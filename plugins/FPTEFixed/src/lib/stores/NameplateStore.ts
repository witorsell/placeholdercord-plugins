import { findByProps } from "@vendetta/metro";

import { CollectiblesCategoryStore } from "./CollectiblesCategoryStore";
import { CollectiblesPurchaseStore } from "./CollectiblesPurchaseStore";

// Same collectibles utils module as profile effects. getNameplatesFromCategories walks the raw
// `.categories` Map (values -> flatMap items -> filter NAMEPLATE), so we hand it the map property.
function getNameplatesModule() {
    return findByProps("getNameplatesFromCategories", "getNameplatesFromPurchases")
        ?? findByProps("getNameplatesFromCategories")
        ?? findByProps("getNameplatesFromPurchases");
}

const collectiblesActions = findByProps("fetchCollectiblesCategories");

export const NameplateStore: any = {
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

    get nameplates() {
        const Nameplates = getNameplatesModule();
        const categories = CollectiblesCategoryStore?.categories;
        const purchases = CollectiblesPurchaseStore?.purchases;

        const raw: any[] = [];
        try {
            if (Nameplates?.getNameplatesFromCategories && categories) {
                raw.push(...(Nameplates.getNameplatesFromCategories(categories) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getNameplatesFromCategories failed", e);
        }
        try {
            if (Nameplates?.getNameplatesFromPurchases && purchases && typeof (purchases as any).values === "function") {
                raw.push(...(Nameplates.getNameplatesFromPurchases(purchases) ?? []));
            }
        } catch (e) {
            console.warn("[FPTE] getNameplatesFromPurchases skipped", e);
        }

        const seen = new Set<string>();
        return raw
            .map(n => {
                const config = n.config ?? n;
                const skuId = n.skuId ?? config.sku_id ?? config.skuId;
                const id = n.id ?? config.id ?? skuId;
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
            .filter(n => {
                if (!n.id || seen.has(n.id)) return false;
                seen.add(n.id);
                return true;
            });
    }
};
