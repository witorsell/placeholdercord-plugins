import { registerCommand } from "@vendetta/commands";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { clipboard } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";

import { callTokenGetter, firstToken, optionValue } from "./token.js";

// meqativ GetToken calls resolveSemanticColor(theme, semanticColors.BACKGROUND_BASE_LOWER)
// just to tint the embed. On 352 with a custom theme, placeholdercord's resolver does
// Object.getOwnPropertySymbols on that argument. The key is missing, so Hermes throws
// "Cannot convert undefined value to object" inside /token get. This plugin never touches colors.

const unpatches: Array<() => void> = [];

function readToken(): string | null {
    const store = findByStoreName("AuthenticationStore");
    const manager = findByProps("getToken", "setToken");
    const utils = findByProps("getToken", "isAuthenticated");
    return firstToken([
        store && callTokenGetter(store.getToken, store),
        manager && callTokenGetter(manager.getToken, manager),
        utils && callTokenGetter(utils.getToken, utils),
    ]);
}

function channelIdOf(ctx: { channel?: { id?: string } } | undefined): string {
    if (ctx && ctx.channel && ctx.channel.id) return String(ctx.channel.id);
    return "";
}

function showLocal(channelId: string, text: string) {
    const messages = findByProps("sendBotMessage");
    if (messages && typeof messages.sendBotMessage === "function" && channelId) {
        messages.sendBotMessage(channelId, text);
        return;
    }
    alert(text);
}

function copy(text: string) {
    try {
        clipboard.setString(text);
        showToast("Token copied");
    } catch (e) {
        // clipboard can be missing on a half-loaded metro. The local message still has the token.
    }
}

export default {
    onUnload() {
        for (let i = 0; i < unpatches.length; i++) {
            try {
                unpatches[i]();
            } catch (e) {
                // a dead unpatch must not block the rest
            }
        }
        unpatches.length = 0;
    },
    onLoad() {
        unpatches.push(registerCommand({
            name: "token get",
            displayName: "token get",
            description: "Shows your current user token and copies it",
            displayDescription: "Shows your current user token and copies it",
            applicationId: "-1",
            type: 1,
            inputType: 1,
            options: [],
            execute(args, ctx) {
                try {
                    const token = readToken();
                    const channelId = channelIdOf(ctx);
                    if (!token) {
                        showLocal(channelId, "No token. AuthenticationStore and TokenManager both came back empty.");
                        return;
                    }
                    copy(token);
                    showLocal(channelId, "Token copied.\n" + token);
                } catch (e) {
                    const err = e as { stack?: string };
                    alert("token get failed\n" + (err && err.stack ? err.stack : String(e)));
                }
            },
        }));

        unpatches.push(registerCommand({
            name: "token login",
            displayName: "token login",
            description: "Logs into an account using a token",
            displayDescription: "Logs into an account using a token",
            applicationId: "-1",
            type: 1,
            inputType: 1,
            options: [
                {
                    name: "token",
                    displayName: "token",
                    description: "Token of the account to login into",
                    displayDescription: "Token of the account to login into",
                    type: 3,
                    required: true,
                },
            ],
            execute(args, ctx) {
                try {
                    const token = optionValue(args, "token").trim();
                    const channelId = channelIdOf(ctx);
                    if (!token) {
                        showLocal(channelId, "Pass a token.");
                        return;
                    }
                    // 352: switchAccountToken(token, goHome=true) logs out, then loginToken(token, true).
                    const auth = findByProps("switchAccountToken");
                    if (!auth || typeof auth.switchAccountToken !== "function") {
                        showLocal(channelId, "switchAccountToken is missing on this Discord build.");
                        return;
                    }
                    auth.switchAccountToken(token);
                    showLocal(channelId, "Switching accounts.");
                } catch (e) {
                    const err = e as { stack?: string };
                    alert("token login failed\n" + (err && err.stack ? err.stack : String(e)));
                }
            },
        }));
    },
};
