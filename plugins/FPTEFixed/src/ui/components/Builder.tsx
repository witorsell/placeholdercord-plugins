import { showToast } from "@vendetta/ui/toasts";
import { findByProps } from "@vendetta/metro";
import React, { useMemo, useState, useEffect } from "react";
import { Image, View, Text } from "react-native";
import { buildFPTE, hasFPTE, stripFPTE } from "../../lib/fpte";
import { decodeBio, setFPTE } from "../../lib/fpteCache";
import { AvatarDecorationStore, CollectiblesCategoryStore, CollectiblesPurchaseStore, NameplateStore, type ProfileEffectConfig, ProfileEffectStore, UserStore, UserProfileStore } from "../../lib/stores";
import { useAccentColor, usePrimaryColor, useShowPreview } from "../../patches/patchUseProfileTheme";
import { showAvatarDecorationPicker, showColorPicker, showEffectPicker, showNameplatePicker } from "../../ui/actionSheets";
import { resolveSemanticColor, semanticColors, useAvatarColors, useThemeContext } from "../../ui/color";
import { BuilderButton, Button, StaticEffect } from "../../ui/components";
import { FormCardSection, FormSwitchRow } from "../../ui/components/forms";

const UserProfileActionCreators = findByProps("saveProfileChanges");

const { useStateFromStores } = (findByProps("useStateFromStores") ?? {}) as {
    useStateFromStores?: <T>(stores: unknown[], getState: () => T) => T;
};

export interface BuilderProps {
    guildId?: string | undefined;
}

