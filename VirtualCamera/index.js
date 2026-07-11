((e, t, a) => {
    "use strict";
    function o() {
        var e = window;
        return e.placeholder && e.placeholder.native || null;
    }
    var r = e => {
        try {
            a.showToast(e);
        } catch (e) {}
    }, i = t.storage;
    return {
        onLoad() {
            try {
                var e = o();
                if (e && e.camera) {
                    var t = i.mediaPath;
                    i.enabled && t && e.camera.setMedia(t).catch(() => {});
                }
            } catch (e) {
                r("VirtualCamera onLoad Error: " + e);
            }
        },
        onUnload() {
            var e = o();
            e && e.camera && e.camera.setMedia(null).catch(() => {});
        },
        settings() {
            var {ScrollView: t, View: a, Text: n, Pressable: l, TextInput: c} = e.ReactNative, s = e.React.createElement, [, d] = e.React.useState(0), f = () => d(e => e + 1), g = o(), u = i.mediaPath ?? "", m = i.enabled ?? !1, h = async e => {
                if (g) try {
                    i.mediaPath = e, i.enabled = !0, await g.camera.setMedia(e), f(), r("Virtual camera set!");
                } catch (e) {
                    r("Error: " + (e?.message ?? e));
                } else r("Enable the Native Bridge plugin first");
            }, p = [];
            return g || p.push(s(n, {
                key: "warn",
                style: {
                    color: "#faa61a",
                    marginBottom: 16,
                    fontSize: 14
                }
            }, "Native Bridge is off. Enable the Native Bridge plugin to use the virtual camera.")), 
            p.push(s(a, {
                key: "status",
                style: {
                    marginBottom: 20,
                    padding: 14,
                    backgroundColor: "#2b2d31",
                    borderRadius: 10
                }
            }, s(n, {
                style: {
                    color: "#b5bac1",
                    fontSize: 12,
                    marginBottom: 4
                }
            }, "STATUS"), s(n, {
                style: {
                    color: m ? "#23a559" : "#80848e",
                    fontWeight: "600",
                    fontSize: 15
                }
            }, m ? "● Active" : "○ Inactive"), u ? s(n, {
                style: {
                    color: "#949ba4",
                    fontSize: 11,
                    marginTop: 4
                },
                numberOfLines: 1
            }, u) : null)), p.push(s(n, {
                key: "heading",
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 12
                }
            }, "Pick Media")), p.push(s(l, {
                key: "pick",
                async onPress() {
                    var t = e.ReactNative.NativeModules?.ImageCropPicker;
                    if (t) try {
                        var a = await t.openPicker({
                            mediaType: "any"
                        });
                        a && a.path && h(a.path.replace("file://", ""));
                    } catch (e) {
                        "E_PICKER_CANCELLED" !== e?.code && r("Picker error: " + (e?.message ?? e));
                    } else r("Native ImageCropPicker not found!");
                },
                style: {
                    backgroundColor: "#5865F2",
                    borderRadius: 10,
                    paddingVertical: 14,
                    alignItems: "center",
                    marginBottom: 10
                }
            }, s(n, {
                style: {
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: 15
                }
            }, "📁  Choose Photo / Video / GIF"))), p.push(s(a, {
                key: "orDivider",
                style: {
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10
                }
            }, s(a, {
                style: {
                    flex: 1,
                    height: 1,
                    backgroundColor: "#3f4147"
                }
            }), s(n, {
                style: {
                    color: "#80848e",
                    marginHorizontal: 10,
                    fontSize: 13
                }
            }, "or paste path"), s(a, {
                style: {
                    flex: 1,
                    height: 1,
                    backgroundColor: "#3f4147"
                }
            }))), p.push(s(a, {
                key: "pathInput",
                style: {
                    flexDirection: "row",
                    marginBottom: 20
                }
            }, s(c, {
                defaultValue: u,
                placeholder: "/storage/emulated/0/DCIM/photo.jpg",
                placeholderTextColor: "#555",
                autoCapitalize: "none",
                onEndEditing(e) {
                    e.nativeEvent.text && h(e.nativeEvent.text);
                },
                style: {
                    flex: 1,
                    color: "#ffffff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginRight: 8,
                    fontSize: 13
                }
            }), s(l, {
                async onPress() {
                    if (g) try {
                        i.enabled = !1, i.mediaPath = "", await g.camera.setMedia(null), f(), r("Virtual camera disabled");
                    } catch (e) {
                        r("Error: " + (e?.message ?? e));
                    }
                },
                style: {
                    backgroundColor: "#da373c",
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    justifyContent: "center"
                }
            }, s(n, {
                style: {
                    color: "#fff",
                    fontWeight: "700"
                }
            }, "Off")))), s(t, {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    padding: 16
                }
            }, p);
        }
    };
})(vendetta.metro.common, vendetta.plugin, vendetta.ui.toasts);
