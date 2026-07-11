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
                        label="Show NSFW"
                        subLabel="Include NSFW gifs in the picker. On by default here, does not change the website."
                        value={get("nsfw", true)}
                        onValueChange={(v: boolean) => { set("nsfw", v); forceUpdate(); }}
                    />
                </TableRowGroup>
            </Stack>
        </ScrollView>
    );
}
