/* eslint-disable @stylistic/brace-style */

/** The FPTE delimiter codepoint (codepoint of zero-width space). */
const DELIMITER_CODEPOINT = 0x200B;
/** The FPTE delimiter (zero-width space). */
const DELIMITER = String.fromCodePoint(DELIMITER_CODEPOINT);
/** The FPTE radix (number of default-ignorable codepoints in the SSP plane). */
const RADIX = 0x1000;
/** The FPTE starting codepoint (first codepoint in the SSP plane). */
const STARTING_CODEPOINT = 0xE0000;
/** The FPTE ending codepoint (last default-ignorable codepoint in the SSP plane). */
const ENDING_CODEPOINT = STARTING_CODEPOINT + RADIX - 1;

/**
 * Builds a theme color string in the legacy format: `[#primary,#accent]`, where primary and accent are
 * 24-bit colors as base-16 strings, with each codepoint of the string offset by +{@link STARTING_CODEPOINT}.
 * @param primary The 24-bit primary color.
 * @param accent The 24-bit accent color.
 * @returns The built legacy-format theme color string.
 */
export function encodeColorsLegacy(primary: number, accent: number) {
    return String.fromCodePoint(...[...`[#${primary.toString(16)},#${accent.toString(16)}]`]
        .map(c => c.codePointAt(0)! + STARTING_CODEPOINT));
}

/**
 * Extracts the theme colors from a legacy-format string.
 * @param str The legacy-format string to extract the theme colors from.
 * @returns The profile theme colors. Colors will be -1 if not found.
 * @see {@link encodeColorsLegacy}
 */
