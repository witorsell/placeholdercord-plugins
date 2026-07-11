import { findByProps } from "@vendetta/metro";
import type { ComponentType } from "react";
import type { ColorValue, ImageProps } from "react-native";

export type SizeKey = "EXTRA_SMALL_10" | "EXTRA_SMALL" | "SMALL" | "SMALL_20" | "MEDIUM" | "LARGE" | "CUSTOM" | "REFRESH_SMALL_16" | "SMALL_14";

export interface IconProps extends Pick<ImageProps, "accessible" | "accessibilityLabel" | "resizeMode" | "source" | "style"> {
    size?: string | undefined;
    color?: ColorValue | undefined;
    disableColor?: boolean | undefined;
}

const iconModule = findByProps("IconSizes") as Record<string, any> | undefined;

const IconComponent: ComponentType<IconProps> =
    iconModule?.default ?? iconModule?.Icon ?? (() => null);

// Discord dropped the `.Sizes` static off the Icon component; the size enum now
// lives as the sibling `IconSizes` export. Fall back to the old static, then to an
// empty map, so `Icon.Sizes.LARGE` is at worst `undefined` (no size) and never throws.
const Sizes: Record<SizeKey, string> =
    iconModule?.IconSizes
    ?? (IconComponent as { Sizes?: Record<SizeKey, string> }).Sizes
    ?? ({} as Record<SizeKey, string>);

export const Icon: ComponentType<IconProps> & {
    Sizes: Record<SizeKey, string>;
} = Object.assign(IconComponent, { Sizes });
