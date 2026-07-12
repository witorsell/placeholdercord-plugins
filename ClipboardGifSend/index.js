(() => { try { return ((e, t, n) => {
    "use strict";
    var s = [], r = !1;
    return {
        onLoad() {
            try {
                var i = e.findByProps("trackSelectGIF");
                i?.trackSelectGIF && s.push(t.instead("trackSelectGIF", i, (e, t) => (r = !0, setTimeout(() => {
                    r = !1;
                }, 100), t(...e))));
                var c = e.findByProps("sendMessage");
                if (!c?.sendMessage) throw Error("sendMessage not found");
                s.push(t.instead("sendMessage", c, (e, t) => {
                    var [s, i, ...c] = e, d = i?.content?.trim();
                    return d && d.startsWith("http") && !d.includes(" ") && !d.includes("\n") && (d.endsWith(".gif") || d.endsWith(".webp") || d.includes("cdn.discordapp.com/attachments") || d.includes("tenor.com") || d.includes("giphy.com") || d.includes("klipy.com") || d.includes("giflibrary.site")) && r ? (n.clipboard.setString(d), 
                    void (r = !1)) : t(...e);
                }));
            } catch (e) {
                console.error("Plugin failed:", e);
            }
        },
        onUnload() {
            s.forEach(e => e()), s = [];
        }
    };
})(vendetta.metro, vendetta.patcher, vendetta.metro.common);; } catch(e) { try { window.vendetta.ui.toasts.showToast("CRASH: " + String(e)); } catch(err) {} alert("CRASH: " + String(e)); return { onLoad(){}, onUnload(){} }; } })()