export function decodeColorsLegacy(str: string): [primaryColor: number, accentColor: number] {
    const [primary, accent] = str.matchAll(/(?<=#)[\dA-Fa-f]{1,6}/g);
    return [primary ? parseInt(primary[0], 16) : -1, accent ? parseInt(accent[0], 16) : -1];
}

/**
 * Converts a 24-bit color to a base-{@link RADIX} string with each codepoint offset by +{@link STARTING_CODEPOINT}.
 * @param color The 24-bit color to be converted.
 * @returns The converted base-{@link RADIX} string with +{@link STARTING_CODEPOINT} offset.
 */
export function encodeColor(color: number) {
    if (color === 0) return String.fromCodePoint(STARTING_CODEPOINT);
    let str = "";
    for (; color > 0; color = Math.trunc(color / RADIX))
        str = String.fromCodePoint(color % RADIX + STARTING_CODEPOINT) + str;
    return str;
}

/**
 * Converts a no-offset base-{@link RADIX} string to a 24-bit color.
 * @param str The no-offset base-{@link RADIX} string to be converted.
 * @returns The converted 24-bit color.
 *          Will be -1 if `str` is empty and -2 if the color is greater than the maximum 24-bit color, 0xFFFFFF.
 */
export function decodeColor(str: string) {
    if (str === "") return -1;
    let color = 0;
    for (let i = 0; i < str.length; i++) {
        if (color > 0xFFF_FFF) return -2;
        color += str.codePointAt(i)! * RADIX ** (str.length - 1 - i);
    }
    return color;
}

/**
 * Converts an effect ID to a base-{@link RADIX} string with each code point offset by +{@link STARTING_CODEPOINT}.
 * @param id The effect ID to be converted.
 * @returns The converted base-{@link RADIX} string with +{@link STARTING_CODEPOINT} offset.
 */
export function encodeEffect(id: bigint) {
    if (id === 0n) return String.fromCodePoint(STARTING_CODEPOINT);
    let str = "";
    for (; id > 0n; id /= BigInt(RADIX))
        str = String.fromCodePoint(Number(id % BigInt(RADIX)) + STARTING_CODEPOINT) + str;
    return str;
}

/**
 * Converts a no-offset base-{@link RADIX} string to an effect ID.
 * @param str The no-offset base-{@link RADIX} string to be converted.
 * @returns The converted effect ID.
 *          Will be -1n if `str` is empty and -2n if the color is greater than the maximum effect ID.
 */
export function decodeEffect(str: string) {
    if (str === "") return -1n;
    let id = 0n;
    for (let i = 0; i < str.length; i++) {
        if (id >= 10_000_000_000_000_000_000n) return -2n;
        id += BigInt(str.codePointAt(i)!) * BigInt(RADIX) ** BigInt(str.length - 1 - i);
    }
    return id;
}

/** Generic collectible-sku codecs. Same base-{@link RADIX} scheme as the effect id. */
export const encodeSku = encodeEffect;
export const decodeSku = decodeEffect;

/**
 * Builds a FPTE string containing the given colors, effect, decoration, and nameplate skus. The collectible
 * fields are appended after the colors in fixed slots (effect, decoration, nameplate) so that older clients,
 * which stop parsing after the effect, ignore the new trailing fields.
 * @param primary The primary profile theme color. Must be negative if unset.
 * @param accent The accent profile theme color. Must be negative if unset.
 * @param effect The profile effect sku. Empty if unset.
 * @param decoration The avatar decoration sku. Empty if unset.
 * @param nameplate The nameplate sku. Empty if unset.
 * @param legacy Whether the primary and accent colors should be legacy encoded.
 * @returns The built FPTE string. Empty if everything is unset.
 */
export function buildFPTE(primary: number, accent: number, effect: string, decoration: string, nameplate: string, legacy: boolean) {
    const enc = (sku: string) => sku ? encodeSku(BigInt(sku)) : "";
    const collectibles = [enc(effect), enc(decoration), enc(nameplate)];

    let fields: string[];
    if (legacy && (primary >= 0 || accent >= 0)) {
        // Legacy strings carry both colors as a single field, even when identical.
        const p = primary >= 0 ? primary : accent;
        const a = primary >= 0 ? (accent >= 0 ? accent : primary) : accent;
        // Colors in slot 0, effect/decoration/nameplate in slots 1/2/3.
        fields = [encodeColorsLegacy(p, a), ...collectibles];
    }
    else if (!legacy && primary >= 0 && accent >= 0 && primary !== accent) {
        // Two distinct colors in slots 0/1, collectibles in slots 2/3/4.
        fields = [encodeColor(primary), encodeColor(accent), ...collectibles];
    }
    else {
        // One color (or none) in slot 0, empty slot 1, collectibles in slots 2/3/4.
        const color = primary >= 0 ? primary : accent;
        fields = [color >= 0 ? encodeColor(color) : "", "", ...collectibles];
    }

    // Drop trailing empty fields so unset fields never emit dangling delimiters.
    while (fields.length && fields[fields.length - 1] === "") fields.pop();

    return fields.join(DELIMITER);
}

/**
 * Extracts the delimiter-separated values of the first FPTE substring in a string.
 * @param str The string to be searched for a FPTE substring.
 * @returns An array of the found FPTE substring's extracted values. Values will be empty if not found.
 */
export function extractFPTE(str: string) {
    /** The array of extracted FPTE values to be returned. Slots: color(s), effect, decoration, nameplate. */
    const fpte: [string, string, string, string, string] = ["", "", "", "", ""];
    /** The current index of {@link fpte} getting extracted. */
    let i = 0;

    for (const char of str) {
        /** The current character's codepoint. */
        const cp = char.codePointAt(0)!;

        // If the current character is a delimiter, then the current index of fpte has been completed.
        if (cp === DELIMITER_CODEPOINT) {
            // If the current index of fpte is the last, then the extraction is done.
            if (i >= 4) break;
            i++; // Start extracting the next index of fpte.
        }
        // If the current character is not a delimiter but a valid FPTE
        // character, it will be added to the current index of fpte.
        else if (cp >= STARTING_CODEPOINT && cp <= ENDING_CODEPOINT)
            fpte[i]! += String.fromCodePoint(cp - STARTING_CODEPOINT);
        // If an FPTE string has been found and its end has been reached, then the extraction is done.
        else if (i > 0 || fpte[0]) break;
    }

    return fpte;
}

/**
 * Detects if a string contains an FPTE substring based on the presence of
 * FPTE codepoints or the FPTE delimiter.
 * @param str The string to check.
 * @returns True if the string contains FPTE codepoints or delimiters, false otherwise.
 */
export function hasFPTE(str: string): boolean {
    for (const char of str) {
        const cp = char.codePointAt(0)!;
        if (
            (cp >= STARTING_CODEPOINT && cp <= ENDING_CODEPOINT) || // FPTE codepoint range
            cp === DELIMITER_CODEPOINT                               // delimiter zero-width space
        ) {
            return true;
        }
    }
    return false;
}

export function stripFPTE(str: string) {
        return [...str]
            .filter(ch => {
                const cp = ch.codePointAt(0)!;
                return (cp < STARTING_CODEPOINT || cp > ENDING_CODEPOINT) && cp !== DELIMITER_CODEPOINT;
            })
            .join("")
            .trim();
    }