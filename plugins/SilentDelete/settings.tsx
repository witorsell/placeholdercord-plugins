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
}

export default function SilentDeleteSettings() {
    useProxy(storage);
    defaults();
    const [, bump] = React.useReducer((n: number) => n + 1, 0);
    const RN: any = ReactNative || {};
    const TextInput = RN.TextInput;
    const ScrollView = RN.ScrollView;
    const Text = RN.Text;
    const View = RN.View || "div";

    const tables = findByProps("TableRowGroup", "TableSwitchRow", "Stack");
    const TableRowGroup = tables?.TableRowGroup;
    const TableSwitchRow = tables?.TableSwitchRow;
    const Stack = tables?.Stack ?? View;

    const switchRow = (label: string, sub: string, key: string) => {
        const value = !!(storage as any)[key];
        const onChange = (v: boolean) => {
            (storage as any)[key] = v;
            bump();
        };
        if (TableSwitchRow) {
            return React.createElement(TableSwitchRow, {
                label,
                subLabel: sub,
                value,
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
                { style: { color: "#5865F2" }, onPress: () => onChange(!value) },
                value ? "On (tap to disable)" : "Off (tap to enable)",
            ),
        );
    };

    const body = React.createElement(
        Stack,
        { style: { padding: 16 }, spacing: 16 },
        React.createElement(Text, { style: { color: "#fff", fontSize: 16, fontWeight: "600" } }, "Replacement text"),
        React.createElement(TextInput, {
            value: String(storage.replacementText ?? "** **"),
            placeholder: "** **",
            onChangeText: (v: string) => {
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
        }),
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
        React.createElement(TextInput, {
            value: String(storage.deleteDelay ?? 200),
            placeholder: "200",
            keyboardType: "numeric",
            onChangeText: (v: string) => {
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
        }),
    );

    return ScrollView
        ? React.createElement(ScrollView, { style: { flex: 1 } }, body)
        : body;
}
