(() => { try { return ((e, t, o, r) => {
    "use strict";
    var {ScrollView: a, View: l, Text: n, Pressable: i, TextInput: b} = t.ReactNative, u = [ [ "Square", 0 ], [ "Slightly rounded", 15 ], [ "Rounded", 30 ], [ "Circle", 50 ] ], s = [ [ "Subtle", 8 ], [ "Rounded", 16 ], [ "Very rounded", 24 ], [ "Pill", 40 ] ], d = o.storage;
    function f() {
        return {
            avatarRadius: d.avatarRadius ?? 30,
            bubbleRadius: d.bubbleRadius ?? 40,
            bubbleColor: d.bubbleColor ?? "#5865F2"
        };
    }
    function c() {
        var e = window;
        return e.placeholder && e.placeholder.native || null;
    }
    function g(e) {
        try {
            r.showToast(e);
        } catch (e) {}
    }
    function p() {
        var e = c();
        if (e) {
            var t = f();
            e.bubbles.setEnabled(!0).then(() => e.bubbles.configure({
                avatarRadius: t.avatarRadius,
                bubbleRadius: t.bubbleRadius,
                bubbleColor: t.bubbleColor
            })).catch(e => {
                g("Bubble error: " + (e?.message ?? e));
            });
        } else g("Enable the Native Bridge plugin first");
    }
    var h = e.findByName("showCustomColorPickerActionSheet") ?? e.findByName("showCustomColorPickerActionSheet", !1), m = "function" == typeof h ? h : "function" == typeof h?.default ? h.default : () => {}, y = e => "#" + (16777215 & e).toString(16).padStart(6, "0");
    return {
        onLoad() {
            if (!c()) throw g("Bubble Chat needs the Native Bridge plugin enabled. Disabling."), 
            Error("Native Bridge plugin is not enabled");
            p();
        },
        onUnload() {
            var e = c();
            e && e.bubbles.setEnabled(!1);
        },
        settings() {
            var e = t.React.createElement, [, o] = t.React.useState(0), r = f(), h = c(), C = e => {
                Object.assign(d, e), p(), o(e => e + 1);
            }, v = (t, o, a) => {
                var l = r[a] === o;
                return e(i, {
                    key: a + "-" + o,
                    onPress: () => C({
                        [a]: o
                    }),
                    style: {
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        marginRight: 8,
                        marginBottom: 8,
                        backgroundColor: l ? "#5865F2" : "#2b2d31"
                    }
                }, e(n, {
                    style: {
                        color: "#ffffff"
                    }
                }, t));
            }, R = (t, o) => e(l, {
                style: {
                    marginBottom: 20
                }
            }, e(n, {
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8
                }
            }, t), e(l, {
                style: {
                    flexDirection: "row",
                    flexWrap: "wrap"
                }
            }, o)), B = [];
            return h || B.push(e(n, {
                key: "warn",
                style: {
                    color: "#faa61a",
                    marginBottom: 16
                }
            }, "Native Bridge is off. Enable the Native Bridge plugin to use bubbles.")), B.push(R("Avatar Corners", u.map(e => {
                var [t, o] = e;
                return v(t, o, "avatarRadius");
            }))), B.push(R("Bubble Corners", s.map(e => {
                var [t, o] = e;
                return v(t, o, "bubbleRadius");
            }))), B.push(e(l, {
                key: "color",
                style: {
                    marginBottom: 20
                }
            }, e(n, {
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8
                }
            }, "Bubble Color"), e(l, {
                style: {
                    flexDirection: "row",
                    alignItems: "center"
                }
            }, e(l, {
                style: {
                    flexGrow: 1,
                    marginRight: 10
                }
            }, e(b, {
                defaultValue: r.bubbleColor,
                placeholder: "#5865F2",
                placeholderTextColor: "#888888",
                autoCapitalize: "none",
                onChangeText(e) {
                    d.bubbleColor = e;
                },
                onEndEditing: () => C({}),
                style: {
                    color: "#ffffff",
                    backgroundColor: "#2b2d31",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8
                }
            })), e(i, {
                onPress() {
                    return m({
                        color: (e = r.bubbleColor, t = parseInt((e || "").replace(/[^0-9a-fA-F]/g, ""), 16), 
                        Number.isNaN(t) ? 0 : 16777215 & t),
                        suggestedColors: [ "#000000", "#1e1f22", "#5865F2", "#248046", "#DA373C" ],
                        onSelect: e => C({
                            bubbleColor: y(e)
                        })
                    });
                    var e, t;
                },
                style: {
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#555555",
                    backgroundColor: r.bubbleColor || "#000000"
                }
            })))), B.push(e(i, {
                key: "apply",
                onPress() {
                    p(), g("Bubbles applied, scroll the channel to see them");
                },
                style: {
                    backgroundColor: "#248046",
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center"
                }
            }, e(n, {
                style: {
                    color: "#ffffff",
                    fontWeight: "600"
                }
            }, "Apply and reload bubbles"))), e(a, {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    padding: 16
                }
            }, B);
        }
    };
})(vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
