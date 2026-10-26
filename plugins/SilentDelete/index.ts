import { findByProps } from "@vendetta/metro";
import { before, after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { findInReactTree } from "@vendetta/utils";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./settings";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const EPHEMERAL = 64;
const SUPPRESS_NOTIFICATIONS = 4096;
const unpatches: Array<() => void> = [];

function toast(msg: string) {
    try { showToast(msg); } catch { console.log("[SilentDelete] " + msg); }
}

function log(msg: string) {
    console.log("[SilentDelete] " + msg);
}

function defaults() {
    storage.replacementText ??= "** **";
    storage.deleteDelay ??= 200;
    storage.suppressNotifications ??= true;
    storage.deleteOriginal ??= true;
    storage.tryEphemeral ??= true;
}

function findSheet(): any {
    return (
        findByProps("openLazy", "hideActionSheet") ||
        findByProps("hideActionSheet", "openLazy") ||
        findByProps("showActionSheet", "hideActionSheet") ||
        findByProps("hideActionSheet")
    );
}

function findRow(): any {
    const mod = findByProps("ActionSheetRow");
    if (mod?.ActionSheetRow) return mod.ActionSheetRow;
    if (typeof mod === "function") return mod;
    return null;
}

function rest(): any {
    return (
        findByProps("HTTP", "get", "post", "put", "patch", "del") ||
        findByProps("get", "post", "patch", "del")
    );
}

function currentFlags(channelId: string, messageId: string): number {
    const MessageStore = findByProps("getMessage", "getMessages");
    const msg = MessageStore?.getMessage?.(channelId, messageId);
    return typeof msg?.flags === "number" ? msg.flags : 0;
}

function deleteIcon() {
    return (
        getAssetIDByName("ic_message_delete") ??
        getAssetIDByName("TrashIcon") ??
        getAssetIDByName("trash") ??
        getAssetIDByName("ic_trash") ??
        getAssetIDByName("ic_close_16px")
    );
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
        log("ephemeral flag accepted");
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
    if (!RestAPI?.post || !RestAPI?.del) {
        toast("SilentDelete: REST module missing");
        return false;
    }
    try {
        defaults();
        const replacementText: string = storage.replacementText ?? "** **";
        const deleteDelay: number = storage.deleteDelay ?? 200;
        const suppressNotifications: boolean = storage.suppressNotifications ?? true;
        const deleteOriginal: boolean = storage.deleteOriginal ?? true;
        const flags = suppressNotifications ? SUPPRESS_NOTIFICATIONS : 0;

        if (storage.tryEphemeral !== false) {
            const dropped = await tryEphemeralThenDelete(RestAPI, channelId, messageId);
            if (dropped) {
                toast("Silent deleted");
                return true;
            }
        }

        let response: any;
        try {
            response = await postOverwrite(RestAPI, channelId, messageId, replacementText, flags, true);
        } catch (err) {
            log("media_mention POST rejected, nonce-only: " + String(err));
            response = await postOverwrite(RestAPI, channelId, messageId, replacementText, flags, false);
        }

        const ghostId = response?.body?.id;
        await sleep(deleteDelay);

        if (ghostId) {
            try {
                await RestAPI.del({ url: `/channels/${channelId}/messages/${ghostId}` });
            } catch (err) {
                log("ghost delete: " + String(err));
            }
        }

        if (deleteOriginal) {
            await sleep(100);
            await RestAPI.del({ url: `/channels/${channelId}/messages/${messageId}` });
        }

        toast("Silent deleted");
        return true;
    } catch (err) {
        toast("SilentDelete failed: " + String(err));
        log("Error: " + String(err));
        return false;
    }
}

function isOwnMessage(message: any): boolean {
    if (!message?.id || !message?.channel_id) return false;
    const UserStore = findByProps("getCurrentUser");
    const me = UserStore?.getCurrentUser?.();
    return !!me && message.author?.id === me.id;
}

function extractFromOpenArgs(args: any[]): { lazy?: any; message?: any } {
    const key = args[1];
    const props = args[2];
    if (typeof key === "string" && /Message(LongPress)?ActionSheet/i.test(key)) {
        return { lazy: args[0], message: props?.message ?? props };
    }
    for (const a of args) {
        if (a?.message?.id && a.message.channel_id) return { lazy: args[0], message: a.message };
        if (a?.id && a?.channel_id && a?.author) return { lazy: args[0], message: a };
    }
    return {};
}

function insertButton(component: any, ActionSheetRow: any, ActionSheet: any, channelId: string, messageId: string) {
    const icon = deleteIcon();
    const rowProps: any = {
        label: "Silent Delete",
        destructive: true,
        onPress: () => {
            try { ActionSheet.hideActionSheet?.(); } catch {}
            silentDeleteMessage(channelId, messageId);
        },
    };
    if (ActionSheetRow?.Icon && icon != null) {
        rowProps.icon = React.createElement(ActionSheetRow.Icon, { source: icon, color: "#ed4245" });
    }

    const button = ActionSheetRow
        ? React.createElement(ActionSheetRow, rowProps)
        : null;

    const groups: any[] = findInReactTree(
        component,
        (c: any) => Array.isArray(c) && (
            c[0]?.type?.name === "ActionSheetRowGroup" ||
            c[0]?.type?.name === "ActionSheetRow" ||
            c[0]?.type?.name === "ButtonRow"
        ),
    );

    const rows: any[] = findInReactTree(
        component,
        (c: any) => Array.isArray(c) && c.some((child: any) =>
            child?.type?.name === "ActionSheetRow" ||
            child?.type?.name === "ButtonRow",
        ),
    );

    const target = rows || groups;
    if (!target?.length || !button) {
        log("could not find action sheet rows");
        return;
    }

    const deleteRowIndex = target.findIndex((c: any) =>
        c?.props?.label?.toLowerCase?.()?.includes?.("delete") ||
        c?.props?.message?.toLowerCase?.()?.includes?.("delete"),
    );
    if (deleteRowIndex >= 0) target.splice(deleteRowIndex, 0, button);
    else target.push(button);
}

function patchSheet(ActionSheet: any) {
    const method = typeof ActionSheet.openLazy === "function"
        ? "openLazy"
        : typeof ActionSheet.showActionSheet === "function"
            ? "showActionSheet"
            : null;
    if (!method) {
        log("no openLazy/showActionSheet on ActionSheet module");
        return;
    }

    const ActionSheetRow = findRow();

    unpatches.push(before(method, ActionSheet, (args: any[]) => {
        try {
            const { lazy, message } = extractFromOpenArgs(args);
            if (!message || !isOwnMessage(message)) return;
            if (!lazy?.then) return;

            const channelId = message.channel_id;
            const messageId = message.id;

            lazy.then((instance: any) => {
                try {
                    const target = instance?.default ? instance : { default: instance };
                    const unpatch = after("default", target, (_: any, component: any) => {
                        try {
                            React.useEffect(() => () => { try { unpatch(); } catch {} }, []);
                            insertButton(component, ActionSheetRow, ActionSheet, channelId, messageId);
                        } catch (e) {
                            log("sheet render: " + String(e));
                        }
                    });
                    unpatches.push(unpatch);
                } catch (e) {
                    log("sheet instance: " + String(e));
                }
            });
        } catch (e) {
            log("openLazy: " + String(e));
        }
    }));
}

export default {
    onLoad() {
        try {
            defaults();
            const ActionSheet = findSheet();
            if (!ActionSheet) {
                toast("SilentDelete loaded, but ActionSheet was not found");
                log("ActionSheet module missing");
                return;
            }
            patchSheet(ActionSheet);
            log("loaded");
        } catch (e) {
            toast("SilentDelete error: " + String(e));
            log("onLoad: " + String(e));
        }
    },

    onUnload() {
        for (const u of unpatches) {
            try { u(); } catch {}
        }
        unpatches.length = 0;
        log("unloaded");
    },

    settings: Settings,
};
