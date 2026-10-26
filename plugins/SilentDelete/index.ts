import { findByProps } from "@vendetta/metro";
import { before, after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { findInReactTree } from "@vendetta/utils";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./settings";

const EPHEMERAL = 64;
const SUPPRESS_NOTIFICATIONS = 4096;
const unpatches: Array<() => void> = [];

function sleep(ms: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function toast(msg: string) {
    try {
        storage.lastError = msg;
        showToast(msg);
    } catch {
        try { console.log("[SilentDelete] " + msg); } catch {}
    }
}

function log(msg: string) {
    try { console.log("[SilentDelete] " + msg); } catch {}
}

function errText(e: any) {
    if (!e) return "unknown error";
    if (typeof e === "string") return e;
    if (e.message) return String(e.message);
    return String(e);
}

function defaults() {
    storage.replacementText ??= "** **";
    storage.deleteDelay ??= 200;
    storage.suppressNotifications ??= true;
    storage.deleteOriginal ??= true;
    storage.tryEphemeral ??= true;
    storage.lastError ??= "";
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
    if (mod && mod.ActionSheetRow) return mod.ActionSheetRow;
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
    const msg = MessageStore && MessageStore.getMessage && MessageStore.getMessage(channelId, messageId);
    return typeof (msg && msg.flags) === "number" ? msg.flags : 0;
}

function deleteIcon() {
    return (
        getAssetIDByName("ic_message_delete") ||
        getAssetIDByName("TrashIcon") ||
        getAssetIDByName("trash") ||
        getAssetIDByName("ic_trash") ||
        getAssetIDByName("ic_close_16px")
    );
}

function tryEphemeralThenDelete(RestAPI: any, channelId: string, messageId: string) {
    const flags = currentFlags(channelId, messageId) | EPHEMERAL;
    return RestAPI.patch({
        url: "/channels/" + channelId + "/messages/" + messageId,
        body: { flags: flags },
    }).then(function (patched: any) {
        const got = (patched && patched.body && patched.body.flags) || 0;
        if ((got & EPHEMERAL) !== EPHEMERAL) return false;
        return RestAPI.del({
            url: "/channels/" + channelId + "/messages/" + messageId,
        }).then(function () {
            return true;
        });
    }).catch(function () {
        return false;
    });
}

function postOverwrite(
    RestAPI: any,
    channelId: string,
    messageId: string,
    content: string,
    flags: number,
    withMediaMention: boolean,
) {
    const body: Record<string, any> = {
        content: content,
        flags: flags,
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
        url: "/channels/" + channelId + "/messages",
        body: body,
    });
}

function silentDeleteMessage(channelId: string, messageId: string) {
    const RestAPI = rest();
    if (!RestAPI || !RestAPI.post || !RestAPI.del) {
        toast("SilentDelete: REST module missing");
        return;
    }

    defaults();
    const replacementText: string = storage.replacementText || "** **";
    const deleteDelay: number = storage.deleteDelay || 200;
    const suppressNotifications: boolean = storage.suppressNotifications !== false;
    const deleteOriginal: boolean = storage.deleteOriginal !== false;
    const flags = suppressNotifications ? SUPPRESS_NOTIFICATIONS : 0;

    const afterOverwrite = function (response: any) {
        const ghostId = response && response.body && response.body.id;
        return sleep(deleteDelay).then(function () {
            const ghostDel = ghostId
                ? RestAPI.del({
                    url: "/channels/" + channelId + "/messages/" + ghostId,
                }).catch(function (e: any) {
                    log("ghost delete: " + errText(e));
                })
                : Promise.resolve();
            return ghostDel.then(function () {
                if (!deleteOriginal) {
                    toast("Silent deleted");
                    return true;
                }
                return sleep(100).then(function () {
                    return RestAPI.del({
                        url: "/channels/" + channelId + "/messages/" + messageId,
                    });
                }).then(function () {
                    toast("Silent deleted");
                    return true;
                });
            });
        });
    };

    const doOverwrite = function () {
        return postOverwrite(RestAPI, channelId, messageId, replacementText, flags, true)
            .catch(function (e: any) {
                log("media_mention POST rejected: " + errText(e));
                return postOverwrite(RestAPI, channelId, messageId, replacementText, flags, false);
            })
            .then(afterOverwrite);
    };

    const start = storage.tryEphemeral !== false
        ? tryEphemeralThenDelete(RestAPI, channelId, messageId).then(function (dropped: boolean) {
            if (dropped) {
                toast("Silent deleted");
                return true;
            }
            return doOverwrite();
        })
        : doOverwrite();

    start.catch(function (e: any) {
        toast("SilentDelete failed: " + errText(e));
    });
}

function isOwnMessage(message: any): boolean {
    if (!message || !message.id || !message.channel_id) return false;
    const UserStore = findByProps("getCurrentUser");
    const me = UserStore && UserStore.getCurrentUser && UserStore.getCurrentUser();
    return !!(me && message.author && message.author.id === me.id);
}

function extractFromOpenArgs(args: any[]): { lazy?: any; message?: any } {
    const key = args[1];
    const props = args[2];
    if (typeof key === "string" && /Message(LongPress)?ActionSheet/i.test(key)) {
        return { lazy: args[0], message: (props && props.message) || props };
    }
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a && a.message && a.message.id && a.message.channel_id) {
            return { lazy: args[0], message: a.message };
        }
        if (a && a.id && a.channel_id && a.author) {
            return { lazy: args[0], message: a };
        }
    }
    return {};
}

