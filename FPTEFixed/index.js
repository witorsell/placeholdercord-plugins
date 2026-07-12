(() => { try { return ((e, t, r, o, i, n, a, s, l, c, f) => {
    "use strict";
    var d = e.FluxDispatcher, u = 8203, m = String.fromCodePoint(u), p = 4096, g = 917504, h = 921599;
    function y(e, t) {
        return String.fromCodePoint(...[ ..."[#".concat(e.toString(16), ",#").concat(t.toString(16), "]") ].map(e => e.codePointAt(0) + g));
    }
    function E(e) {
        var [t, r] = e.matchAll(/(?<=#)[\dA-Fa-f]{1,6}/g);
        return [ t ? parseInt(t[0], 16) : -1, r ? parseInt(r[0], 16) : -1 ];
    }
    function v(e) {
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
    function b(e) {
        var t = [ "", "", "", "", "" ], r = 0;
        for (var o of e) {
            var i = o.codePointAt(0);
            if (i === u) {
                if (r >= 4) break;
                r++;
            } else if (g > i || i > h) {
                if (r > 0 || t[0]) break;
            } else t[r] += String.fromCodePoint(i - g);
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
    function I(e) {
        return [ ...e ].filter(e => {
            var t = e.codePointAt(0);
            return (g > t || t > h) && t !== u;
        }).join("").trim();
    }
    var k = t.findByStoreName("CollectiblesCategoryStore"), B = t.findByStoreName("CollectiblesPurchaseStore"), A = t.findByProps("fetchCollectiblesCategories"), T = {
        fetch() {
            try {
                A?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = k?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get decorations() {
            var e = t.findByProps("getAvatarDecorationsFromCategories", "getAvatarDecorationsFromPurchases") ?? t.findByProps("getAvatarDecorationsFromCategories") ?? t.findByProps("getAvatarDecorationsFromPurchases"), r = k?.categories, o = B?.purchases, i = [];
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
    }, _ = t.findByProps("fetchCollectiblesCategories"), w = {
        fetch() {
            try {
                _?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = k?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get nameplates() {
            var e = t.findByProps("getNameplatesFromCategories", "getNameplatesFromPurchases") ?? t.findByProps("getNameplatesFromCategories") ?? t.findByProps("getNameplatesFromPurchases"), r = k?.categories, o = B?.purchases, i = [];
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
    }, N = t.findByProps("fetchCollectiblesCategories"), D = {
        fetch() {
            try {
                N?.fetchCollectiblesCategories?.();
            } catch (e) {
                console.warn("[FPTE] fetchCollectiblesCategories failed", e);
            }
        },
        get isLoaded() {
            var e = k?.categories;
            return !!e && (e.size ?? 0) > 0;
        },
        get profileEffects() {
            var e = t.findByProps("getProfileEffects", "getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromCategories") ?? t.findByProps("getProfileEffectsFromPurchases"), r = k?.categories, o = B?.purchases, i = [];
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
    }, R = t.findByStoreName("UserProfileStore"), x = t.findByStoreName("UserStore"), L = new Map;
    function U(e) {
        var t = C(e);
        return t > -1n ? t.toString() : null;
    }
    function z(e) {
        var t = b(e ?? ""), r = P(t[0]);
        if (-2 === r) {
            var [o, i] = E(t[0]);
            return {
                primary: o,
                accent: i,
                effectSku: U(t[1]),
                decorationSku: U(t[2]),
                nameplateSku: U(t[3])
            };
        }
        return {
            primary: r,
            accent: P(t[1]),
            effectSku: U(t[2]),
            decorationSku: U(t[3]),
            nameplateSku: U(t[4])
        };
    }
    function O(e, t) {
        L.set(e, t);
    }
    function H(e, t) {
        O(e, z(t));
    }
    var V = i.semanticColors, M = t.find(e => e.default?.internal?.resolveSemanticColor)?.default.internal.resolveSemanticColor ?? t.find(e => e.meta?.resolveSemanticColor)?.meta.resolveSemanticColor ?? (() => {}), G = t.findByProps("useAvatarColors")?.useAvatarColors ?? (() => {}), j = t.findByProps("getProfileTheme").getProfileTheme, X = t.findByProps("useThemeContext")?.useThemeContext ?? (() => ({})), W = t.findByProps("ThemeContextProvider")?.ThemeContextProvider ?? (e => {
        var {children: t} = e;
        return t;
    });
    function K() {
        d.dispatch({
            type: "USER_SETTINGS_ACCOUNT_SUBMIT_SUCCESS"
        });
    }
    var Y = !0, Z = null;
    function q(e) {
        var [t, r] = o.useState(() => Z = e);
        return [ t, e => {
            r(Z = e), Y && K();
        } ];
    }
    var J, Q = null;
    function $(e) {
        var [t, r] = o.useState(() => Q = e);
        return [ t, e => {
            r(Q = e), Y && K();
        } ];
    }
    function ee(e) {
        J = e;
    }
    var te = (() => {
        var e = t.findByName("useProfileTheme", !1);
        return e ? () => r.after("default", e, (e, t) => {
            var [r] = e, {user: o} = r;
            return (null != o && o.id === J || "pendingThemeColors" in r) && Y && (null !== Z ? (t.theme = j(Z), 
            t.primaryColor = Z, t.secondaryColor = Q ?? Z) : null !== Q && (t.theme = j(Q), 
            t.primaryColor = Q, t.secondaryColor = Q)), t;
        }) : (e = t.findByName("useProfileThemeColors", !1)) ? () => r.after("default", e, (e, t) => {
            var [r, o, i] = e;
            if ((null != r && r.id === J || i) && Y) {
                if (null !== Z) return [ Z, Q ?? Z ];
                if (null !== Q) return [ Q, Q ];
            }
            return t;
        }) : () => () => !0;
    })(), re = t.findByName("ProfileEffectRecord");
    function oe(e, t, r) {
        t > -1 ? (e.themeColors = [ t, r > -1 ? r : t ], e.premiumType = 2) : r > -1 && (e.themeColors = [ r, r ], 
        e.premiumType = 2);
    }
    function ie(e, t) {
        if (t > -1n) {
            var r = t.toString();
            try {
                e.profileEffect = new re({
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
    function ne(e) {
        return !!(e.profileEffect || e.profileEffectSkuId || e.profileEffectId || e.profileEffectID);
    }
    var ae, se = t.findByPropsAll("NONE_ITEM");
    function le(e) {
        return "function" == typeof e[Symbol.iterator];
    }
    function ce(e) {
        return null !== e && "object" == typeof e;
    }
    function fe(e) {
        return ce(e) && "type" in e;
    }
    function de(e) {
        return "children" in e.props;
    }
    function ue(e) {
        return "symbol" == typeof e ? Symbol.keyFor(e) || null : "function" == typeof e ? e.displayName || e.name || null : "_context" in e ? e._context.displayName || null : e.displayName ? e.displayName : "render" in e ? e.render.displayName || e.render.name || null : "type" in e ? ue(e.type) : null;
    }
    function me(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (ce(e)) if (le(e)) {
            if (r > 0) for (var o of e) {
                var i = me(o, t, r - 1);
                if (i) return i;
            }
        } else {
            if (t(e)) return e;
            if (de(e)) return me(e.props.children, t, r - 1);
        }
        return null;
    }
    function pe(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200;
        if (ce(e)) if (le(e)) {
            if (r > 0) for (var o of e) {
                var i = pe(o, t, r - 1);
                if (i) return i;
            }
        } else if (de(e)) return t(e.props.children) ? e : pe(e.props.children, t, r - 1);
        return null;
    }
    var ge = t.findByProps("Radius")?.Radius ?? {}, he = t.findByProps("Spacing")?.Spacing ?? {}, ye = t.findByProps("SafeAreaContext")?.SafeAreaContext, Ee = t.findByName("useWindowDimensions") ?? (() => {});
    function ve(e) {
        var {title: t, items: r, currentSkuId: i, getPreviewUri: n, getLabel: a, onSelect: l} = e, [c, f] = o.useState(i), d = Ee(), u = o.useContext(ye), m = o.useMemo(() => r.find(e => e.skuId === c)?.config ?? null, [ r, c ]);
        return o.createElement(Ye, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: d.height - u.top
        }, o.createElement(Ze, {
            scrollsToTop: !1
        }, o.createElement(s.View, {
            style: {
                flex: 1,
                alignItems: "center",
                paddingBottom: 96
            }
        }, o.createElement(pt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: he.PX_16
            }
        }, t), o.createElement(s.View, {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: he.PX_12,
                width: "92%"
            }
        }, o.createElement(Pe, {
            label: "None",
            uri: void 0,
            isSelected: !c,
            onPress: () => f(void 0)
        }), r.map(e => o.createElement(Pe, {
            key: e.id,
            label: a(e.config),
            uri: n(e.config),
            isSelected: e.skuId === c,
            onPress: () => f(e.skuId)
        }))))), o.createElement(lt, {
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
                marginBottom: he.PX_48,
                borderRadius: ge.round
            }
        }));
    }
    function Pe(e) {
        var {label: t, uri: r, isSelected: i, onPress: n} = e;
        return o.createElement(vt, {
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
                borderRadius: ge.sm,
                borderWidth: 2,
                borderColor: i ? "#FFFFFF" : "transparent"
            }
        }, o.createElement(s.View, {
            style: {
                width: 68,
                height: 68,
                borderRadius: ge.sm,
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
        }) : null), o.createElement(pt, {
            variant: "text-xs/medium",
            color: "header-secondary",
            style: {
                marginTop: 4
            },
            numberOfLines: 1
        }, t));
    }
    var Se, Ce = t.findByName("EditProfileEffectActionSheet"), be = Ce ? e => {
        var {currentEffectId: t, effects: r, onSelect: i, user: a} = e, s = Ce({
            user: a
        }), l = X(), c = o.useMemo(() => r.map(e => ({
            items: new re(e)
        })), [ r ]);
        if (n.storage.forceFallbackEffectPicker) return o.createElement(Ne, e);
        var f = !1, d = me(s, e => "EditProfileEffectInner" === ue(e.type) || "profileEffects" in e.props && "selectedProfileEffect" in e.props && "function" == typeof e.props.setSelectedProfileEffect && (f = !0));
        if (!d) return Se || o.createElement(Ne, e);
        var u = me(s, e => "Button" === ue(e.type));
        if (!u) return Se || o.createElement(Ne, e);
        if (f) {
            void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(e.currentEffectId ? {
                id: e.currentEffectId
            } : null), d.props.profileEffects = e.effects;
            var m = pe(s, e => Array.isArray(e) && e.some(e => "DisplayBanner" === ue(e.type)));
            if (m) {
                var p = s;
                m.props.children = o.createElement(W, {
                    theme: p.props.theme,
                    primaryColor: p.props.primaryColor,
                    secondaryColor: p.props.secondaryColor,
                    children: m.props.children
                }), p.props.theme = l.theme ?? "dark", p.props.primaryColor = l.primaryColor, p.props.secondaryColor = l.secondaryColor;
            }
        } else void 0 === d.props.selectedProfileEffect && d.props.setSelectedProfileEffect(t ? new re({
            id: t
        }) : null), d.props.purchases = c;
        return ee(a.id), u.props.onPress = () => {
            ee(void 0), i(r.find(e => e.id === d.props.selectedProfileEffect?.id)?.config ?? null);
        }, Se = s;
    } : Ne, Fe = t.findByProps("triggerHapticFeedback"), Ie = Fe?.HapticFeedbackTypes ?? {}, ke = Fe?.triggerHapticFeedback ?? (() => {}), Be = l.getAssetIDByName("img_none"), Ae = t.findByProps("DEFAULT_PROFILE_EFFECT_WH_RATIO")?.DEFAULT_PROFILE_EFFECT_WH_RATIO ?? 45 / 88, Te = l.getAssetIDByName("sample-profile-small") ?? {
        uri: "https://discordapp.com/assets/f328a6f8209d4f1f5022.png"
    };
    l.getAssetIDByName("toast_copy_link"), l.getAssetIDByName("Small");
    var _e = 3;
    function we(e) {
        var {label: t, isSelected: r, size: i, colors: n, onPress: a, style: s, children: l} = e, [c, f, d] = n;
        return o.createElement(vt, {
            accessibilityLabel: t,
            accessibilityRole: "button",
            accessibilityState: {
                selected: r
            },
            disabled: r,
            onPress() {
                ke(Ie.IMPACT_LIGHT), a();
            },
            style: [ {
                height: i,
                width: i,
                overflow: "hidden",
                backgroundColor: f,
                borderColor: c,
                borderRadius: ge.sm,
                borderWidth: 2
            }, r && {
                borderColor: d
            }, s ]
        }, l);
    }
    function Ne(e) {
        var {currentEffectId: t, effects: r, onSelect: i} = e, [n, a] = o.useState(t), [l, c] = o.useState(0), {theme: f = "dark"} = X(), d = o.useMemo(() => [ V.BACKGROUND_PRIMARY ? M(f, V.BACKGROUND_PRIMARY) : "#313338", V.BACKGROUND_FLOATING ? M(f, V.BACKGROUND_FLOATING) : "#2B2D31", V.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE ? M(f, V.BUTTON_OUTLINE_BRAND_BORDER_ACTIVE) : "#FFFFFF" ], [ f ]), u = Ee(), m = o.useContext(ye), p = o.useMemo(() => {
            for (var e = ((e, t) => {
                for (var r = [], o = 0; o < e.length; o += t) r.push(e.slice(o, o + t));
                return r;
            })([ null, ...r ], _e), t = e[e.length - 1]; 3 > t.length; ) t.push(void 0);
            return e;
        }, [ r ]);
        return o.createElement(Ye, {
            transparentHeader: !0,
            scrollable: !0,
            startExpanded: !0,
            startHeight: u.height - m.top
        }, o.createElement(Ze, {
            scrollsToTop: !1
        }, o.createElement(s.View, {
            style: {
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 88
            }
        }, o.createElement(pt, {
            variant: "redesign/heading-18/bold",
            color: "header-primary",
            style: {
                margin: he.PX_16
            }
        }, t ? "Change Effect" : "Add Profile Effect"), o.createElement(s.View, {
            style: {
                width: "72%",
                minHeight: 38
            }
        }, o.createElement(pt, {
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
        }, o.createElement(gt, {
            accessibilityLabel: "Profile Effect Selection Section",
            numColumns: 1,
            estimatedItemSize: 98,
            ItemSeparatorComponent: () => o.createElement(s.View, {
                style: {
                    height: he.PX_16
                }
            }),
            contentContainerStyle: {
                paddingHorizontal: he.PX_4
            },
            data: p,
            extraData: n,
            renderItem(e) {
                var {item: t} = e;
                return o.createElement(s.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: he.PX_16
                    }
                }, t.map(e => e ? o.createElement(we, {
                    label: e.config?.accessibilityLabel ?? "Profile Effect",
                    isSelected: e.id === n,
                    size: l,
                    colors: d,
                    onPress() {
                        a(e.id);
                    }
                }, o.createElement(mt, {
                    effect: e.config
                })) : null === e ? o.createElement(we, {
                    label: "None",
                    isSelected: !n,
                    size: l,
                    colors: d,
                    onPress() {
                        a(void 0);
                    },
                    style: {
                        alignItems: "center",
                        justifyContent: "center"
                    }
                }, o.createElement(ut, {
                    source: Be,
                    size: ut.Sizes.LARGE
                }), o.createElement(pt, {
                    variant: "text-sm/medium",
                    color: "header-primary",
                    style: {
                        marginTop: he.PX_4
                    }
                }, "None")) : o.createElement(s.View, {
                    style: {
                        width: l,
                        height: l
                    }
                })));
            },
            onLayout(e) {
                c((e.nativeEvent.layout.width - 64) / _e);
            }
        })))), o.createElement(lt, {
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
                marginBottom: he.PX_48,
                borderRadius: ge.round
            }
        }));
    }
    var De = "__FPTE_DECO__", {useStateFromStores: Re} = t.findByProps("useStateFromStores");
    function xe(e) {
        if (e?.asset) return "https://cdn.discordapp.com/avatar-decoration-presets/".concat(e.asset, ".png?size=128&passthrough=false");
    }
    function Le(e) {
        return e?.label ?? e?.name ?? "Decoration";
    }
    function Ue(e) {
        var {onSelect: t, currentSkuId: r} = e, i = Re ? Re([ k, B ], () => T.decorations) : T.decorations;
        return o.useEffect(() => {
            T.isLoaded || T.fetch();
        }, []), o.createElement(ve, {
            title: "Avatar Decoration",
            items: i,
            currentSkuId: r,
            getPreviewUri: xe,
            getLabel: Le,
            onSelect(e) {
                t(e), Qe(De);
            }
        });
    }
    var ze = t.findByName("showCustomColorPickerActionSheet") ?? (() => {});
    function Oe(e) {
        var t;
        return (t = e).color ?? (t.color = 0), ze(e);
    }
    var He = "__FPTE__", {useStateFromStores: Ve} = t.findByProps("useStateFromStores");
    function Me(e) {
        var {onSelect: t, currentEffectId: r} = e, i = Ve ? Ve([ k, B ], () => D.profileEffects) : D.profileEffects;
        return o.useEffect(() => {
            D.isLoaded || D.fetch();
        }, []), o.createElement(be, {
            effects: i,
            onSelect(e) {
                t(e), Qe(He);
            },
            user: x.getCurrentUser(),
            currentEffectId: r
        });
    }
    var Ge = "__FPTE_NAMEPLATE__", {useStateFromStores: je} = t.findByProps("useStateFromStores");
    function Xe(e) {
        if (e?.asset) return "https://cdn.discordapp.com/assets/collectibles/".concat(e.asset, "static.png");
    }
    function We(e) {
        return e?.label ?? e?.name ?? "Nameplate";
    }
    function Ke(e) {
        var {onSelect: t, currentSkuId: r} = e, i = je ? je([ k, B ], () => w.nameplates) : w.nameplates;
        return o.useEffect(() => {
            w.isLoaded || w.fetch();
        }, []), o.createElement(ve, {
            title: "Nameplate",
            items: i,
            currentSkuId: r,
            getPreviewUri: Xe,
            getLabel: We,
            onSelect(e) {
                t(e), Qe(Ge);
            }
        });
    }
    var Ye = t.findByProps("BottomSheet")?.BottomSheet ?? t.findByProps("ActionSheet")?.ActionSheet ?? (() => {
        throw Error("FakeProfileThemesAndEffects threw an error to avoid an otherwise-inevitable, unrecoverable freeze.");
    }), Ze = t.findByProps("BottomSheetScrollView")?.BottomSheetScrollView ?? (() => null), qe = t.findByProps("showActionSheet"), Je = qe?.showActionSheet ?? (() => {}), Qe = qe?.default?.hideActionSheet ?? (() => {}), $e = c.Forms.FormSection, et = c.Forms.FormRow, tt = c.Forms.FormRadioRow, rt = c.Forms.FormSwitchRow, ot = c.Forms.FormCardSection, it = t.findByProps("saveProfileChanges"), {useStateFromStores: nt} = t.findByProps("useStateFromStores") ?? {};
    function at(e) {
        var {guildId: t} = e, [r, i] = q(null), [n, l] = $(null), [c, f] = o.useState(null);
        (() => {
            var [e, t] = o.useState(() => Y = !0);
        })();
        var [u, h] = o.useState(!1), {theme: E = "dark"} = X(), [P, S] = o.useMemo(() => [ V.HEADER_SECONDARY ? M(E, V.HEADER_SECONDARY) : "#B5BAC1", V.BACKGROUND_ACCENT ? M(E, V.BACKGROUND_ACCENT) : "#111214" ], [ E ]), C = G(x.getCurrentUser().getAvatarURL(t, 80), S, !1), [b, A] = o.useState(null), [_, N] = o.useState(null), [L, U] = o.useState(null), [H, j] = o.useState(null), [W, K] = o.useState(null), [Z, J] = o.useState(null), Q = nt ? nt([ k, B ], () => D.profileEffects) : D.profileEffects, te = nt ? nt([ k, B ], () => T.decorations) : T.decorations, re = nt ? nt([ k, B ], () => w.nameplates) : w.nameplates;
        o.useEffect(() => {
            var e = x.getCurrentUser();
            if (e) {
                var t = R.getUserProfile(e.id);
                if (t) {
                    U(t.bio ?? null);
                    var r = z(t.bio);
                    r.primary > -1 && i(r.primary), r.accent > -1 ? l(r.accent) : r.primary > -1 && l(r.primary), 
                    r.effectSku && (j(r.effectSku), D.fetch()), r.decorationSku && (K(r.decorationSku), 
                    T.fetch()), r.nameplateSku && (J(r.nameplateSku), w.fetch());
                }
            }
        }, []), o.useEffect(() => {
            if (H && !c) {
                var e = Q.find(e => e.skuId === H || e.id === H);
                e && f(e.config);
            }
        }, [ H, Q, c ]), o.useEffect(() => {
            if (W && !b) {
                var e = te.find(e => e.skuId === W);
                e && A(e.config);
            }
        }, [ W, te, b ]), o.useEffect(() => {
            if (Z && !_) {
                var e = re.find(e => e.skuId === Z);
                e && N(e.config);
            }
        }, [ Z, re, _ ]);
        var oe = null !== L && F(L), ie = null !== r || null !== n || null !== c || null !== b || null !== _, ne = ((e, t, r, o, i, n) => {
            var a, s = e => e ? (e => {
                if (0n === e) return String.fromCodePoint(g);
                for (var t = ""; e > 0n; e /= BigInt(p)) t = String.fromCodePoint(Number(e % BigInt(p)) + g) + t;
                return t;
            })(BigInt(e)) : "", l = [ s(r), s(o), s(i) ];
            if (!n || 0 > e && 0 > t) if (n || 0 > e || 0 > t || e === t) {
                var c = 0 > e ? t : e;
                a = [ 0 > c ? "" : v(c), "", ...l ];
            } else a = [ v(e), v(t), ...l ]; else a = [ y(0 > e ? t : e, 0 > e ? t : 0 > t ? e : t), ...l ];
            for (;a.length && "" === a[a.length - 1]; ) a.pop();
            return a.join(m);
        })(r ?? -1, n ?? -1, c?.sku_id ?? c?.id ?? "", b?.sku_id ?? b?.skuId ?? "", _?.sku_id ?? _?.skuId ?? "", u), ae = oe && !ie ? "Remove FPTE" : "Apply FPTE", se = ie || oe;
        return o.createElement(ot, {
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
        }, o.createElement(st, {
            fgColor: P,
            label: "Primary",
            bgColor: r,
            onPress: () => Oe({
                color: r,
                onSelect: i,
                suggestedColors: C
            })
        }), o.createElement(st, {
            fgColor: P,
            label: "Accent",
            bgColor: n,
            onPress: () => Oe({
                color: n,
                onSelect: l,
                suggestedColors: C
            })
        }), o.createElement(st, {
            fgColor: P,
            label: "Effect",
            onPress() {
                return e = f, t = c?.id, d.subscribe("HIDE_ACTION_SHEET", function e(t) {
                    t.key === He && (d.unsubscribe("HIDE_ACTION_SHEET", e), ee(void 0));
                }), D.isLoaded || D.fetch(), void Je({
                    content: o.createElement(Me, {
                        onSelect: e,
                        currentEffectId: t
                    }),
                    key: He
                });
                var e, t;
            }
        }, c && o.createElement(mt, {
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
        }, o.createElement(lt, {
            text: ae,
            size: lt.Sizes.SMALL,
            onPress() {
                var e = x.getCurrentUser();
                if (e) {
                    var t = L ?? "";
                    if (!oe || ie) {
                        if (ne) {
                            F(t) && (t = I(t)), t.length > 0 && (t += " "), (t += ne).length > 190 && a.showToast("Heads up: bio is over the 190 character limit, it may not save.");
                            try {
                                it.saveProfileChanges({
                                    ...R.getUserProfile(e.id),
                                    bio: t
                                }), U(t), O(e.id, z(t)), a.showToast("FPTE applied!");
                            } catch (e) {
                                a.showToast("Failed to update bio!"), console.error(e);
                            }
                        }
                    } else {
                        t = I(t);
                        try {
                            it.saveProfileChanges({
                                ...R.getUserProfile(e.id),
                                bio: t
                            }), U(t), O(e.id, z(t)), a.showToast("FPTE removed!");
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
        }), o.createElement(lt, {
            text: "Reset",
            look: lt.Looks.LINK,
            color: lt.Colors.TRANSPARENT,
            size: lt.Sizes.SMALL,
            ...ie ? {} : {
                pointerEvents: "none",
                style: {
                    opacity: 0
                }
            },
            onPress() {
                i(null), l(null), f(null), A(null), N(null);
            }
        }))), o.createElement(s.View, {
            style: {
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 12,
                marginTop: 12
            }
        }, o.createElement(st, {
            fgColor: P,
            label: "Decoration",
            onPress() {
                return e = A, t = b?.sku_id ?? b?.skuId, T.isLoaded || T.fetch(), void Je({
                    content: o.createElement(Ue, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: De
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
        })), o.createElement(st, {
            fgColor: P,
            label: "Nameplate",
            onPress() {
                return e = N, t = _?.sku_id ?? _?.skuId, w.isLoaded || w.fetch(), void Je({
                    content: o.createElement(Ke, {
                        onSelect: e,
                        currentSkuId: t
                    }),
                    key: Ge
                });
                var e, t;
            }
        }, _?.asset && o.createElement(s.Image, {
            source: {
                uri: "https://cdn.discordapp.com/assets/collectibles/".concat(_.asset, "static.png")
            },
            resizeMode: "cover",
            style: {
                width: "100%",
                height: "100%"
            }
        }))));
    }
    var st = e => {
        var {label: t, fgColor: r, bgColor: i, onPress: n, children: a} = e;
        return o.createElement(s.View, {
            style: {
                width: 50
            }
        }, o.createElement(vt, {
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
                borderRadius: ge.xs
            }, null != i && {
                backgroundColor: "#" + i.toString(16).padStart(6, "0"),
                borderStyle: "solid"
            }, !!a && {
                borderWidth: 0
            } ]
        }, a ?? (null == i && o.createElement(yt, {
            fill: r,
            width: "40%",
            height: "40%",
            viewBox: "0 0 144 144"
        }, o.createElement(Et, {
            d: "M144 64H80V0H64v64H0v16h64v64h16V80h64Z"
        })))), !!t && o.createElement(pt, {
            variant: "text-sm/normal",
            style: {
                marginTop: he.PX_4,
                textAlign: "center"
            }
        }, t));
    }, lt = c.Button, ct = t.findByProps("IconSizes"), ft = ct?.default ?? ct?.Icon ?? (() => null), dt = ct?.IconSizes ?? ft.Sizes ?? {}, ut = Object.assign(ft, {
        Sizes: dt
    }), mt = e => {
        var {effect: t, style: r} = e;
        return o.createElement(s.View, {
            style: r
        }, o.createElement(s.Image, {
            resizeMode: "cover",
            source: Te,
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
                aspectRatio: Ae
            }
        }));
    }, pt = t.findByProps("TextStyleSheet")?.Text ?? (() => null), gt = t.findByName("FlashList") ?? (() => null), ht = t.findByProps("Svg"), yt = ht?.Svg ?? (() => null), Et = ht?.Path ?? (() => null), vt = t.findByProps("PressableOpacity")?.PressableOpacity ?? (() => null), Pt = t.findByName("UserProfileEditForm", !1), St = t.findByName("UserProfileEditForm", !1);
    function Ct(e) {
        if (!e) return null;
        if (fe(e) && "UserProfilePremiumUpsellCard" === ue(e.type)) return null;
        if (e.props?.children) {
            var t = e.props.children;
            Array.isArray(t) || (t = [ t ]);
            var r = t.map(Ct).filter(e => null !== e);
            e.props.children = 1 === r.length ? r[0] : r;
        }
        return e;
    }
    function bt() {
        var e = x.getCurrentUser();
        if (e) {
            var t = R.getUserProfile(e.id);
            t && d.dispatch({
                type: "USER_PROFILE_FETCH_SUCCESS",
                user: e,
                user_profile: t,
                connected_accounts: t.connectedAccounts
            });
        }
    }
    var Ft = [], It = {
        onLoad() {
            Ft.push(r.instead("getPurchase", B, (e, t) => J ? {
                purchasedAt: new Date
            } : t(e)), r.after("getUserProfile", R, (e, t) => {
                if (!t || t.profileFetchFailed) return t;
                if (H(t.userId, t.bio), n.storage.prioritizeNitro) {
                    if (t.themeColors) {
                        if (!ne(t)) {
                            var r = b(t.bio);
                            -2 === P(r[0]) ? ie(t, S(r[1])) : ie(t, S(r[2]));
                        }
                        return t;
                    }
                    if (ne(t)) {
                        var o = b(t.bio), i = P(o[0]);
                        return -2 === i ? oe(t, ...E(o[0])) : oe(t, i, P(o[1])), t;
                    }
                }
                var a = b(t.bio), s = P(a[0]);
                return -2 === s ? (oe(t, ...E(a[0])), ie(t, S(a[1]))) : (oe(t, s, P(a[1])), ie(t, S(a[2]))), 
                t;
            }), ...se.map(e => r.after("default", e, (e, t) => (J && (void 0 !== D.profileEffects ? (t.splice(1), 
            t[0].items.splice(1), D.profileEffects.forEach(e => {
                t[0].items.push(new re(e));
            }), ae = t) : t = ae), t))), te(), r.after("default", Pt, (e, t) => {
                if (n.storage.hideBuilder) return t;
                var r = pe(t, e => Array.isArray(e) && e.some(e => fe(e) && "UserProfileEditFormTextField" === ue(e.type)));
                if (r) {
                    var i = r.props.children.reduce((e, t, r) => (fe(t) && "UserProfileEditFormTextField" === ue(t.type) && e.push(r), 
                    e), []);
                    3 > i.length || r.props.children.splice(i[2] + 1, 0, o.createElement(at, null));
                }
                return t;
            }), void (St && r.after("default", St, (e, t) => Ct(t) || t)), r.after("getUser", x, (e, t) => {
                try {
                    if (!t?.id) return t;
                    var r = (a = t.id, L.get(a));
                    if (!r) return t;
                    if (r.decorationSku) {
                        var o = (n = r.decorationSku, T.isLoaded ? T.decorations.find(e => e.skuId === n)?.config ?? null : (T.fetch(), 
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
                        var i = (e => w.isLoaded ? w.nameplates.find(t => t.skuId === e)?.config ?? null : (w.fetch(), 
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
                var e = x.getCurrentUser();
                if (e) {
                    var t = R.getUserProfile(e.id);
                    t && H(e.id, t.bio);
                }
            })(), bt();
        },
        onUnload() {
            Ft.forEach(e => {
                e();
            }), bt();
        },
        settings: () => (f.useProxy(n.storage), o.createElement(s.ScrollView, null, o.createElement($e, {
            title: "Settings"
        }, o.createElement(et, {
            label: "Source to prioritize"
        }), o.createElement(tt, {
            label: "Nitro",
            selected: !!n.storage.prioritizeNitro,
            onPress() {
                n.storage.prioritizeNitro = !0;
            }
        }), o.createElement(tt, {
            label: "About Me",
            selected: !n.storage.prioritizeNitro,
            onPress() {
                n.storage.prioritizeNitro = !1;
            }
        }), o.createElement(rt, {
            label: "Hide Builder",
            subLabel: "Hide the FPTE Builder in the User Profile and Server Profiles settings pages",
            value: !!n.storage.hideBuilder,
            onValueChange(e) {
                n.storage.hideBuilder = e;
            }
        }), o.createElement(rt, {
            label: "Force fallback effect picker",
            value: !!n.storage.forceFallbackEffectPicker,
            onValueChange(e) {
                n.storage.forceFallbackEffectPicker = e;
            }
        }))))
    };
    return It;
})(vendetta.metro.common, vendetta.metro, vendetta.patcher, React, vendetta.ui, vendetta.plugin, vendetta.ui.toasts, vendetta.metro.common.ReactNative, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
