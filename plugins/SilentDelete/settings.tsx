import { findByProps } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

function defaults() {
    storage.replacementText ??= "** **";
    storage.deleteDelay ??= 200;
    storage.suppressNotifications ??= true;
    storage.deleteOriginal ??= true;
    storage.tryEphemeral ??= true;
    storage.lastError ??= "";
}

export default function SilentDeleteSettings() {
    useProxy(storage);
    defaults();
    const [, bump] = React.useReducer(function (n: number) { return n + 1; }, 0);
    const RN: any = ReactNative || {};
    const TextInput = RN.TextInput;
    const ScrollView = RN.ScrollView;
    const Text = RN.Text;
    const View = RN.View;

    const tables = findByProps("TableRowGroup", "TableSwitchRow", "Stack");
    const TableRowGroup = tables && tables.TableRowGroup;
    const TableSwitchRow = tables && tables.TableSwitchRow;
    const Stack = (tables && tables.Stack) || View;

    const lastError = storage.lastError ? String(storage.lastError) : "";

    const switchRow = function (label: string, sub: string, key: string) {
        const value = !!(storage as any)[key];
        const onChange = function (v: boolean) {
            (storage as any)[key] = v;
            bump();
        };
        if (TableSwitchRow) {
            return React.createElement(TableSwitchRow, {
                label: label,
                subLabel: sub,
                value: value,
                onValueChange: onChange,
            });
        }
        return React.createElement(
            View,
            { style: { paddingVertical: 10 } },
            React.createElement(Text, { style: { color: "#fff", fontWeight: "600" } }, label),
            React.createElement(Text, { style: { color: "#949ba4", fontSize: 12, marginBottom: 6 } }, sub),
            React.createElement(
                Text,
                { style: { color: "#5865F2" }, onPress: function () { onChange(!value); } },
                value ? "On (tap to disable)" : "Off (tap to enable)",
            ),
        );
    };

    const errorBanner = lastError
        ? React.createElement(
            View,
            {
                style: {
                    backgroundColor: "#4a1a1a",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    borderLeftWidth: 3,
                    borderLeftColor: "#ed4245",
                },
            },
            React.createElement(Text, { style: { color: "#ed4245", fontWeight: "700", fontSize: 12, marginBottom: 4 } }, "Last error"),
            React.createElement(Text, { style: { color: "#f0b0b0", fontSize: 12 } }, lastError),
        )
        : null;

    const body = React.createElement(
        Stack,
        { style: { padding: 16 }, spacing: 16 },
        errorBanner,
        React.createElement(Text, { style: { color: "#fff", fontSize: 16, fontWeight: "600" } }, "Replacement text"),
        TextInput
            ? React.createElement(TextInput, {
                value: String(storage.replacementText || "** **"),
                placeholder: "** **",
                onChangeText: function (v: string) {
                    storage.replacementText = v;
                    bump();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                },
            })
            : null,
        TableRowGroup
            ? React.createElement(
                TableRowGroup,
                { title: "Behavior" },
                switchRow(
                    "Try ephemeral flag first",
                    "PATCH flags 64 then delete. If Discord accepts it, Vencord drops the row.",
                    "tryEphemeral",
                ),
                switchRow(
                    "Suppress notifications",
                    "Don't ping mentioned users when posting the overwrite.",
                    "suppressNotifications",
                ),
                switchRow(
                    "Delete original message",
                    "If off, the original can come back after a client restart.",
                    "deleteOriginal",
                ),
            )
            : React.createElement(
                View,
                null,
                switchRow("Try ephemeral flag first", "PATCH flags 64 then delete.", "tryEphemeral"),
                switchRow("Suppress notifications", "Don't ping mentioned users.", "suppressNotifications"),
                switchRow("Delete original message", "If off, original can reappear.", "deleteOriginal"),
            ),
        React.createElement(Text, { style: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 8 } }, "Delete delay (ms)"),
        TextInput
            ? React.createElement(TextInput, {
                value: String(storage.deleteDelay || 200),
                placeholder: "200",
                keyboardType: "numeric",
                onChangeText: function (v: string) {
                    const n = parseInt(v, 10);
                    if (!isNaN(n)) storage.deleteDelay = n;
                    bump();
                },
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                },
            })
            : null,
    );

    return ScrollView
        ? React.createElement(ScrollView, { style: { flex: 1 } }, body)
        : body;
}
