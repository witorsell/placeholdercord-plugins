import React, { useMemo, useState } from "react";
import { Image, View } from "react-native";

import { BottomSheet, BottomSheetScrollView } from "@ui/actionSheets";
import { Button, PressableOpacity, Text } from "@ui/components";
import { Radius, SafeAreaContext, Spacing, useWindowDimensions } from "@ui/length";
import { useContext } from "react";

export interface CollectibleItem {
    id: string;
    skuId: string;
    config: any;
}

export interface CollectiblePickerProps {
    title: string;
    items: CollectibleItem[];
    currentSkuId?: string | undefined;
    /** Resolve a preview image uri for an item, or undefined to show just the label. */
    getPreviewUri: (config: any) => string | undefined;
    /** Human label for an item. */
    getLabel: (config: any) => string;
    onSelect: (config: any | null) => void;
}

const CELL = 84;

export function CollectiblePickerActionSheet({ title, items, currentSkuId, getPreviewUri, getLabel, onSelect }: CollectiblePickerProps) {
    const [selectedSku, setSelectedSku] = useState<string | undefined>(currentSkuId);
    const windowDimensions = useWindowDimensions();
    const safeArea = useContext(SafeAreaContext);

    const selected = useMemo(
        () => items.find(i => i.skuId === selectedSku)?.config ?? null,
        [items, selectedSku]
    );

    return (
        <BottomSheet
            transparentHeader={true}
            scrollable={true}
            startExpanded={true}
            startHeight={windowDimensions.height - safeArea.top}
        >
            <BottomSheetScrollView scrollsToTop={false}>
                <View style={{ flex: 1, alignItems: "center", paddingBottom: 96 }}>
                    <Text variant="redesign/heading-18/bold" color="header-primary" style={{ margin: Spacing.PX_16 }}>
                        {title}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: Spacing.PX_12,
                            width: "92%"
                        }}
                    >
                        <Cell
                            label="None"
                            uri={undefined}
                            isSelected={!selectedSku}
                            onPress={() => setSelectedSku(undefined)}
                        />
                        {items.map(item => (
                            <Cell
                                key={item.id}
                                label={getLabel(item.config)}
                                uri={getPreviewUri(item.config)}
                                isSelected={item.skuId === selectedSku}
                                onPress={() => setSelectedSku(item.skuId)}
                            />
                        ))}
                    </View>
                </View>
            </BottomSheetScrollView>
            <Button
                text="Apply"
                textStyle={{ fontSize: 16 }}
                onPress={() => onSelect(selected)}
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    left: 0,
                    height: 48,
                    marginHorizontal: 36,
                    marginBottom: Spacing.PX_48,
                    borderRadius: Radius.round
                }}
            />
        </BottomSheet>
    );
}

function Cell({ label, uri, isSelected, onPress }: { label: string; uri: string | undefined; isSelected: boolean; onPress: () => void }) {
    return (
        <PressableOpacity
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={onPress}
            style={{
                width: CELL,
                alignItems: "center",
                padding: 4,
                borderRadius: Radius.sm,
                borderWidth: 2,
                borderColor: isSelected ? "#FFFFFF" : "transparent"
            }}
        >
            <View style={{ width: CELL - 16, height: CELL - 16, borderRadius: Radius.sm, overflow: "hidden", backgroundColor: "#2B2D31" }}>
                {uri
                    ? <Image source={{ uri }} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
                    : null}
            </View>
            <Text variant="text-xs/medium" color="header-secondary" style={{ marginTop: 4 }} numberOfLines={1}>
                {label}
            </Text>
        </PressableOpacity>
    );
}
