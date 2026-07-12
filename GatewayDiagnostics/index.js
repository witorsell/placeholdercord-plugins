(() => { try { return (function(e, t, o, n) {
    "use strict";
    var {ScrollView: r, View: a, Text: i, Pressable: l} = t.ReactNative, c = [], s = [];
    function d(e) {
        try {
            n.showToast(e);
        } catch (e) {}
    }
    function f(e, t) {
        c.unshift({
            time: (new Date).toLocaleTimeString(),
            method: e,
            properties: t && t.properties,
            hasToken: !(!t || !t.token),
            hasPresence: !(!t || !t.presence)
        }), c.length > 20 && (c.length = 20);
    }
    return {
        onLoad() {
            !function() {
                var t = function(e) {
                    if ("function" != typeof n.prototype[e]) return "continue";
                    s.push(o.before(e, n.prototype, function() {
                        try {
                            f(e, this), a(this);
                        } catch (t) {
                            f(e + " (capture error: " + t + ")", null);
                        }
                    }));
                }, n = e.find(e => e && e.prototype && "function" == typeof e.prototype._doIdentify);
                if (n) {
                    var r = new WeakSet, a = e => {
                        if (e && !r.has(e) && "function" == typeof e.send) {
                            r.add(e);
                            try {
                                s.push(o.before("send", e, e => {
                                    try {
                                        var [t, o] = e;
                                        o && "object" == typeof o && "properties" in o && f("send(opcode=" + t + ")", o);
                                    } catch (e) {
                                        f("send (capture error: " + e + ")", null);
                                    }
                                }));
                            } catch (e) {
                                f("send patch failed: " + e, null);
                            }
                        }
                    };
                    for (var i of [ "_doIdentify", "_doResume", "_doResumeOrIdentify" ]) t(i);
                    d("Gateway Diagnostics: patched " + s.length + " method(s)");
                } else d("Gateway Diagnostics: GatewaySocket class not found, nothing patched");
            }();
        },
        onUnload() {
            (() => {
                for (;s.length; ) try {
                    s.pop()();
                } catch (e) {}
            })();
        },
        settings() {
            var e = t.React.createElement, [, o] = t.React.useState(0), n = () => o(e => e + 1);
            return e(r, {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    padding: 16
                }
            }, e(i, {
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 4
                }
            }, "Gateway call log"), e(i, {
                style: {
                    color: "#949ba4",
                    fontSize: 12,
                    marginBottom: 16
                }
            }, "Reconnect the gateway (toggle airplane mode, no app restart needed) to capture a new call. Auth token is never shown, only whether one was present."), e(a, {
                style: {
                    flexDirection: "row",
                    marginBottom: 16
                }
            }, e(l, {
                onPress() {
                    n();
                },
                style: {
                    backgroundColor: "#2b2d31",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginRight: 8
                }
            }, e(i, {
                style: {
                    color: "#ffffff",
                    fontWeight: "600"
                }
            }, "Refresh")), e(l, {
                onPress() {
                    var e, t = (e = window).placeholder && e.placeholder.native || null, o = JSON.stringify(c, null, 2) || "(empty)";
                    t ? t.call("alertError", o, "Gateway Diagnostics log") : d("Enable the Native Bridge plugin to copy the log");
                },
                style: {
                    backgroundColor: "#5865F2",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginRight: 8
                }
            }, e(i, {
                style: {
                    color: "#ffffff",
                    fontWeight: "600"
                }
            }, "Copy log")), e(l, {
                onPress() {
                    c.length = 0, n();
                },
                style: {
                    backgroundColor: "#da373c",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 14
                }
            }, e(i, {
                style: {
                    color: "#ffffff",
                    fontWeight: "600"
                }
            }, "Clear"))), 0 === c.length ? e(i, {
                style: {
                    color: "#80848e"
                }
            }, "No calls captured yet.") : c.map((t, o) => e(a, {
                key: o,
                style: {
                    marginBottom: 12,
                    padding: 10,
                    backgroundColor: "#2b2d31",
                    borderRadius: 8
                }
            }, e(i, {
                style: {
                    color: "#5865F2",
                    fontWeight: "700",
                    fontSize: 13
                }
            }, "".concat(t.method, "  (").concat(t.time, ")")), e(i, {
                style: {
                    color: "#b5bac1",
                    fontSize: 12,
                    marginTop: 4
                }
            }, "token: ".concat(t.hasToken ? "present (redacted)" : "absent", "   presence: ").concat(t.hasPresence ? "present" : "absent")), e(i, {
                style: {
                    color: "#dbdee1",
                    fontSize: 12,
                    marginTop: 4
                }
            }, "properties: " + JSON.stringify(t.properties, null, 2)))));
        }
    };
})(vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
