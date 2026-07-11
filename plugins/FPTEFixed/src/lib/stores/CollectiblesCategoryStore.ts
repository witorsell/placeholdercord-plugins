import type { ExtractAction, FluxAction, FluxStore } from "@vencord/discord-types";
import { findByStoreName } from "@vendetta/metro";

export const CollectiblesCategoryStore: $CollectiblesCategoryStore
    = findByStoreName("CollectiblesCategoryStore");

export type CollectiblesCategoryStoreAction = ExtractAction<FluxAction, "COLLECTIBLES_CATEGORIES_FETCH" | "COLLECTIBLES_CATEGORIES_FETCH_FAILURE" | "COLLECTIBLES_CATEGORIES_FETCH_SUCCESS" | "LOGOUT">;

declare class $CollectiblesCategoryStore extends FluxStore<CollectiblesCategoryStoreAction> {
    static displayName: "CollectiblesCategoryStore";

    // The raw state Map keyed by category skuId. Each value carries an `items`
    // array of collectible records. This is what getProfileEffectsFromCategories
    // walks (`categories.values()` -> flatMap `items`), NOT the getCategories() method.
    get categories(): Map<string, Category>;
    get products(): Map<string, unknown>;
    get fetchError(): Error | undefined;
    get isFetching(): boolean;
    getCategories(): Category[];
}

export interface Category {
    items: {
        asset: string;
        id: string;
        label: string;
        skuId: string;
        type: number;
    }[];
    name: string;
    skuId: string;
    type: number;
}
