import { findByName } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, Pressable, TextInput } = ReactNative as any;

interface Config {
    avatarRadius: number;
    bubbleRadius: number;
    bubbleColor: string;
}

// Matches the built-in ChatBubbles plugin: avatar corners are a percentage (0 square to 50
// circle), bubble corners a px radius, bubble color a hex string.
const DEFAULTS: Config = { avatarRadius: 30, bubbleRadius: 40, bubbleColor: "#5865F2" };

const AVATAR_PRESETS: [string, number][] = [
    ["Square", 0], ["Slightly rounded", 15], ["Rounded", 30], ["Circle", 50]
];
const BUBBLE_PRESETS: [string, number][] = [
    ["Subtle", 8], ["Rounded", 16], ["Very rounded", 24], ["Pill", 40]
];

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

function apply() {
    const native = getNative();
    if (!native) {
        toast("Enable the Native Bridge plugin first");
        return;
    }
    const c = cfg();
    native.bubbles.setEnabled(true).then(() => native.bubbles.configure({
        avatarRadius: c.avatarRadius,
        bubbleRadius: c.bubbleRadius,
        bubbleColor: c.bubbleColor
    })).catch((e: any) => {
        toast("Bubble error: " + (e?.message ?? e));
    });
}

// Discord's native color picker action sheet, same one the built-in plugin and FPTE use.
const _picker: any = findByName("showCustomColorPickerActionSheet")
    ?? findByName("showCustomColorPickerActionSheet", false);
const showColorPicker: (props: any) => void =
    typeof _picker === "function" ? _picker
        : typeof _picker?.default === "function" ? _picker.default
            : () => undefined;

const hexToInt = (hex: string): number => {
    const n = parseInt((hex || "").replace(/[^0-9a-fA-F]/g, ""), 16);
    return Number.isNaN(n) ? 0 : n & 0xFFFFFF;
};
const intToHex = (n: number): string => "#" + (n & 0xFFFFFF).toString(16).padStart(6, "0");

function Settings() {
    const h = React.createElement;
    const [, setTick] = React.useState(0);
    const rerender = () => setTick((n: number) => n + 1);
    const c = cfg();
    const native = getNative();

    // Update config, apply through the bridge live, and re-render the toggles.
    const set = (patch: Partial<Config>) => {
        Object.assign(store, patch);
        apply();
        rerender();
    };

    const presetButton = (label: string, value: number, key: "avatarRadius" | "bubbleRadius") => {
        const active = c[key] === value;
        return h(Pressable, {
            key: key + "-" + value,
            onPress: () => set({ [key]: value } as Partial<Config>),
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

    const openPicker = () => showColorPicker({
        color: hexToInt(c.bubbleColor),
        suggestedColors: ["#000000", "#1e1f22", "#5865F2", "#248046", "#DA373C"],
        onSelect: (col: number) => set({ bubbleColor: intToHex(col) })
    });

    const children: any[] = [];

    if (!native) {
        children.push(h(Text, {
            key: "warn",
            style: { color: "#faa61a", marginBottom: 16 }
        }, "Native Bridge is off. Enable the Native Bridge plugin to use bubbles."));
    }

    children.push(section("Avatar Corners", AVATAR_PRESETS.map(([l, v]) => presetButton(l, v, "avatarRadius"))));
    children.push(section("Bubble Corners", BUBBLE_PRESETS.map(([l, v]) => presetButton(l, v, "bubbleRadius"))));

    children.push(h(View, { key: "color", style: { marginBottom: 20 } },
        h(Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, "Bubble Color"),
        h(View, { style: { flexDirection: "row", alignItems: "center" } },
            h(View, { style: { flexGrow: 1, marginRight: 10 } },
                h(TextInput, {
                    defaultValue: c.bubbleColor,
                    placeholder: "#5865F2",
                    placeholderTextColor: "#888888",
                    autoCapitalize: "none",
                    onChangeText: (t: string) => { store.bubbleColor = t; },
                    onEndEditing: () => set({}),
                    style: {
                        color: "#ffffff", backgroundColor: "#2b2d31",
                        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8
                    }
                })),
            h(Pressable, {
                onPress: openPicker,
                style: {
                    width: 40, height: 40, borderRadius: 8,
                    borderWidth: 1, borderColor: "#555555",
                    backgroundColor: c.bubbleColor || "#000000"
                }
            }))));

    children.push(h(Pressable, {
        key: "apply",
        onPress: () => { apply(); toast("Bubbles applied, scroll the channel to see them"); },
        style: { backgroundColor: "#248046", borderRadius: 8, paddingVertical: 12, alignItems: "center" }
    }, h(Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Apply and reload bubbles")));

    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } }, children);
}

export default {
    onLoad() {
        // This plugin only drives native bubbles through the bridge. If the Native Bridge plugin
        // is off, there is nothing to talk to, so disable ourselves: throwing here makes the
        // plugin manager set this plugin's enabled state to false (see startPlugin).
        if (!getNative()) {
            toast("Bubble Chat needs the Native Bridge plugin enabled. Disabling.");
            throw new Error("Native Bridge plugin is not enabled");
        }
        apply();
    },
    onUnload() {
        const native = getNative();
        if (native) native.bubbles.setEnabled(false);
    },
    settings: Settings
};
