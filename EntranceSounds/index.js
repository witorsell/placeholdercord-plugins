(() => { try { return ((t, e, n, r, o) => {
    "use strict";
    var {ScrollView: i, View: s, Text: a} = e.ReactNative, l = r.storage, u = !1, f = null, d = null;
    function c(t) {
        try {
            console.log("[EntranceSounds] " + t);
        } catch (t) {}
        l.lastEvent = t;
    }
    function g(t) {
        if (!t) return "unknown error";
        if ("string" == typeof t) return t;
        if (t.message) return t.message + "";
        if (t.body) try {
            return JSON.stringify(t.body);
        } catch (t) {}
        return t + "";
    }
    function p() {
        return t.findByStoreName("UserStore") || t.findByProps("getCurrentUser", "getUser");
    }
    function y(t, e, n) {
        if (t) return null != t[e] ? t[e] : null != t[n] ? t[n] : void 0;
    }
    return {
        onLoad() {
            if (l.lastEvent = l.lastEvent || "", l.lastError = l.lastError || "", u = !1, f = null, 
            e.FluxDispatcher && "function" == typeof e.FluxDispatcher.dispatch) d = n.before("dispatch", e.FluxDispatcher, e => {
                !function(e) {
                    if (e && e.type) try {
                        "RTC_CONNECTION_STATE" === e.type ? (e => {
                            if (e) {
                                var n = e.state, r = y(e, "channelId", "channel_id"), o = "RTC_CONNECTED" === n, i = o && !u;
                                if (u = o, i && null != r) {
                                    var s = (e => {
                                        var n = t.findByStoreName("ChannelStore") || t.findByProps("getChannel", "getDMFromUserId");
                                        if (!n || "function" != typeof n.getChannel) return null;
                                        var r = n.getChannel(e);
                                        if (!r) return null;
                                        if ("function" == typeof r.getGuildId) {
                                            var o = r.getGuildId();
                                            return null == o ? null : o + "";
                                        }
                                        var i = y(r, "guild_id", "guildId");
                                        return null == i ? null : i + "";
                                    })(r + "");
                                    null != s && (f === r + "" ? (f = null, c("skip, muted join for " + r)) : ((e, n) => {
                                        (() => {
                                            var e = t.findByStoreName("MediaEngineStore") || t.findByProps("isSelfDeaf", "isSelfMute");
                                            if (e) {
                                                if ("function" == typeof e.isSelfDeaf && e.isSelfDeaf()) return !0;
                                                if ("function" == typeof e.isDeaf && e.isDeaf()) return !0;
                                            }
                                            return !1;
                                        })() ? c("skip, deafened") : ((e => {
                                            var n = (() => {
                                                var e = t.findByStoreName("UserSettingsProtoStore") || t.findByProps("getUserSettingsProto");
                                                if (!e) return null;
                                                var n = e.settings;
                                                if (n || "function" != typeof e.getUserSettingsProto || (n = e.getUserSettingsProto()), 
                                                !n && e.proto && (n = e.proto), !n && "function" == typeof e.getFullState) {
                                                    var r = e.getFullState();
                                                    n = r && (r.settings || r.proto || r);
                                                }
                                                if (!n) return null;
                                                var o = n.guilds;
                                                return o ? o.guilds || o : null;
                                            })();
                                            if (!n) return !0;
                                            var r = n[e] || n[e + ""], o = n[0] || n[""] || n[0];
                                            return !!(r && (r.joinSound || r.join_sound) || o && (o.joinSound || o.join_sound));
                                        })(n) || c("no join sound in proto for " + n + ", posting anyway"), (e => {
                                            var n = t.findByProps("HTTP", "get", "post", "put", "patch", "del") || t.findByProps("get", "post", "patch", "del");
                                            if (!n || "function" != typeof n.post) return l.lastError = "REST module missing", 
                                            void c("REST module missing, cannot post custom-call-sounds");
                                            var r = {
                                                animation_type: 1,
                                                animation_id: 0
                                            }, o = "/channels/" + e + "/custom-call-sounds", i = () => n.post({
                                                url: o,
                                                body: r
                                            });
                                            i().then(() => {
                                                l.lastError = "", c("posted custom-call-sounds for " + e);
                                            }).catch(t => {
                                                c("first post failed, retrying: " + g(t)), setTimeout(() => {
                                                    i().then(() => {
                                                        l.lastError = "", c("posted custom-call-sounds for " + e + " (retry)");
                                                    }).catch(t => {
                                                        l.lastError = g(t), c("custom-call-sounds failed: " + g(t));
                                                    });
                                                }, 500);
                                            });
                                        })(e));
                                    })(r + "", s));
                                }
                            }
                        })(e) : "SOUNDBOARD_MUTE_JOIN_SOUND" === e.type ? (t => {
                            var e = y(t, "channelId", "channel_id");
                            null != e && (f = e + "");
                        })(e) : "VOICE_STATE_UPDATES" === e.type && (e => {
                            var n = e && (e.voiceStates || e.voice_states);
                            if (n && n.length) {
                                var r = (() => {
                                    var t = p();
                                    if (t && "function" == typeof t.getId) {
                                        var e = t.getId();
                                        if (e) return e + "";
                                    }
                                    if (t && "function" == typeof t.getCurrentUser) {
                                        var n = t.getCurrentUser();
                                        if (n && n.id) return n.id + "";
                                    }
                                    return null;
                                })(), o = (() => {
                                    var e = p();
                                    if (e && "function" == typeof e.getSessionId) {
                                        var n = e.getSessionId();
                                        if (n) return n + "";
                                    }
                                    var r = t.findByStoreName("SessionStore") || t.findByProps("getSessionId");
                                    if (r && "function" == typeof r.getSessionId) {
                                        var o = r.getSessionId();
                                        if (o) return o + "";
                                    }
                                    return null;
                                })();
                                if (r) for (var i = 0; i < n.length; i++) {
                                    var s = n[i], a = y(s, "userId", "user_id"), l = y(s, "channelId", "channel_id"), u = y(s, "sessionId", "session_id");
                                    a + "" == r + "" && null != u && null != o && u + "" != o + "" && null != l && (f = l + "");
                                }
                            }
                        })(e);
                    } catch (t) {
                        l.lastError = g(t), c("handler error: " + g(t));
                    }
                }(e && e[0]);
            }), c("loaded"); else {
                try {
                    o.showToast("EntranceSounds: FluxDispatcher missing");
                } catch (t) {}
                c("FluxDispatcher missing");
            }
        },
        onUnload() {
            try {
                d && d();
            } catch (t) {}
            d = null, u = !1, f = null, c("unloaded");
        },
        settings() {
            var t = e.React.createElement;
            return t(i, {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    padding: 16
                }
            }, t(a, {
                style: {
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8
                }
            }, "Entrance Sounds"), t(a, {
                style: {
                    color: "#949ba4",
                    fontSize: 13,
                    marginBottom: 16
                }
            }, "Official Android never fires the desktop CustomCallSoundsManager store, so joining a voice channel from this client never POSTs /custom-call-sounds. This plugin does that on the RTC_CONNECTED rising edge. Set a Nitro entrance sound in Discord settings as usual."), t(s, {
                style: {
                    backgroundColor: "#2b2d31",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12
                }
            }, t(a, {
                style: {
                    color: "#949ba4",
                    fontSize: 12,
                    marginBottom: 4
                }
            }, "Last event"), t(a, {
                style: {
                    color: "#ffffff",
                    fontSize: 13
                }
            }, l.lastEvent || "none yet, join a voice channel")), l.lastError ? t(s, {
                style: {
                    backgroundColor: "#3f1d1d",
                    borderRadius: 8,
                    padding: 12
                }
            }, t(a, {
                style: {
                    color: "#f23f43",
                    fontSize: 12,
                    marginBottom: 4
                }
            }, "Last error"), t(a, {
                style: {
                    color: "#ffffff",
                    fontSize: 13
                }
            }, l.lastError)) : null);
        }
    };
})(vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.plugin, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
