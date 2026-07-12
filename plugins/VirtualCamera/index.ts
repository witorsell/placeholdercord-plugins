import { ReactNative, React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const oldError = console.error;
console.error = (...args: any[]) => {
    try {
        const msg = args.map(a => (a?.stack ? a.stack : typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        if (msg.includes("Virtual Camera") || msg.includes("VirtualCamera") || msg.includes("errored")) {
            alert("VIRTUALCAMERA CRASH: " + msg);
        }
    } catch {}
    oldError.apply(console, args);
};

function getNative(): any {
    const w = window as any;
    return (w.placeholder && w.placeholder.native) || null;
}

const toast = (msg: string) => {
    try {
        showToast(msg);
    } catch (e) {}
};

const store = storage as any;

function Settings() {
    const { ScrollView, View, Text, Pressable, TextInput } = ReactNative as any;
    const h = React.createElement;

    const [, forceUpdate] = React.useState(0);
    const rerender = () => forceUpdate((n: number) => n + 1);

    const native = getNative();
    const currentPath: string = store.mediaPath ?? "";
    const isEnabled: boolean = store.enabled ?? false;

    const setMedia = (path: string) => {
        if (!native) { toast("Enable the Native Bridge plugin first"); return; }
        store.mediaPath = path;
        store.enabled = true;
        native.camera.setMedia(path).then(() => {
            rerender();
            toast("Virtual camera set!");
        }).catch((e: any) => {
            toast("Error: " + (e?.message ?? e));
        });
    };

    const disable = () => {
        if (!native) return;
        store.enabled = false;
        store.mediaPath = "";
        native.camera.setMedia(null).then(() => {
            rerender();
            toast("Virtual camera disabled");
        }).catch((e: any) => {
            toast("Error: " + (e?.message ?? e));
        });
    };

    const pickFromGallery = () => {
        if (!native) {
            toast("Native Bridge is required for the file picker.");
            return;
        }
        
        native.call("mediaPicker.start");
        toast("Opening gallery...");
        
        const checkPoll = () => {
            native.call("mediaPicker.poll").then((res: any) => {
                if (res === "CANCELLED") {
                    return; // user cancelled
                }
                if (res) {
                    setMedia(res.replace("file://", ""));
                    return;
                }
                setTimeout(checkPoll, 500);
            }).catch(() => {
                setTimeout(checkPoll, 500);
            });
        };
        setTimeout(checkPoll, 500);
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
        try {
            const native = getNative();
            if (native && native.camera) {
                const path = store.mediaPath;
                if (store.enabled && path) {
                    native.camera.setMedia(path).catch(() => {});
                }
            }
        } catch (e: any) {
            toast("VirtualCamera onLoad Error: " + String(e));
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
