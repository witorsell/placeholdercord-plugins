import { findByProps, findByStoreName } from "@vendetta/metro";
import { FluxDispatcher, React, ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text } = ReactNative as any;

const RTC_CONNECTED = "RTC_CONNECTED";
const ANIMATION_BASIC = 1;
const GLOBAL_GUILD = "0";

const store = storage as unknown as {
    lastEvent?: string;
    lastError?: string;
};

let prevConnected = false;
let tempMutedChannel: string | null = null;
let unpatchDispatch: (() => void) | null = null;

function log(msg: string) {
    try { console.log("[EntranceSounds] " + msg); } catch {}
    store.lastEvent = msg;
}

function errText(e: any) {
    if (!e) return "unknown error";
    if (typeof e === "string") return e;
    if (e.message) return String(e.message);
    if (e.body) {
        try { return JSON.stringify(e.body); } catch {}
    }
    return String(e);
}

function rest(): any {
    return (
        findByProps("HTTP", "get", "post", "put", "patch", "del") ||
        findByProps("get", "post", "patch", "del")
    );
}

function channelStore(): any {
    return findByStoreName("ChannelStore") || findByProps("getChannel", "getDMFromUserId");
}

function userStore(): any {
    return findByStoreName("UserStore") || findByProps("getCurrentUser", "getUser");
}

function mediaEngine(): any {
    return findByStoreName("MediaEngineStore") || findByProps("isSelfDeaf", "isSelfMute");
}

function protoStore(): any {
    return findByStoreName("UserSettingsProtoStore") || findByProps("getUserSettingsProto");
}

function pick(obj: any, a: string, b: string) {
    if (!obj) return undefined;
    if (obj[a] != null) return obj[a];
    if (obj[b] != null) return obj[b];
    return undefined;
}

function currentUserId(): string | null {
    const us = userStore();
    if (us && typeof us.getId === "function") {
        const id = us.getId();
        if (id) return String(id);
    }
    if (us && typeof us.getCurrentUser === "function") {
        const me = us.getCurrentUser();
        if (me && me.id) return String(me.id);
    }
    return null;
}

function sessionId(): string | null {
    const us = userStore();
    if (us && typeof us.getSessionId === "function") {
        const id = us.getSessionId();
        if (id) return String(id);
    }
    const ss = findByStoreName("SessionStore") || findByProps("getSessionId");
    if (ss && typeof ss.getSessionId === "function") {
        const id = ss.getSessionId();
        if (id) return String(id);
    }
    return null;
}

function getGuildId(channelId: string): string | null {
    const cs = channelStore();
    if (!cs || typeof cs.getChannel !== "function") return null;
    const ch = cs.getChannel(channelId);
    if (!ch) return null;
    if (typeof ch.getGuildId === "function") {
        const gid = ch.getGuildId();
        return gid == null ? null : String(gid);
    }
    const gid = pick(ch, "guild_id", "guildId");
    return gid == null ? null : String(gid);
}

function isDeafened(): boolean {
    const me = mediaEngine();
    if (me) {
        if (typeof me.isSelfDeaf === "function" && me.isSelfDeaf()) return true;
        if (typeof me.isDeaf === "function" && me.isDeaf()) return true;
    }
    return false;
}

function guildsMap(): any {
    const ps = protoStore();
    if (!ps) return null;
    let settings = ps.settings;
    if (!settings && typeof ps.getUserSettingsProto === "function") {
        settings = ps.getUserSettingsProto();
    }
    if (!settings && ps.proto) settings = ps.proto;
    if (!settings && typeof ps.getFullState === "function") {
        const full = ps.getFullState();
        settings = full && (full.settings || full.proto || full);
    }
    if (!settings) return null;
    const guilds = settings.guilds;
    if (!guilds) return null;
    return guilds.guilds || guilds;
}

function hasJoinSound(guildId: string): boolean {
    const guilds = guildsMap();
    if (!guilds) return true;
    const own = guilds[guildId] || guilds[String(guildId)];
    const global = guilds[GLOBAL_GUILD] || guilds[""] || guilds[0];
    const sound =
        (own && (own.joinSound || own.join_sound)) ||
        (global && (global.joinSound || global.join_sound));
    return !!sound;
}

function postCallSound(channelId: string) {
    const RestAPI = rest();
    if (!RestAPI || typeof RestAPI.post !== "function") {
        store.lastError = "REST module missing";
        log("REST module missing, cannot post custom-call-sounds");
        return;
    }

    const body = {
        animation_type: ANIMATION_BASIC,
        animation_id: 0,
    };
    const url = "/channels/" + channelId + "/custom-call-sounds";

    const send = function () {
        return RestAPI.post({ url: url, body: body });
    };

    send().then(function () {
        store.lastError = "";
        log("posted custom-call-sounds for " + channelId);
    }).catch(function (e: any) {
        log("first post failed, retrying: " + errText(e));
        setTimeout(function () {
            send().then(function () {
                store.lastError = "";
                log("posted custom-call-sounds for " + channelId + " (retry)");
            }).catch(function (e2: any) {
                store.lastError = errText(e2);
                log("custom-call-sounds failed: " + errText(e2));
            });
        }, 500);
    });
}

