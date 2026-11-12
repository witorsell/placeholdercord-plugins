(() => { try { return ((t, e, n, o) => {
    "use strict";
    function i(t, e) {
        if ("function" == typeof t) try {
            return t.call(e);
        } catch (t) {
            return;
        }
    }
    var a = [];
    function r(t) {
        return t && t.channel && t.channel.id ? t.channel.id + "" : "";
    }
    function c(t, n) {
        var o = e.findByProps("sendBotMessage");
        o && "function" == typeof o.sendBotMessage && t ? o.sendBotMessage(t, n) : alert(n);
    }
    return {
        onUnload() {
            for (var t = 0; t < a.length; t++) try {
                a[t]();
            } catch (t) {}
            a.length = 0;
        },
        onLoad() {
            a.push(t.registerCommand({
                name: "token get",
                displayName: "token get",
                description: "Shows your current user token and copies it",
                displayDescription: "Shows your current user token and copies it",
                applicationId: "-1",
                type: 1,
                inputType: 1,
                options: [],
                execute(t, a) {
                    try {
                        var s = (p = e.findByStoreName("AuthenticationStore"), l = e.findByProps("getToken", "setToken"), 
                        k = e.findByProps("getToken", "isAuthenticated"), (t => {
                            for (var e = 0; t.length > e; e++) {
                                var n = t[e];
                                if ("string" == typeof n && n.length > 0) return n;
                            }
                            return null;
                        })([ p && i(p.getToken, p), l && i(l.getToken, l), k && i(k.getToken, k) ])), u = r(a);
                        if (!s) return void c(u, "No token. AuthenticationStore and TokenManager both came back empty.");
                        (t => {
                            try {
                                n.clipboard.setString(t), o.showToast("Token copied");
                            } catch (t) {}
                        })(s), c(u, "Token copied.\n" + s);
                    } catch (t) {
                        var d = t;
                        alert("token get failed\n" + (d && d.stack ? d.stack : t + ""));
                    }
                    var p, l, k;
                }
            })), a.push(t.registerCommand({
                name: "token login",
                displayName: "token login",
                description: "Logs into an account using a token",
                displayDescription: "Logs into an account using a token",
                applicationId: "-1",
                type: 1,
                inputType: 1,
                options: [ {
                    name: "token",
                    displayName: "token",
                    description: "Token of the account to login into",
                    displayDescription: "Token of the account to login into",
                    type: 3,
                    required: !0
                } ],
                execute(t, n) {
                    try {
                        var o = (t => {
                            if (!t || !t.length) return "";
                            for (var e = 0; e < t.length; e++) {
                                var n = t[e];
                                if (n && "token" === n.name && null != n.value && "" !== n.value) return n.value + "";
                            }
                            return "";
                        })(t).trim(), i = r(n);
                        if (!o) return void c(i, "Pass a token.");
                        var a = e.findByProps("switchAccountToken");
                        if (!a || "function" != typeof a.switchAccountToken) return void c(i, "switchAccountToken is missing on this Discord build.");
                        a.switchAccountToken(o), c(i, "Switching accounts.");
                    } catch (t) {
                        var s = t;
                        alert("token login failed\n" + (s && s.stack ? s.stack : t + ""));
                    }
                }
            }));
        }
    };
})(vendetta.commands, vendetta.metro, vendetta.metro.common, vendetta.ui.toasts);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