export function Builder({ guildId }: BuilderProps) {
    const [primaryColor, setPrimaryColor] = usePrimaryColor(null);
    const [accentColor, setAccentColor] = useAccentColor(null);
    const [effect, setEffect] = useState<ProfileEffectConfig | null>(null);
    const [preview, setPreview] = useShowPreview(true);
    const [buildLegacy, setBuildLegacy] = useState(false);
    const { theme = "dark" } = useThemeContext() as any;
    const [fgColor, fillerColor] = useMemo(
        () => [
            semanticColors.HEADER_SECONDARY ? resolveSemanticColor(theme, semanticColors.HEADER_SECONDARY) : "#B5BAC1",
            semanticColors.BACKGROUND_ACCENT ? resolveSemanticColor(theme, semanticColors.BACKGROUND_ACCENT) : "#111214"
        ],
        [theme]
    );
    const avatarColors = useAvatarColors(
        UserStore.getCurrentUser()!.getAvatarURL(guildId, 80),
        fillerColor,
        false
    );
    const [decoration, setDecoration] = useState<any | null>(null);
    const [nameplate, setNameplate] = useState<any | null>(null);
    const [bio, setBio] = useState<string | null>(null);
    const [appliedEffectSku, setAppliedEffectSku] = useState<string | null>(null);
    const [appliedDecorationSku, setAppliedDecorationSku] = useState<string | null>(null);
    const [appliedNameplateSku, setAppliedNameplateSku] = useState<string | null>(null);

    const availableEffects = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => ProfileEffectStore.profileEffects)
        : ProfileEffectStore.profileEffects;
    const availableDecorations = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => AvatarDecorationStore.decorations)
        : AvatarDecorationStore.decorations;
    const availableNameplates = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => NameplateStore.nameplates)
        : NameplateStore.nameplates;

    // Decode whatever FPTE is already in the bio so the Builder reflects the current
    // selection. Colors must be pre-filled too, otherwise applying would re-encode a
    // collectible with the colors dropped.
    useEffect(() => {
        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) return;
        const profile = UserProfileStore.getUserProfile(currentUser.id);
        if (!profile) return;
        setBio(profile.bio ?? null);

        const decoded = decodeBio(profile.bio);
        if (decoded.primary > -1) setPrimaryColor(decoded.primary);
        // A single-color theme stores only the primary; Discord renders it as both, so show the
        // accent swatch filled with the same color rather than empty.
        if (decoded.accent > -1) setAccentColor(decoded.accent);
        else if (decoded.primary > -1) setAccentColor(decoded.primary);
        if (decoded.effectSku) { setAppliedEffectSku(decoded.effectSku); ProfileEffectStore.fetch(); }
        if (decoded.decorationSku) { setAppliedDecorationSku(decoded.decorationSku); AvatarDecorationStore.fetch(); }
        if (decoded.nameplateSku) { setAppliedNameplateSku(decoded.nameplateSku); NameplateStore.fetch(); }
    }, []);

    // Resolve the applied collectibles' configs once each catalog loads.
    useEffect(() => {
        if (!appliedEffectSku || effect) return;
        const match = availableEffects.find((e: any) => e.skuId === appliedEffectSku || e.id === appliedEffectSku);
        if (match) setEffect(match.config);
    }, [appliedEffectSku, availableEffects, effect]);
    useEffect(() => {
        if (!appliedDecorationSku || decoration) return;
        const match = availableDecorations.find((d: any) => d.skuId === appliedDecorationSku);
        if (match) setDecoration(match.config);
    }, [appliedDecorationSku, availableDecorations, decoration]);
    useEffect(() => {
        if (!appliedNameplateSku || nameplate) return;
        const match = availableNameplates.find((n: any) => n.skuId === appliedNameplateSku);
        if (match) setNameplate(match.config);
    }, [appliedNameplateSku, availableNameplates, nameplate]);

    const fpteActive = bio !== null && hasFPTE(bio);
    const hasSelection = primaryColor !== null || accentColor !== null || effect !== null || decoration !== null || nameplate !== null;

    const fpteString = buildFPTE(
        primaryColor ?? -1,
        accentColor ?? -1,
        // Collectibles are encoded by their SKU id, which is how Discord renders them.
        effect?.sku_id ?? effect?.id ?? "",
        decoration?.sku_id ?? decoration?.skuId ?? "",
        nameplate?.sku_id ?? nameplate?.skuId ?? "",
        buildLegacy
    );

    function applyFPTE() {
        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) return;

        let newBio = bio ?? "";

        if (fpteActive && !hasSelection) {
            newBio = stripFPTE(newBio);
            try {
                UserProfileActionCreators.saveProfileChanges({
                    ...UserProfileStore.getUserProfile(currentUser.id),
                    bio: newBio,
                });
                setBio(newBio);
                // Clear the local cache so the removal shows immediately app-wide.
                setFPTE(currentUser.id, decodeBio(newBio));
                showToast("FPTE removed!");
            } catch (err) {
                showToast("Failed to update bio!");
                console.error(err);
            }
            return;
        }

        if (!fpteString) return;

        if (hasFPTE(newBio)) {
            newBio = stripFPTE(newBio);
        }
        if (newBio.length > 0) newBio += " ";
        newBio += fpteString;

        // Non-nitro bios cap at 190 characters; warn but still try to apply.
        if (newBio.length > 190) showToast("Heads up: bio is over the 190 character limit, it may not save.");

        try {
            UserProfileActionCreators.saveProfileChanges({
                ...UserProfileStore.getUserProfile(currentUser.id),
                bio: newBio,
            });
            setBio(newBio);
            // Populate the local cache immediately so your own decoration/nameplate render
            // app-wide without waiting for a profile fetch.
            setFPTE(currentUser.id, decodeBio(newBio));
            showToast("FPTE applied!");
        } catch (err) {
            showToast("Failed to update bio!");
            console.error(err);
        }
    }

    const buttonText = fpteActive && !hasSelection ? "Remove FPTE" : "Apply FPTE";

    const applyButtonVisible = hasSelection || fpteActive;

    return (
        <FormCardSection
            title={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: "#FFFFFF" }}>FPTE Builder</Text>
                    <Text
                        style={{
                            color: fpteActive ? "#4CAF50" : "#F44336",
                            fontSize: 17,
                            marginLeft: 8,
                        }}
                    >
                        {fpteActive ? "Active" : "Inactive"}
                    </Text>
                </View>
            }
            cardStyle={{ backgroundColor: "transparent" }}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <BuilderButton
                    fgColor={fgColor}
                    label="Primary"
                    bgColor={primaryColor}
                    onPress={() =>
                        showColorPicker({
                            color: primaryColor,
                            onSelect: setPrimaryColor,
                            suggestedColors: avatarColors,
                        })
                    }
                />
                <BuilderButton
                    fgColor={fgColor}
                    label="Accent"
                    bgColor={accentColor}
                    onPress={() =>
                        showColorPicker({
                            color: accentColor,
                            onSelect: setAccentColor,
                            suggestedColors: avatarColors,
                        })
                    }
                />
                <BuilderButton fgColor={fgColor} label="Effect" onPress={() => showEffectPicker(setEffect, effect?.id)}>
                    {effect && <StaticEffect effect={effect} style={{ width: "140%", height: "100%" }} />}
                </BuilderButton>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginLeft: 12,
                    }}
                >
                    <Button
                        text={buttonText}
                        size={Button.Sizes.SMALL}
                        onPress={applyFPTE}
                        style={{ marginBottom: 6, paddingHorizontal: 12, opacity: applyButtonVisible ? 1 : 0 }}
                        pointerEvents={applyButtonVisible ? "auto" : "none"}
                    />
                    <Button
                        text="Reset"
                        look={Button.Looks.LINK}
                        color={Button.Colors.TRANSPARENT}
                        size={Button.Sizes.SMALL}
                        {...(!hasSelection ? { pointerEvents: "none", style: { opacity: 0 } } : {})}
                        onPress={() => {
                            setPrimaryColor(null);
                            setAccentColor(null);
                            setEffect(null);
                            setDecoration(null);
                            setNameplate(null);
                        }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", gap: 12, marginTop: 12 }}>
                <BuilderButton fgColor={fgColor} label="Decoration" onPress={() => showAvatarDecorationPicker(setDecoration, decoration?.sku_id ?? decoration?.skuId)}>
                    {decoration?.asset && (
                        <Image
                            source={{ uri: `https://cdn.discordapp.com/avatar-decoration-presets/${decoration.asset}.png?size=96&passthrough=false` }}
                            resizeMode="contain"
                            style={{ width: "100%", height: "100%" }}
                        />
                    )}
                </BuilderButton>
                <BuilderButton fgColor={fgColor} label="Nameplate" onPress={() => showNameplatePicker(setNameplate, nameplate?.sku_id ?? nameplate?.skuId)}>
                    {nameplate?.asset && (
                        <Image
                            source={{ uri: `https://cdn.discordapp.com/assets/collectibles/${nameplate.asset}static.png` }}
                            resizeMode="cover"
                            style={{ width: "100%", height: "100%" }}
                        />
                    )}
                </BuilderButton>
            </View>
           {/* <FormSwitchRow label="FPTE Builder Preview" value={preview} onValueChange={setPreview} />
            <FormSwitchRow
                label="Build backwards compatible FPTE"
                subLabel="Will use more characters"
                value={buildLegacy}
                onValueChange={setBuildLegacy}
            /> */}
        </FormCardSection>
    );
}