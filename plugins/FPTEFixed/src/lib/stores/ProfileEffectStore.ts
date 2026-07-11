import { findByProps } from "@vendetta/metro";

import type { CollectiblesItemType } from "@lib/records";

import { CollectiblesCategoryStore } from "./CollectiblesCategoryStore";
import { CollectiblesPurchaseStore } from "./CollectiblesPurchaseStore";

// The profile-effect accessors live on the collectibles utils module. Discord's
// getProfileEffects(categories, purchases) walks the raw store Maps: it does
// `categories.values()` -> flatMap(`items`) -> filter(PROFILE_EFFECT). So we must
// hand it the `.categories` / `.purchases` Map *properties*, not getCategories().
function getProfileEffectsModule() {
    return findByProps("getProfileEffects", "getProfileEffectsFromCategories")
        ?? findByProps("getProfileEffectsFromCategories")
        ?? findByProps("getProfileEffectsFromPurchases");
}

const collectiblesActions = findByProps("fetchCollectiblesCategories");

export const ProfileEffectStore: any = {
    // Categories are lazy: nothing is in the store until the collectibles shop
    // is opened. Kick the fetch so the picker fills in. Safe to call repeatedly.
    fetch() {
        try {
            collectiblesActions?.fetchCollectiblesCategories?.();
        } catch (e) {
            console.warn("[FPTE] fetchCollectiblesCategories failed", e);
        }
    },

    get isLoaded() {
        const categories = CollectiblesCategoryStore?.categories;
        return !!categories && (categories.size ?? 0) > 0;
    },

    get profileEffects() {
        const ProfileEffects = getProfileEffectsModule();
        const categories = CollectiblesCategoryStore?.categories;
        const purchases = CollectiblesPurchaseStore?.purchases;

        const rawEffects: any[] = [];

        // The full catalog is the categories path. Keep it independent so a bad
        // purchases Map can't wipe it out.
        try {
            if (ProfileEffects?.getProfileEffectsFromCategories && categories) {
                rawEffects.push(...(ProfileEffects.getProfileEffectsFromCategories(categories) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getProfileEffectsFromCategories failed", e);
        }

        // Merge owned effects only when the purchases Map is actually present;
        // getProfileEffectsFromPurchases calls `.values()` on it and would throw
        // on an undefined collection.
        try {
            if (ProfileEffects?.getProfileEffectsFromPurchases && purchases && typeof (purchases as any).values === "function") {
                rawEffects.push(...(ProfileEffects.getProfileEffectsFromPurchases(purchases) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getProfileEffectsFromPurchases skipped", e);
        }

        // The collectibles records carry the config fields (title, effects,
        // thumbnailPreviewSrc, accessibilityLabel, ...) at the top level; the old
        // ProfileEffectStore nested them under `.config`. Normalize to the picker's
        // { id, skuId, config } shape so effect.config.* resolves either way.
        const seen = new Set<string>();
        return rawEffects
            .map(e => {
                const config = e.config ?? e;
                const skuId = e.skuId ?? e.profileEffectSkuId ?? config.sku_id ?? config.skuId;
                const id = e.id ?? config.id ?? skuId;
                return {
                    id,
                    skuId,
                    config: {
                        ...config,
                        id: config.id ?? id,
                        sku_id: config.sku_id ?? config.skuId ?? skuId,
                        title: config.title ?? "Profile Effect",
                        accessibilityLabel: config.accessibilityLabel ?? config.title ?? "Profile Effect"
                    }
                };
            })
            .filter(e => {
                if (!e.id || seen.has(e.id)) return false;
                seen.add(e.id);
                return true;
            });
    }
};

export type ProfileEffectStoreAction = ExtractAction<FluxAction, "LOGOUT" | "PROFILE_EFFECTS_SET_TRY_IT_OUT" | "USER_PROFILE_EFFECTS_FETCH" | "USER_PROFILE_EFFECTS_FETCH_FAILURE" | "USER_PROFILE_EFFECTS_FETCH_SUCCESS">;

declare class $ProfileEffectStore extends FluxStore<ProfileEffectStoreAction> {
    static displayName: "ProfileEffectStore";

    canFetch(): boolean;
    get fetchError(): Error | undefined;
    getProfileEffectById(effectId: string): ProfileEffect | undefined;
    hasFetched(): boolean;
    get isFetching(): boolean;
    get profileEffects(): ProfileEffect[];
    get tryItOutId(): string | null;
}

export interface ProfileEffect {
    config: ProfileEffectConfig;
    id: string;
    skuId: string;
}

export interface ProfileEffectConfig {
    accessibilityLabel: string;
    animationType: number;
    description: string;
    effects: {
        duartion: number;
        height: number;
        loop: boolean;
        loopDelay: number;
        position: {
            x: number;
            y: number;
        };
        src: string;
        start: number;
        width: number;
        zIndex: number;
    }[];
    id: string;
    reducedMotionSrc: string;
    sku_id: string;
    staticFrameSrc?: string;
    thumbnailPreviewSrc: string;
    title: string;
    type: CollectiblesItemType.PROFILE_EFFECT;
}
