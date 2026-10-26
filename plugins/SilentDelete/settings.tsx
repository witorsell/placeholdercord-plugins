import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

const { FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

export default function SilentDeleteSettings() {
    useProxy(storage);

    storage.replacementText ??= "** **";
    storage.deleteDelay ??= 200;
    storage.suppressNotifications ??= true;
    storage.deleteOriginal ??= true;
    storage.tryEphemeral ??= true;

    return (
        <>
            <FormSection title="Behavior">
                <FormInput
                    title="Replacement Text"
                    placeholder="** **"
                    value={storage.replacementText}
                    onChangeText={(v: string) => (storage.replacementText = v)}
                />
                <FormDivider />
                <FormSwitchRow
                    label="Try Ephemeral Flag First"
                    subLabel="PATCH flags 64 then delete. If Discord accepts it, Vencord drops the row instead of logging it."
                    value={!!storage.tryEphemeral}
                    onValueChange={(v: boolean) => (storage.tryEphemeral = v)}
                />
                <FormDivider />
                <FormSwitchRow
                    label="Suppress Notifications"
                    subLabel="Prevents pinging mentioned users when posting the overwrite."
                    value={!!storage.suppressNotifications}
                    onValueChange={(v: boolean) => (storage.suppressNotifications = v)}
                />
                <FormDivider />
                <FormSwitchRow
                    label="Delete Original Message"
                    subLabel="If disabled, the original message will reappear on client restart."
                    value={!!storage.deleteOriginal}
                    onValueChange={(v: boolean) => (storage.deleteOriginal = v)}
                />
            </FormSection>

            <FormSection title="Timing (milliseconds)">
                <FormInput
                    title="Delete Delay"
                    placeholder="200"
                    value={String(storage.deleteDelay ?? 200)}
                    keyboardType="numeric"
                    onChangeText={(v: string) => {
                        const n = parseInt(v);
                        if (!isNaN(n)) storage.deleteDelay = n;
                    }}
                />
            </FormSection>
        </>
    );
}
