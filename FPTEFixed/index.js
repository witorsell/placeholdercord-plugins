(() => { try { return ((e, t, r, a, o, i, n, s, l, c, f) => {
    "use strict";
    var d = e.FluxDispatcher, u = 8203, m = String.fromCodePoint(u), p = 4096, g = 917504, h = 921599;
    function v(e, t) {
        return String.fromCodePoint(...[ ..."[#".concat(e.toString(16), ",#").concat(t.toString(16), "]") ].map(e => e.codePointAt(0) + g));
    }
    function y(e) {
        var [t, r] = e.matchAll(/(?<=#)[\dA-Fa-f]{1,6}/g);
        return [ t ? parseInt(t[0], 16) : -1, r ? parseInt(r[0], 16) : -1 ];
    }
    function E(e) {
        if (0 === e) return String.fromCodePoint(g);
        for (var t = ""; e > 0; e = Math.trunc(e / p)) t = String.fromCodePoint(e % p + g) + t;
        return t;
    }
    function P(e) {
        if ("" === e) return -1;
        for (var t = 0, r = 0; r < e.length; r++) {
            if (t > 16777215) return -2;
            t += e.codePointAt(r) * p ** (e.length - 1 - r);
        }
        return t;
    }
    function S(e) {
        if ("" === e) return -1n;
        for (var t = 0n, r = 0; r < e.length; r++) {
            if (t >= 10000000000000000000n) return -2n;
            t += BigInt(e.codePointAt(r)) * BigInt(p) ** BigInt(e.length - 1 - r);
        }
        return t;
    }
    var C = S;
    function b(e, t, r, a, o, i, n, s, l) {
        var c, f = e => e ? (e => {
            if (0n === e) return String.fromCodePoint(g);
            for (var t = ""; e > 0n; e /= BigInt(p)) t = String.fromCodePoint(Number(e % BigInt(p)) + g) + t;
            return t;
        })(BigInt(e)) : "", d = [ f(r), f(a), f(o), f(i), f(n), f(s) ];
        if (!l || 0 > e && 0 > t) if (l || 0 > e || 0 > t || e === t) {
            var u = 0 > e ? t : e;
            c = [ 0 > u ? "" : E(u), "", ...d ];
        } else c = [ E(e), E(t), ...d ]; else c = [ v(0 > e ? t : e, 0 > e ? t : 0 > t ? e : t), ...d ];
        for (;c.length && "" === c[c.length - 1]; ) c.pop();
        return c.join(m);
    }
    function I(e) {
        var t = [ "", "", "", "", "", "", "", "" ], r = 0;
        for (var a of e) {
            var o = a.codePointAt(0);
            if (o === u) {
                if (r >= 7) break;
                r++;
            } else if (g > o || o > h) {
                if (r > 0 || t[0]) break;
            } else t[r] += String.fromCodePoint(o - g);
        }
        return t;
    }
    function F(e) {
        for (var t of e) {
            var r = t.codePointAt(0);
            if (r >= g && h >= r || r === u) return !0;
        }
        return !1;
    }
    function k(e) {
        return [ ...e ].filter(e => {
            var t = e.codePointAt(0);
            return (g > t || t > h) && t !== u;
        }).join("").trim();
    }
    var B = t.findByStoreName("CollectiblesCategoryStore"), A = t.findByStoreName("CollectiblesPurchaseStore"), w = t.findByProps("fetchCollectiblesCategories"), T = {
        fetch() {
            try {
                w?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = B?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get decorations() {
            var e = t.findByProps("getAvatarDecorationsFromCategories", "getAvatarDecorationsFromPurchases") ?? t.findByProps("getAvatarDecorationsFromCategories") ?? t.findByProps("getAvatarDecorationsFromPurchases"), r = B?.categories, a = A?.purchases, o = [];
            try {
                e?.getAvatarDecorationsFromCategories && r && o.push(...e.getAvatarDecorationsFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getAvatarDecorationsFromCategories failed", e);
            }
            try {
                e?.getAvatarDecorationsFromPurchases && a && "function" == typeof a.values && o.push(...e.getAvatarDecorationsFromPurchases(a) ?? []);
            } catch (e) {
                console.warn("[FPTE] getAvatarDecorationsFromPurchases skipped", e);
            }
            var i = new Set;
            return o.map(e => {
                var t = e.config ?? e, r = e.skuId ?? t.sku_id ?? t.skuId, a = e.id ?? t.id ?? r;
                return {
                    id: a,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? a,
                        sku_id: t.sku_id ?? t.skuId ?? r
                    }
                };
            }).filter(e => !(!e.id || i.has(e.id) || (i.add(e.id), 0)));
        }
    }, _ = t.findByProps("fetchCollectiblesCategories"), N = {
        fetch() {
            try {
                _?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = B?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get nameplates() {
            var e = t.findByProps("getNameplatesFromCategories", "getNameplatesFromPurchases") ?? t.findByProps("getNameplatesFromCategories") ?? t.findByProps("getNameplatesFromPurchases"), r = B?.categories, a = A?.purchases, o = [];
            try {
                e?.getNameplatesFromCategories && r && o.push(...e.getNameplatesFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getNameplatesFromCategories failed", e);
            }
            try {
                e?.getNameplatesFromPurchases && a && "function" == typeof a.values && o.push(...e.getNameplatesFromPurchases(a) ?? []);
            } catch (e) {
                console.warn("[FPTE] getNameplatesFromPurchases skipped", e);
            }
            var i = new Set;
            return o.map(e => {
                var t = e.config ?? e, r = e.skuId ?? t.sku_id ?? t.skuId, a = e.id ?? t.id ?? r;
                return {
                    id: a,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? a,
                        sku_id: t.sku_id ?? t.skuId ?? r
                    }
                };
            }).filter(e => !(!e.id || i.has(e.id) || (i.add(e.id), 0)));
        }
    }, R = t.findByProps("fetchCollectiblesCategories"), D = {
        fetch() {
            try {
                R?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = B?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get profileEffects() {
            var e = t.findByProps("getProfileEffects", "getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromPurchases"), r = B?.categories, a = A?.purchases, o = [];
            try {
                e?.getProfileEffectsFromCategories && r && o.push(...e.getProfileEffectsFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getProfileEffectsFromCategories failed", e);
            }
            try {
                e?.getProfileEffectsFromPurchases && a && "function" == typeof a.values && o.push(...e.getProfileEffectsFromPurchases(a) ?? []);
            } catch (e) {
                console.warn("[FPTE] getProfileEffectsFromPurchases skipped", e);
            }
            var i = new Set;
            return o.map(e => {
                var t = e.config ?? e, r = e.skuId ?? e.profileEffectSkuId ?? t.sku_id ?? t.skuId, a = e.id ?? t.id ?? r;
                return {
                    id: a,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? a,
                        sku_id: t.sku_id ?? t.skuId ?? r,
                        title: t.title ?? "Profile Effect",
                        accessibilityLabel: t.accessibilityLabel ?? t.title ?? "Profile Effect"
                    }
                };
            }).filter(e => !(!e.id || i.has(e.id) || (i.add(e.id), 0)));
        }
    }, U = t.findByStoreName("UserProfileStore"), L = t.findByStoreName("UserStore"), x = new Map;
    function z(e) {
        var t = C(e);
        return t > -1n ? t.toString() : null;
    }
    function M(e) {
        var t = I(e ?? ""), r = P(t[0]);
        if (-2 === r) {
            var [a, o] = y(t[0]);
            return {
                primary: a,
                accent: o,
                effectSku: z(t[1]),
                decorationSku: z(t[2]),
                nameplateSku: z(t[3]),
                gifChannelId: z(t[4]),
                avatarGifMessageId: z(t[5]),
                bannerGifMessageId: z(t[6])
            };
        }
        return {
            primary: r,
            accent: P(t[1]),
            effectSku: z(t[2]),
            decorationSku: z(t[3]),
            nameplateSku: z(t[4]),
            gifChannelId: z(t[5]),
            avatarGifMessageId: z(t[6]),
            bannerGifMessageId: z(t[7])
        };
    }
    function O(e) {
        return x.get(e);
    }
    function G(e, t) {
        x.set(e, t);
    }
    function H(e, t) {
        G(e, M(t));
    }
    var V = o.semanticColors, j = t.find(e => e.default?.internal?.resolveSemanticColor)?.default.internal.resolveSemanticColor ?? t.find(e => e.meta?.resolveSemanticColor)?.meta.resolveSemanticColor ?? (() => {}), W = t.findByProps("useAvatarColors")?.useAvatarColors ?? (() => {}), X = t.findByProps("getProfileTheme").getProfileTheme, K = t.findByProps("useThemeContext")?.useThemeContext ?? (() => ({})), Y = t.findByProps("ThemeContextProvider")?.ThemeContextProvider ?? (e => {
        var {children: t} = e;
        return t;
    });
    function Z() {
        d.dispatch({
            type: "USER_SETTINGS_ACCOUNT_SUBMIT_SUCCESS"
        });
    }
    var q = !0, J = null;
    function Q(e) {
        var [t, r] = a.useState(() => J = e);
        return [ t, e => {
            r(J = e), q && Z();
        } ];
    }
    var $, ee = null;
    function te(e) {
        var [t, r] = a.useState(() => ee = e);
        return [ t, e => {
            r(ee = e), q && Z();
        } ];
    }
    function re(e) {
        $ = e;
    }
    var ae = (() => {
        var e = t.findByName("useProfileTheme", !1);
        return e ? () => r.after("default", e, (e, t) => {
            var [r] = e, {user: a} = r;
            return (null != a && a.id === $ || "pendingThemeColors" in r) && q && (null !== J ? (t.theme = X(J), 
            t.primaryColor = J, t.secondaryColor = ee ?? J) : null !== ee && (t.theme = X(ee), 
            t.primaryColor = ee, t.secondaryColor = ee)), t;
        }) : (e = t.findByName("useProfileThemeColors", !1)) ? () => r.after("default", e, (e, t) => {
            var [r, a, o] = e;
            if ((null != r && r.id === $ || o) && q) {
                if (null !== J) return [ J, ee ?? J ];
                if (null !== ee) return [ ee, ee ];
            }
            return t;
        }) : () => () => !0;
    })(), oe = t.findByName("ProfileEffectRecord");
    function ie(e, t, r) {
        t > -1 ? (e.themeColors = [ t, r > -1 ? r : t ], e.premiumType = 2) : r > -1 && (e.themeColors = [ r, r ], 
        e.premiumType = 2);
    }
    function ne(e, t) {
        if (t > -1n) {
            var r = t.toString();
            try {
                e.profileEffect = new oe({
                    id: r,
                    skuId: r
                });
            } catch (t) {
                e.profileEffect = {
                    id: r,
                    skuId: r,
                    sku_id: r,
                    type: 1
                };
            }
            e.profileEffectSkuId = e.profileEffectId = e.profileEffectID = r, e.premiumType = 2;
        }
    }
    function se(e) {
        return !!(e.profileEffect || e.profileEffectSkuId || e.profileEffectId || e.profileEffectID);
    }
    var le, ce = t.findByPropsAll("NONE_ITEM");
    function fe(e) {
        return "function" == typeof e[Symbol.iterator];
    }
    function de(e) {
        return null !== e && "object" == typeof e;
    }
    function ue(e) {
        return de(e) && "type" in e;
    }
    function me(e) {
        return "children" in e.props;
    }
    function pe(e) {
        return "symbol" == typeof e ? Symbol.keyFor(e) || null : "function" == typeof e ? e.displayName || e.name || null : "_context" in e ? e._context.displayName || null : e.displayName ? e.displayName : "render" in e ? e.render.displayName || e.render.name || null : "type" in e ? pe(e.type) : null;
    }
    function ge(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (de(e)) if (fe(e)) {
            if (r > 0) for (var a of e) {
                var o = ge(a, t, r - 1);
                if (o) return o;
            }
        } else {
            if (t(e)) return e;
            if (me(e)) return ge(e.props.children, t, r - 1);
        }
        return null;
    }
    function he(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (de(e)) if (fe(e)) {
            if (r > 0) for (var a of e) {
                var o = he(a, t, r - 1);
                if (o) return o;
            }
        } else if (me(e)) return t(e.props.children) ? e : he(e.props.children, t, r - 1);
        return null;
    }
    var ve = t.findByProps("Radius")?.Radius ?? {}, ye = t.findByProps("Spacing")?.Spacing ?? {}, Ee = t.findByProps("SafeAreaContext")?.SafeAreaContext, Pe = t.findByName("useWindowDimensions") ?? (() => {});
    function Se(e) {
        var {title: t, items: r, currentSkuId: o, getPreviewUri: i, getLabel: n, onSelect: l} = e, [c, f] = a.useState(o), d = Pe(), u = a.useContext(Ee), m = a.useMemo(() => r.find(e => e.skuId === c)?.config ?? null, [ r, c ]);
        return a.createElement(qe, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: d.height - u.top
        }, a.createElement(Je, {
            scrollsToTop: !1
        }, a.createElement(s.View, {
            style: {
                flex: 1,
                alignItems: "center",
                paddingBottom: 96
            }
        }, a.createElement(vt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: ye.PX_16
            }
        }, t), a.createElement(s.View, {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: ye.PX_12,
                width: "92%"
            }
        }, a.createElement(Ce, {
            label: "None",
            uri: void 0,
            isSelected: !c,
            onPress: () => f(void 0)
        }), r.map(e => a.createElement(Ce, {
            key: e.id,
            label: n(e.config),
            uri: i(e.config),
            isSelected: e.skuId === c,
            onPress: () => f(e.skuId)
        }))))), a.createElement(dt, {
            text: "Apply",
            textStyle: {
                fontSize: 16
            },
            onPress: () => l(m),
            style: {
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                height: 48,
                marginHorizontal: 36,
                marginBottom: ye.PX_48,
                borderRadius: ve.round
            }
        }));
    }
    function Ce(e) {
        var {label: t, uri: r, isSelected: o, onPress: i} = e;
        return a.createElement(Ct, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            accessibilityState: {
                selected: o
            },
            onPress: i,
            style: {
                width: 84,
                alignItems: "center",
                padding: 4,
                borderRadius: ve.sm,
                borderWidth: 2,
                borderColor: o ? "#FFFFFF" : "transparent"
            }
        }, a.createElement(s.View, {
            style: {
                width: 68,
                height: 68,
                borderRadius: ve.sm,
                overflow: "hidden",
                backgroundColor: "#2B2D31"
            }
        }, r ? a.createElement(s.Image, {
            source: {
                uri: r
            },
            resizeMode: "contain",
            style: {
                width: "100%",
                height: "100%"
            }
        }) : null), a.createElement(vt, {
            variant: "text-xs/medium",
            color: "header-secondary",
            style: {
                marginTop: 4
            },
            numberOfLines: 1
        }, t));
    }
    var be, Ie = t.findByName("EditProfileEffectActionSheet"), Fe = Ie ? e => {
        var {currentEffectId: t, effects: r, onSelect: o, user: n} = e, s = Ie({
            user: n
        }), l = K(), c = a.useMemo(() => r.map(e => ({
            items: new oe(e)
        })), [ r ]);
        if (i.storage.forceFallbackEffectPicker) return a.createElement(De, e);
        var f = !1, d = ge(s, e => "EditProfileEffectInner" === pe(e.type) || "profileEffects" in e.props && "selectedProfileEffect" in e.props && "function" == typeof e.props.setSelectedProfileEffect && (f = !0));
        if (!d) return be || a.createElement(De, e);
        var u = ge(s, e => "Button" === pe(e.type));
        if (!u) return be || a.createElement(De, e);
        if (f) {
            void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(e.currentEffectId ? {
                id: e.currentEffectId
            } : null), d.props.profileEffects = e.effects;
            var m = he(s, e => Array.isArray(e) && e.some(e => "DisplayBanner" === pe(e.type)));
            if (m) {
                var p = s;
                m.props.children = a.createElement(Y, {
                    theme: p.props.theme,
                    primaryColor: p.props.primaryColor,
                    secondaryColor: p.props.secondaryColor,
                    children: m.props.children
                }), p.props.theme = l.theme ?? "dark", p.props.primaryColor = l.primaryColor, p.props.secondaryColor = l.secondaryColor;
            }
        } else void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(t ? new oe({
            id: t
        }) : null), d.props.purchases = c;
        return re(n.id), u.props.onPress = () => {
            re(void 0), o(r.find(e => e.id === d.props.selectedProfileEffect?.id)?.config ?? null);
        }, be = s;
    } : De, ke = t.findByProps("triggerHapticFeedback"), Be = ke?.HapticFeedbackTypes ?? {}, Ae = ke?.triggerHapticFeedback ?? (() => {}), we = l.getAssetIDByName("img_none"), Te = t.findByProps("DEFAULT_PROFILE_EFFECT_WH_RATIO")?.DEFAULT_PROFILE_EFFECT_WH_RATIO ?? 45 / 88, _e = l.getAssetIDByName("sample-profile-small") ?? {
        uri: "https://discordapp.com/assets/f328a6f8209d4f1f5022.png"
    };
    l.getAssetIDByName("toast_copy_link"), l.getAssetIDByName("Small");
    var Ne = 3;
    function Re(e) {
        var {label: t, isSelected: r, size: o, colors: i, onPress: n, style: s, children: l} = e, [c, f, d] = i;
        return a.createElement(Ct, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            accessibilityState: {
                selected: r
            },
            disabled: r,
            onPress() {
                Ae(Be.IMPACT_LIGHT), n();
            },
            style: [ {
                height: o,
                width: o,
                overflow: "hidden",
                backgroundColor: f,
                borderColor: c,
                borderRadius: ve.sm,
                borderWidth: 2
            }, r && {
                borderColor: d
            }, s ]
        }, l);
    }
    function De(e) {
        var {currentEffectId: t, effects: r, onSelect: o} = e, [i, n] = a.useState(t), [l, c] = a.useState(0), {theme: f = "dark"} = K(), d = a.useMemo(() => [ V.BACKGROUND_PRIMARY ? j(f, V.BACKGROUND_PRIMARY) : "#313338", V.BACKGROUND_FLOATING ? j(f, V.BACKGROUND_FLOATING) : "#2B2D31", V.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE ? j(f, V.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE) : "#FFFFFF" ], [ f ]), u = Pe(), m = a.useContext(Ee), p = a.useMemo(() => {
            for (var e = ((e, t) => {
                for (var r = [], a = 0; a < e.length; a += t) r.push(e.slice(a, a + t));
                return r;
            })([ null, ...r ], Ne), t = e[e.length - 1]; 3 > t.length; ) t.push(void 0);
            return e;
        }, [ r ]);
        return a.createElement(qe, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: u.height - m.top
        }, a.createElement(Je, {
            scrollsToTop: !1
        }, a.createElement(s.View, {
            style: {
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 88
            }
        }, a.createElement(vt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: ye.PX_16
            }
        }, t ? "Change Effect" : "Add Profile Effect"), a.createElement(s.View, {
            style: {
                width: "72%",
                minHeight: 38
            }
        }, a.createElement(vt, {
            variant: "heading-md/bold",
            color: "header-primary",
            style: {
                textAlign: "center"
            }
        }, r.find(e => e.id === i)?.config?.title ?? "None")), a.createElement(s.View, {
            style: {
                flex: 1,
                width: "92%",
                marginTop: 3
            }
        }, a.createElement(yt, {
            accessibilityLabel: "Profile Effect Selection Section",
            numColumns: 1,
            estimatedItemSize: 98,
            ItemSeparatorComponent: () => a.createElement(s.View, {
                style: {
                    height: ye.PX_16
                }
            }),
            contentContainerStyle: {
                paddingHorizontal: ye.PX_4
            },
            data: p,
            extraData: i,
            renderItem(e) {
                var {item: t} = e;
                return a.createElement(s.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: ye.PX_16
                    }
                }, t.map(e => e ? a.createElement(Re, {
                    label: e.config?.accessibilityLabel ?? "Profile Effect",
                    isSelected: e.id === i,
                    size: l,
                    colors: d,
                    onPress() {
                        n(e.id);
                    }
                }, a.createElement(ht, {
                    effect: e.config
                })) : null === e ? a.createElement(Re, {
                    label: "None",
                    isSelected: !i,
                    size: l,
                    colors: d,
                    onPress() {
                        n(void 0);
                    },
                    style: {
                        alignItems: "center",
                        justifyContent: "center"
                    }
                }, a.createElement(gt, {
                    source: we,
                    size: gt.Sizes.LARGE
                }), a.createElement(vt, {
                    variant: "text-sm/medium",
                    color: "header-primary",
                    style: {
                        marginTop: ye.PX_4
                    }
                }, "None")) : a.createElement(s.View, {
                    style: {
                        width: l,
                        height: l
                    }
                })));
            },
            onLayout(e) {
                c((e.nativeEvent.layout.width - 64) / Ne);
            }
        })))), a.createElement(dt, {
            text: "Apply",
            textStyle: {
                fontSize: 16
            },
            onPress() {
                o(r.find(e => e.id === i)?.config ?? null);
            },
            style: {
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                height: 48,
                marginHorizontal: 36,
                marginBottom: ye.PX_48,
                borderRadius: ve.round
            }
        }));
    }
    var Ue = "__FPTE_DECO__", {useStateFromStores: Le} = t.findByProps("useStateFromStores");
    function xe(e) {
        if (e?.asset) return "https://cdn.discordapp.com/avatar-decoration-presets/".concat(e.asset, ".png?size=128&passthrough=false");
    }
    function ze(e) {
        return e?.label ?? e?.name ?? "Decoration";
    }
    function Me(e) {
        var {onSelect: t, currentSkuId: r} = e, o = Le ? Le([ B, A ], () => T.decorations) : T.decorations;
        return a.useEffect(() => {
            T.isLoaded || T.fetch();
        }, []), a.createElement(Se, {
            title: "Avatar Decoration",
            items: o,
            currentSkuId: r,
            getPreviewUri: xe,
            getLabel: ze,
            onSelect(e) {
                t(e), et(Ue);
            }
        });
    }
    var Oe = t.findByName("showCustomColorPickerActionSheet") ?? (() => {});
    function Ge(e) {
        var t;
        return (t = e).color ?? (t.color = 0), Oe(e);
    }
    var He = "__FPTE__", {useStateFromStores: Ve} = t.findByProps("useStateFromStores");
    function je(e) {
        var {onSelect: t, currentEffectId: r} = e, o = Ve ? Ve([ B, A ], () => D.profileEffects) : D.profileEffects;
        return a.useEffect(() => {
            D.isLoaded || D.fetch();
        }, []), a.createElement(Fe, {
            effects: o,
            onSelect(e) {
                t(e), et(He);
            },
            user: L.getCurrentUser(),
            currentEffectId: r
        });
    }
    var We = "__FPTE_NAMEPLATE__", {useStateFromStores: Xe} = t.findByProps("useStateFromStores");
    function Ke(e) {
        if (e?.asset) return "https://cdn.discordapp.com/assets/collectibles/".concat(e.asset, "static.png");
    }
    function Ye(e) {
        return e?.label ?? e?.name ?? "Nameplate";
    }
    function Ze(e) {
        var {onSelect: t, currentSkuId: r} = e, o = Xe ? Xe([ B, A ], () => N.nameplates) : N.nameplates;
        return a.useEffect(() => {
            N.isLoaded || N.fetch();
        }, []), a.createElement(Se, {
            title: "Nameplate",
            items: o,
            currentSkuId: r,
            getPreviewUri: Ke,
            getLabel: Ye,
            onSelect(e) {
                t(e), et(We);
            }
        });
    }
    var qe = t.findByProps("BottomSheet")?.BottomSheet ?? t.findByProps("ActionSheet")?.ActionSheet ?? (() => {
        throw Error("FakeProfileThemesAndEffects threw an error to avoid an otherwise-inevitable, unrecoverable freeze.");
    }), Je = t.findByProps("BottomSheetScrollView")?.BottomSheetScrollView ?? (() => null), Qe = t.findByProps("showActionSheet"), $e = Qe?.showActionSheet ?? (() => {}), et = Qe?.default?.hideActionSheet ?? (() => {}), tt = c.Forms.FormSection, rt = c.Forms.FormRow, at = c.Forms.FormRadioRow, ot = c.Forms.FormSwitchRow, it = c.Forms.FormCardSection, nt = t.findByProps("saveProfileChanges"), {useStateFromStores: st} = t.findByProps("useStateFromStores") ?? {}, lt = [ B, A ];
    function ct(e) {
        var {guildId: t} = e, [r, o] = Q(null), [i, l] = te(null), [c, f] = a.useState(null);
        (() => {
            var [e, t] = a.useState(() => q = !0);
        })();
        var [u, m] = a.useState(!1), {theme: p = "dark"} = K(), [g, h] = a.useMemo(() => [ V.HEADER_SECONDARY ? j(p, V.HEADER_SECONDARY) : "#B5BAC1", V.BACKGROUND_ACCENT ? j(p, V.BACKGROUND_ACCENT) : "#111214" ], [ p ]), v = W(L.getCurrentUser().getAvatarURL(t, 80), h, !1), [y, E] = a.useState(null), [P, S] = a.useState(null), [C, I] = a.useState(null), [B, A] = a.useState(null), [w, _] = a.useState(null), [R, x] = a.useState(null), [z, O] = a.useState(null), [H, X] = a.useState(null), [Y, Z] = a.useState(null), J = st ? st(lt, () => D.profileEffects) : D.profileEffects, $ = st ? st(lt, () => T.decorations) : T.decorations, ee = st ? st(lt, () => N.nameplates) : N.nameplates;
        a.useEffect(() => {
            var e = L.getCurrentUser();
            if (e) {
                var t = U.getUserProfile(e.id);
                if (t) {
                    I(t.bio ?? null);
                    var r = M(t.bio);
                    r.primary > -1 && o(r.primary), r.accent > -1 ? l(r.accent) : r.primary > -1 && l(r.primary), 
                    r.effectSku && (A(r.effectSku), D.fetch()), r.decorationSku && (_(r.decorationSku), 
                    T.fetch()), r.nameplateSku && (x(r.nameplateSku), N.fetch()), O(r.gifChannelId), 
                    X(r.avatarGifMessageId), Z(r.bannerGifMessageId);
                }
            }
        }, []), a.useEffect(() => {
            if (B && !c) {
                var e = J.find(e => e.skuId === B || e.id === B);
                e && f(e.config);
            }
        }, [ B, J, c ]), a.useEffect(() => {
            if (w && !y) {
                var e = $.find(e => e.skuId === w);
                e && E(e.config);
            }
        }, [ w, $, y ]), a.useEffect(() => {
            if (R && !P) {
                var e = ee.find(e => e.skuId === R);
                e && S(e.config);
            }
        }, [ R, ee, P ]);
        var ae = null !== C && F(C), oe = null !== r || null !== i || null !== c || null !== y || null !== P || null !== z || null !== H || null !== Y, ie = b(r ?? -1, i ?? -1, c?.sku_id ?? c?.id ?? "", y?.sku_id ?? y?.skuId ?? "", P?.sku_id ?? P?.skuId ?? "", z ?? "", H ?? "", Y ?? "", u), ne = ae && !oe ? "Remove FPTE" : "Apply FPTE", se = oe || ae;
        return a.createElement(it, {
            title: a.createElement(s.View, {
                style: {
                    flexDirection: "row",
                    alignItems: "center"
                }
            }, a.createElement(s.Text, {
                style: {
                    fontSize: 16,
                    color: "#FFFFFF"
                }
            }, "FPTE Builder"), a.createElement(s.Text, {
                style: {
                    color: ae ? "#4CAF50" : "#F44336",
                    fontSize: 17,
                    marginLeft: 8
                }
            }, ae ? "Active" : "Inactive")),
            cardStyle: {
                backgroundColor: "transparent"
            }
        }, a.createElement(s.View, {
            style: {
                flexDirection: "row",
                justifyContent: "space-between"
            }
        }, a.createElement(ft, {
            fgColor: g,
            label: "Primary",
            bgColor: r,
            onPress: () => Ge({
                color: r,
                onSelect: o,
                suggestedColors: v
            })
        }), a.createElement(ft, {
            fgColor: g,
            label: "Accent",
            bgColor: i,
            onPress: () => Ge({
                color: i,
                onSelect: l,
                suggestedColors: v
            })
        }), a.createElement(ft, {
            fgColor: g,
            label: "Effect",
            onPress() {
                return e = f, t = c?.id, d.subscribe("HIDE_ACTION_SHEET", function e(t) {
                    t.key === He && (d.unsubscribe("HIDE_ACTION_SHEET", e), re(void 0));
                }), D.isLoaded || D.fetch(), void $e({
                    content: a.createElement(je, {
                        onSelect: e,
                        currentEffectId: t
                    }),
                    key: He
                });
                var e, t;
            }
        }, c && a.createElement(ht, {
            effect: c,
            style: {
                width: "140%",
                height: "100%"
            }
        })), a.createElement(s.View, {
            style: {
                flexDirection: "column",
                alignItems: "center",
                marginLeft: 12
            }
        }, a.createElement(dt, {
            text: ne,
            size: dt.Sizes.SMALL,
            onPress() {
                var e = L.getCurrentUser();
                if (e) {
                    var t = C ?? "";
                    if (!ae || oe) {
                        if (ie) {
                            F(t) && (t = k(t)), t.length > 0 && (t += " "), (t += ie).length > 190 && n.showToast("Heads up: bio is over the 190 character limit, it may not save.");
                            try {
                                nt.saveProfileChanges({
                                    ...U.getUserProfile(e.id),
                                    bio: t
                                }), I(t), G(e.id, M(t)), n.showToast("FPTE applied!");
                            } catch (e) {
                                n.showToast("Failed to update bio!"), console.error(e);
                            }
                        }
                    } else {
                        t = k(t);
                        try {
                            nt.saveProfileChanges({
                                ...U.getUserProfile(e.id),
                                bio: t
                            }), I(t), G(e.id, M(t)), n.showToast("FPTE removed!");
                        } catch (e) {
                            n.showToast("Failed to update bio!"), console.error(e);
                        }
                    }
                }
            },
            style: {
                marginBottom: 6,
                paddingHorizontal: 12,
                opacity: se ? 1 : 0
            },
            pointerEvents: se ? "auto" : "none"
        }), a.createElement(dt, {
            text: "Reset",
            look: dt.Looks.LINK,
            color: dt.Colors.TRANSPARENT,
            size: dt.Sizes.SMALL,
            ...oe ? {} : {
                pointerEvents: "none",
                style: {
                    opacity: 0
                }
            },
            onPress() {
                o(null), l(null), f(null), E(null), S(null);
            }
        }))), a.createElement(s.View, {
            style: {
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 12,
                marginTop: 12
            }
        }, a.createElement(ft, {
            fgColor: g,
            label: "Decoration",
            onPress() {
                return e = E, t = y?.sku_id ?? y?.skuId, T.isLoaded || T.fetch(), void $e({
                    content: a.createElement(Me, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: Ue
                });
                var e, t;
            }
        }, y?.asset && a.createElement(s.Image, {
            source: {
                uri: "https://cdn.discordapp.com/avatar-decoration-presets/".concat(y.asset, ".png?size=96&passthrough=false")
            },
            resizeMode: "contain",
            style: {
                width: "100%",
                height: "100%"
            }
        })), a.createElement(ft, {
            fgColor: g,
            label: "Nameplate",
            onPress() {
                return e = S, t = P?.sku_id ?? P?.skuId, N.isLoaded || N.fetch(), void $e({
                    content: a.createElement(Ze, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: We
                });
                var e, t;
            }
        }, P?.asset && a.createElement(s.Image, {
            source: {
                uri: "https://cdn.discordapp.com/assets/collectibles/".concat(P.asset, "static.png")
            },
            resizeMode: "cover",
            style: {
                width: "100%",
                height: "100%"
            }
        }))));
    }
    var ft = e => {
        var {label: t, fgColor: r, bgColor: o, onPress: i, children: n} = e;
        return a.createElement(s.View, {
            style: {
                width: 50
            }
        }, a.createElement(Ct, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            onPress: i,
            style: [ {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                overflow: "hidden",
                borderColor: r,
                borderStyle: "dashed",
                borderWidth: 2,
                borderRadius: ve.xs
            }, null != o && {
                backgroundColor: "#" + o.toString(16).padStart(6, "0"),
                borderStyle: "solid"
            }, !!n && {
                borderWidth: 0
            } ]
        }, n ?? (null == o && a.createElement(Pt, {
            fill: r,
            width: "40%",
            height: "40%",
            viewBox: "0 0 144 144"
        }, a.createElement(St, {
            d: "M144 64H80V0H64v64H0v16h64v64h16V80h64Z"
        })))), !!t && a.createElement(vt, {
            variant: "text-sm/normal",
            style: {
                marginTop: ye.PX_4,
                textAlign: "center"
            }
        }, t));
    }, dt = c.Button, ut = t.findByProps("IconSizes"), mt = ut?.default ?? ut?.Icon ?? (() => null), pt = ut?.IconSizes ?? mt.Sizes ?? {}, gt = Object.assign(mt, {
        Sizes: pt
    }), ht = e => {
        var {effect: t, style: r} = e;
        return a.createElement(s.View, {
            style: r
        }, a.createElement(s.Image, {
            resizeMode: "cover",
            source: _e,
            style: {
                width: "100%",
                height: "100%"
            }
        }), a.createElement(s.Image, {
            alt: t.accessibilityLabel,
            resizeMethod: "resize",
            resizeMode: "cover",
            source: {
                uri: t.thumbnailPreviewSrc
            },
            style: {
                position: "absolute",
                width: "100%",
                aspectRatio: Te
            }
        }));
    }, vt = t.findByProps("TextStyleSheet")?.Text ?? (() => null), yt = t.findByName("FlashList") ?? (() => null), Et = t.findByProps("Svg"), Pt = Et?.Svg ?? (() => null), St = Et?.Path ?? (() => null), Ct = t.findByProps("PressableOpacity")?.PressableOpacity ?? (() => null), bt = t.findByName("UserProfileEditForm", !1), It = t.findByName("UserProfileEditForm", !1);
    function Ft(e) {
        if (!e) return null;
        if (ue(e) && "UserProfilePremiumUpsellCard" === pe(e.type)) return null;
        if (e.props?.children) {
            var t = e.props.children;
            Array.isArray(t) || (t = [ t ]);
            var r = t.map(Ft).filter(e => null !== e);
            e.props.children = 1 === r.length ? r[0] : r;
        }
        return e;
    }
    var kt = null, Bt = t.findByProps("saveProfileChanges");
    function At(e, a) {
        var o = t.findByName(e, !1);
        return o ? r.after("default", o, (e, t) => (kt = a, t)) : () => !0;
    }
    var wt = new Map, Tt = new Set;
    function _t(e) {
        var r = wt.get(e);
        if (r) return r;
        if (!Tt.has(e)) {
            Tt.add(e);
            var a = t.findByProps("maybeRefreshAttachmentUrl");
            Promise.resolve().then(() => a?.maybeRefreshAttachmentUrl?.(e) ?? e).then(t => {
                wt.set(e, t);
            }).catch(() => {}).then(() => {
                Tt.delete(e);
            });
        }
        return e;
    }
    function Nt(e, t) {
        var r = ge(e, e => ue(e) && ("Avatar" === pe(e.type) || "Image" === pe(e.type)));
        r && (r.props.source = {
            uri: _t(t)
        });
    }
    function Rt() {
        var e = L.getCurrentUser();
        if (e) {
            var t = U.getUserProfile(e.id);
            t && d.dispatch({
                type: "USER_PROFILE_FETCH_SUCCESS",
                user: e,
                user_profile: t,
                connected_accounts: t.connectedAccounts
            });
        }
    }
    var Dt = [], Ut = {
        onLoad() {
            var e, o, s, l, c, f;
            Dt.push(r.instead("getPurchase", A, (e, t) => $ ? {
                purchasedAt: new Date
            } : t(e)), r.after("getUserProfile", U, (e, t) => {
                if (!t || t.profileFetchFailed) return t;
                if (H(t.userId, t.bio), i.storage.prioritizeNitro) {
                    if (t.themeColors) {
                        if (!se(t)) {
                            var r = I(t.bio);
                            -2 === P(r[0]) ? ne(t, S(r[1])) : ne(t, S(r[2]));
                        }
                        return t;
                    }
                    if (se(t)) {
                        var a = I(t.bio), o = P(a[0]);
                        return -2 === o ? ie(t, ...y(a[0])) : ie(t, o, P(a[1])), t;
                    }
                }
                var n = I(t.bio), s = P(n[0]);
                return -2 === s ? (ie(t, ...y(n[0])), ne(t, S(n[1]))) : (ie(t, s, P(n[1])), ne(t, S(n[2]))), 
                t;
            }), ...ce.map(e => r.after("default", e, (e, t) => ($ && (void 0 !== D.profileEffects ? (t.splice(1), 
            t[0].items.splice(1), D.profileEffects.forEach(e => {
                t[0].items.push(new oe(e));
            }), le = t) : t = le), t))), ae(), r.after("default", bt, (e, t) => {
                if (i.storage.hideBuilder) return t;
                var r = he(t, e => Array.isArray(e) && e.some(e => ue(e) && "UserProfileEditFormTextField" === pe(e.type)));
                if (r) {
                    var o = r.props.children.reduce((e, t, r) => (ue(t) && "UserProfileEditFormTextField" === pe(t.type) && e.push(r), 
                    e), []);
                    3 > o.length || r.props.children.splice(o[2] + 1, 0, a.createElement(ct, null));
                }
                return t;
            }), void (It && r.after("default", It, (e, t) => Ft(t) || t)), r.after("getUser", L, (e, t) => {
                try {
                    if (!t?.id) return t;
                    var r = O(t.id);
                    if (!r) return t;
                    if (r.decorationSku) {
                        var a = (i = r.decorationSku, T.isLoaded ? T.decorations.find(e => e.skuId === i)?.config ?? null : (T.fetch(), 
                        null));
                        if (a) {
                            t.avatarDecorationData = {
                                asset: a.asset,
                                skuId: a.skuId,
                                sku_id: a.sku_id ?? a.skuId
                            };
                            try {
                                t.avatarDecoration = a;
                            } catch (e) {}
                        }
                    }
                    if (r.nameplateSku) {
                        var o = (e => N.isLoaded ? N.nameplates.find(t => t.skuId === e)?.config ?? null : (N.fetch(), 
                        null))(r.nameplateSku);
                        o && (t.collectibles = {
                            ...t.collectibles ?? {},
                            nameplate: o
                        });
                    }
                } catch (e) {}
                var i;
                return t;
            }), (s = At("EditUserProfileAvatar", "avatar"), l = At("UserProfileEditBannerButton", "banner"), 
            c = t.findByProps("openImagePicker"), f = c ? r.instead("openImagePicker", c, (e, r) => r(...e).then(e => {
                var r, a, o, s, l, c, f, d, u = kt, m = "avatar" === u ? i.storage.gifAvatarRedirect : i.storage.gifBannerRedirect;
                if (u && m && (d = e?.base64, "string" == typeof d && d.startsWith("data:image/gif;base64,"))) {
                    var p = L.getCurrentUser();
                    p && (r = p.id, a = "avatar" === u ? "a.gif" : "b.gif", o = e.base64, l = t.findByProps("ensurePrivateChannel", "getOrEnsurePrivateChannel"), 
                    c = t.findByProps("uploadFiles"), f = t.findByProps("sendMessage"), s = {
                        ensurePrivateChannel(e) {
                            return l.getOrEnsurePrivateChannel(e);
                        },
                        uploadFile(e, t, r, a) {
                            return new Promise((e, o) => {
                                c.once("complete", (t, r) => {
                                    e({
                                        id: r.id,
                                        filename: r.filename,
                                        uploadedFilename: r.uploadedFilename
                                    });
                                }), c.once("error", e => o(e instanceof Error ? e : Error(e + ""))), c.uploadFiles([ {
                                    file: {
                                        uri: a,
                                        name: t,
                                        type: r
                                    },
                                    filename: t
                                } ]);
                            });
                        },
                        sendMessage(e, t) {
                            return f.sendMessage(e, t);
                        }
                    }, s.ensurePrivateChannel(r).then(e => s.uploadFile(e, a, "image/gif", o).then(t => s.sendMessage(e, {
                        attachments: [ {
                            id: t.id,
                            filename: t.filename,
                            uploaded_filename: t.uploadedFilename
                        } ]
                    }).then(t => ({
                        channelId: e,
                        messageId: t.id
                    }))))).then(e => {
                        var {channelId: t, messageId: r} = e;
                        return ((e, t, r) => {
                            var a = L.getCurrentUser();
                            if (a) {
                                var o = U.getUserProfile(a.id);
                                if (o) {
                                    var i = M(o.bio), s = b(i.primary, i.accent, i.effectSku ?? "", i.decorationSku ?? "", i.nameplateSku ?? "", t, "avatar" === e ? r : i.avatarGifMessageId ?? "", "banner" === e ? r : i.bannerGifMessageId ?? "", !1), l = o.bio ?? "";
                                    F(l) && (l = k(l)), l.length > 0 && (l += " "), l += s, Bt.saveProfileChanges({
                                        ...o,
                                        bio: l
                                    }).then(() => {
                                        G(a.id, M(l)), n.showToast("GIF ".concat(e, " applied!"));
                                    }).catch(t => {
                                        console.error(t), n.showToast("Failed to save GIF ".concat(e, " reference!"));
                                    });
                                }
                            }
                        })(u, t, r);
                    }).catch(e => {
                        console.error(e), n.showToast("Failed to upload GIF ".concat(u, "!"));
                    });
                }
                return e;
            })) : () => !0, () => s() && l() && f()), (o = t.findByName("HeaderAvatar", !1)) ? r.after("default", o, (e, t) => {
                var r = e[0]?.user?.id;
                if (!r) return t;
                var a, o, i = O(r);
                return i?.gifChannelId && i.avatarGifMessageId ? (Nt(t, (a = i.gifChannelId, o = i.avatarGifMessageId, 
                "https://cdn.discordapp.com/attachments/".concat(a, "/").concat(o, "/a.gif"))), 
                t) : t;
            }) : () => !0, (e = t.findByName("UserProfileBanner", !1)) ? r.after("default", e, (e, t) => {
                var r = e[0]?.displayProfile?.userId;
                if (!r) return t;
                var a, o, i = O(r);
                return i?.gifChannelId && i.bannerGifMessageId ? (Nt(t, (a = i.gifChannelId, o = i.bannerGifMessageId, 
                "https://cdn.discordapp.com/attachments/".concat(a, "/").concat(o, "/b.gif"))), 
                t) : t;
            }) : () => !0), (() => {
                var e = L.getCurrentUser();
                if (e) {
                    var t = U.getUserProfile(e.id);
                    t && H(e.id, t.bio);
                }
            })(), Rt();
        },
        onUnload() {
            Dt.forEach(e => {
                e();
            }), Rt();
        },
        settings: () => (f.useProxy(i.storage), a.createElement(s.ScrollView, null, a.createElement(tt, {
            title: "Settings"
        }, a.createElement(rt, {
            label: "Source to prioritize"
        }), a.createElement(at, {
            label: "Nitro",
            selected: !!i.storage.prioritizeNitro,
            onPress() {
                i.storage.prioritizeNitro = !0;
            }
        }), a.createElement(at, {
            label: "About Me",
            selected: !i.storage.prioritizeNitro,
            onPress() {
                i.storage.prioritizeNitro = !1;
            }
        }), a.createElement(ot, {
            label: "Hide Builder",
            subLabel: "Hide the FPTE Builder in the User Profile and Server Profiles settings pages",
            value: !!i.storage.hideBuilder,
            onValueChange(e) {
                i.storage.hideBuilder = e;
            }
        }), a.createElement(ot, {
            label: "Force fallback effect picker",
            value: !!i.storage.forceFallbackEffectPicker,
            onValueChange(e) {
                i.storage.forceFallbackEffectPicker = e;
            }
        }), a.createElement(ot, {
            label: "Redirect GIF avatar uploads",
            subLabel: "When you pick an animated GIF as your avatar, upload it through your own Message Yourself DM instead of Discord's real upload. Other FPTE users then see it animated on your profile; everyone else keeps seeing your normal static avatar. Off leaves GIF avatar picks going through Discord as normal (still blocked without Nitro).",
            value: !!i.storage.gifAvatarRedirect,
            onValueChange(e) {
                i.storage.gifAvatarRedirect = e;
            }
        }), a.createElement(ot, {
            label: "Redirect GIF banner uploads",
            subLabel: "Same as above, for your profile banner instead of your avatar.",
            value: !!i.storage.gifBannerRedirect,
            onValueChange(e) {
                i.storage.gifBannerRedirect = e;
            }
        }))))
    };
    return Ut;
})(vendetta.metro.common, vendetta.metro, vendetta.patcher, React, vendetta.ui, vendetta.plugin, vendetta.ui.toasts, vendetta.metro.common.ReactNative, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
