import { findByProps } from "@vendetta/metro";
import React from "react";

import { FluxDispatcher } from "@lib/flux";
import { CollectiblesCategoryStore, CollectiblesPurchaseStore, type ProfileEffectConfig, ProfileEffectStore, UserStore } from "@lib/stores";
import { setPreviewUserId } from "@patches/patchUseProfileTheme";
import { EffectPickerActionSheet, hideActionSheet, showActionSheet } from "@ui/actionSheets";

const SHEET_KEY = "__FPTE__";

const { useStateFromStores } = findByProps("useStateFromStores") as {
    useStateFromStores: <T>(stores: unknown[], getState: () => T) => T;
};

// Categories are fetched lazily, so the effect list starts empty until the
// collectibles data lands. Subscribe to the stores and kick the fetch on mount
// so the grid fills itself in instead of showing nothing.
function EffectPickerContent({ onSelect, currentEffectId }: {
    onSelect: (effect: ProfileEffectConfig | null) => void;
    currentEffectId?: string | undefined;
}) {
    const effects = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => ProfileEffectStore.profileEffects)
        : ProfileEffectStore.profileEffects;

    React.useEffect(() => {
        if (!ProfileEffectStore.isLoaded) ProfileEffectStore.fetch();
    }, []);

    return (
        <EffectPickerActionSheet
            effects={effects}
            onSelect={effect => {
                onSelect(effect);
                hideActionSheet(SHEET_KEY);
            }}
            user={UserStore.getCurrentUser()!}
            currentEffectId={currentEffectId}
        />
    );
}

export function showEffectPicker(
    onSelect: (effect: ProfileEffectConfig | null) => void,
    currentEffectId?: string | undefined
) {
    function onClose(action: any) {
        if (action.key === SHEET_KEY) {
            FluxDispatcher.unsubscribe("HIDE_ACTION_SHEET", onClose);
            setPreviewUserId(undefined);
        }
    }
    FluxDispatcher.subscribe("HIDE_ACTION_SHEET", onClose);

    // Warm the catalog before the sheet mounts so it is often ready on first paint.
    if (!ProfileEffectStore.isLoaded) ProfileEffectStore.fetch();

    showActionSheet({
        content: (
            <EffectPickerContent
                onSelect={onSelect}
                currentEffectId={currentEffectId}
            />
        ),
        key: SHEET_KEY
    });
}
