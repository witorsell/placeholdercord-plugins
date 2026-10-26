(() => { try { return ((e, t, a, r, n, l, s, o, i) => {
    "use strict";
    var {FormSwitchRow: c, FormSection: g, FormDivider: d, FormInput: m} = o.Forms, p = e => new Promise(t => setTimeout(t, e)), u = e.findByProps("openLazy", "hideActionSheet"), {ActionSheetRow: h} = e.findByProps("ActionSheetRow"), y = s.getAssetIDByName("ic_message_delete") ?? s.getAssetIDByName("TrashIcon") ?? s.getAssetIDByName("trash") ?? s.getAssetIDByName("ic_trash");
    async function f(e, t, a, r, n, l) {
        var s = {
            content: r,
            flags: n,
            mobile_network_type: "unknown",
            nonce: a,
            tts: !1,
            enforce_nonce: !1
        };
        return l && (s.message_reference = {
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
    var v = null;
    return {
        onLoad() {
            var s, o, i, c, g;
            (s = a.storage).replacementText ?? (s.replacementText = "** **"), (o = a.storage).deleteDelay ?? (o.deleteDelay = 200), 
            (i = a.storage).suppressNotifications ?? (i.suppressNotifications = !0), (c = a.storage).deleteOriginal ?? (c.deleteOriginal = !0), 
            (g = a.storage).tryEphemeral ?? (g.tryEphemeral = !0), v = t.before("openLazy", u, s => {
                var [o, i, c] = s;
                if ("MessageLongPressActionSheet" === i && c?.message) {
                    var g = e.findByProps("getCurrentUser"), d = g?.getCurrentUser();
                    if (d && c.message.author?.id === d.id) {
                        var m = c.message.channel_id, v = c.message.id;
                        o.then(s => {
                            var o = t.after("default", s, (t, s) => {
                                n.React.useEffect(() => () => {
                                    o();
                                }, []);
                                var i = l.findInReactTree(s, e => Array.isArray(e) && "ActionSheetRowGroup" === e[0]?.type?.name);
                                if (i?.length) {
                                    for (var c = n.React.createElement(h, {
                                        label: "Silent Delete",
                                        destructive: !0,
                                        icon: n.React.createElement(h.Icon, {
                                            source: y,
                                            color: "#ed4245"
                                        }),
                                        onPress() {
                                            u.hideActionSheet(), (async (t, n) => {
                                                var l = e.findByProps("get", "post", "del", "patch");
                                                try {
                                                    var s, o = a.storage.replacementText ?? "** **", i = a.storage.deleteDelay ?? 200, c = a.storage.suppressNotifications ?? !0, g = a.storage.deleteOriginal ?? !0, d = c ? 4096 : 0;
                                                    if (!1 !== a.storage.tryEphemeral && await (async (t, a, n) => {
                                                        try {
                                                            var l = 64 | ((t, a) => {
                                                                var r = e.findByProps("getMessage", "getMessages"), n = r?.getMessage?.(t, a);
                                                                return "number" == typeof n?.flags ? n.flags : 0;
                                                            })(a, n), s = await t.patch({
                                                                url: "/channels/".concat(a, "/messages/").concat(n),
                                                                body: {
                                                                    flags: l
                                                                }
                                                            });
                                                            return !(64 & ~(s?.body?.flags ?? 0) || (await t.del({
                                                                url: "/channels/".concat(a, "/messages/").concat(n)
                                                            }), r.logger.log("[SilentDelete v2] ephemeral flag accepted, dropped from logger cache"), 
                                                            0));
                                                        } catch (e) {
                                                            return !1;
                                                        }
                                                    })(l, t, n)) return !0;
                                                    try {
                                                        s = await f(l, t, n, o, d, !0);
                                                    } catch (e) {
                                                        r.logger.log("[SilentDelete v2] media_mention POST rejected, nonce-only: " + e), 
                                                        s = await f(l, t, n, o, d, !1);
                                                    }
                                                    var m = s?.body?.id;
                                                    if (await p(i), m) try {
                                                        await l.del({
                                                            url: "/channels/".concat(t, "/messages/").concat(m)
                                                        });
                                                    } catch (e) {
                                                        r.logger.log("[SilentDelete v2] ghost delete: " + e);
                                                    }
                                                    return g && (await p(100), await l.del({
                                                        url: "/channels/".concat(t, "/messages/").concat(n)
                                                    })), r.logger.log("[SilentDelete v2] done"), !0;
                                                } catch (e) {
                                                    return r.logger.log("[SilentDelete v2] Error: " + e), !1;
                                                }
                                            })(m, v);
                                        }
                                    }), g = !1, d = 0; d < i.length; d++) {
                                        var w = l.findInReactTree(i[d], e => Array.isArray(e) && e.some(e => "ActionSheetRow" === e?.type?.name));
                                        if (w) {
                                            var D = w.findIndex(e => e?.props?.label?.toLowerCase?.()?.includes?.("delete") || e?.props?.message?.toLowerCase?.()?.includes?.("delete"));
                                            if (D >= 0) {
                                                w.splice(D, 0, c), g = !0;
                                                break;
                                            }
                                        }
                                    }
                                    if (!g) {
                                        r.logger.warn("[SilentDelete v2] Delete row not found, inserting before last group");
                                        var R = Math.max(0, i.length - 1);
                                        i.splice(R, 0, n.React.createElement(h.Group, null, c));
                                    }
                                } else r.logger.warn("[SilentDelete v2] Could not find ActionSheetRowGroups");
                            });
                        });
                    }
                }
            }), r.logger.log("[SilentDelete v2] Loaded.");
        },
        onUnload() {
            v?.(), v = null, r.logger.log("[SilentDelete v2] Unloaded.");
        },
        settings() {
            var e, t, r, l, s;
            return i.useProxy(a.storage), (e = a.storage).replacementText ?? (e.replacementText = "** **"), 
            (t = a.storage).deleteDelay ?? (t.deleteDelay = 200), (r = a.storage).suppressNotifications ?? (r.suppressNotifications = !0), 
            (l = a.storage).deleteOriginal ?? (l.deleteOriginal = !0), (s = a.storage).tryEphemeral ?? (s.tryEphemeral = !0), 
            n.React.createElement(n.React.Fragment, null, n.React.createElement(g, {
                title: "Behavior"
            }, n.React.createElement(m, {
                title: "Replacement Text",
                placeholder: "** **",
                value: a.storage.replacementText,
                onChangeText: e => a.storage.replacementText = e
            }), n.React.createElement(d, null), n.React.createElement(c, {
                label: "Try Ephemeral Flag First",
                subLabel: "PATCH flags 64 then delete. If Discord accepts it, Vencord drops the row instead of logging it.",
                value: !!a.storage.tryEphemeral,
                onValueChange: e => a.storage.tryEphemeral = e
            }), n.React.createElement(d, null), n.React.createElement(c, {
                label: "Suppress Notifications",
                subLabel: "Prevents pinging mentioned users when posting the overwrite.",
                value: !!a.storage.suppressNotifications,
                onValueChange: e => a.storage.suppressNotifications = e
            }), n.React.createElement(d, null), n.React.createElement(c, {
                label: "Delete Original Message",
                subLabel: "If disabled, the original message will reappear on client restart.",
                value: !!a.storage.deleteOriginal,
                onValueChange: e => a.storage.deleteOriginal = e
            })), n.React.createElement(g, {
                title: "Timing (milliseconds)"
            }, n.React.createElement(m, {
                title: "Delete Delay",
                placeholder: "200",
                value: (a.storage.deleteDelay ?? 200) + "",
                keyboardType: "numeric",
                onChangeText(e) {
                    var t = parseInt(e);
                    isNaN(t) || (a.storage.deleteDelay = t);
                }
            })));
        }
    };
})(vendetta.metro, vendetta.patcher, vendetta.plugin, vendetta, vendetta.metro.common, vendetta.utils, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
