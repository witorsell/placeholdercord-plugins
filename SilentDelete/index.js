(() => { try { return ((e, t, a, n, r, o, s, i) => {
    "use strict";
    var l = e => new Promise(t => setTimeout(t, e)), c = [];
    function d(e) {
        try {
            s.showToast(e);
        } catch (t) {
            console.log("[SilentDelete] " + e);
        }
    }
    function g(e) {
        console.log("[SilentDelete] " + e);
    }
    function p() {
        var e, t, n, r, o;
        (e = a.storage).replacementText ?? (e.replacementText = "** **"), (t = a.storage).deleteDelay ?? (t.deleteDelay = 200), 
        (n = a.storage).suppressNotifications ?? (n.suppressNotifications = !0), (r = a.storage).deleteOriginal ?? (r.deleteOriginal = !0), 
        (o = a.storage).tryEphemeral ?? (o.tryEphemeral = !0);
    }
    async function f(e, t, a, n, r, o) {
        var s = {
            content: n,
            flags: r,
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
            url: "/channels/".concat(t, "/messages"),
            body: s
        });
    }
    return {
        onLoad() {
            try {
                p();
                var s = e.findByProps("openLazy", "hideActionSheet") || e.findByProps("hideActionSheet", "openLazy") || e.findByProps("showActionSheet", "hideActionSheet") || e.findByProps("hideActionSheet");
                if (!s) return d("SilentDelete loaded, but ActionSheet was not found"), void g("ActionSheet module missing");
                (function(s) {
                    var i = "function" == typeof s.openLazy ? "openLazy" : "function" == typeof s.showActionSheet ? "showActionSheet" : null;
                    if (i) {
                        var h, u = (h = e.findByProps("ActionSheetRow"), h?.ActionSheetRow ? h.ActionSheetRow : "function" == typeof h ? h : null);
                        c.push(t.before(i, s, i => {
                            try {
                                var {lazy: h, message: m} = (e => {
                                    var t = e[1], a = e[2];
                                    if ("string" == typeof t && /Message(LongPress)?ActionSheet/i.test(t)) return {
                                        lazy: e[0],
                                        message: a?.message ?? a
                                    };
                                    for (var n of e) {
                                        if (n?.message?.id && n.message.channel_id) return {
                                            lazy: e[0],
                                            message: n.message
                                        };
                                        if (n?.id && n?.channel_id && n?.author) return {
                                            lazy: e[0],
                                            message: n
                                        };
                                    }
                                    return {};
                                })(i);
                                if (!m || !(t => {
                                    if (!t?.id || !t?.channel_id) return !1;
                                    var a = e.findByProps("getCurrentUser"), n = a?.getCurrentUser?.();
                                    return !!n && t.author?.id === n.id;
                                })(m)) return;
                                if (!h?.then) return;
                                var y = m.channel_id, v = m.id;
                                h.then(i => {
                                    try {
                                        var h = i?.default ? i : {
                                            default: i
                                        }, m = t.after("default", h, (t, i) => {
                                            try {
                                                n.React.useEffect(() => () => {
                                                    try {
                                                        m();
                                                    } catch (e) {}
                                                }, []), ((t, s, i, c, h) => {
                                                    var u = o.getAssetIDByName("ic_message_delete") ?? o.getAssetIDByName("TrashIcon") ?? o.getAssetIDByName("trash") ?? o.getAssetIDByName("ic_trash") ?? o.getAssetIDByName("ic_close_16px"), m = {
                                                        label: "Silent Delete",
                                                        destructive: !0,
                                                        onPress() {
                                                            try {
                                                                i.hideActionSheet?.();
                                                            } catch (e) {}
                                                            (async (t, n) => {
                                                                var r = e.findByProps("HTTP", "get", "post", "put", "patch", "del") || e.findByProps("get", "post", "patch", "del");
                                                                if (!r?.post || !r?.del) return d("SilentDelete: REST module missing"), !1;
                                                                try {
                                                                    p();
                                                                    var o, s = a.storage.replacementText ?? "** **", i = a.storage.deleteDelay ?? 200, c = a.storage.suppressNotifications ?? !0, h = a.storage.deleteOriginal ?? !0, u = c ? 4096 : 0;
                                                                    if (!1 !== a.storage.tryEphemeral && await (async (t, a, n) => {
                                                                        try {
                                                                            var r = 64 | ((t, a) => {
                                                                                var n = e.findByProps("getMessage", "getMessages"), r = n?.getMessage?.(t, a);
                                                                                return "number" == typeof r?.flags ? r.flags : 0;
                                                                            })(a, n), o = await t.patch({
                                                                                url: "/channels/".concat(a, "/messages/").concat(n),
                                                                                body: {
                                                                                    flags: r
                                                                                }
                                                                            });
                                                                            return !(64 & ~(o?.body?.flags ?? 0) || (await t.del({
                                                                                url: "/channels/".concat(a, "/messages/").concat(n)
                                                                            }), g("ephemeral flag accepted"), 0));
                                                                        } catch (e) {
                                                                            return !1;
                                                                        }
                                                                    })(r, t, n)) return d("Silent deleted"), !0;
                                                                    try {
                                                                        o = await f(r, t, n, s, u, !0);
                                                                    } catch (e) {
                                                                        g("media_mention POST rejected, nonce-only: " + e), o = await f(r, t, n, s, u, !1);
                                                                    }
                                                                    var m = o?.body?.id;
                                                                    if (await l(i), m) try {
                                                                        await r.del({
                                                                            url: "/channels/".concat(t, "/messages/").concat(m)
                                                                        });
                                                                    } catch (e) {
                                                                        g("ghost delete: " + e);
                                                                    }
                                                                    return h && (await l(100), await r.del({
                                                                        url: "/channels/".concat(t, "/messages/").concat(n)
                                                                    })), d("Silent deleted"), !0;
                                                                } catch (e) {
                                                                    return d("SilentDelete failed: " + e), g("Error: " + e), !1;
                                                                }
                                                            })(c, h);
                                                        }
                                                    };
                                                    s?.Icon && null != u && (m.icon = n.React.createElement(s.Icon, {
                                                        source: u,
                                                        color: "#ed4245"
                                                    }));
                                                    var y = s ? n.React.createElement(s, m) : null, v = r.findInReactTree(t, e => Array.isArray(e) && ("ActionSheetRowGroup" === e[0]?.type?.name || "ActionSheetRow" === e[0]?.type?.name || "ButtonRow" === e[0]?.type?.name)), w = r.findInReactTree(t, e => Array.isArray(e) && e.some(e => "ActionSheetRow" === e?.type?.name || "ButtonRow" === e?.type?.name)) || v;
                                                    if (w?.length && y) {
                                                        var S = w.findIndex(e => e?.props?.label?.toLowerCase?.()?.includes?.("delete") || e?.props?.message?.toLowerCase?.()?.includes?.("delete"));
                                                        0 > S ? w.push(y) : w.splice(S, 0, y);
                                                    } else g("could not find action sheet rows");
                                                })(i, u, s, y, v);
                                            } catch (e) {
                                                g("sheet render: " + e);
                                            }
                                        });
                                        c.push(m);
                                    } catch (e) {
                                        g("sheet instance: " + e);
                                    }
                                });
                            } catch (e) {
                                g("openLazy: " + e);
                            }
                        }));
                    } else g("no openLazy/showActionSheet on ActionSheet module");
                })(s), g("loaded");
            } catch (e) {
                d("SilentDelete error: " + e), g("onLoad: " + e);
            }
        },
        onUnload() {
            for (var e of c) try {
                e();
            } catch (e) {}
            c.length = 0, g("unloaded");
        },
        settings() {
            var t, r, o, s, l;
            i.useProxy(a.storage), (t = a.storage).replacementText ?? (t.replacementText = "** **"), 
            (r = a.storage).deleteDelay ?? (r.deleteDelay = 200), (o = a.storage).suppressNotifications ?? (o.suppressNotifications = !0), 
            (s = a.storage).deleteOriginal ?? (s.deleteOriginal = !0), (l = a.storage).tryEphemeral ?? (l.tryEphemeral = !0);
            var [, c] = n.React.useReducer(e => e + 1, 0), d = n.ReactNative || {}, g = d.TextInput, p = d.ScrollView, f = d.Text, h = d.View || "div", u = e.findByProps("TableRowGroup", "TableSwitchRow", "Stack"), m = u?.TableRowGroup, y = u?.TableSwitchRow, v = u?.Stack ?? h, w = (e, t, r) => {
                var o = !!a.storage[r], s = e => {
                    a.storage[r] = e, c();
                };
                return y ? n.React.createElement(y, {
                    label: e,
                    subLabel: t,
                    value: o,
                    onValueChange: s
                }) : n.React.createElement(h, {
                    style: {
                        paddingVertical: 10
                    }
                }, n.React.createElement(f, {
                    style: {
                        color: "#fff",
                        fontWeight: "600"
                    }
                }, e), n.React.createElement(f, {
                    style: {
                        color: "#949ba4",
                        fontSize: 12,
                        marginBottom: 6
                    }
                }, t), n.React.createElement(f, {
                    style: {
                        color: "#5865F2"
                    },
                    onPress: () => s(!o)
                }, o ? "On (tap to disable)" : "Off (tap to enable)"));
            }, S = n.React.createElement(v, {
                style: {
                    padding: 16
                },
                spacing: 16
            }, n.React.createElement(f, {
                style: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600"
                }
            }, "Replacement text"), n.React.createElement(g, {
                value: (a.storage.replacementText ?? "** **") + "",
                placeholder: "** **",
                onChangeText(e) {
                    a.storage.replacementText = e, c();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10
                }
            }), m ? n.React.createElement(m, {
                title: "Behavior"
            }, w("Try ephemeral flag first", "PATCH flags 64 then delete. If Discord accepts it, Vencord drops the row.", "tryEphemeral"), w("Suppress notifications", "Don't ping mentioned users when posting the overwrite.", "suppressNotifications"), w("Delete original message", "If off, the original can come back after a client restart.", "deleteOriginal")) : n.React.createElement(h, null, w("Try ephemeral flag first", "PATCH flags 64 then delete.", "tryEphemeral"), w("Suppress notifications", "Don't ping mentioned users.", "suppressNotifications"), w("Delete original message", "If off, original can reappear.", "deleteOriginal")), n.React.createElement(f, {
                style: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 8
                }
            }, "Delete delay (ms)"), n.React.createElement(g, {
                value: (a.storage.deleteDelay ?? 200) + "",
                placeholder: "200",
                keyboardType: "numeric",
                onChangeText(e) {
                    var t = parseInt(e, 10);
                    isNaN(t) || (a.storage.deleteDelay = t), c();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10
                }
            }));
            return p ? n.React.createElement(p, {
                style: {
                    flex: 1
                }
            }, S) : S;
        }
    };
})(vendetta.metro, vendetta.patcher, vendetta.plugin, vendetta.metro.common, vendetta.utils, vendetta.ui.assets, vendetta.ui.toasts, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
