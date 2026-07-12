(() => { try { return ((e, t, a) => {
    "use strict";
    var r = console.error;
    function o() {
        var e = window;
        return e.placeholder && e.placeholder.native || null;
    }
    console.error = function() {
        for (var e = arguments.length, t = Array(e), a = 0; e > a; a++) t[a] = arguments[a];
        try {
            var o = t.map(e => e?.stack ? e.stack : "object" == typeof e ? JSON.stringify(e) : e + "").join(" ");
            (o.includes("Virtual Camera") || o.includes("VirtualCamera") || o.includes("errored")) && alert("VIRTUALCAMERA CRASH: " + o);
        } catch (e) {}
        r.apply(console, t);
    };
    var i = e => {
        try {
            a.showToast(e);
        } catch (e) {}
    }, n = t.storage;
    return {
        onLoad() {
            var e = o();
            if (!e) throw i("Virtual Camera needs the Native Bridge plugin enabled. Disabling."), 
            Error("Native Bridge plugin is not enabled");
            try {
                if (e.camera) {
                    var t = n.mediaPath;
                    n.enabled && t && e.camera.setMedia(t).catch(() => {});
                }
            } catch (e) {
                i("VirtualCamera onLoad Error: " + e);
            }
        },
        onUnload() {
            var e = o();
            e && e.camera && e.camera.setMedia(null).catch(() => {});
        },
        settings() {
            var {ScrollView: t, View: a, Text: r, Pressable: l, TextInput: s} = e.ReactNative, c = e.React.createElement, [, d] = e.React.useState(0), f = () => d(e => e + 1), u = o(), g = n.mediaPath ?? "", m = n.enabled ?? !1, h = e => {
                u ? (n.mediaPath = e, n.enabled = !0, u.camera.setMedia(e).then(() => {
                    f(), i("Virtual camera set!");
                }).catch(e => {
                    i("Error: " + (e?.message ?? e));
                })) : i("Enable the Native Bridge plugin first");
            }, p = [];
            return u || p.push(c(r, {
                key: "warn",
                style: {
                    color: "#faa61a",
                    marginBottom: 16,
                    fontSize: 14
                }
            }, "Native Bridge is off. Enable the Native Bridge plugin to use the virtual camera.")), 
            p.push(c(a, {
                key: "status",
                style: {
                    marginBottom: 20,
                    padding: 14,
                    backgroundColor: "#2b2d31",
                    borderRadius: 10
                }
            }, c(r, {
                style: {
                    color: "#b5bac1",
                    fontSize: 12,
                    marginBottom: 4
                }
            }, "STATUS"), c(r, {
                style: {
                    color: m ? "#23a559" : "#80848e",
                    fontWeight: "600",
                    fontSize: 15
                }
            }, m ? "● Active" : "○ Inactive"), g ? c(r, {
                style: {
                    color: "#949ba4",
                    fontSize: 11,
                    marginTop: 4
                },
                numberOfLines: 1
            }, g) : null)), p.push(c(r, {
                key: "heading",
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 12
                }
            }, "Pick Media")), p.push(c(l, {
                key: "pick",
                onPress() {
                    if (u) {
                        u.call("mediaPicker.start"), i("Opening gallery...");
                        var e = () => {
                            u.call("mediaPicker.poll").then(t => {
                                "CANCELLED" !== t && (t ? h(t.replace("file://", "")) : setTimeout(e, 500));
                            }).catch(() => {
                                setTimeout(e, 500);
                            });
                        };
                        setTimeout(e, 500);
                    } else i("Native Bridge is required for the file picker.");
                },
                style: {
                    backgroundColor: "#5865F2",
                    borderRadius: 10,
                    paddingVertical: 14,
                    alignItems: "center",
                    marginBottom: 10
                }
            }, c(r, {
                style: {
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: 15
                }
            }, "📁  Choose Photo"))), p.push(c(a, {
                key: "orDivider",
                style: {
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10
                }
            }, c(a, {
                style: {
                    flex: 1,
                    height: 1,
                    backgroundColor: "#3f4147"
                }
            }), c(r, {
                style: {
                    color: "#80848e",
                    marginHorizontal: 10,
                    fontSize: 13
                }
            }, "or paste path"), c(a, {
                style: {
                    flex: 1,
                    height: 1,
                    backgroundColor: "#3f4147"
                }
            }))), p.push(c(a, {
                key: "pathInput",
                style: {
                    flexDirection: "row",
                    marginBottom: 20
                }
            }, c(s, {
                defaultValue: g,
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
            }), c(l, {
                onPress() {
                    u && (n.enabled = !1, n.mediaPath = "", u.camera.setMedia(null).then(() => {
                        f(), i("Virtual camera disabled");
                    }).catch(e => {
                        i("Error: " + (e?.message ?? e));
                    }));
                },
                style: {
                    backgroundColor: "#da373c",
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    justifyContent: "center"
                }
            }, c(r, {
                style: {
                    color: "#fff",
                    fontWeight: "700"
                }
            }, "Off")))), c(t, {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    padding: 16
                }
            }, p);
        }
    };
})(vendetta.metro.common, vendetta.plugin, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
