import type { UserProfile } from "@vencord/discord-types";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

import { decodeColor, decodeColorsLegacy, decodeEffect, extractFPTE } from "@lib/fpte";
import { cacheBio } from "@lib/fpteCache";
import { ProfileEffectRecord } from "@lib/records";
import { UserProfileStore } from "@lib/stores";

function updateProfileThemeColors(profile: UserProfile<false>, primary: number, accent: number) {
    if (primary > -1) {
        profile.themeColors = [primary, accent > -1 ? accent : primary];
        profile.premiumType = 2;
    } else if (accent > -1) {
        profile.themeColors = [accent, accent];
        profile.premiumType = 2;
    }
}

function updateProfileEffectId(profile: UserProfile<false>, id: bigint) {
    if (id > -1n) {
        const skuId = id.toString();
        // useUserProfileEffect reads getUserProfile(userId).profileEffect (a
        // ProfileEffectRecord) and resolves its config by skuId. The old
        // profileEffectId field is gone, so set profileEffect directly. We only have
        // the sku (records no longer carry a separate effect id), so use it for both.
        try {
            (profile as any).profileEffect = new ProfileEffectRecord({ id: skuId, skuId } as any);
        } catch {
            (profile as any).profileEffect = { id: skuId, skuId, sku_id: skuId, type: 1 };
        }
        // Keep legacy fields for older clients.
        (profile as any).profileEffectSkuId = profile.profileEffectId = profile.profileEffectID = skuId;
        profile.premiumType = 2;
    }
}

function hasProfileEffect(profile: UserProfile<false>) {
    return !!((profile as any).profileEffect || (profile as any).profileEffectSkuId || profile.profileEffectId || profile.profileEffectID);
}

export const patchGetUserProfile = () => after("getUserProfile", UserProfileStore, (_args: unknown[], profile: UserProfile | undefined) => {
    if (!profile || profile.profileFetchFailed) return profile;

    // Cache the decoded bio for this user so decorations/nameplates can render app-wide,
    // not just on the profile popout.
    cacheBio(profile.userId, profile.bio);

    if (storage.prioritizeNitro) {
        if (profile.themeColors) {
            if (!hasProfileEffect(profile)) {
                const fpte = extractFPTE(profile.bio);
                if (decodeColor(fpte[0]) === -2)
                    updateProfileEffectId(profile, decodeEffect(fpte[1]));
                else
                    updateProfileEffectId(profile, decodeEffect(fpte[2]));
            }
            return profile;
        } else if (hasProfileEffect(profile)) {
            const fpte = extractFPTE(profile.bio);
            const primaryColor = decodeColor(fpte[0]);
            if (primaryColor === -2)
                updateProfileThemeColors(profile, ...decodeColorsLegacy(fpte[0]));
            else
                updateProfileThemeColors(profile, primaryColor, decodeColor(fpte[1]));
            return profile;
        }
    }

    const fpte = extractFPTE(profile.bio);
    const primaryColor = decodeColor(fpte[0]);
    if (primaryColor === -2) {
        updateProfileThemeColors(profile, ...decodeColorsLegacy(fpte[0]));
        updateProfileEffectId(profile, decodeEffect(fpte[1]));
    } else {
        updateProfileThemeColors(profile, primaryColor, decodeColor(fpte[1]));
        updateProfileEffectId(profile, decodeEffect(fpte[2]));
    }

    return profile;
});
