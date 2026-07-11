import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { getTranslation } from "./translations.js";
import { matchesSearch } from "./persist.js";
import ItemWithRemove from "./common/ui/ItemWithRemove.jsx";
import { findByStoreName, findByProps } from "@vendetta/metro";
let UserStore, UncachedUserManager, Profiles;
export default (props) => {
	UserStore ??= findByStoreName("UserStore");
	UncachedUserManager ??= findByProps("fetchProfile", "getUser", "setFlag");
	Profiles ??= findByProps("showUserProfile");
	async function openProfile(userId) {
		const show = Profiles.showUserProfile;

		UserStore.getUser(userId) ? show({ userId }) : UncachedUserManager.getUser(userId).then(({ id }) => show({ userId: id }));
	}

	useProxy(storage);
	const [users, setUsers] = React.useState(storage["ignore"]["users"]);

	const [saved, setSaved] = React.useState(Array.isArray(storage.saved) ? storage.saved : []);
	const [query, setQuery] = React.useState("");
	const syncSaved = () => setSaved([...(storage.saved ?? [])]);
	const toggleLock = (id) => {
		const arr = storage.saved ?? [];
		const rec = arr.find((r) => r.id === id);
		if (rec) rec.locked = !rec.locked;
		storage.saved = [...arr];
		syncSaved();
	};
	const removeSaved = (id) => {
		storage.saved = (storage.saved ?? []).filter((r) => r.id !== id);
		syncSaved();
	};
	const clearUnlocked = () => {
		storage.saved = (storage.saved ?? []).filter((r) => r.locked);
		syncSaved();
	};
	const lockedCount = saved.filter((r) => r.locked).length;
	const visible = saved.filter((r) => matchesSearch(r, query)).slice().reverse();

	const handleRemoveUser = (userId) => {
		const newArr = users.filter((id) => id !== userId);
		storage["ignore"].users = newArr;
		setUsers(newArr);
	};
	const handleClearUsers = () => {
		storage["ignore"].users = [];
		setUsers([]);
	};
	let uncached = 0;

	return (
		<ReactNative.ScrollView style={{ flex: 1 }}>
			<Forms.FormSection title={getTranslation("settings.titles.settings")} titleStyleType="no_border">
				<Forms.FormRow label={getTranslation("settings.showTimestamps")} trailing={<Forms.FormSwitch value={storage.timestamps} onValueChange={(v) => (storage.timestamps = v)} />} />
				<Forms.FormRow label={getTranslation("settings.ewTimestampFormat")} trailing={<Forms.FormSwitch value={storage["ew"]} onValueChange={(v) => (storage.ew = v)} />} />
				<Forms.FormDivider />
				<Forms.FormRow label={getTranslation("settings.youDeletedItWarning")} />
			</Forms.FormSection>
			<Forms.FormSection title={getTranslation("settings.titles.filters")}>
				<Forms.FormRow label={getTranslation("settings.ignoreBots")} trailing={<Forms.FormSwitch value={storage["ignore"].bots} onValueChange={(value) => (storage["ignore"].bots = value)} />} />
				<Forms.FormRow
					label={getTranslation("settings.clearUsersLabel", true)?.make?.(users.length)}
					trailing={<Forms.FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />}
					onPress={() => {
						if (users.length !== 0)
							showConfirmationAlert({
								title: getTranslation("settings.confirmClear.title"),
								content: getTranslation("settings.confirmClear.description", true)?.make?.(users.length),
								confirmText: getTranslation("settings.confirmClear.yes"),
								cancelText: getTranslation("settings.confirmClear.no"),
								confirmColor: "brand",
								onConfirm: handleClearUsers,
							});
					}}
				/>
				<ReactNative.ScrollView style={{ flex: 1, gap: 3, marginLeft: 15 }}>
					{users.map((id) => {
						const User = UserStore.getUser(id) ?? {};
						let pfp = User?.getAvatarURL?.(null,26)?.replace?.(/\.(gif|webp)/, ".png");
						if (!pfp) {
							pfp = "https://cdn.discordapp.com/embed/avatars/1.png?size=48";
							User.username = `${id} Uncached`;
							User.discriminator = "0";
							if (uncached === 0) User.username += ", press the avatar";
							uncached++;
						}

						return (
							<ItemWithRemove
								imageSource={{ uri: pfp }}
								onImagePress={() => {
									openProfile(id);
								}}
								onRemove={() => handleRemoveUser(id)}
								label={User.username + (User.discriminator == 0 ? "" : `#${User.discriminator}`)}
								labelRemove={getTranslation("settings.removeUserButton")}
							/>
						);
					})}
				</ReactNative.ScrollView>
				<Forms.FormDivider />
				<Forms.FormRow label={getTranslation("settings.addUsersInfo")} />
			</Forms.FormSection>
			<Forms.FormSection title="Saved deleted messages">
				<Forms.FormRow label={`${saved.length} saved (${lockedCount} locked)`} />
				<ReactNative.TextInput
					placeholder="Search by message id, user id, username, or text"
					placeholderTextColor="#888"
					value={query}
					onChangeText={setQuery}
					style={{ color: "#fff", marginHorizontal: 15, marginBottom: 8, paddingVertical: 6, borderBottomWidth: 1, borderColor: "#444" }}
				/>
				<Forms.FormRow
					label="Clear all (keeps locked)"
					trailing={<Forms.FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />}
					onPress={() => {
						const unlocked = saved.length - lockedCount;
						if (unlocked !== 0)
							showConfirmationAlert({
								title: "Clear saved messages",
								content: `Remove ${unlocked} unlocked saved messages? Locked ones stay.`,
								confirmText: "Clear",
								cancelText: "Cancel",
								confirmColor: "red",
								onConfirm: clearUnlocked,
							});
					}}
				/>
				<ReactNative.ScrollView style={{ flex: 1, maxHeight: 460 }}>
					{visible.map((r) => {
						const fullUser = UserStore?.getUser?.(r.author?.id);
						const displayName = r.author?.globalName ?? fullUser?.globalName ?? r.author?.username ?? fullUser?.username ?? "unknown";
						const handleName = r.author?.username ?? fullUser?.username;
						const handle = handleName ? `@${handleName}` : "";
						const avatar = r.author?.avatarUrl ?? fullUser?.getAvatarURL?.(null, 64) ?? "https://cdn.discordapp.com/embed/avatars/0.png";
						return (
							<ReactNative.View key={r.id} style={{ flexDirection: "row", paddingVertical: 8, paddingHorizontal: 14, alignItems: "flex-start" }}>
								<ReactNative.Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
								<ReactNative.View style={{ flex: 1 }}>
									<ReactNative.View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
										<ReactNative.Text style={{ color: "#f2f3f5", fontWeight: "600", marginRight: 6 }}>{displayName}</ReactNative.Text>
										{handle ? <ReactNative.Text style={{ color: "#949ba4", fontSize: 12, marginRight: 6 }}>{handle}</ReactNative.Text> : null}
										<ReactNative.Text style={{ color: "#949ba4", fontSize: 11 }}>{new Date(r.timestamp).toLocaleString()}</ReactNative.Text>
									</ReactNative.View>
									{r.content ? <ReactNative.Text style={{ color: "#dbdee1", marginTop: 2 }}>{r.content}</ReactNative.Text> : null}
									{(r.attachments ?? []).map((url, i) => (
										<ReactNative.Image key={i} source={{ uri: url }} resizeMode="cover" style={{ width: 180, height: 130, borderRadius: 8, marginTop: 4 }} />
									))}
									{!r.content && !(r.attachments?.length) ? <ReactNative.Text style={{ color: "#80848e", fontStyle: "italic", marginTop: 2 }}>[no content]</ReactNative.Text> : null}
									<ReactNative.Text style={{ color: "#6d7178", fontSize: 10, marginTop: 3 }}>#{r.channelName}</ReactNative.Text>
								</ReactNative.View>
								<ReactNative.View style={{ alignItems: "center", marginLeft: 6, gap: 10 }}>
									<ReactNative.Pressable onPress={() => toggleLock(r.id)} hitSlop={8}>
										<ReactNative.Text style={{ fontSize: 18, opacity: r.locked ? 1 : 0.4 }}>{r.locked ? "🔒" : "🔓"}</ReactNative.Text>
									</ReactNative.Pressable>
									<ReactNative.Pressable onPress={() => removeSaved(r.id)} hitSlop={8}>
										<Forms.FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />
									</ReactNative.Pressable>
								</ReactNative.View>
							</ReactNative.View>
						);
					})}
				</ReactNative.ScrollView>
			</Forms.FormSection>
		</ReactNative.ScrollView>
	);
};
