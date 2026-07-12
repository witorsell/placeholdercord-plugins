(() => { try { return (function(e, o, t, r, n) {
    "use strict";
    var {ScrollView: s, View: a, Text: i, Pressable: l} = o.ReactNative, d = [ "device", "device_vendor_id", "design_id", "client_app_state", "is_fast_connect", "gateway_connect_reasons" ], c = {
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
    }, p = t.storage;
    function f() {
        return p.preset && c[p.preset] ? p.preset : "android";
    }
    function b(e) {
        try {
            n.showToast(e);
        } catch (e) {}
    }
    var u = null, _ = new WeakSet, g = null;
    return {
        onLoad() {
            var o;
            o = e.find(e => e && e.prototype && "function" == typeof e.prototype._doIdentify), 
            g = o ? r.before("_doIdentify", o.prototype, function() {
                var e;
                (e = this) && !_.has(e) && "function" == typeof e.send && (_.add(e), u = r.before("send", e, e => {
                    try {
                        (e => {
                            var o = c[f()];
                            if (o && o.properties && e && e.properties) for (var t of (Object.assign(e.properties, o.properties), 
                            d)) delete e.properties[t];
                        })(e[1]);
                    } catch (e) {
                        b("Platform Spoofer: failed to apply preset: " + e);
                    }
                }));
            }) : (b("Platform Spoofer: GatewaySocket class not found, nothing patched"), null);
        },
        onUnload() {
            u && u(), g && g();
        },
        settings() {
            var e = o.React.createElement, [, t] = o.React.useState(0), r = f();
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
            }, "Only affects a fresh IDENTIFY (logout/login, or a genuinely new connection), not a short reconnect, which resumes the existing session instead."), Object.keys(c).map(o => {
                var n = o === r;
                return e(l, {
                    key: o,
                    onPress: () => (e => {
                        p.preset = e, t(e => e + 1), b("Platform set to " + c[e].label + ". Reconnect (logout/login) to apply.");
                    })(o),
                    style: {
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        marginBottom: 8,
                        backgroundColor: n ? "#5865F2" : "#2b2d31"
                    }
                }, e(i, {
                    style: {
                        color: "#ffffff",
                        fontWeight: n ? "700" : "400"
                    }
                }, c[o].label));
            }));
        }
    };
})(vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.patcher, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
