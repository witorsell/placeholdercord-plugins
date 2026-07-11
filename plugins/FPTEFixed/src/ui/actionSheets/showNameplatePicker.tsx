import { findByProps } from "@vendetta/metro";
import React from "react";

import { CollectiblesCategoryStore, CollectiblesPurchaseStore, NameplateStore } from "@lib/stores";
import { CollectiblePickerActionSheet, hideActionSheet, showActionSheet } from "@ui/actionSheets";

const SHEET_KEY = "__FPTE_NAMEPLATE__";

const { useStateFromStores } = findByProps("useStateFromStores") as {
    useStateFromStores: <T>(stores: unknown[], getState: () => T) => T;
};

function previewUri(config: any): string | undefined {
    // Nameplate `asset` is a collectibles path ending in `/`; the static frame lives at static.png.
    if (!config?.asset) return undefined;
    return `https://cdn.discordapp.com/assets/collectibles/${config.asset}static.png`;
}

function label(config: any): string {
    return config?.label ?? config?.name ?? "Nameplate";
}

function NameplatePickerContent({ onSelect, currentSkuId }: {
    onSelect: (config: any | null) => void;
    currentSkuId?: string | undefined;
}) {
    const items = useStateFromStores
        ? useStateFromStores([CollectiblesCategoryStore, CollectiblesPurchaseStore], () => NameplateStore.nameplates)
        : NameplateStore.nameplates;

    React.useEffect(() => {
        if (!NameplateStore.isLoaded) NameplateStore.fetch();
    }, []);

    return (
        <CollectiblePickerActionSheet
            title="Nameplate"
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

export function showNameplatePicker(
    onSelect: (config: any | null) => void,
    currentSkuId?: string | undefined
) {
    if (!NameplateStore.isLoaded) NameplateStore.fetch();
    showActionSheet({
        content: <NameplatePickerContent onSelect={onSelect} currentSkuId={currentSkuId} />,
        key: SHEET_KEY
    });
}
