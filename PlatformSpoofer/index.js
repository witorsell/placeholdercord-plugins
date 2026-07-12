(() => { try { return (function(e, o, t, n, r) {
    "use strict";
    var {ScrollView: s, View: a, Text: i, Pressable: l} = o.ReactNative, c = [ "device", "design_id", "client_app_state", "is_fast_connect", "gateway_connect_reasons" ], d = {
        android: {
            label: "Android (off, real)",
            properties: null
        },
        desktop: {
            label: "Desktop (Windows)",
            properties: {
                os: "Windows",
                browser: "Discord Client",
                release_channel: "stable",
                client_version: "1.0.9187",
                os_version: "10.0.19045",
                browser_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9187 Chrome/134.0.6998.205 Electron/35.5.1 Safari/537.36",
                browser_version: "35.5.1"
            }
        },
        web: {
            label: "Web (Chrome)",
            properties: {
                os: "Windows",
                browser: "Chrome",
                release_channel: "stable",
                client_version: "",
                os_version: "10",
                browser_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                browser_version: "134.0.0.0"
            }
        },
        embedded: {
            label: "Embedded (Console)",
            properties: {
                os: "Playstation 5",
                browser: "Discord Embedded",
                release_channel: "stable",
                browser_user_agent: "",
                browser_version: ""
            }
        }
    }, f = t.storage;
    function p() {
        return f.preset && d[f.preset] ? f.preset : "android";
    }
    function u(e) {
        try {
            r.showToast(e);
        } catch (e) {}
    }
    var b = null, y = null, g = new WeakSet;
    function m(e) {
        y = e, e && !g.has(e) && "function" == typeof e.send && (g.add(e), b = n.before("send", e, e => {
            try {
                (e => {
                    var o = d[p()];
                    if (o && o.properties && e && e.properties) for (var t of (Object.assign(e.properties, o.properties), 
                    c)) delete e.properties[t];
                })(e[1]);
            } catch (e) {
                u("Platform Spoofer: failed to apply preset: " + e);
            }
        }));
    }
    function w() {
        if (y) {
            try {
                y.sessionId = null, y.seq = 0;
            } catch (e) {
                return void u("Platform Spoofer: couldn't clear session state: " + e);
            }
            "function" == typeof y.close ? (y.close(), u("Reconnecting with a fresh IDENTIFY...")) : u("Session cleared, but no close() method found to force a reconnect");
        } else u("Platform Spoofer: no gateway connection seen yet");
    }
    var _ = null;
    return {
        onLoad() {
            _ = function() {
                var o = e.find(e => e && e.socket && "function" == typeof e.socket._doIdentify);
                o?.socket && m(o.socket);
                var t = e.find(e => e && e.prototype && "function" == typeof e.prototype._doIdentify);
                return t ? n.before("_doIdentify", t.prototype, function() {
                    m(this);
                }) : (y || u("Platform Spoofer: GatewaySocket class not found, nothing patched"), 
                null);
            }(), "android" !== p() && y && w();
        },
        onUnload() {
            b && b(), _ && _();
        },
        settings() {
            var e = o.React.createElement, [, t] = o.React.useState(0), n = p();
            return e(s, {
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
            }, "Report as"), e(i, {
                style: {
                    color: "#949ba4",
                    fontSize: 12,
                    marginBottom: 16
                }
            }, "Picking a preset only takes effect on the next IDENTIFY. Use Reconnect below to force one immediately, no logout needed."), Object.keys(d).map(o => {
                var r = o === n;
                return e(l, {
                    key: o,
                    onPress: () => (e => {
                        f.preset = e, t(e => e + 1), u("Platform set to " + d[e].label + ". Tap Reconnect below to apply.");
                    })(o),
                    style: {
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        marginBottom: 8,
                        backgroundColor: r ? "#5865F2" : "#2b2d31"
                    }
                }, e(i, {
                    style: {
                        color: "#ffffff",
                        fontWeight: r ? "700" : "400"
                    }
                }, d[o].label));
            }), e(l, {
                onPress: w,
                style: {
                    backgroundColor: "#248046",
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginTop: 8
                }
            }, e(i, {
                style: {
                    color: "#ffffff",
                    fontWeight: "600"
                }
            }, "Reconnect now (apply without logging out)")));
        }
    };
})(vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.patcher, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
