(() => { try { return ((e, t, a, r, n, o, s, l) => {
    "use strict";
    var i = [];
    function c(e) {
        return new Promise(t => {
            setTimeout(t, e);
        });
    }
    function d(e) {
        try {
            a.storage.lastError = e, s.showToast(e);
        } catch (t) {
            try {
                console.log("[SilentDelete] " + e);
            } catch (e) {}
        }
    }
    function g(e) {
        try {
            console.log("[SilentDelete] " + e);
        } catch (e) {}
    }
    function h(e) {
        return e ? "string" == typeof e ? e : e.message ? e.message + "" : e + "" : "unknown error";
    }
    function f() {
        var e, t, r, n, o, s;
        (e = a.storage).replacementText ?? (e.replacementText = "** **"), (t = a.storage).deleteDelay ?? (t.deleteDelay = 200), 
        (r = a.storage).suppressNotifications ?? (r.suppressNotifications = !0), (n = a.storage).deleteOriginal ?? (n.deleteOriginal = !0), 
        (o = a.storage).tryEphemeral ?? (o.tryEphemeral = !0), (s = a.storage).lastError ?? (s.lastError = "");
    }
    function p(e, t, a, r, n, o) {
        var s = {
            content: r,
            flags: n,
            mobile_network_type: "unknown",
            nonce: a,
            tts: !1,
            enforce_nonce: !1
        };
        return o && (s.message_reference = {
            type: 0,
            message_id: a,
            channel_id: t
        }, s.media_mention = {
            message_id: a,
            attachment_id: t,
            timestamp: 0
        }), e.post({
            url: "/channels/" + t + "/messages",
            body: s
        });
    }
    return {
        onLoad() {
            try {
                f(), a.storage.lastError = "";
                var s = e.findByProps("openLazy", "hideActionSheet") || e.findByProps("hideActionSheet", "openLazy") || e.findByProps("showActionSheet", "hideActionSheet") || e.findByProps("hideActionSheet");
                if (!s) return void d("SilentDelete: ActionSheet not found");
                (function(s) {
                    var l = "function" == typeof s.openLazy ? "openLazy" : "function" == typeof s.showActionSheet ? "showActionSheet" : null;
                    if (l) {
                        var u, m = (u = e.findByProps("ActionSheetRow")) && u.ActionSheetRow ? u.ActionSheetRow : "function" == typeof u ? u : null;
                        m || d("SilentDelete: ActionSheetRow not found"), i.push(t.before(l, s, l => {
                            try {
                                var u = (e => {
                                    var t = e[1], a = e[2];
                                    if ("string" == typeof t && /Message(LongPress)?ActionSheet/i.test(t)) return {
                                        lazy: e[0],
                                        message: a && a.message || a
                                    };
                                    for (var r = 0; r < e.length; r++) {
                                        var n = e[r];
                                        if (n && n.message && n.message.id && n.message.channel_id) return {
                                            lazy: e[0],
                                            message: n.message
                                        };
                                        if (n && n.id && n.channel_id && n.author) return {
                                            lazy: e[0],
                                            message: n
                                        };
                                    }
                                    return {};
                                })(l), y = u.lazy, S = u.message;
                                if (!S || !(t => {
                                    if (!t || !t.id || !t.channel_id) return !1;
                                    var a = e.findByProps("getCurrentUser"), r = a && a.getCurrentUser && a.getCurrentUser();
                                    return !(!r || !t.author || t.author.id !== r.id);
                                })(S)) return;
                                if (!y || "function" != typeof y.then) return;
                                var v = S.channel_id, R = S.id;
                                y.then(l => {
                                    try {
                                        var u = l && l.default ? l : {
                                            default: l
                                        }, y = t.after("default", u, (t, l) => {
                                            try {
                                                r.React.useEffect(() => () => {
                                                    try {
                                                        y();
                                                    } catch (e) {}
                                                }, []), ((t, s, l, i, u) => {
                                                    var m = o.getAssetIDByName("ic_message_delete") || o.getAssetIDByName("TrashIcon") || o.getAssetIDByName("trash") || o.getAssetIDByName("ic_trash") || o.getAssetIDByName("ic_close_16px"), y = {
                                                        label: "Silent Delete",
                                                        destructive: !0,
                                                        onPress() {
                                                            try {
                                                                l && l.hideActionSheet && l.hideActionSheet();
                                                            } catch (e) {}
                                                            ((t, r) => {
                                                                var n = e.findByProps("HTTP", "get", "post", "put", "patch", "del") || e.findByProps("get", "post", "patch", "del");
                                                                if (n && n.post && n.del) {
                                                                    f();
                                                                    var o = a.storage.replacementText || "** **", s = a.storage.deleteDelay || 200, l = !1 !== a.storage.suppressNotifications, i = !1 !== a.storage.deleteOriginal, u = l ? 4096 : 0, m = e => {
                                                                        var a = e && e.body && e.body.id;
                                                                        return c(s).then(() => (a ? n.del({
                                                                            url: "/channels/" + t + "/messages/" + a
                                                                        }).catch(e => {
                                                                            g("ghost delete: " + h(e));
                                                                        }) : Promise.resolve()).then(() => i ? c(100).then(() => n.del({
                                                                            url: "/channels/" + t + "/messages/" + r
                                                                        })).then(() => (d("Silent deleted"), !0)) : (d("Silent deleted"), !0)));
                                                                    }, y = () => p(n, t, r, o, u, !0).catch(e => (g("media_mention POST rejected: " + h(e)), 
                                                                    p(n, t, r, o, u, !1))).then(m);
                                                                    (!1 !== a.storage.tryEphemeral ? ((t, a, r) => {
                                                                        var n = 64 | ((t, a) => {
                                                                            var r = e.findByProps("getMessage", "getMessages"), n = r && r.getMessage && r.getMessage(t, a);
                                                                            return "number" == typeof (n && n.flags) ? n.flags : 0;
                                                                        })(a, r);
                                                                        return t.patch({
                                                                            url: "/channels/" + a + "/messages/" + r,
                                                                            body: {
                                                                                flags: n
                                                                            }
                                                                        }).then(e => !(64 & ~(e && e.body && e.body.flags || 0)) && t.del({
                                                                            url: "/channels/" + a + "/messages/" + r
                                                                        }).then(() => !0)).catch(() => !1);
                                                                    })(n, t, r).then(e => e ? (d("Silent deleted"), !0) : y()) : y()).catch(e => {
                                                                        d("SilentDelete failed: " + h(e));
                                                                    });
                                                                } else d("SilentDelete: REST module missing");
                                                            })(i, u);
                                                        }
                                                    };
                                                    s && s.Icon && null != m && (y.icon = r.React.createElement(s.Icon, {
                                                        source: m,
                                                        color: "#ed4245"
                                                    }));
                                                    var S = s ? r.React.createElement(s, y) : null;
                                                    if (S) {
                                                        var v = n.findInReactTree(t, e => Array.isArray(e) && e[0] && e[0].type && ("ActionSheetRowGroup" === e[0].type.name || "ActionSheetRow" === e[0].type.name || "ButtonRow" === e[0].type.name)), R = n.findInReactTree(t, e => Array.isArray(e) && e.some(e => e && e.type && ("ActionSheetRow" === e.type.name || "ButtonRow" === e.type.name))) || v;
                                                        if (R && R.length) {
                                                            for (var b = -1, E = 0; E < R.length; E++) {
                                                                var D = R[E] && R[E].props && (R[E].props.label || R[E].props.message);
                                                                if ("string" == typeof D && -1 !== D.toLowerCase().indexOf("delete")) {
                                                                    b = E;
                                                                    break;
                                                                }
                                                            }
                                                            0 > b ? R.push(S) : R.splice(b, 0, S);
                                                        } else d("SilentDelete: no rows in this action sheet");
                                                    } else d("SilentDelete: ActionSheetRow missing, cannot add button");
                                                })(l, m, s, v, R);
                                            } catch (e) {
                                                d("SilentDelete sheet render: " + h(e));
                                            }
                                        });
                                        i.push(y);
                                    } catch (e) {
                                        d("SilentDelete sheet instance: " + h(e));
                                    }
                                });
                            } catch (e) {
                                d("SilentDelete open sheet: " + h(e));
                            }
                        }));
                    } else d("SilentDelete: sheet has no openLazy/showActionSheet");
                })(s), d("SilentDelete loaded");
            } catch (e) {
                d("SilentDelete error: " + h(e));
            }
        },
        onUnload() {
            for (var e = 0; e < i.length; e++) try {
                i[e]();
            } catch (e) {}
            i.length = 0, g("unloaded");
        },
        settings() {
            var t, n, o, s, i, c;
            l.useProxy(a.storage), (t = a.storage).replacementText ?? (t.replacementText = "** **"), 
            (n = a.storage).deleteDelay ?? (n.deleteDelay = 200), (o = a.storage).suppressNotifications ?? (o.suppressNotifications = !0), 
            (s = a.storage).deleteOriginal ?? (s.deleteOriginal = !0), (i = a.storage).tryEphemeral ?? (i.tryEphemeral = !0), 
            (c = a.storage).lastError ?? (c.lastError = "");
            var [, d] = r.React.useReducer(e => e + 1, 0), g = r.ReactNative || {}, h = g.TextInput, f = g.ScrollView, p = g.Text, u = g.View, m = e.findByProps("TableRowGroup", "TableSwitchRow", "Stack"), y = m && m.TableRowGroup, S = m && m.TableSwitchRow, v = m && m.Stack || u, R = a.storage.lastError ? a.storage.lastError + "" : "", b = (e, t, n) => {
                var o = !!a.storage[n], s = e => {
                    a.storage[n] = e, d();
                };
                return S ? r.React.createElement(S, {
                    label: e,
                    subLabel: t,
                    value: o,
                    onValueChange: s
                }) : r.React.createElement(u, {
                    style: {
                        paddingVertical: 10
                    }
                }, r.React.createElement(p, {
                    style: {
                        color: "#fff",
                        fontWeight: "600"
                    }
                }, e), r.React.createElement(p, {
                    style: {
                        color: "#949ba4",
                        fontSize: 12,
                        marginBottom: 6
                    }
                }, t), r.React.createElement(p, {
                    style: {
                        color: "#5865F2"
                    },
                    onPress() {
                        s(!o);
                    }
                }, o ? "On (tap to disable)" : "Off (tap to enable)"));
            }, E = R ? r.React.createElement(u, {
                style: {
                    backgroundColor: "#4a1a1a",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    borderLeftWidth: 3,
                    borderLeftColor: "#ed4245"
                }
            }, r.React.createElement(p, {
                style: {
                    color: "#ed4245",
                    fontWeight: "700",
                    fontSize: 12,
                    marginBottom: 4
                }
            }, "Last error"), r.React.createElement(p, {
                style: {
                    color: "#f0b0b0",
                    fontSize: 12
                }
            }, R)) : null, D = r.React.createElement(v, {
                style: {
                    padding: 16
                },
                spacing: 16
            }, E, r.React.createElement(p, {
                style: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600"
                }
            }, "Replacement text"), h ? r.React.createElement(h, {
                value: (a.storage.replacementText || "** **") + "",
                placeholder: "** **",
                onChangeText(e) {
                    a.storage.replacementText = e, d();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10
                }
            }) : null, y ? r.React.createElement(y, {
                title: "Behavior"
            }, b("Try ephemeral flag first", "PATCH flags 64 then delete. If Discord accepts it, Vencord drops the row.", "tryEphemeral"), b("Suppress notifications", "Don't ping mentioned users when posting the overwrite.", "suppressNotifications"), b("Delete original message", "If off, the original can come back after a client restart.", "deleteOriginal")) : r.React.createElement(u, null, b("Try ephemeral flag first", "PATCH flags 64 then delete.", "tryEphemeral"), b("Suppress notifications", "Don't ping mentioned users.", "suppressNotifications"), b("Delete original message", "If off, original can reappear.", "deleteOriginal")), r.React.createElement(p, {
                style: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 8
                }
            }, "Delete delay (ms)"), h ? r.React.createElement(h, {
                value: (a.storage.deleteDelay || 200) + "",
                placeholder: "200",
                keyboardType: "numeric",
                onChangeText(e) {
                    var t = parseInt(e, 10);
                    isNaN(t) || (a.storage.deleteDelay = t), d();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10
                }
            }) : null);
            return f ? r.React.createElement(f, {
                style: {
                    flex: 1
                }
            }, D) : D;
        }
    };
})(vendetta.metro, vendetta.patcher, vendetta.plugin, vendetta.metro.common, vendetta.utils, vendetta.ui.assets, vendetta.ui.toasts, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
