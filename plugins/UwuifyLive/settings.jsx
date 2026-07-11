import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import renderSimpleSettings from "./common/ui/SettingsBuilder.jsx";

export default function Settings() {
	useProxy(storage);
	return (
		<ReactNative.ScrollView style={{ flex: 1 }}>
			{renderSimpleSettings(
				storage,
				[
					{
						label: "Add faces",
						type: "number",
						storage_path: "settings.uwuifier.spaces.faces",
					},
					{
						label: "Add actions",
						type: "number",
						storage_path: "settings.uwuifier.spaces.actions",
					},
					{
						label: "Add stutters",
						type: "number",
						storage_path: "settings.uwuifier.spaces.stutters",
					},
					{
						label: "Add words",
						type: "number",
						storage_path: "settings.uwuifier.words",
					},
					{
						label: "Add exclamations",
						type: "number",
						storage_path: "settings.uwuifier.exclamations",
					},
					{
						type: "spacer",
						style: { height: 5 },
					},
					{
						label: "Convert message before sending",
						type: "toggle",
						storage_path: "settings.convert_messages",
					},
				],
			)}
		</ReactNative.ScrollView>
	);
}
