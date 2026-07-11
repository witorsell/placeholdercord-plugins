import { findByProps } from "@vendetta/metro";

import { CollectiblesCategoryStore } from "./CollectiblesCategoryStore";
import { CollectiblesPurchaseStore } from "./CollectiblesPurchaseStore";

// Same collectibles utils module as profile effects. getAvatarDecorationsFromCategories walks
// the raw `.categories` Map (values -> flatMap items -> filter AVATAR_DECORATION), so we hand
// it the map property, not a getter result.
function getAvatarDecorationsModule() {
    return findByProps("getAvatarDecorationsFromCategories", "getAvatarDecorationsFromPurchases")
        ?? findByProps("getAvatarDecorationsFromCategories")
        ?? findByProps("getAvatarDecorationsFromPurchases");
}

const collectiblesActions = findByProps("fetchCollectiblesCategories");

export const AvatarDecorationStore: any = {
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

    get decorations() {
        const AvatarDecorations = getAvatarDecorationsModule();
        const categories = CollectiblesCategoryStore?.categories;
        const purchases = CollectiblesPurchaseStore?.purchases;

        const raw: any[] = [];
        try {
            if (AvatarDecorations?.getAvatarDecorationsFromCategories && categories) {
                raw.push(...(AvatarDecorations.getAvatarDecorationsFromCategories(categories) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getAvatarDecorationsFromCategories failed", e);
        }
        try {
            if (AvatarDecorations?.getAvatarDecorationsFromPurchases && purchases && typeof (purchases as any).values === "function") {
                raw.push(...(AvatarDecorations.getAvatarDecorationsFromPurchases(purchases) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getAvatarDecorationsFromPurchases skipped", e);
        }

        const seen = new Set<string>();
        return raw
            .map(d => {
                const config = d.config ?? d;
                const skuId = d.skuId ?? config.sku_id ?? config.skuId;
                const id = d.id ?? config.id ?? skuId;
                return {
                    id,
                    skuId,
                    config: {
                        ...config,
                        id: config.id ?? id,
                        sku_id: config.sku_id ?? config.skuId ?? skuId
                    }
                };
            })
            .filter(d => {
                if (!d.id || seen.has(d.id)) return false;
                seen.add(d.id);
                return true;
            });
    }
};
