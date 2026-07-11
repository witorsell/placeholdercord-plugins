import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, Pressable, TextInput } = ReactNative as any;

interface Config {
    avatarRadius: number;
    bubbleRadius: number;
    bubbleColor: string;
}

const DEFAULTS: Config = { avatarRadius: 30, bubbleRadius: 40, bubbleColor: "#5865F2" };

// Per-plugin persisted config. Vendetta preloads this before the plugin runs.
const store = storage as unknown as Partial<Config>;

function cfg(): Config {
    return {
        avatarRadius: store.avatarRadius ?? DEFAULTS.avatarRadius,
        bubbleRadius: store.bubbleRadius ?? DEFAULTS.bubbleRadius,
        bubbleColor: store.bubbleColor ?? DEFAULTS.bubbleColor
    };
}

// The bridge lives on window.placeholder, which only exists while the built-in Native Bridge
// plugin is enabled. Never destructure it blindly; that throws and crashes the client when off.
function getNative(): any {
    const w = window as any;
    return (w.placeholder && w.placeholder.native) || null;
}

function toast(msg: string) {
    try { showToast(msg); } catch { /* ignore */ }
}

async function apply() {
    const native = getNative();
    if (!native) {
        toast("Enable the Native Bridge plugin first");
        return;
    }
    const c = cfg();
    try {
        await native.bubbles.setEnabled(true);
        await native.bubbles.configure({
            avatarRadius: c.avatarRadius,
            bubbleRadius: c.bubbleRadius,
            bubbleColor: c.bubbleColor
        });
        toast("Bubbles applied, scroll the channel to see them");
    } catch (e: any) {
        toast("Bubble error: " + (e?.message ?? e));
    }
}

function Settings() {
    const h = React.createElement;
    const [, setTick] = React.useState(0);
    const rerender = () => setTick((n: number) => n + 1);
    const c = cfg();
    const native = getNative();

    const presetButton = (label: string, value: number, key: "avatarRadius" | "bubbleRadius") => {
        const active = c[key] === value;
        return h(Pressable, {
            key: key + "-" + value,
            onPress: () => { store[key] = value; rerender(); },
            style: {
                paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
                marginRight: 8, marginBottom: 8,
                backgroundColor: active ? "#5865F2" : "#2b2d31"
            }
        }, h(Text, { style: { color: "#ffffff" } }, label));
    };

    const section = (title: string, buttons: any[]) =>
        h(View, { style: { marginBottom: 20 } },
            h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, title),
            h(View, { style: { flexDirection: "row", flexWrap: "wrap" } }, buttons));

    const children: any[] = [];

    if (!native) {
        children.push(h(Text, {
            key: "warn",
            style: { color: "#faa61a", marginBottom: 16 }
        }, "Native Bridge is off. Enable the Native Bridge plugin to use bubbles."));
    }

    children.push(section("Avatar corners", [
        presetButton("Square", 0, "avatarRadius"),
        presetButton("Slightly", 15, "avatarRadius"),
        presetButton("Rounded", 30, "avatarRadius"),
        presetButton("Circle", 50, "avatarRadius")
    ]));

    children.push(section("Bubble corners", [
        presetButton("Subtle", 8, "bubbleRadius"),
        presetButton("Rounded", 16, "bubbleRadius"),
        presetButton("Very", 24, "bubbleRadius"),
        presetButton("Pill", 40, "bubbleRadius")
    ]));

    children.push(h(View, { key: "color", style: { marginBottom: 20 } },
        h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, "Bubble color (hex)"),
        h(TextInput, {
            defaultValue: c.bubbleColor,
            placeholder: "#5865F2",
            placeholderTextColor: "#888888",
            autoCapitalize: "none",
            onChangeText: (t: string) => { store.bubbleColor = t; },
            style: {
                color: "#ffffff", backgroundColor: "#2b2d31",
                borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8
            }
        })));

    children.push(h(Pressable, {
        key: "apply",
        onPress: () => { apply(); },
        style: { backgroundColor: "#248046", borderRadius: 8, paddingVertical: 12, alignItems: "center" }
    }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Apply and reload bubbles")));

    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } }, children);
}

export default {
    onLoad() { apply(); },
    onUnload() {
        const native = getNative();
        if (native) native.bubbles.setEnabled(false);
    },
    settings: Settings
};
