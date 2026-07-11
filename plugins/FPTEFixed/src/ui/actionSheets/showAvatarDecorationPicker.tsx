import { findByProps } from "@vendetta/metro";
import React from "react";

import { AvatarDecorationStore, CollectiblesCategoryStore, CollectiblesPurchaseStore } from "@lib/stores";
import { CollectiblePickerActionSheet, hideActionSheet, showActionSheet } from "@ui/actionSheets";

const SHEET_KEY = "__FPTE_DECO__";

const { useStateFromStores } = findByProps("useStateFromStores") as {
    useStateFromStores: <T>(stores: unknown[], getState: () => T) => T;
};

function previewUri(config: any): string | undefined {
    // Avatar decoration `asset` is a preset hash served from the decoration-presets CDN.
    if (!config?.asset) return undefined;
    return `https://cdn.discordapp.com/avatar-decoration-presets/${config.asset}.png?size=128&passthrough=false`;
}

function label(config: any): string {
    return config?.label ?? config?.name ?? "Decoration";
}

function DecorationPickerContent({ onSelect, currentSkuId }: {
    onSelect: (config: any | null) => void;
    currentSkuId?: string | undefined;
}) {
    const items = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => AvatarDecorationStore.decorations)
        : AvatarDecorationStore.decorations;

    React.useEffect(() => {
        if (!AvatarDecorationStore.isLoaded) AvatarDecorationStore.fetch();
    }, []);

    return (
        <CollectiblePickerActionSheet
            title="Avatar Decoration"
            items={items}
            currentSkuId={currentSkuId}
            getPreviewUri={previewUri}
            getLabel={label}
            onSelect={config => {
                onSelect(config);
                hideActionSheet(SHEET_KEY);
            }}
        />
    );
}

export function showAvatarDecorationPicker(
    onSelect: (config: any | null) => void,
    currentSkuId?: string | undefined
) {
    if (!AvatarDecorationStore.isLoaded) AvatarDecorationStore.fetch();
    showActionSheet({
        content: <DecorationPickerContent onSelect={onSelect} currentSkuId={currentSkuId} />,
        key: SHEET_KEY
    });
}
