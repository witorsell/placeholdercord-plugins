import { plugin } from "@vendetta";
import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";

const { ScrollView } = findByProps("ScrollView");
const { TableRowGroup, TableSwitchRow, Stack } = findByProps("TableRowGroup", "TableSwitchRow", "Stack");

const get = (key: string, fallback: any) => plugin.storage[key] ?? fallback;
const set = (key: string, value: any) => { plugin.storage[key] = value; };

export default function BringBackGifLibrarySettings() {
    const [, forceUpdate] = React.useReducer((x: number) => ~x, 0);

    return (
        <ScrollView style={{ flex: 1 }}>
            <Stack style={{ padding: 16 }} spacing={16}>
                <TableRowGroup title="giflibrary.site">
                    <TableSwitchRow
                        label="Suggestive"
                        subLabel="Include gifs tagged suggestive. On by default here, does not change the website."
                        value={get("nsfwSuggestive", true)}
                        onValueChange={(v: boolean) => { set("nsfwSuggestive", v); forceUpdate(); }}
                    />
                    <TableSwitchRow
                        label="Offensive"
                        subLabel="Include gifs tagged offensive."
                        value={get("nsfwOffensive", true)}
                        onValueChange={(v: boolean) => { set("nsfwOffensive", v); forceUpdate(); }}
                    />
                    <TableSwitchRow
                        label="Sexual"
                        subLabel="Include gifs tagged sexual."
                        value={get("nsfwSexual", true)}
                        onValueChange={(v: boolean) => { set("nsfwSexual", v); forceUpdate(); }}
                    />
                    <TableSwitchRow
                        label="Other NSFW"
                        subLabel="Include gifs only tagged with the generic nsfw catch-all."
                        value={get("nsfwOther", true)}
                        onValueChange={(v: boolean) => { set("nsfwOther", v); forceUpdate(); }}
                    />
                </TableRowGroup>
            </Stack>
        </ScrollView>
    );
}
