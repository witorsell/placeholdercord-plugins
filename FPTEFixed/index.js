(() => { try { return ((e, t, r, o, i, n, a, s, l, c, f, d) => {
    "use strict";
    var u = e.FluxDispatcher, m = 8203, p = String.fromCodePoint(m), g = 4096, h = 917504, y = 921599;
    function E(e, t) {
        return String.fromCodePoint(...[ ..."[#".concat(e.toString(16), ",#").concat(t.toString(16), "]") ].map(e => e.codePointAt(0) + h));
    }
    function v(e) {
        var [t, r] = e.matchAll(/(?<=#)[\dA-Fa-f]{1,6}/g);
        return [ t ? parseInt(t[0], 16) : -1, r ? parseInt(r[0], 16) : -1 ];
    }
    function P(e) {
        if (0 === e) return String.fromCodePoint(h);
        for (var t = ""; e > 0; e = Math.trunc(e / g)) t = String.fromCodePoint(e % g + h) + t;
        return t;
    }
    function S(e) {
        if ("" === e) return -1;
        for (var t = 0, r = 0; r < e.length; r++) {
            if (t > 16777215) return -2;
            t += e.codePointAt(r) * g ** (e.length - 1 - r);
        }
        return t;
    }
    function C(e) {
        if ("" === e) return -1n;
        for (var t = 0n, r = 0; r < e.length; r++) {
            if (t >= 10000000000000000000n) return -2n;
            t += BigInt(e.codePointAt(r)) * BigInt(g) ** BigInt(e.length - 1 - r);
        }
        return t;
    }
    var b = C;
    function F(e) {
        var t = [ "", "", "", "", "" ], r = 0;
        for (var o of e) {
            var i = o.codePointAt(0);
            if (i === m) {
                if (r >= 4) break;
                r++;
            } else if (h > i || i > y) {
                if (r > 0 || t[0]) break;
            } else t[r] += String.fromCodePoint(i - h);
        }
        return t;
    }
    function I(e) {
        for (var t of e) {
            var r = t.codePointAt(0);
            if (r >= h && y >= r || r === m) return !0;
        }
        return !1;
    }
    function k(e) {
        return [ ...e ].filter(e => {
            var t = e.codePointAt(0);
            return (h > t || t > y) && t !== m;
        }).join("").trim();
    }
    var B = t.findByStoreName("CollectiblesCategoryStore"), A = t.findByStoreName("CollectiblesPurchaseStore"), T = t.findByProps("fetchCollectiblesCategories"), _ = {
        fetch() {
            try {
                T?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = B?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get decorations() {
            var e = t.findByProps("getAvatarDecorationsFromCategories", "getAvatarDecorationsFromPurchases") ?? t.findByProps("getAvatarDecorationsFromCategories") ?? t.findByProps("getAvatarDecorationsFromPurchases"), r = B?.categories, o = A?.purchases, i = [];
            try {
                e?.getAvatarDecorationsFromCategories && r && i.push(...e.getAvatarDecorationsFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getAvatarDecorationsFromCategories failed", e);
            }
            try {
                e?.getAvatarDecorationsFromPurchases && o && "function" == typeof o.values && i.push(...e.getAvatarDecorationsFromPurchases(o) ?? []);
            } catch (e) {
                console.warn("[FPTE] getAvatarDecorationsFromPurchases skipped", e);
            }
            var n = new Set;
            return i.map(e => {
                var t = e.config ?? e, r = e.skuId ?? t.sku_id ?? t.skuId, o = e.id ?? t.id ?? r;
                return {
                    id: o,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? o,
                        sku_id: t.sku_id ?? t.skuId ?? r
                    }
                };
            }).filter(e => !(!e.id || n.has(e.id) || (n.add(e.id), 0)));
        }
    }, w = t.findByProps("fetchCollectiblesCategories"), N = {
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
        get nameplates() {
            var e = t.findByProps("getNameplatesFromCategories", "getNameplatesFromPurchases") ?? t.findByProps("getNameplatesFromCategories") ?? t.findByProps("getNameplatesFromPurchases"), r = B?.categories, o = A?.purchases, i = [];
            try {
                e?.getNameplatesFromCategories && r && i.push(...e.getNameplatesFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getNameplatesFromCategories failed", e);
            }
            try {
                e?.getNameplatesFromPurchases && o && "function" == typeof o.values && i.push(...e.getNameplatesFromPurchases(o) ?? []);
            } catch (e) {
                console.warn("[FPTE] getNameplatesFromPurchases skipped", e);
            }
            var n = new Set;
            return i.map(e => {
                var t = e.config ?? e, r = e.skuId ?? t.sku_id ?? t.skuId, o = e.id ?? t.id ?? r;
                return {
                    id: o,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? o,
                        sku_id: t.sku_id ?? t.skuId ?? r
                    }
                };
            }).filter(e => !(!e.id || n.has(e.id) || (n.add(e.id), 0)));
        }
    }, D = t.findByProps("fetchCollectiblesCategories"), R = {
        fetch() {
            try {
                D?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = B?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get profileEffects() {
            var e = t.findByProps("getProfileEffects", "getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromPurchases"), r = B?.categories, o = A?.purchases, i = [];
            try {
                e?.getProfileEffectsFromCategories && r && i.push(...e.getProfileEffectsFromCategories(r) ?? []);
            } catch (e) {
                console.warn("[FPTE] getProfileEffectsFromCategories failed", e);
            }
            try {
                e?.getProfileEffectsFromPurchases && o && "function" == typeof o.values && i.push(...e.getProfileEffectsFromPurchases(o) ?? []);
            } catch (e) {
                console.warn("[FPTE] getProfileEffectsFromPurchases skipped", e);
            }
            var n = new Set;
            return i.map(e => {
                var t = e.config ?? e, r = e.skuId ?? e.profileEffectSkuId ?? t.sku_id ?? t.skuId, o = e.id ?? t.id ?? r;
                return {
                    id: o,
                    skuId: r,
                    config: {
                        ...t,
                        id: t.id ?? o,
                        sku_id: t.sku_id ?? t.skuId ?? r,
                        title: t.title ?? "Profile Effect",
                        accessibilityLabel: t.accessibilityLabel ?? t.title ?? "Profile Effect"
                    }
                };
            }).filter(e => !(!e.id || n.has(e.id) || (n.add(e.id), 0)));
        }
    }, x = t.findByStoreName("UserProfileStore"), L = t.findByStoreName("UserStore"), U = new Map;
    function z(e) {
        var t = b(e);
        return t > -1n ? t.toString() : null;
    }
    function O(e) {
        var t = F(e ?? ""), r = S(t[0]);
        if (-2 === r) {
            var [o, i] = v(t[0]);
            return {
                primary: o,
                accent: i,
                effectSku: z(t[1]),
                decorationSku: z(t[2]),
                nameplateSku: z(t[3])
            };
        }
        return {
            primary: r,
            accent: S(t[1]),
            effectSku: z(t[2]),
            decorationSku: z(t[3]),
            nameplateSku: z(t[4])
        };
    }
    function H(e, t) {
        U.set(e, t);
    }
    function V(e, t) {
        H(e, O(t));
    }
    var M = i.semanticColors, G = t.find(e => e.default?.internal?.resolveSemanticColor)?.default.internal.resolveSemanticColor ?? t.find(e => e.meta?.resolveSemanticColor)?.meta.resolveSemanticColor ?? (() => {}), j = t.findByProps("useAvatarColors")?.useAvatarColors ?? (() => {}), X = t.findByProps("getProfileTheme").getProfileTheme, W = t.findByProps("useThemeContext")?.useThemeContext ?? (() => ({})), K = t.findByProps("ThemeContextProvider")?.ThemeContextProvider ?? (e => {
        var {children: t} = e;
        return t;
    });
    function Y() {
        u.dispatch({
            type: "USER_SETTINGS_ACCOUNT_SUBMIT_SUCCESS"
        });
    }
    var Z = !0, q = null;
    function J(e) {
        var [t, r] = o.useState(() => q = e);
        return [ t, e => {
            r(q = e), Z && Y();
        } ];
    }
    var Q, $ = null;
    function ee(e) {
        var [t, r] = o.useState(() => $ = e);
        return [ t, e => {
            r($ = e), Z && Y();
        } ];
    }
    function te(e) {
        Q = e;
    }
    var re = (() => {
        var e = t.findByName("useProfileTheme", !1);
        return e ? () => r.after("default", e, (e, t) => {
            var [r] = e, {user: o} = r;
            return (null != o && o.id === Q || "pendingThemeColors" in r) && Z && (null !== q ? (t.theme = X(q), 
            t.primaryColor = q, t.secondaryColor = $ ?? q) : null !== $ && (t.theme = X($), 
            t.primaryColor = $, t.secondaryColor = $)), t;
        }) : (e = t.findByName("useProfileThemeColors", !1)) ? () => r.after("default", e, (e, t) => {
            var [r, o, i] = e;
            if ((null != r && r.id === Q || i) && Z) {
                if (null !== q) return [ q, $ ?? q ];
                if (null !== $) return [ $, $ ];
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
    function ae(e) {
        return !!(e.profileEffect || e.profileEffectSkuId || e.profileEffectId || e.profileEffectID);
    }
    var se, le = t.findByPropsAll("NONE_ITEM");
    function ce(e) {
        return "function" == typeof e[Symbol.iterator];
    }
    function fe(e) {
        return null !== e && "object" == typeof e;
    }
    function de(e) {
        return fe(e) && "type" in e;
    }
    function ue(e) {
        return "children" in e.props;
    }
    function me(e) {
        return "symbol" == typeof e ? Symbol.keyFor(e) || null : "function" == typeof e ? e.displayName || e.name || null : "_context" in e ? e._context.displayName || null : e.displayName ? e.displayName : "render" in e ? e.render.displayName || e.render.name || null : "type" in e ? me(e.type) : null;
    }
    function pe(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (fe(e)) if (ce(e)) {
            if (r > 0) for (var o of e) {
                var i = pe(o, t, r - 1);
                if (i) return i;
            }
        } else {
            if (t(e)) return e;
            if (ue(e)) return pe(e.props.children, t, r - 1);
        }
        return null;
    }
    function ge(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (fe(e)) if (ce(e)) {
            if (r > 0) for (var o of e) {
                var i = ge(o, t, r - 1);
                if (i) return i;
            }
        } else if (ue(e)) return t(e.props.children) ? e : ge(e.props.children, t, r - 1);
        return null;
    }
    var he = t.findByProps("Radius")?.Radius ?? {}, ye = t.findByProps("Spacing")?.Spacing ?? {}, Ee = t.findByProps("SafeAreaContext")?.SafeAreaContext, ve = t.findByName("useWindowDimensions") ?? (() => {});
    function Pe(e) {
        var {title: t, items: r, currentSkuId: i, getPreviewUri: n, getLabel: a, onSelect: l} = e, [c, f] = o.useState(i), d = ve(), u = o.useContext(Ee), m = o.useMemo(() => r.find(e => e.skuId === c)?.config ?? null, [ r, c ]);
        return o.createElement(Ze, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: d.height - u.top
        }, o.createElement(qe, {
            scrollsToTop: !1
        }, o.createElement(s.View, {
            style: {
                flex: 1,
                alignItems: "center",
                paddingBottom: 96
            }
        }, o.createElement(gt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: ye.PX_16
            }
        }, t), o.createElement(s.View, {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: ye.PX_12,
                width: "92%"
            }
        }, o.createElement(Se, {
            label: "None",
            uri: void 0,
            isSelected: !c,
            onPress: () => f(void 0)
        }), r.map(e => o.createElement(Se, {
            key: e.id,
            label: a(e.config),
            uri: n(e.config),
            isSelected: e.skuId === c,
            onPress: () => f(e.skuId)
        }))))), o.createElement(ct, {
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
                borderRadius: he.round
            }
        }));
    }
    function Se(e) {
        var {label: t, uri: r, isSelected: i, onPress: n} = e;
        return o.createElement(Pt, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            accessibilityState: {
                selected: i
            },
            onPress: n,
            style: {
                width: 84,
                alignItems: "center",
                padding: 4,
                borderRadius: he.sm,
                borderWidth: 2,
                borderColor: i ? "#FFFFFF" : "transparent"
            }
        }, o.createElement(s.View, {
            style: {
                width: 68,
                height: 68,
                borderRadius: he.sm,
                overflow: "hidden",
                backgroundColor: "#2B2D31"
            }
        }, r ? o.createElement(s.Image, {
            source: {
                uri: r
            },
            resizeMode: "contain",
            style: {
                width: "100%",
                height: "100%"
            }
        }) : null), o.createElement(gt, {
            variant: "text-xs/medium",
            color: "header-secondary",
            style: {
                marginTop: 4
            },
            numberOfLines: 1
        }, t));
    }
    var Ce, be = t.findByName("EditProfileEffectActionSheet"), Fe = be ? e => {
        var {currentEffectId: t, effects: r, onSelect: i, user: a} = e, s = be({
            user: a
        }), l = W(), c = o.useMemo(() => r.map(e => ({
            items: new oe(e)
        })), [ r ]);
        if (n.storage.forceFallbackEffectPicker) return o.createElement(De, e);
        var f = !1, d = pe(s, e => "EditProfileEffectInner" === me(e.type) || "profileEffects" in e.props && "selectedProfileEffect" in e.props && "function" == typeof e.props.setSelectedProfileEffect && (f = !0));
        if (!d) return Ce || o.createElement(De, e);
        var u = pe(s, e => "Button" === me(e.type));
        if (!u) return Ce || o.createElement(De, e);
        if (f) {
            void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(e.currentEffectId ? {
                id: e.currentEffectId
            } : null), d.props.profileEffects = e.effects;
            var m = ge(s, e => Array.isArray(e) && e.some(e => "DisplayBanner" === me(e.type)));
            if (m) {
                var p = s;
                m.props.children = o.createElement(K, {
                    theme: p.props.theme,
                    primaryColor: p.props.primaryColor,
                    secondaryColor: p.props.secondaryColor,
                    children: m.props.children
                }), p.props.theme = l.theme ?? "dark", p.props.primaryColor = l.primaryColor, p.props.secondaryColor = l.secondaryColor;
            }
        } else void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(t ? new oe({
            id: t
        }) : null), d.props.purchases = c;
        return te(a.id), u.props.onPress = () => {
            te(void 0), i(r.find(e => e.id === d.props.selectedProfileEffect?.id)?.config ?? null);
        }, Ce = s;
    } : De, Ie = t.findByProps("triggerHapticFeedback"), ke = Ie?.HapticFeedbackTypes ?? {}, Be = Ie?.triggerHapticFeedback ?? (() => {}), Ae = c.getAssetIDByName("img_none"), Te = t.findByProps("DEFAULT_PROFILE_EFFECT_WH_RATIO")?.DEFAULT_PROFILE_EFFECT_WH_RATIO ?? 45 / 88, _e = c.getAssetIDByName("sample-profile-small") ?? {
        uri: "https://discordapp.com/assets/f328a6f8209d4f1f5022.png"
    };
    c.getAssetIDByName("toast_copy_link"), c.getAssetIDByName("Small");
    var we = 3;
    function Ne(e) {
        var {label: t, isSelected: r, size: i, colors: n, onPress: a, style: s, children: l} = e, [c, f, d] = n;
        return o.createElement(Pt, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            accessibilityState: {
                selected: r
            },
            disabled: r,
            onPress() {
                Be(ke.IMPACT_LIGHT), a();
            },
            style: [ {
                height: i,
                width: i,
                overflow: "hidden",
                backgroundColor: f,
                borderColor: c,
                borderRadius: he.sm,
                borderWidth: 2
            }, r && {
                borderColor: d
            }, s ]
        }, l);
    }
    function De(e) {
        var {currentEffectId: t, effects: r, onSelect: i} = e, [n, a] = o.useState(t), [c, f] = o.useState(0), {theme: d = "dark"} = W(), u = o.useMemo(() => [ M.BACKGROUND_PRIMARY ? G(d, M.BACKGROUND_PRIMARY) : "#313338", M.BACKGROUND_FLOATING ? G(d, M.BACKGROUND_FLOATING) : "#2B2D31", M.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE ? G(d, M.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE) : "#FFFFFF" ], [ d ]), m = ve(), p = o.useContext(Ee), g = o.useMemo(() => {
            for (var e = l.chunk([ null, ...r ], we), t = e[e.length - 1]; 3 > t.length; ) t.push(void 0);
            return e;
        }, [ r ]);
        return o.createElement(Ze, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: m.height - p.top
        }, o.createElement(qe, {
            scrollsToTop: !1
        }, o.createElement(s.View, {
            style: {
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 88
            }
        }, o.createElement(gt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: ye.PX_16
            }
        }, t ? "Change Effect" : "Add Profile Effect"), o.createElement(s.View, {
            style: {
                width: "72%",
                minHeight: 38
            }
        }, o.createElement(gt, {
            variant: "heading-md/bold",
            color: "header-primary",
            style: {
                textAlign: "center"
            }
        }, r.find(e => e.id === n)?.config?.title ?? "None")), o.createElement(s.View, {
            style: {
                flex: 1,
                width: "92%",
                marginTop: 3
            }
        }, o.createElement(ht, {
            accessibilityLabel: "Profile Effect Selection Section",
            numColumns: 1,
            estimatedItemSize: 98,
            ItemSeparatorComponent: () => o.createElement(s.View, {
                style: {
                    height: ye.PX_16
                }
            }),
            contentContainerStyle: {
                paddingHorizontal: ye.PX_4
            },
            data: g,
            extraData: n,
            renderItem(e) {
                var {item: t} = e;
                return o.createElement(s.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: ye.PX_16
                    }
                }, t.map(e => e ? o.createElement(Ne, {
                    label: e.config?.accessibilityLabel ?? "Profile Effect",
                    isSelected: e.id === n,
                    size: c,
                    colors: u,
                    onPress() {
                        a(e.id);
                    }
                }, o.createElement(pt, {
                    effect: e.config
                })) : null === e ? o.createElement(Ne, {
                    label: "None",
                    isSelected: !n,
                    size: c,
                    colors: u,
                    onPress() {
                        a(void 0);
                    },
                    style: {
                        alignItems: "center",
                        justifyContent: "center"
                    }
                }, o.createElement(mt, {
                    source: Ae,
                    size: mt.Sizes.LARGE
                }), o.createElement(gt, {
                    variant: "text-sm/medium",
                    color: "header-primary",
                    style: {
                        marginTop: ye.PX_4
                    }
                }, "None")) : o.createElement(s.View, {
                    style: {
                        width: c,
                        height: c
                    }
                })));
            },
            onLayout(e) {
                f((e.nativeEvent.layout.width - 64) / we);
            }
        })))), o.createElement(ct, {
            text: "Apply",
            textStyle: {
                fontSize: 16
            },
            onPress() {
                i(r.find(e => e.id === n)?.config ?? null);
            },
            style: {
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                height: 48,
                marginHorizontal: 36,
                marginBottom: ye.PX_48,
                borderRadius: he.round
            }
        }));
    }
    var Re = "__FPTE_DECO__", {useStateFromStores: xe} = t.findByProps("useStateFromStores");
    function Le(e) {
        if (e?.asset) return "https://cdn.discordapp.com/avatar-decoration-presets/".concat(e.asset, ".png?size=128&passthrough=false");
    }
    function Ue(e) {
        return e?.label ?? e?.name ?? "Decoration";
    }
    function ze(e) {
        var {onSelect: t, currentSkuId: r} = e, i = xe ? xe([ B, A ], () => _.decorations) : _.decorations;
        return o.useEffect(() => {
            _.isLoaded || _.fetch();
        }, []), o.createElement(Pe, {
            title: "Avatar Decoration",
            items: i,
            currentSkuId: r,
            getPreviewUri: Le,
            getLabel: Ue,
            onSelect(e) {
                t(e), $e(Re);
            }
        });
    }
    var Oe = t.findByName("showCustomColorPickerActionSheet") ?? (() => {});
    function He(e) {
        var t;
        return (t = e).color ?? (t.color = 0), Oe(e);
    }
    var Ve = "__FPTE__", {useStateFromStores: Me} = t.findByProps("useStateFromStores");
    function Ge(e) {
        var {onSelect: t, currentEffectId: r} = e, i = Me ? Me([ B, A ], () => R.profileEffects) : R.profileEffects;
        return o.useEffect(() => {
            R.isLoaded || R.fetch();
        }, []), o.createElement(Fe, {
            effects: i,
            onSelect(e) {
                t(e), $e(Ve);
            },
            user: L.getCurrentUser(),
            currentEffectId: r
        });
    }
    var je = "__FPTE_NAMEPLATE__", {useStateFromStores: Xe} = t.findByProps("useStateFromStores");
    function We(e) {
        if (e?.asset) return "https://cdn.discordapp.com/assets/collectibles/".concat(e.asset, "static.png");
    }
    function Ke(e) {
        return e?.label ?? e?.name ?? "Nameplate";
    }
    function Ye(e) {
        var {onSelect: t, currentSkuId: r} = e, i = Xe ? Xe([ B, A ], () => N.nameplates) : N.nameplates;
        return o.useEffect(() => {
            N.isLoaded || N.fetch();
        }, []), o.createElement(Pe, {
            title: "Nameplate",
            items: i,
            currentSkuId: r,
            getPreviewUri: We,
            getLabel: Ke,
            onSelect(e) {
                t(e), $e(je);
            }
        });
    }
    var Ze = t.findByProps("BottomSheet")?.BottomSheet ?? t.findByProps("ActionSheet")?.ActionSheet ?? (() => {
        throw Error("FakeProfileThemesAndEffects threw an error to avoid an otherwise-inevitable, unrecoverable freeze.");
    }), qe = t.findByProps("BottomSheetScrollView")?.BottomSheetScrollView ?? (() => null), Je = t.findByProps("showActionSheet"), Qe = Je?.showActionSheet ?? (() => {}), $e = Je?.default?.hideActionSheet ?? (() => {}), et = f.Forms.FormSection, tt = f.Forms.FormRow, rt = f.Forms.FormRadioRow, ot = f.Forms.FormSwitchRow, it = f.Forms.FormCardSection, nt = t.findByProps("saveProfileChanges"), {useStateFromStores: at} = t.findByProps("useStateFromStores") ?? {};
    function st(e) {
        var {guildId: t} = e, [r, i] = J(null), [n, l] = ee(null), [c, f] = o.useState(null);
        (() => {
            var [e, t] = o.useState(() => Z = !0);
        })();
        var [d, m] = o.useState(!1), {theme: y = "dark"} = W(), [v, S] = o.useMemo(() => [ M.HEADER_SECONDARY ? G(y, M.HEADER_SECONDARY) : "#B5BAC1", M.BACKGROUND_ACCENT ? G(y, M.BACKGROUND_ACCENT) : "#111214" ], [ y ]), C = j(L.getCurrentUser().getAvatarURL(t, 80), S, !1), [b, F] = o.useState(null), [T, w] = o.useState(null), [D, U] = o.useState(null), [z, V] = o.useState(null), [X, K] = o.useState(null), [Y, q] = o.useState(null), Q = at ? at([ B, A ], () => R.profileEffects) : R.profileEffects, $ = at ? at([ B, A ], () => _.decorations) : _.decorations, re = at ? at([ B, A ], () => N.nameplates) : N.nameplates;
        o.useEffect(() => {
            var e = L.getCurrentUser();
            if (e) {
                var t = x.getUserProfile(e.id);
                if (t) {
                    U(t.bio ?? null);
                    var r = O(t.bio);
                    r.primary > -1 && i(r.primary), r.accent > -1 ? l(r.accent) : r.primary > -1 && l(r.primary), 
                    r.effectSku && (V(r.effectSku), R.fetch()), r.decorationSku && (K(r.decorationSku), 
                    _.fetch()), r.nameplateSku && (q(r.nameplateSku), N.fetch());
                }
            }
        }, []), o.useEffect(() => {
            if (z && !c) {
                var e = Q.find(e => e.skuId === z || e.id === z);
                e && f(e.config);
            }
        }, [ z, Q, c ]), o.useEffect(() => {
            if (X && !b) {
                var e = $.find(e => e.skuId === X);
                e && F(e.config);
            }
        }, [ X, $, b ]), o.useEffect(() => {
            if (Y && !T) {
                var e = re.find(e => e.skuId === Y);
                e && w(e.config);
            }
        }, [ Y, re, T ]);
        var oe = null !== D && I(D), ie = null !== r || null !== n || null !== c || null !== b || null !== T, ne = ((e, t, r, o, i, n) => {
            var a, s = e => e ? (e => {
                if (0n === e) return String.fromCodePoint(h);
                for (var t = ""; e > 0n; e /= BigInt(g)) t = String.fromCodePoint(Number(e % BigInt(g)) + h) + t;
                return t;
            })(BigInt(e)) : "", l = [ s(r), s(o), s(i) ];
            if (!n || 0 > e && 0 > t) if (n || 0 > e || 0 > t || e === t) {
                var c = 0 > e ? t : e;
                a = [ 0 > c ? "" : P(c), "", ...l ];
            } else a = [ P(e), P(t), ...l ]; else a = [ E(0 > e ? t : e, 0 > e ? t : 0 > t ? e : t), ...l ];
            for (;a.length && "" === a[a.length - 1]; ) a.pop();
            return a.join(p);
        })(r ?? -1, n ?? -1, c?.sku_id ?? c?.id ?? "", b?.sku_id ?? b?.skuId ?? "", T?.sku_id ?? T?.skuId ?? "", d), ae = oe && !ie ? "Remove FPTE" : "Apply FPTE", se = ie || oe;
        return o.createElement(it, {
            title: o.createElement(s.View, {
                style: {
                    flexDirection: "row",
                    alignItems: "center"
                }
            }, o.createElement(s.Text, {
                style: {
                    fontSize: 16,
                    color: "#FFFFFF"
                }
            }, "FPTE Builder"), o.createElement(s.Text, {
                style: {
                    color: oe ? "#4CAF50" : "#F44336",
                    fontSize: 17,
                    marginLeft: 8
                }
            }, oe ? "Active" : "Inactive")),
            cardStyle: {
                backgroundColor: "transparent"
            }
        }, o.createElement(s.View, {
            style: {
                flexDirection: "row",
                justifyContent: "space-between"
            }
        }, o.createElement(lt, {
            fgColor: v,
            label: "Primary",
            bgColor: r,
            onPress: () => He({
                color: r,
                onSelect: i,
                suggestedColors: C
            })
        }), o.createElement(lt, {
            fgColor: v,
            label: "Accent",
            bgColor: n,
            onPress: () => He({
                color: n,
                onSelect: l,
                suggestedColors: C
            })
        }), o.createElement(lt, {
            fgColor: v,
            label: "Effect",
            onPress() {
                return e = f, t = c?.id, u.subscribe("HIDE_ACTION_SHEET", function e(t) {
                    t.key === Ve && (u.unsubscribe("HIDE_ACTION_SHEET", e), te(void 0));
                }), R.isLoaded || R.fetch(), void Qe({
                    content: o.createElement(Ge, {
                        onSelect: e,
                        currentEffectId: t
                    }),
                    key: Ve
                });
                var e, t;
            }
        }, c && o.createElement(pt, {
            effect: c,
            style: {
                width: "140%",
                height: "100%"
            }
        })), o.createElement(s.View, {
            style: {
                flexDirection: "column",
                alignItems: "center",
                marginLeft: 12
            }
        }, o.createElement(ct, {
            text: ae,
            size: ct.Sizes.SMALL,
            onPress() {
                var e = L.getCurrentUser();
                if (e) {
                    var t = D ?? "";
                    if (!oe || ie) {
                        if (ne) {
                            I(t) && (t = k(t)), t.length > 0 && (t += " "), (t += ne).length > 190 && a.showToast("Heads up: bio is over the 190 character limit, it may not save.");
                            try {
                                nt.saveProfileChanges({
                                    ...x.getUserProfile(e.id),
                                    bio: t
                                }), U(t), H(e.id, O(t)), a.showToast("FPTE applied!");
                            } catch (e) {
                                a.showToast("Failed to update bio!"), console.error(e);
                            }
                        }
                    } else {
                        t = k(t);
                        try {
                            nt.saveProfileChanges({
                                ...x.getUserProfile(e.id),
                                bio: t
                            }), U(t), H(e.id, O(t)), a.showToast("FPTE removed!");
                        } catch (e) {
                            a.showToast("Failed to update bio!"), console.error(e);
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
        }), o.createElement(ct, {
            text: "Reset",
            look: ct.Looks.LINK,
            color: ct.Colors.TRANSPARENT,
            size: ct.Sizes.SMALL,
            ...ie ? {} : {
                pointerEvents: "none",
                style: {
                    opacity: 0
                }
            },
            onPress() {
                i(null), l(null), f(null), F(null), w(null);
            }
        }))), o.createElement(s.View, {
            style: {
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 12,
                marginTop: 12
            }
        }, o.createElement(lt, {
            fgColor: v,
            label: "Decoration",
            onPress() {
                return e = F, t = b?.sku_id ?? b?.skuId, _.isLoaded || _.fetch(), void Qe({
                    content: o.createElement(ze, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: Re
                });
                var e, t;
            }
        }, b?.asset && o.createElement(s.Image, {
            source: {
                uri: "https://cdn.discordapp.com/avatar-decoration-presets/".concat(b.asset, ".png?size=96&passthrough=false")
            },
            resizeMode: "contain",
            style: {
                width: "100%",
                height: "100%"
            }
        })), o.createElement(lt, {
            fgColor: v,
            label: "Nameplate",
            onPress() {
                return e = w, t = T?.sku_id ?? T?.skuId, N.isLoaded || N.fetch(), void Qe({
                    content: o.createElement(Ye, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: je
                });
                var e, t;
            }
        }, T?.asset && o.createElement(s.Image, {
            source: {
                uri: "https://cdn.discordapp.com/assets/collectibles/".concat(T.asset, "static.png")
            },
            resizeMode: "cover",
            style: {
                width: "100%",
                height: "100%"
            }
        }))));
    }
    var lt = e => {
        var {label: t, fgColor: r, bgColor: i, onPress: n, children: a} = e;
        return o.createElement(s.View, {
            style: {
                width: 50
            }
        }, o.createElement(Pt, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            onPress: n,
            style: [ {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                overflow: "hidden",
                borderColor: r,
                borderStyle: "dashed",
                borderWidth: 2,
                borderRadius: he.xs
            }, null != i && {
                backgroundColor: "#" + i.toString(16).padStart(6, "0"),
                borderStyle: "solid"
            }, !!a && {
                borderWidth: 0
            } ]
        }, a ?? (null == i && o.createElement(Et, {
            fill: r,
            width: "40%",
            height: "40%",
            viewBox: "0 0 144 144"
        }, o.createElement(vt, {
            d: "M144 64H80V0H64v64H0v16h64v64h16V80h64Z"
        })))), !!t && o.createElement(gt, {
            variant: "text-sm/normal",
            style: {
                marginTop: ye.PX_4,
                textAlign: "center"
            }
        }, t));
    }, ct = f.Button, ft = t.findByProps("IconSizes"), dt = ft?.default ?? ft?.Icon ?? (() => null), ut = ft?.IconSizes ?? dt.Sizes ?? {}, mt = Object.assign(dt, {
        Sizes: ut
    }), pt = e => {
        var {effect: t, style: r} = e;
        return o.createElement(s.View, {
            style: r
        }, o.createElement(s.Image, {
            resizeMode: "cover",
            source: _e,
            style: {
                width: "100%",
                height: "100%"
            }
        }), o.createElement(s.Image, {
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
    }, gt = t.findByProps("TextStyleSheet")?.Text ?? (() => null), ht = t.findByName("FlashList") ?? (() => null), yt = t.findByProps("Svg"), Et = yt?.Svg ?? (() => null), vt = yt?.Path ?? (() => null), Pt = t.findByProps("PressableOpacity")?.PressableOpacity ?? (() => null), St = t.findByName("UserProfileEditForm", !1), Ct = t.findByName("UserProfileEditForm", !1);
    function bt(e) {
        if (!e) return null;
        if (de(e) && "UserProfilePremiumUpsellCard" === me(e.type)) return null;
        if (e.props?.children) {
            var t = e.props.children;
            Array.isArray(t) || (t = [ t ]);
            var r = t.map(bt).filter(e => null !== e);
            e.props.children = 1 === r.length ? r[0] : r;
        }
        return e;
    }
    function Ft() {
        var e = L.getCurrentUser();
        if (e) {
            var t = x.getUserProfile(e.id);
            t && u.dispatch({
                type: "USER_PROFILE_FETCH_SUCCESS",
                user: e,
                user_profile: t,
                connected_accounts: t.connectedAccounts
            });
        }
    }
    var It = [], kt = {
        onLoad() {
            It.push(r.instead("getPurchase", A, (e, t) => Q ? {
                purchasedAt: new Date
            } : t(e)), r.after("getUserProfile", x, (e, t) => {
                if (!t || t.profileFetchFailed) return t;
                if (V(t.userId, t.bio), n.storage.prioritizeNitro) {
                    if (t.themeColors) {
                        if (!ae(t)) {
                            var r = F(t.bio);
                            -2 === S(r[0]) ? ne(t, C(r[1])) : ne(t, C(r[2]));
                        }
                        return t;
                    }
                    if (ae(t)) {
                        var o = F(t.bio), i = S(o[0]);
                        return -2 === i ? ie(t, ...v(o[0])) : ie(t, i, S(o[1])), t;
                    }
                }
                var a = F(t.bio), s = S(a[0]);
                return -2 === s ? (ie(t, ...v(a[0])), ne(t, C(a[1]))) : (ie(t, s, S(a[1])), ne(t, C(a[2]))), 
                t;
            }), ...le.map(e => r.after("default", e, (e, t) => (Q && (void 0 !== R.profileEffects ? (t.splice(1), 
            t[0].items.splice(1), R.profileEffects.forEach(e => {
                t[0].items.push(new oe(e));
            }), se = t) : t = se), t))), re(), r.after("default", St, (e, t) => {
                if (n.storage.hideBuilder) return t;
                var r = ge(t, e => Array.isArray(e) && e.some(e => de(e) && "UserProfileEditFormTextField" === me(e.type)));
                if (r) {
                    var i = r.props.children.reduce((e, t, r) => (de(t) && "UserProfileEditFormTextField" === me(t.type) && e.push(r), 
                    e), []);
                    3 > i.length || r.props.children.splice(i[2] + 1, 0, o.createElement(st, null));
                }
                return t;
            }), void (Ct && r.after("default", Ct, (e, t) => bt(t) || t)), r.after("getUser", L, (e, t) => {
                try {
                    if (!t?.id) return t;
                    var r = (a = t.id, U.get(a));
                    if (!r) return t;
                    if (r.decorationSku) {
                        var o = (n = r.decorationSku, _.isLoaded ? _.decorations.find(e => e.skuId === n)?.config ?? null : (_.fetch(), 
                        null));
                        if (o) {
                            t.avatarDecorationData = {
                                asset: o.asset,
                                skuId: o.skuId,
                                sku_id: o.sku_id ?? o.skuId
                            };
                            try {
                                t.avatarDecoration = o;
                            } catch (e) {}
                        }
                    }
                    if (r.nameplateSku) {
                        var i = (e => N.isLoaded ? N.nameplates.find(t => t.skuId === e)?.config ?? null : (N.fetch(), 
                        null))(r.nameplateSku);
                        i && (t.collectibles = {
                            ...t.collectibles ?? {},
                            nameplate: i
                        });
                    }
                } catch (e) {}
                var n, a;
                return t;
            })), (() => {
                var e = L.getCurrentUser();
                if (e) {
                    var t = x.getUserProfile(e.id);
                    t && V(e.id, t.bio);
                }
            })(), Ft();
        },
        onUnload() {
            It.forEach(e => {
                e();
            }), Ft();
        },
        settings: () => (d.useProxy(n.storage), o.createElement(s.ScrollView, null, o.createElement(et, {
            title: "Settings"
        }, o.createElement(tt, {
            label: "Source to prioritize"
        }), o.createElement(rt, {
            label: "Nitro",
            selected: !!n.storage.prioritizeNitro,
            onPress() {
                n.storage.prioritizeNitro = !0;
            }
        }), o.createElement(rt, {
            label: "About Me",
            selected: !n.storage.prioritizeNitro,
            onPress() {
                n.storage.prioritizeNitro = !1;
            }
        }), o.createElement(ot, {
            label: "Hide Builder",
            subLabel: "Hide the FPTE Builder in the User Profile and Server Profiles settings pages",
            value: !!n.storage.hideBuilder,
            onValueChange(e) {
                n.storage.hideBuilder = e;
            }
        }), o.createElement(ot, {
            label: "Force fallback effect picker",
            value: !!n.storage.forceFallbackEffectPicker,
            onValueChange(e) {
                n.storage.forceFallbackEffectPicker = e;
            }
        }))))
    };
    return kt;
})(vendetta.metro.common, vendetta.metro, vendetta.patcher, React, vendetta.ui, vendetta.plugin, vendetta.ui.toasts, vendetta.metro.common.ReactNative, lodash, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
