((e, t, a, r, o, s, n, l, i, c, m, d, u) => {
    "use strict";
    function g(e, t, a, r) {
        var o = Math.abs(e);
        return 5 > (o %= 100) || o > 20 ? 1 == (o %= 10) ? t : 2 > o || o > 4 ? r : a : r;
    }
    function h(e, t, a) {
        return 1 === e ? t : a;
    }
    var v = {};
    function f(e, t) {
        var a = v;
        for (var r of e.split(".")) a = a?.hasOwnProperty(r) ? a[r] : v;
        if (a === v) return e;
        var o = a[vendetta.metro.findByStoreName("LocaleStore").locale] ?? a["en-GB"] ?? e;
        return "function" != typeof o || t || (o = o()), t ? {
            make: o
        } : o;
    }
    v = {
        settings: {
            titles: {
                settings: {
                    "en-GB": "Settings",
                    uk: "Налаштування",
                    ru: "Настройки"
                },
                filters: {
                    "en-GB": "Filters",
                    uk: "Фільтри",
                    ru: "Фильтры"
                }
            },
            showTimestamps: {
                "en-GB": "Show the time of deletion",
                uk: "Показувати час видалення",
                ru: "Показывать время удаления"
            },
            ewTimestampFormat: {
                "en-GB": "Use 12-hour format",
                uk: "Використовувати 12-годинний формат",
                ru: "Использовать 12-часовой формат"
            },
            youDeletedItWarning: {
                "en-GB": "The messages YOU deleted - are not saved",
                uk: "Повідомлення які видалили ВИ - не зберігаются",
                ru: "Сообщения удаленные ВАМИ - не сохраняются"
            },
            addUsersInfo: {
                "en-GB": () => "To add or remove users from the ignore list, follow these steps:\n1. open their profile\n2. press the •••\n" + '3. press "'.concat(v.optionLabels[0]["en-GB"], '"\n') + "4. 🎉",
                uk: () => "Щоб добавити когось до списку ігнорованих користувачів, виконайте ці дії:\n1. відкрите їх профіль\n2. натисніть •••\n" + '3. натисніть "'.concat(v.optionLabels[0].uk, '"\n') + "4. 🎉",
                ru: () => "Чтобы добавить кого-то в список игнорированных пользователей - следуйте этим шагам\n1. откройте их профиль\n2. нажмите •••\n" + '3. нажмите "'.concat(v.optionLabels[0].ru, '"\n') + "4. 🎉"
            },
            ignoreBots: {
                "en-GB": "Ignore bots",
                uk: "Ігнорувати ботів",
                ru: "Игнорировать ботов"
            },
            clearUsersLabel: {
                "en-GB": e => "You have ".concat(e, " user").concat(h(e, "", "s"), " in the ignored users list"),
                uk: e => "Ви маєте ".concat(e, " користувач").concat(g(e, "а", "а", "ів"), " у списку ігнорованих користувачів"),
                ru: e => "Вы имеете ".concat(e, " пользовател").concat(g(e, "я", "я", "ей"), " в списке игнорированных пользователей")
            },
            confirmClear: {
                title: {
                    "en-GB": "Hold on!",
                    uk: "Почекай-но!",
                    ru: "Положди-ка!"
                },
                description: {
                    "en-GB": e => "This will remove ".concat(e, " user").concat(h(e, "", "s"), " from the ignored users list.\nDo you you really want to do that?"),
                    uk: e => "Це прибере ".concat(e, " користувач").concat(g(e, "а", "а", "ів"), " зі списку ігнорованих користувачів.\nВи дійсно хочете продовжити?"),
                    ru: e => "Это уберет ".concat(e, " пользовател").concat(g(e, "я", "я", "ей"), " из списка игнорированных пользователей.\nВы действительно хотите продолжить?")
                },
                yes: {
                    "en-GB": "Yes",
                    uk: "Так",
                    ru: "Да"
                },
                no: {
                    "en-GB": "Cancel",
                    uk: "Відминити",
                    ru: "Отменить"
                }
            },
            removeUserButton: {
                "en-GB": "REMOVE",
                uk: "ПРИБРАТИ",
                ru: "УБРАТЬ"
            }
        },
        optionLabels: [ {
            "en-GB": "Add to NoDelete ignored users list",
            uk: "Добавити до списку ігнорованих користувачів у NoDelete",
            ru: "Добавить в список игнорированных пользователей в NoDelete"
        }, {
            "en-GB": "Remove from the NoDelete ignore list",
            uk: "Прибрати з списку ігнорованих користувачів у NoDelete",
            ru: "Убрать из списка игнорированных пользователей в NoDelete"
        } ],
        toastLabels: [ {
            "en-GB": "Added {user} to the ignored users list",
            uk: "{user} добавлено до списку ігнорованих користувачів",
            ru: "{user} добавлены в список игнорированных пользователей"
        }, {
            "en-GB": "Removed {user} from the ignored users list",
            uk: "{user} прибрано зі списку ігнорованих користувачів",
            ru: "{user} убраны из списка игнорированных пользователей"
        } ],
        thisMessageWasDeleted: {
            "en-GB": "This message was deleted",
            uk: "Це повідомлення було видалено",
            ru: "Это сообщение было удалено"
        }
    };
    var p, R, y, b = i.createThemedStyleSheet({
        container: {
            flexDirection: "row",
            alignItems: "center"
        },
        image: {
            marginLeft: 5,
            marginRight: 5,
            width: 25,
            height: 25,
            borderRadius: 100
        },
        label: {
            color: c.semanticColors.MOBILE_TEXT_HEADING_PRIMARY
        },
        labelRemove: {
            color: c.semanticColors.TEXT_FEEDBACK_WARNING
        }
    }), w = e => {
        var {imageSource: t, onImagePress: a, label: r, labelRemove: o = "REMOVE", onRemove: s} = e;
        return React.createElement(React.Fragment, null, React.createElement(l.View, {
            style: b.container
        }, React.createElement(l.TouchableOpacity, {
            onPress: s
        }, React.createElement(l.Text, {
            style: b.labelRemove
        }, o)), React.createElement(l.TouchableOpacity, {
            onPress: a
        }, React.createElement(l.Image, {
            style: [ b.image ],
            source: t
        })), React.createElement(l.Text, {
            style: b.label
        }, r)));
    };
    !function e(t, a) {
        if (void 0 === t) throw Error("No object passed to make defaults for");
        if (void 0 === a) throw Error("No defaults object passed to make defaults off of");
        for (var r in a) {
            var o, s;
            "object" != typeof a[r] || Array.isArray(a?.[r]) ? (o = t)[s = r] ?? (o[s] = a[r]) : ("object" != typeof t?.[r] && (t[r] = {}), 
            e(t[r], a[r]));
        }
        return t;
    }(t.storage, {
        ignore: {
            users: [],
            channels: [],
            bots: !1
        },
        timestamps: !1,
        ew: !1,
        onlyTimestamps: !1,
        savePersistent: !0,
        maxSaved: 5e3,
        saved: []
    });
    var E, N = [], S = [];
    return {
        settings(l) {
            p ?? (p = n.findByStoreName("UserStore")), R ?? (R = n.findByProps("fetchProfile", "getUser", "setFlag")), 
            y ?? (y = n.findByProps("showUserProfile")), a.useProxy(t.storage);
            var [i, c] = e.React.useState(t.storage.ignore.users), [m, d] = e.React.useState(Array.isArray(t.storage.saved) ? t.storage.saved : []), [u, g] = e.React.useState(""), h = () => d([ ...t.storage.saved ?? [] ]), v = () => {
                t.storage.saved = (t.storage.saved ?? []).filter(e => e.locked), h();
            }, b = m.filter(e => e.locked).length, E = m.filter(e => ((e, t) => {
                if (!t) return !0;
                var a = (t + "").toLowerCase();
                return e.id && (e.id + "").toLowerCase().includes(a) || e.author?.id && (e.author.id + "").toLowerCase().includes(a) || e.author?.username && (e.author.username + "").toLowerCase().includes(a) || e.content && (e.content + "").toLowerCase().includes(a) || !1;
            })(e, u)).slice().reverse(), N = () => {
                t.storage.ignore.users = [], c([]);
            }, S = 0;
            return e.React.createElement(e.ReactNative.ScrollView, {
                style: {
                    flex: 1
                }
            }, e.React.createElement(o.Forms.FormSection, {
                title: f("settings.titles.settings"),
                titleStyleType: "no_border"
            }, e.React.createElement(o.Forms.FormRow, {
                label: f("settings.showTimestamps"),
                trailing: e.React.createElement(o.Forms.FormSwitch, {
                    value: t.storage.timestamps,
                    onValueChange: e => t.storage.timestamps = e
                })
            }), e.React.createElement(o.Forms.FormRow, {
                label: f("settings.ewTimestampFormat"),
                trailing: e.React.createElement(o.Forms.FormSwitch, {
                    value: t.storage.ew,
                    onValueChange: e => t.storage.ew = e
                })
            }), e.React.createElement(o.Forms.FormDivider, null), e.React.createElement(o.Forms.FormRow, {
                label: f("settings.youDeletedItWarning")
            })), e.React.createElement(o.Forms.FormSection, {
                title: f("settings.titles.filters")
            }, e.React.createElement(o.Forms.FormRow, {
                label: f("settings.ignoreBots"),
                trailing: e.React.createElement(o.Forms.FormSwitch, {
                    value: t.storage.ignore.bots,
                    onValueChange: e => t.storage.ignore.bots = e
                })
            }), e.React.createElement(o.Forms.FormRow, {
                label: f("settings.clearUsersLabel", !0)?.make?.(i.length),
                trailing: e.React.createElement(o.Forms.FormRow.Icon, {
                    source: s.getAssetIDByName("ic_trash_24px")
                }),
                onPress() {
                    0 !== i.length && r.showConfirmationAlert({
                        title: f("settings.confirmClear.title"),
                        content: f("settings.confirmClear.description", !0)?.make?.(i.length),
                        confirmText: f("settings.confirmClear.yes"),
                        cancelText: f("settings.confirmClear.no"),
                        confirmColor: "brand",
                        onConfirm: N
                    });
                }
            }), e.React.createElement(e.ReactNative.ScrollView, {
                style: {
                    flex: 1,
                    gap: 3,
                    marginLeft: 15
                }
            }, i.map(a => {
                var r = p.getUser(a) ?? {}, o = r?.getAvatarURL?.(null, 26)?.replace?.(/\.(gif|webp)/, ".png");
                return o || (o = "https://cdn.discordapp.com/embed/avatars/1.png?size=48", r.username = "".concat(a, " Uncached"), 
                r.discriminator = "0", 0 === S && (r.username += ", press the avatar"), S++), e.React.createElement(w, {
                    imageSource: {
                        uri: o
                    },
                    onImagePress() {
                        (async e => {
                            var t = y.showUserProfile;
                            p.getUser(e) ? t({
                                userId: e
                            }) : R.getUser(e).then(e => {
                                var {id: a} = e;
                                return t({
                                    userId: a
                                });
                            });
                        })(a);
                    },
                    onRemove() {
                        return e = a, r = i.filter(t => t !== e), t.storage.ignore.users = r, void c(r);
                        var e, r;
                    },
                    label: r.username + (0 == r.discriminator ? "" : "#".concat(r.discriminator)),
                    labelRemove: f("settings.removeUserButton")
                });
            })), e.React.createElement(o.Forms.FormDivider, null), e.React.createElement(o.Forms.FormRow, {
                label: f("settings.addUsersInfo")
            })), e.React.createElement(o.Forms.FormSection, {
                title: "Saved deleted messages"
            }, e.React.createElement(o.Forms.FormRow, {
                label: "".concat(m.length, " saved (").concat(b, " locked)")
            }), e.React.createElement(e.ReactNative.TextInput, {
                placeholder: "Search by message id, user id, username, or text",
                placeholderTextColor: "#888",
                value: u,
                onChangeText: g,
                style: {
                    color: "#fff",
                    marginHorizontal: 15,
                    marginBottom: 8,
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderColor: "#444"
                }
            }), e.React.createElement(o.Forms.FormRow, {
                label: "Clear all (keeps locked)",
                trailing: e.React.createElement(o.Forms.FormRow.Icon, {
                    source: s.getAssetIDByName("ic_trash_24px")
                }),
                onPress() {
                    var e = m.length - b;
                    0 !== e && r.showConfirmationAlert({
                        title: "Clear saved messages",
                        content: "Remove ".concat(e, " unlocked saved messages? Locked ones stay."),
                        confirmText: "Clear",
                        cancelText: "Cancel",
                        confirmColor: "red",
                        onConfirm: v
                    });
                }
            }), e.React.createElement(e.ReactNative.ScrollView, {
                style: {
                    flex: 1,
                    maxHeight: 460
                }
            }, E.map(a => {
                var r = p?.getUser?.(a.author?.id), n = a.author?.globalName ?? r?.globalName ?? a.author?.username ?? r?.username ?? "unknown", l = a.author?.username ?? r?.username, i = l ? "@".concat(l) : "", c = a.author?.avatarUrl ?? r?.getAvatarURL?.(null, 64) ?? "https://cdn.discordapp.com/embed/avatars/0.png";
                return e.React.createElement(e.ReactNative.View, {
                    key: a.id,
                    style: {
                        flexDirection: "row",
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        alignItems: "flex-start"
                    }
                }, e.React.createElement(e.ReactNative.Image, {
                    source: {
                        uri: c
                    },
                    style: {
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10
                    }
                }), e.React.createElement(e.ReactNative.View, {
                    style: {
                        flex: 1
                    }
                }, e.React.createElement(e.ReactNative.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }
                }, e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#f2f3f5",
                        fontWeight: "600",
                        marginRight: 6
                    }
                }, n), i ? e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#949ba4",
                        fontSize: 12,
                        marginRight: 6
                    }
                }, i) : null, e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#949ba4",
                        fontSize: 11
                    }
                }, new Date(a.timestamp).toLocaleString())), a.content ? e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#dbdee1",
                        marginTop: 2
                    }
                }, a.content) : null, (a.attachments ?? []).map((t, a) => e.React.createElement(e.ReactNative.Image, {
                    key: a,
                    source: {
                        uri: t
                    },
                    resizeMode: "cover",
                    style: {
                        width: 180,
                        height: 130,
                        borderRadius: 8,
                        marginTop: 4
                    }
                })), a.content || a.attachments?.length ? null : e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#80848e",
                        fontStyle: "italic",
                        marginTop: 2
                    }
                }, "[no content]"), e.React.createElement(e.ReactNative.Text, {
                    style: {
                        color: "#6d7178",
                        fontSize: 10,
                        marginTop: 3
                    }
                }, "#", a.channelName)), e.React.createElement(e.ReactNative.View, {
                    style: {
                        alignItems: "center",
                        marginLeft: 6,
                        gap: 10
                    }
                }, e.React.createElement(e.ReactNative.Pressable, {
                    onPress() {
                        return e = a.id, o = (r = t.storage.saved ?? []).find(t => t.id === e), o && (o.locked = !o.locked), 
                        t.storage.saved = [ ...r ], void h();
                        var e, r, o;
                    },
                    hitSlop: 8
                }, e.React.createElement(e.ReactNative.Text, {
                    style: {
                        fontSize: 18,
                        opacity: a.locked ? 1 : .4
                    }
                }, a.locked ? "🔒" : "🔓")), e.React.createElement(e.ReactNative.Pressable, {
                    onPress() {
                        return e = a.id, t.storage.saved = (t.storage.saved ?? []).filter(t => t.id !== e), 
                        void h();
                        var e;
                    },
                    hitSlop: 8
                }, e.React.createElement(o.Forms.FormRow.Icon, {
                    source: s.getAssetIDByName("ic_trash_24px")
                }))));
            }))));
        },
        onUnload() {
            for (var e of S) e();
        },
        onLoad() {
            try {
                S.push(m.before("dispatch", e.FluxDispatcher, a => {
                    try {
                        E || (E = n.findByStoreName("MessageStore"));
                        var r = a[0];
                        if (!r || "MESSAGE_DELETE" !== r?.type) return;
                        if (!r?.id || !r?.channelId) return;
                        var o = E.getMessage(r.channelId, r.id);
                        if (t.storage.ignore.users.includes(o?.author?.id)) return;
                        if (t.storage.ignore.bots && o?.author?.bot) return;
                        if (N.includes(r.id)) return N.splice(N.indexOf(r.id), 1), a;
                        N.push(r.id);
                        try {
                            ((e, a) => {
                                try {
                                    if (!1 === t.storage.savePersistent) return;
                                    if (Array.isArray(t.storage.saved) || (t.storage.saved = []), t.storage.saved.some(t => t.id === e.id)) return;
                                    var r = a, o = null;
                                    try {
                                        var s = n.findByStoreName("ChannelStore"), l = s?.getChannel?.(a);
                                        r = l?.name ?? a, o = l?.guild_id ?? null;
                                    } catch (e) {}
                                    var i = e.author ?? {};
                                    try {
                                        var c = n.findByStoreName("UserStore"), m = c?.getUser?.(i.id);
                                        m && (i = {
                                            ...i,
                                            username: m.username ?? i.username,
                                            globalName: m.globalName ?? m.global_name ?? i.globalName ?? null,
                                            avatar: m.avatar ?? i.avatar
                                        });
                                    } catch (e) {}
                                    t.storage.saved.push(((e, t, a, r) => {
                                        var o = [];
                                        for (var s of e.attachments ?? []) s?.url && o.push(s.url);
                                        for (var n of e.embeds ?? []) {
                                            var l = n?.image?.url ?? n?.thumbnail?.url;
                                            l && o.push(l);
                                        }
                                        var i = e.author ?? {};
                                        return {
                                            id: e.id,
                                            channelId: t,
                                            channelName: a ?? t ?? "",
                                            guildId: r ?? null,
                                            author: {
                                                id: i.id ?? "",
                                                username: i.username ?? "unknown",
                                                globalName: i.globalName ?? i.global_name ?? null,
                                                avatarUrl: i.avatar ? "https://cdn.discordapp.com/avatars/".concat(i.id, "/").concat(i.avatar, ".png?size=64") : null
                                            },
                                            content: e.content ?? "",
                                            timestamp: Date.now(),
                                            attachments: o,
                                            locked: !1
                                        };
                                    })({
                                        ...e,
                                        author: i
                                    }, a, r, o)), ((e, t) => {
                                        for (;e.length > t; ) {
                                            var a = e.findIndex(e => !e.locked);
                                            if (-1 === a) break;
                                            e.splice(a, 1);
                                        }
                                    })(t.storage.saved, t.storage.maxSaved ?? 5e3);
                                } catch (e) {
                                    console.error("[NoDelete] saveDeleted failed", e);
                                }
                            })(o, r.channelId);
                        } catch (e) {}
                        var s = f("thisMessageWasDeleted");
                        return t.storage.timestamps && (s += " (".concat(e.moment().format(t.storage.ew ? "hh:mm:ss.SS a" : "HH:mm:ss.SS"), ")")), 
                        a[0] = {
                            type: "MESSAGE_EDIT_FAILED_AUTOMOD",
                            messageData: {
                                type: 1,
                                message: {
                                    channelId: r.channelId,
                                    messageId: r.id
                                }
                            },
                            errorResponseBody: {
                                code: 2e5,
                                message: s
                            }
                        }, a;
                    } catch (e) {
                        console.error(e), alert("[Nodelete → dispatcher patch] died\n".concat(e.stack));
                    }
                }));
                var a = m.before("render", n.findByProps("ScrollView").View, e => {
                    try {
                        var r = d.findInReactTree(e, e => ".$UserProfileOverflow" === e.key);
                        if (!r || !r.props || "UserProfileOverflow" !== r.props.sheetKey) return;
                        var o = r.props.content.props, s = v.optionLabels.flatMap(Object.values);
                        if (o.options.some(e => s.includes(e?.label))) return;
                        var n = Object.keys(r._owner.stateNode._keyChildMapping).find(e => r._owner.stateNode._keyChildMapping[e] && e.match(/(?<=\$UserProfile)\d+/))?.slice?.(13), l = o.options.findLastIndex(e => e.isDestructive);
                        t.storage.ignore.users.includes(n) ? o.options.splice(l + 1, 0, {
                            label: f("optionLabels.1"),
                            onPress() {
                                t.storage.ignore.users.splice(t.storage.ignore.users.findIndex(e => e === n), 1), 
                                u.showToast(f("toastLabels.1").replaceAll("{user}", o.header.title)), o.hideActionSheet();
                            }
                        }) : o.options.splice(l + 1, 0, {
                            isDestructive: !0,
                            label: f("optionLabels.0"),
                            onPress() {
                                t.storage.ignore.users.push(n), u.showToast(f("toastLabels.0").replaceAll("{user}", o.header.title)), 
                                o.hideActionSheet();
                            }
                        });
                    } catch (e) {
                        console.error(e);
                        var i = !1;
                        try {
                            i = a();
                        } catch (e) {
                            i = !1;
                        }
                        alert("[NoDelete → context menu patch] failed. Patch ".concat(i ? "dis" : "en", "abled\n").concat(e.stack));
                    }
                });
                S.push(a);
            } catch (e) {
                console.error(e), alert("[NoDelete] dead\n".concat(e.stack));
            }
        }
    };
})(vendetta.metro.common, vendetta.plugin, vendetta.storage, vendetta.ui.alerts, vendetta.ui.components, vendetta.ui.assets, vendetta.metro, vendetta.ui.components.General, vendetta.metro.common.stylesheet, vendetta.ui, vendetta.patcher, vendetta.utils, vendetta.ui.toasts);
