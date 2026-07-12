import { find } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, Pressable } = ReactNative as any;

interface LogEntry {
    time: string;
    method: string;
    properties: any;
    hasToken: boolean;
    hasPresence: boolean;
}

const log: LogEntry[] = [];
const unpatchers: Array<() => void> = [];

function getNative(): any {
    const w = window as any;
    return (w.placeholder && w.placeholder.native) || null;
}

function toast(msg: string) {
    try { showToast(msg); } catch {}
}

function record(method: string, self: any) {
    log.unshift({
        time: new Date().toLocaleTimeString(),
        method,
        properties: self && self.properties,
        hasToken: !!(self && self.token),
        hasPresence: !!(self && self.presence),
    });
    if (log.length > 20) log.length = 20;
}

function patchGateway() {
    const gwClass = find((m: any) => m && m.prototype && typeof m.prototype._doIdentify === "function");
    if (!gwClass) {
        toast("Gateway Diagnostics: GatewaySocket class not found, nothing patched");
        return;
    }

    for (const name of ["_doIdentify", "_doResume", "_doResumeOrIdentify"]) {
        if (typeof gwClass.prototype[name] !== "function") continue;
        unpatchers.push(
            before(name, gwClass.prototype, function (this: any) {
                try {
                    record(name, this);
                } catch (e) {
                    record(name + " (capture error: " + e + ")", null);
                }
            }),
        );
    }

    toast("Gateway Diagnostics: patched " + unpatchers.length + " method(s)");
}

function unpatchGateway() {
    while (unpatchers.length) {
        try { unpatchers.pop()!(); } catch {}
    }
}

function Settings() {
    const h = React.createElement;
    const [, setTick] = React.useState(0);
    const rerender = () => setTick((n: number) => n + 1);

    const copyAll = () => {
        const native = getNative();
        const text = JSON.stringify(log, null, 2) || "(empty)";
        if (native) {
            native.call("alertError", text, "Gateway Diagnostics log");
        } else {
            toast("Enable the Native Bridge plugin to copy the log");
        }
    };

    const clear = () => {
        log.length = 0;
        rerender();
    };

    const row = (entry: LogEntry, i: number) =>
        h(View, {
            key: i,
            style: { marginBottom: 12, padding: 10, backgroundColor: "#2b2d31", borderRadius: 8 },
        },
            h(Text, { style: { color: "#5865F2", fontWeight: "700", fontSize: 13 } }, `${entry.method}  (${entry.time})`),
            h(Text, { style: { color: "#b5bac1", fontSize: 12, marginTop: 4 } }, `token: ${entry.hasToken ? "present (redacted)" : "absent"}   presence: ${entry.hasPresence ? "present" : "absent"}`),
            h(Text, { style: { color: "#dbdee1", fontSize: 12, marginTop: 4 } }, "properties: " + JSON.stringify(entry.properties, null, 2)),
        );

    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } },
        h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 4 } }, "Gateway call log"),
        h(Text, { style: { color: "#949ba4", fontSize: 12, marginBottom: 16 } },
            "Reconnect the gateway (toggle airplane mode, no app restart needed) to capture a new call. Auth token is never shown, only whether one was present."),
        h(View, { style: { flexDirection: "row", marginBottom: 16 } },
            h(Pressable, {
                onPress: () => { rerender(); },
                style: { backgroundColor: "#2b2d31", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
            }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Refresh")),
            h(Pressable, {
                onPress: copyAll,
                style: { backgroundColor: "#5865F2", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
            }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Copy log")),
            h(Pressable, {
                onPress: clear,
                style: { backgroundColor: "#da373c", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 },
            }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Clear")),
        ),
        log.length === 0
            ? h(Text, { style: { color: "#80848e" } }, "No calls captured yet.")
            : log.map(row),
    );
}

export default {
    onLoad() {
        patchGateway();
    },
    onUnload() {
        unpatchGateway();
    },
    settings: Settings,
};
