(() => { try { return ((e, t, r, n) => {
    "use strict";
    var {ScrollView: a} = t.findByProps("ScrollView"), {TableRowGroup: s, TableSwitchRow: i, Stack: l} = t.findByProps("TableRowGroup", "TableSwitchRow", "Stack"), o = (e, t) => r.plugin.storage[e] ?? t, u = (e, t) => {
        r.plugin.storage[e] = t;
    }, g = new Set([ "discord", "nsfw", "gif", "webp", "everyone", "here", "@everyone", "@here" ]), c = {
        suggestive: "nsfwSuggestive",
        offensive: "nsfwOffensive",
        sexual: "nsfwSexual",
        nsfw: "nsfwOther"
    }, f = [];
    function d(e) {
        if (!e?.url || e.url.startsWith("data:")) return null;
        var t = e.w || 200, r = e.h || 200, n = e.slug || e.shortKey || e.key.replace(/\.[a-z0-9]+$/i, "");
        return {
            id: e.key,
            title: (e.tags || []).slice(0, 4).join(" "),
            url: "".concat("https://giflibrary.site/gif", "/").concat(n, ".webp"),
            src: e.url,
            gif_src: e.url,
            width: t,
            height: r,
            preview: e.url
        };
    }
    async function h(e, t, n, a) {
        try {
            var s = await fetch(((e, t, n) => {
                var a = new URLSearchParams({
                    page: t + "",
                    limit: n + ""
                });
                e && a.set("q", e);
                var s = Object.entries(c).filter(e => {
                    var [, t] = e;
                    return !1 !== r.plugin.storage[t];
                }).map(e => {
                    var [t] = e;
                    return t;
                });
                return s.length && a.set("nsfw_categories", s.join(",")), "".concat("https://giflibrary.site/api/gifs", "?").concat(a.toString());
            })(e, n, t), {
                signal: a
            });
            return s.ok && (await s.json()).gifs || [];
        } catch (e) {
            return [];
        }
    }
    async function v(e, t, r) {
        return (await h(e, t, 1, r)).map(d).filter(Boolean);
    }
    async function w(e) {
        var t = await h("", 120, 1, e), r = new Map;
        for (var n of t) if (n.url && !n.url.startsWith("data:")) for (var a of n.tags || []) {
            var s = a.toLowerCase().trim();
            if (!(2 > s.length || s.includes(".") || s.startsWith("@") || g.has(s))) {
                var i = r.get(s);
                i ? i.count++ : r.set(s, {
                    count: 1,
                    src: n.url
                });
            }
        }
        return [ ...r.entries() ].sort((e, t) => t[1].count - e[1].count).slice(0, 12).map(e => {
            var [t, r] = e;
            return {
                name: t,
                src: r.src
            };
        });
    }
    var b = null, p = null;
    return {
        onLoad() {
            if (void 0 === r.plugin.storage.nsfwSuggestive) {
                var n = r.plugin.storage.nsfw ?? !0;
                r.plugin.storage.nsfwSuggestive = n, r.plugin.storage.nsfwOffensive = n, r.plugin.storage.nsfwSexual = n, 
                r.plugin.storage.nsfwOther = n;
            }
            var a = t.findByProps("HTTP", "get", "post", "put", "patch", "del");
            if (a?.HTTP) {
                var s = t.findByProps("getProviderForAPIRequest");
                s && f.push(e.instead("getProviderForAPIRequest", s, () => "tenor")), f.push(e.instead("get", a.HTTP, (e, t) => {
                    var r = e[0];
                    if (!r?.url || "string" != typeof r.url) return t(...e);
                    var n = r.url.toLowerCase(), a = r.query?.q, s = r.query?.limit || 50;
                    if (n.endsWith("/trending-search") || n.endsWith("/trending_search")) return Promise.resolve({
                        body: []
                    });
                    if (n.endsWith("/trending-gifs") || n.endsWith("/trending_gifs")) {
                        p?.abort();
                        var i = new AbortController;
                        return p = i, v("", s, i.signal).then(e => ({
                            body: e
                        })).catch(() => ({
                            body: []
                        }));
                    }
                    if (n.endsWith("/search")) {
                        b?.abort();
                        var l = new AbortController;
                        return b = l, v(a || "", s, l.signal).then(e => ({
                            body: e
                        })).catch(() => ({
                            body: []
                        }));
                    }
                    if (n.endsWith("/trending")) {
                        p?.abort();
                        var o = new AbortController;
                        return p = o, Promise.all([ w(o.signal), v("", 1, o.signal) ]).then(e => {
                            var [t, r] = e;
                            return {
                                body: {
                                    categories: t,
                                    gifs: r.length ? r : [ {
                                        src: ""
                                    } ]
                                }
                            };
                        }).catch(() => ({
                            body: {
                                categories: [],
                                gifs: [ {
                                    src: ""
                                } ]
                            }
                        }));
                    }
                    return n.endsWith("/suggest") ? a ? h(a, 20).then(e => {
                        var t = new Set, r = [];
                        for (var n of e) {
                            for (var s of n.tags || []) {
                                var i = s.toLowerCase();
                                if (!i.includes(a.toLowerCase()) || t.has(i) || i.includes(".") || i.startsWith("@") || (t.add(i), 
                                r.push(i)), r.length >= 5) break;
                            }
                            if (r.length >= 5) break;
                        }
                        return {
                            body: r
                        };
                    }).catch(() => ({
                        body: []
                    })) : t(...e) : n.endsWith("/select") ? Promise.resolve({
                        body: {}
                    }) : t(...e);
                }));
            } else console.warn("[BringBackGifLibrary] HTTP module not found, plugin disabled");
        },
        onUnload() {
            for (var e of (b?.abort(), b = null, p?.abort(), p = null, f)) try {
                e();
            } catch (e) {
                console.warn("[BringBackGifLibrary] failed to unpatch", e);
            }
            f.length = 0;
        },
        settings() {
            var [, e] = n.React.useReducer(e => ~e, 0);
            return n.React.createElement(a, {
                style: {
                    flex: 1
                }
            }, n.React.createElement(l, {
                style: {
                    padding: 16
                },
                spacing: 16
            }, n.React.createElement(s, {
                title: "giflibrary.site"
            }, n.React.createElement(i, {
                label: "Suggestive",
                subLabel: "Include gifs tagged suggestive. On by default here, does not change the website.",
                value: o("nsfwSuggestive", !0),
                onValueChange(t) {
                    u("nsfwSuggestive", t), e();
                }
            }), n.React.createElement(i, {
                label: "Offensive",
                subLabel: "Include gifs tagged offensive.",
                value: o("nsfwOffensive", !0),
                onValueChange(t) {
                    u("nsfwOffensive", t), e();
                }
            }), n.React.createElement(i, {
                label: "Sexual",
                subLabel: "Include gifs tagged sexual.",
                value: o("nsfwSexual", !0),
                onValueChange(t) {
                    u("nsfwSexual", t), e();
                }
            }), n.React.createElement(i, {
                label: "Other NSFW",
                subLabel: "Include gifs only tagged with the generic nsfw catch-all.",
                value: o("nsfwOther", !0),
                onValueChange(t) {
                    u("nsfwOther", t), e();
                }
            }))));
        }
    };
})(vendetta.patcher, vendetta.metro, vendetta, vendetta.metro.common);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
