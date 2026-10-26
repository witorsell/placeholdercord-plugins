import { findByProps } from "@vendetta/metro";
import { before, after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import { React } from "@vendetta/metro/common";
import { findInReactTree } from "@vendetta/utils";
import { getAssetIDByName } from "@vendetta/ui/assets";
import Settings from "./settings";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = findByProps("ActionSheetRow");

const DeleteIcon =
    getAssetIDByName("ic_message_delete") ??
    getAssetIDByName("TrashIcon") ??
    getAssetIDByName("trash") ??
    getAssetIDByName("ic_trash");

const EPHEMERAL = 64;
const SUPPRESS_NOTIFICATIONS = 4096;

function rest() {
    return findByProps("get", "post", "del", "patch");
}

function currentFlags(channelId: string, messageId: string): number {
    const MessageStore = findByProps("getMessage", "getMessages");
    const msg = MessageStore?.getMessage?.(channelId, messageId);
    return typeof msg?.flags === "number" ? msg.flags : 0;
}

async function tryEphemeralThenDelete(RestAPI: any, channelId: string, messageId: string): Promise<boolean> {
    try {
        const flags = currentFlags(channelId, messageId) | EPHEMERAL;
        const patched = await RestAPI.patch({
            url: `/channels/${channelId}/messages/${messageId}`,
            body: { flags },
        });
        const got = patched?.body?.flags ?? 0;
        if ((got & EPHEMERAL) !== EPHEMERAL) return false;
        await RestAPI.del({ url: `/channels/${channelId}/messages/${messageId}` });
        logger.log("[SilentDelete v2] ephemeral flag accepted, dropped from logger cache");
        return true;
    } catch {
        return false;
    }
}

async function postOverwrite(
    RestAPI: any,
    channelId: string,
    messageId: string,
    content: string,
    flags: number,
    withMediaMention: boolean,
) {
    const body: Record<string, any> = {
        content,
        flags,
        mobile_network_type: "unknown",
        nonce: messageId,
        tts: false,
        enforce_nonce: false,
    };
    if (withMediaMention) {
        body.message_reference = {
            type: 0,
            message_id: messageId,
            channel_id: channelId,
        };
        // Live canary MessageStore.MESSAGE_CREATE runs W(msg) after receiveMessage.
        // If media_mention.message_id is present, it does:
        //   getOrCreate(media_mention.attachment_id).receiveMessage({...msg, id: message_id})
        // That merge is keyed by id, not nonce, and Vencord never patches it.
        // Sending attachment_id = this channel makes it overwrite the original row.
        body.media_mention = {
            message_id: messageId,
            attachment_id: channelId,
            timestamp: 0,
        };
    }
    return RestAPI.post({
        url: `/channels/${channelId}/messages`,
        body,
    });
}

async function silentDeleteMessage(channelId: string, messageId: string) {
    const RestAPI = rest();
    try {
        const replacementText: string = storage.replacementText ?? "** **";
        const deleteDelay: number = storage.deleteDelay ?? 200;
        const suppressNotifications: boolean = storage.suppressNotifications ?? true;
        const deleteOriginal: boolean = storage.deleteOriginal ?? true;
        const flags = suppressNotifications ? SUPPRESS_NOTIFICATIONS : 0;

        if (storage.tryEphemeral !== false) {
            const dropped = await tryEphemeralThenDelete(RestAPI, channelId, messageId);
            if (dropped) return true;
        }

        let response: any;
        try {
            response = await postOverwrite(RestAPI, channelId, messageId, replacementText, flags, true);
        } catch (err) {
            logger.log("[SilentDelete v2] media_mention POST rejected, nonce-only: " + String(err));
            response = await postOverwrite(RestAPI, channelId, messageId, replacementText, flags, false);
        }

        const ghostId = response?.body?.id;
        await sleep(deleteDelay);

        if (ghostId) {
            try {
                await RestAPI.del({ url: `/channels/${channelId}/messages/${ghostId}` });
            } catch (err) {
                logger.log("[SilentDelete v2] ghost delete: " + String(err));
            }
        }

        if (deleteOriginal) {
            await sleep(100);
            await RestAPI.del({ url: `/channels/${channelId}/messages/${messageId}` });
        }

        logger.log("[SilentDelete v2] done");
        return true;
    } catch (err) {
        logger.log("[SilentDelete v2] Error: " + String(err));
        return false;
    }
}

let unpatchOpenLazy: (() => void) | null = null;

export default {
    onLoad() {
        storage.replacementText ??= "** **";
        storage.deleteDelay ??= 200;
        storage.suppressNotifications ??= true;
        storage.deleteOriginal ??= true;
        storage.tryEphemeral ??= true;

        unpatchOpenLazy = before("openLazy", ActionSheet, ([comp, args, msg]) => {
            if (args !== "MessageLongPressActionSheet" || !msg?.message) return;

            const UserStore = findByProps("getCurrentUser");
            const currentUser = UserStore?.getCurrentUser();
            if (!currentUser || msg.message.author?.id !== currentUser.id) return;

            const channelId: string = msg.message.channel_id;
            const messageId: string = msg.message.id;

            comp.then((instance: any) => {
                const unpatch = after("default", instance, (_: any, component: any) => {
                    React.useEffect(() => () => { unpatch(); }, []);

                    const groups: any[] = findInReactTree(
                        component,
                        (c: any) => Array.isArray(c) && c[0]?.type?.name === "ActionSheetRowGroup"
                    );

                    if (!groups?.length) {
                        logger.warn("[SilentDelete v2] Could not find ActionSheetRowGroups");
                        return;
                    }

                    const silentDeleteButton = React.createElement(ActionSheetRow, {
                        label: "Silent Delete",
                        destructive: true,
                        icon: React.createElement(ActionSheetRow.Icon, {
                            source: DeleteIcon,
                            color: "#ed4245",
                        }),
                        onPress: () => {
                            ActionSheet.hideActionSheet();
                            silentDeleteMessage(channelId, messageId);
                        },
                    });

                    let inserted = false;
                    for (let gi = 0; gi < groups.length; gi++) {
                        const groupChildren: any[] = findInReactTree(
                            groups[gi],
                            (c: any) => Array.isArray(c) && c.some((child: any) =>
                                child?.type?.name === "ActionSheetRow"
                            )
                        );
                        if (!groupChildren) continue;

                        const deleteRowIndex = groupChildren.findIndex((c: any) =>
                            c?.props?.label?.toLowerCase?.()?.includes?.("delete") ||
                            c?.props?.message?.toLowerCase?.()?.includes?.("delete")
                        );

                        if (deleteRowIndex >= 0) {
                            groupChildren.splice(deleteRowIndex, 0, silentDeleteButton);
                            inserted = true;
                            break;
                        }
                    }

                    if (!inserted) {
                        logger.warn("[SilentDelete v2] Delete row not found, inserting before last group");
                        const insertAt = Math.max(0, groups.length - 1);
                        groups.splice(insertAt, 0,
                            React.createElement(ActionSheetRow.Group, null, silentDeleteButton)
                        );
                    }
                });
            });
        });

        logger.log("[SilentDelete v2] Loaded.");
    },

    onUnload() {
        unpatchOpenLazy?.();
        unpatchOpenLazy = null;
        logger.log("[SilentDelete v2] Unloaded.");
    },

    settings: Settings,
};
