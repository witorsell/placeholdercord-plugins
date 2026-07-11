import { ReactNative } from "@vendetta/metro/common";
import { React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, Pressable, TextInput } = ReactNative as any;

function getNative(): any {
    const w = window as any;
    return (w.placeholder && w.placeholder.native) || null;
}

function toast(msg: string) {
    try { showToast(msg); } catch { /* ignore */ }
}

const store = storage as any;

function Settings() {
    const h = React.createElement;
    const [, setTick] = React.useState(0);
    const rerender = () => setTick((n: number) => n + 1);
    const native = getNative();

    const currentPath: string = store.mediaPath ?? "";
    const isEnabled: boolean = store.enabled ?? false;

    const setMedia = async (path: string) => {
        if (!native) { toast("Enable the Native Bridge plugin first"); return; }
        try {
            store.mediaPath = path;
            store.enabled = true;
            await native.camera.setMedia(path);
            rerender();
            toast("Virtual camera set!");
        } catch (e: any) {
            toast("Error: " + (e?.message ?? e));
        }
    };

    const disable = async () => {
        if (!native) return;
        try {
            store.enabled = false;
            store.mediaPath = "";
            await native.camera.setMedia(null);
            rerender();
            toast("Virtual camera disabled");
        } catch (e: any) {
            toast("Error: " + (e?.message ?? e));
        }
    };

    const pickFromGallery = async () => {
        const ImageCropPicker = ReactNative.NativeModules.ImageCropPicker;
        if (!ImageCropPicker) {
            toast("Native ImageCropPicker not found!");
            return;
        }
        try {
            const res = await ImageCropPicker.openPicker({ mediaType: "any" });
            if (res && res.path) {
                setMedia(res.path.replace("file://", ""));
            }
        } catch (e: any) {
            if (e?.code !== "E_PICKER_CANCELLED") {
                toast("Picker error: " + (e?.message ?? e));
            }
        }
    };

    const children: any[] = [];

    if (!native) {
        children.push(h(Text, {
            key: "warn",
            style: { color: "#faa61a", marginBottom: 16, fontSize: 14 }
        }, "Native Bridge is off. Enable the Native Bridge plugin to use the virtual camera."));
    }

    children.push(h(View, { key: "status", style: { marginBottom: 20, padding: 14, backgroundColor: "#2b2d31", borderRadius: 10 } },
        h(Text, { style: { color: "#b5bac1", fontSize: 12, marginBottom: 4 } }, "STATUS"),
        h(Text, { style: { color: isEnabled ? "#23a559" : "#80848e", fontWeight: "600", fontSize: 15 } },
            isEnabled ? "● Active" : "○ Inactive"
        ),
        currentPath ? h(Text, {
            style: { color: "#949ba4", fontSize: 11, marginTop: 4 },
            numberOfLines: 1
        }, currentPath) : null
    ));

    children.push(h(Text, {
        key: "heading",
        style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 12 }
    }, "Pick Media"));

    children.push(h(Pressable, {
        key: "pick",
        onPress: pickFromGallery,
        style: {
            backgroundColor: "#5865F2", borderRadius: 10,
            paddingVertical: 14, alignItems: "center", marginBottom: 10
        }
    }, h(Text, { style: { color: "#ffffff", fontWeight: "700", fontSize: 15 } }, "📁  Choose Photo / Video / GIF")));

    children.push(h(View, { key: "orDivider", style: { flexDirection: "row", alignItems: "center", marginBottom: 10 } },
        h(View, { style: { flex: 1, height: 1, backgroundColor: "#3f4147" } }),
        h(Text, { style: { color: "#80848e", marginHorizontal: 10, fontSize: 13 } }, "or paste path"),
        h(View, { style: { flex: 1, height: 1, backgroundColor: "#3f4147" } })
    ));

    children.push(h(View, { key: "pathInput", style: { flexDirection: "row", marginBottom: 20 } },
        h(TextInput, {
            defaultValue: currentPath,
            placeholder: "/storage/emulated/0/DCIM/photo.jpg",
            placeholderTextColor: "#555",
            autoCapitalize: "none",
            onEndEditing: (e: any) => { if (e.nativeEvent.text) setMedia(e.nativeEvent.text); },
            style: {
                flex: 1, color: "#ffffff", backgroundColor: "#1e1f22",
                borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
                marginRight: 8, fontSize: 13
            }
        }),
        h(Pressable, {
            onPress: disable,
            style: {
                backgroundColor: "#da373c", borderRadius: 8,
                paddingHorizontal: 14, justifyContent: "center"
            }
        }, h(Text, { style: { color: "#fff", fontWeight: "700" } }, "Off"))
    ));

    return h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } }, children);
}

export default {
    onLoad() {
        if (!getNative()) {
            toast("Virtual Camera needs the Native Bridge plugin enabled. Disabling.");
            throw new Error("Native Bridge plugin is not enabled");
        }
        const path = (storage as any).mediaPath;
        const enabled = (storage as any).enabled;
        if (enabled && path) {
            const native = getNative();
            if (native && native.camera) {
                native.camera.setMedia(path).catch(() => {});
            }
        }
    },
    onUnload() {
        const native = getNative();
        if (native && native.camera) {
            native.camera.setMedia(null).catch(() => {});
        }
    },
    settings: Settings
};