function playJoinSound(channelId: string, guildId: string) {
    if (isDeafened()) {
        log("skip, deafened");
        return;
    }
    if (!hasJoinSound(guildId)) {
        log("no join sound in proto for " + guildId + ", posting anyway");
    }
    postCallSound(channelId);
}

function handleRTCConnectionState(payload: any) {
    if (!payload) return;
    const state = payload.state;
    const channelId = pick(payload, "channelId", "channel_id");
    const connected = state === RTC_CONNECTED;
    const justConnected = connected && !prevConnected;
    prevConnected = connected;

    if (!justConnected || channelId == null) return;

    const guildId = getGuildId(String(channelId));
    if (guildId == null) return;

    if (tempMutedChannel === String(channelId)) {
        tempMutedChannel = null;
        log("skip, muted join for " + channelId);
        return;
    }

    playJoinSound(String(channelId), guildId);
}

function handleMute(payload: any) {
    const channelId = pick(payload, "channelId", "channel_id");
    if (channelId != null) tempMutedChannel = String(channelId);
}

function handleVoiceStateUpdates(payload: any) {
    const voiceStates = payload && (payload.voiceStates || payload.voice_states);
    if (!voiceStates || !voiceStates.length) return;
    const me = currentUserId();
    const mine = sessionId();
    if (!me) return;
    for (let i = 0; i < voiceStates.length; i++) {
        const vs = voiceStates[i];
        const userId = pick(vs, "userId", "user_id");
        const channelId = pick(vs, "channelId", "channel_id");
        const sid = pick(vs, "sessionId", "session_id");
        if (String(userId) === String(me) && sid != null && mine != null && String(sid) !== String(mine) && channelId != null) {
            tempMutedChannel = String(channelId);
        }
    }
}

function onDispatch(payload: any) {
    if (!payload || !payload.type) return;
    try {
        if (payload.type === "RTC_CONNECTION_STATE") handleRTCConnectionState(payload);
        else if (payload.type === "SOUNDBOARD_MUTE_JOIN_SOUND") handleMute(payload);
        else if (payload.type === "VOICE_STATE_UPDATES") handleVoiceStateUpdates(payload);
    } catch (e) {
        store.lastError = errText(e);
        log("handler error: " + errText(e));
    }
}

function Settings() {
    const h = React.createElement;
    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } },
        h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, "Entrance Sounds"),
        h(Text, { style: { color: "#949ba4", fontSize: 13, marginBottom: 16 } },
            "Official Android never fires the desktop CustomCallSoundsManager store, so joining a voice channel from this client never POSTs /custom-call-sounds. This plugin does that on the RTC_CONNECTED rising edge. Set a Nitro entrance sound in Discord settings as usual."),
        h(View, {
            style: { backgroundColor: "#2b2d31", borderRadius: 8, padding: 12, marginBottom: 12 },
        },
            h(Text, { style: { color: "#949ba4", fontSize: 12, marginBottom: 4 } }, "Last event"),
            h(Text, { style: { color: "#ffffff", fontSize: 13 } }, store.lastEvent || "none yet, join a voice channel")),
        store.lastError
            ? h(View, {
                style: { backgroundColor: "#3f1d1d", borderRadius: 8, padding: 12 },
            },
                h(Text, { style: { color: "#f23f43", fontSize: 12, marginBottom: 4 } }, "Last error"),
                h(Text, { style: { color: "#ffffff", fontSize: 13 } }, store.lastError))
            : null,
    );
}

export default {
    onLoad() {
        store.lastEvent = store.lastEvent || "";
        store.lastError = store.lastError || "";
        prevConnected = false;
        tempMutedChannel = null;
        if (!FluxDispatcher || typeof (FluxDispatcher as any).dispatch !== "function") {
            try { showToast("EntranceSounds: FluxDispatcher missing"); } catch {}
            log("FluxDispatcher missing");
            return;
        }
        unpatchDispatch = before("dispatch", FluxDispatcher as any, function (args: any[]) {
            onDispatch(args && args[0]);
        });
        log("loaded");
    },
    onUnload() {
        try { if (unpatchDispatch) unpatchDispatch(); } catch {}
        unpatchDispatch = null;
        prevConnected = false;
        tempMutedChannel = null;
        log("unloaded");
    },
    settings: Settings,
};
