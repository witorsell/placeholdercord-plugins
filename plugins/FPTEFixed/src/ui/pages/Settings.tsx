import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import React from "react";
import { ScrollView } from "react-native";

import { FormRadioRow, FormRow, FormSection, FormSwitchRow } from "../../ui/components/forms";

export function Settings() {
    useProxy(storage);

    return (
        <ScrollView>
            <FormSection title="Settings">
                <FormRow label="Source to prioritize" />
                <FormRadioRow
                    label="Nitro"
                    selected={!!storage.prioritizeNitro}
                    onPress={() => { storage.prioritizeNitro = true; }}
                />
                <FormRadioRow
                    label="About Me"
                    selected={!storage.prioritizeNitro}
                    onPress={() => { storage.prioritizeNitro = false; }}
                />
                <FormSwitchRow
                    label="Hide Builder"
                    subLabel="Hide the FPTE Builder in the User Profile and Server Profiles settings pages"
                    value={!!storage.hideBuilder}
                    onValueChange={value => { storage.hideBuilder = value; }}
                />
                <FormSwitchRow
                    label="Force fallback effect picker"
                    value={!!storage.forceFallbackEffectPicker}
                    onValueChange={value => { storage.forceFallbackEffectPicker = value; }}
                />
                <FormSwitchRow
                    label="Redirect GIF avatar uploads"
                    subLabel="When you pick an animated GIF as your avatar, upload it through your own Message Yourself DM instead of Discord's real upload. Other FPTE users then see it animated on your profile; everyone else keeps seeing your normal static avatar. Off leaves GIF avatar picks going through Discord as normal (still blocked without Nitro)."
                    value={!!storage.gifAvatarRedirect}
                    onValueChange={value => { storage.gifAvatarRedirect = value; }}
                />
                <FormSwitchRow
                    label="Redirect GIF banner uploads"
                    subLabel="Same as above, for your profile banner instead of your avatar."
                    value={!!storage.gifBannerRedirect}
                    onValueChange={value => { storage.gifBannerRedirect = value; }}
                />
            </FormSection>
        </ScrollView>
    );
}
