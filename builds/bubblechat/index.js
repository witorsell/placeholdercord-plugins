// Bubble Chat for placeholdercord.
// Configurable native chat bubbles + rounded avatars, driven entirely through the
// Native Bridge (window.placeholder.native). This plugin ships no native code; it just
// drives the bubble knobs the native side exposes. The built-in "Native Bridge" plugin
// must be enabled, otherwise window.placeholder is undefined and we bail with a toast.
//
// The loader evaluates this file as (bunny, definePlugin) => { <this> ; return plugin?.default ?? plugin }.

var React = bunny.metro.findByProps("createElement", "useState");
var RN = bunny.metro.findByProps("View", "Text", "Pressable", "ScrollView", "TextInput");

function toast(msg) {
    try {
        bunny.ui.toasts.showToast(msg);
    } catch (e) {
        try { console.log("[BubbleChat] " + msg); } catch (e2) {}
    }
}

// Persisted per-plugin config. startPlugin preloads this storage before we run, so it is
// safe to read and write synchronously.
var storage = bunny.plugin.createStorage();

var DEFAULTS = { avatarRadius: 30, bubbleRadius: 40, bubbleColor: "#5865F2" };

function cfg() {
    return {
        avatarRadius: storage.avatarRadius != null ? storage.avatarRadius : DEFAULTS.avatarRadius,
        bubbleRadius: storage.bubbleRadius != null ? storage.bubbleRadius : DEFAULTS.bubbleRadius,
        bubbleColor: storage.bubbleColor != null ? storage.bubbleColor : DEFAULTS.bubbleColor
    };
}

// The bridge lives on window.placeholder, which only exists while the Native Bridge plugin
// is enabled. Never destructure it blindly; that throws and crashes the client when it is off.
function getNative() {
    return (window.placeholder && window.placeholder.native) || null;
}

function apply() {
    var native = getNative();
    if (!native) {
        toast("Enable the Native Bridge plugin first");
        return Promise.resolve();
    }
    var c = cfg();
    return native.bubbles
        .setEnabled(true)
        .then(function () {
            return native.bubbles.configure({
                avatarRadius: c.avatarRadius,
                bubbleRadius: c.bubbleRadius,
                bubbleColor: c.bubbleColor
            });
        })
        .then(function () { toast("Bubbles applied, scroll the channel to see them"); })
        .catch(function (e) { toast("Bubble error: " + (e && e.message ? e.message : e)); });
}

function Settings() {
    var h = React.createElement;
    var tick = React.useState(0);
    var rerender = function () { tick[1](tick[0] + 1); };
    var c = cfg();
    var native = getNative();

    function presetButton(label, value, key) {
        var active = c[key] === value;
        return h(
            RN.Pressable,
            {
                key: key + "-" + value,
                onPress: function () { storage[key] = value; rerender(); },
                style: {
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: active ? "#5865F2" : "#2b2d31"
                }
            },
            h(RN.Text, { style: { color: "#ffffff" } }, label)
        );
    }

    function section(title, buttons) {
        return h(
            RN.View,
            { style: { marginBottom: 20 } },
            h(RN.Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, title),
            h(RN.View, { style: { flexDirection: "row", flexWrap: "wrap" } }, buttons)
        );
    }

    var children = [];

    if (!native) {
        children.push(
            h(RN.Text, {
                key: "warn",
                style: { color: "#faa61a", marginBottom: 16 }
            }, "Native Bridge is off. Enable the Native Bridge plugin to use bubbles.")
        );
    }

    children.push(section("Avatar corners", [
        presetButton("Square", 0, "avatarRadius"),
        presetButton("Slightly", 15, "avatarRadius"),
        presetButton("Rounded", 30, "avatarRadius"),
        presetButton("Circle", 50, "avatarRadius")
    ]));

    children.push(section("Bubble corners", [
        presetButton("Subtle", 8, "bubbleRadius"),
        presetButton("Rounded", 16, "bubbleRadius"),
        presetButton("Very", 24, "bubbleRadius"),
        presetButton("Pill", 40, "bubbleRadius")
    ]));

    children.push(
        h(
            RN.View,
            { key: "color", style: { marginBottom: 20 } },
            h(RN.Text, { style: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 8 } }, "Bubble color (hex)"),
            h(RN.TextInput, {
                defaultValue: c.bubbleColor,
                placeholder: "#5865F2",
                placeholderTextColor: "#888888",
                autoCapitalize: "none",
                onChangeText: function (t) { storage.bubbleColor = t; },
                style: {
                    color: "#ffffff",
                    backgroundColor: "#2b2d31",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8
                }
            })
        )
    );

    children.push(
        h(
            RN.Pressable,
            {
                key: "apply",
                onPress: function () { apply(); },
                style: { backgroundColor: "#248046", borderRadius: 8, paddingVertical: 12, alignItems: "center" }
            },
            h(RN.Text, { style: { color: "#ffffff", fontWeight: "600" } }, "Apply and reload bubbles")
        )
    );

    return h(RN.ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16 } }, children);
}

var plugin = definePlugin({
    start: function () { apply(); },
    stop: function () {
        var native = getNative();
        if (native) native.bubbles.setEnabled(false);
    },
    SettingsComponent: Settings
});
