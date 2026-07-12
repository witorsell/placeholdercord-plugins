import { find } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { before } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, Pressable } = ReactNative as any;

// Mobile-only keys a real Desktop/Web/Embedded client would never send. Confirmed against a
// live-captured IDENTIFY payload (see the Gateway Diagnostics plugin): a real Android connect
// includes device, device_vendor_id, design_id, client_app_state, is_fast_connect, and
// gateway_connect_reasons. Dropping them is part of not looking like a mobile client pretending
// to be something else.
const MOBILE_ONLY_KEYS = [
    "device", "device_vendor_id", "design_id", "client_app_state",
    "is_fast_connect", "gateway_connect_reasons",
];

interface Preset {
    label: string;
    /** null means "off": don't touch the payload at all, send real Android properties. */
    properties: Record<string, unknown> | null;
}

const PRESETS: Record<string, Preset> = {
    android: { label: "Android (off, real)", properties: null },
    desktop: {
        label: "Desktop (Windows)",
        properties: {
            os: "Windows",
            browser: "Discord Client",
            release_channel: "stable",
            client_version: "1.0.9187",
            os_version: "10.0.19045",
            browser_user_agent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9187 Chrome/134.0.6998.205 Electron/35.5.1 Safari/537.36",
            browser_version: "35.5.1",
        },
    },
    web: {
        label: "Web (Chrome)",
        properties: {
            os: "Windows",
            browser: "Chrome",
            release_channel: "stable",
            client_version: "",
            os_version: "10",
            browser_user_agent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            browser_version: "134.0.0.0",
        },
    },
    embedded: {
        label: "Embedded (Console)",
        properties: {
            os: "Playstation 5",
            browser: "Discord Embedded",
            release_channel: "stable",
            browser_user_agent: "",
            browser_version: "",
        },
    },
};

const store = storage as unknown as { preset?: string };

function currentPreset(): string {
    return store.preset && PRESETS[store.preset] ? store.preset : "android";
}

function toast(msg: string) {
    try { showToast(msg); } catch {}
}

let unpatchSend: (() => void) | null = null;
let gatewayInstance: any = null;
const patchedInstances = new WeakSet<object>();

function applyPresetToPayload(payload: any) {
    const preset = PRESETS[currentPreset()];
    if (!preset || !preset.properties || !payload || !payload.properties) return;

    Object.assign(payload.properties, preset.properties);
    for (const key of MOBILE_ONLY_KEYS) {
        delete payload.properties[key];
    }
}

function patchInstance(instance: any) {
    gatewayInstance = instance;
    if (!instance || patchedInstances.has(instance) || typeof instance.send !== "function") return;
    patchedInstances.add(instance);
    unpatchSend = before("send", instance, (args: any[]) => {
        try {
            applyPresetToPayload(args[1]);
        } catch (e) {
            toast("Platform Spoofer: failed to apply preset: " + e);
        }
    });
}

/**
 * Forces a fresh IDENTIFY without logging out. _doIdentify's own bytecode clears
 * sessionId/seq as its first step (that's what makes a real login always IDENTIFY
 * instead of RESUME), so replicating that and then closing the socket makes the
 * class's own existing reconnect logic (the same one a network drop already
 * triggers) come back up with nothing to resume, forcing a real IDENTIFY.
 */
function forceReidentify() {
    if (!gatewayInstance) {
        toast("Platform Spoofer: no gateway connection seen yet");
        return;
    }
    try {
        gatewayInstance.sessionId = null;
        gatewayInstance.seq = 0;
    } catch (e) {
        toast("Platform Spoofer: couldn't clear session state: " + e);
        return;
    }
    if (typeof gatewayInstance.close === "function") {
        gatewayInstance.close();
        toast("Reconnecting with a fresh IDENTIFY...");
    } else {
        toast("Session cleared, but no close() method found to force a reconnect");
    }
}

function patchGateway() {
    // The socket connects long before this plugin loads, so _doIdentify won't fire again
    // on its own. Some other module holds the already-connected instance directly (found
    // empirically: a wrapper object exposing it as .socket), grab that now so Reconnect
    // works immediately without waiting for a fresh connection first.
    const wrapper = find((m: any) => m && m.socket && typeof m.socket._doIdentify === "function");
    if (wrapper?.socket) {
        patchInstance(wrapper.socket);
    }

    const gwClass = find((m: any) => m && m.prototype && typeof m.prototype._doIdentify === "function");
    if (!gwClass) {
        if (!gatewayInstance) toast("Platform Spoofer: GatewaySocket class not found, nothing patched");
        return null;
    }
    return before("_doIdentify", gwClass.prototype, function (this: any) {
        patchInstance(this);
    });
}

let unpatchIdentify: (() => void) | null = null;

function Settings() {
    const h = React.createElement;
    const [, setTick] = React.useState(0);
    const rerender = () => setTick((n: number) => n + 1);
    const selected = currentPreset();

    const pick = (key: string) => {
        store.preset = key;
        rerender();
        toast("Platform set to " + PRESETS[key].label + ". Tap Reconnect below to apply.");
    };

    const presetButton = (key: string) => {
        const active = key === selected;
        return h(Pressable, {
            key,
            onPress: () => pick(key),
            style: {
                paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8,
                marginBottom: 8,
                backgroundColor: active ? "#5865F2" : "#2b2d31",
            },
        }, h(Text, { style: { color: "#ffffff", fontWeight: active ? "700" as const : "400" as const } }, PRESETS[key].label));
    };

    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } },
        h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 4 } }, "Report as"),
        h(Text, { style: { color: "#949ba4", fontSize: 12, marginBottom: 16 } },
            "Picking a preset only takes effect on the next IDENTIFY. Use Reconnect below to force one immediately, no logout needed."),
        Object.keys(PRESETS).map(presetButton),
        h(Pressable, {
            onPress: forceReidentify,
            style: { backgroundColor: "#248046", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 8 },
        }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Reconnect now (apply without logging out)")),
    );
}

export default {
    onLoad() {
        unpatchIdentify = patchGateway();
    },
    onUnload() {
        if (unpatchSend) unpatchSend();
        if (unpatchIdentify) unpatchIdentify();
    },
    settings: Settings,
};