function insertButton(component: any, ActionSheetRow: any, ActionSheet: any, channelId: string, messageId: string) {
    const icon = deleteIcon();
    const rowProps: any = {
        label: "Silent Delete",
        destructive: true,
        onPress: function () {
            try { if (ActionSheet && ActionSheet.hideActionSheet) ActionSheet.hideActionSheet(); } catch {}
            silentDeleteMessage(channelId, messageId);
        },
    };
    if (ActionSheetRow && ActionSheetRow.Icon && icon != null) {
        rowProps.icon = React.createElement(ActionSheetRow.Icon, { source: icon, color: "#ed4245" });
    }

    const button = ActionSheetRow ? React.createElement(ActionSheetRow, rowProps) : null;
    if (!button) {
        toast("SilentDelete: ActionSheetRow missing, cannot add button");
        return;
    }

    const groups: any[] = findInReactTree(component, function (c: any) {
        return Array.isArray(c) && c[0] && c[0].type && (
            c[0].type.name === "ActionSheetRowGroup" ||
            c[0].type.name === "ActionSheetRow" ||
            c[0].type.name === "ButtonRow"
        );
    });

    const rows: any[] = findInReactTree(component, function (c: any) {
        return Array.isArray(c) && c.some(function (child: any) {
            return child && child.type && (
                child.type.name === "ActionSheetRow" ||
                child.type.name === "ButtonRow"
            );
        });
    });

    const target = rows || groups;
    if (!target || !target.length) {
        toast("SilentDelete: no rows in this action sheet");
        return;
    }

    let deleteRowIndex = -1;
    for (let i = 0; i < target.length; i++) {
        const lab = target[i] && target[i].props && (target[i].props.label || target[i].props.message);
        if (typeof lab === "string" && lab.toLowerCase().indexOf("delete") !== -1) {
            deleteRowIndex = i;
            break;
        }
    }
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
        toast("SilentDelete: sheet has no openLazy/showActionSheet");
        return;
    }

    const ActionSheetRow = findRow();
    if (!ActionSheetRow) {
        toast("SilentDelete: ActionSheetRow not found");
    }

    unpatches.push(before(method, ActionSheet, function (args: any[]) {
        try {
            const extracted = extractFromOpenArgs(args);
            const lazy = extracted.lazy;
            const message = extracted.message;
            if (!message || !isOwnMessage(message)) return;
            if (!lazy || typeof lazy.then !== "function") return;

            const channelId = message.channel_id;
            const messageId = message.id;

            lazy.then(function (instance: any) {
                try {
                    const target = instance && instance.default ? instance : { default: instance };
                    const unpatch = after("default", target, function (_: any, component: any) {
                        try {
                            React.useEffect(function () {
                                return function () {
                                    try { unpatch(); } catch {}
                                };
                            }, []);
                            insertButton(component, ActionSheetRow, ActionSheet, channelId, messageId);
                        } catch (e) {
                            toast("SilentDelete sheet render: " + errText(e));
                        }
                    });
                    unpatches.push(unpatch);
                } catch (e) {
                    toast("SilentDelete sheet instance: " + errText(e));
                }
            });
        } catch (e) {
            toast("SilentDelete open sheet: " + errText(e));
        }
    }));
}

export default {
    onLoad() {
        try {
            defaults();
            storage.lastError = "";
            const ActionSheet = findSheet();
            if (!ActionSheet) {
                toast("SilentDelete: ActionSheet not found");
                return;
            }
            patchSheet(ActionSheet);
            toast("SilentDelete loaded");
        } catch (e) {
            toast("SilentDelete error: " + errText(e));
        }
    },

    onUnload() {
        for (let i = 0; i < unpatches.length; i++) {
            try { unpatches[i](); } catch {}
        }
        unpatches.length = 0;
        log("unloaded");
    },

    settings: Settings,
};
