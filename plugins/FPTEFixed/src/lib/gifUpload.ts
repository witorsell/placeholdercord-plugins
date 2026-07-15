export interface GifUploadDeps {
    ensurePrivateChannel: (userId: string) => Promise<string>;
    uploadFile: (channelId: string, filename: string, mimeType: string, base64DataUri: string) => Promise<{ id: string; filename: string; uploadedFilename: string; }>;
    sendMessage: (channelId: string, message: { attachments: Array<{ id: string; filename: string; uploaded_filename: string; }>; }) => Promise<{ id: string; }>;
}

/**
 * Uploads a GIF to the current user's own Message-Yourself DM and returns the
 * channel/message id pair needed to build its permanent CDN URL. Deps are
 * injected so this stays unit-testable without the real Discord runtime.
 */
export function uploadGifToSelfDM(userId: string, filename: string, base64DataUri: string, deps: GifUploadDeps): Promise<{ channelId: string; messageId: string; }> {
    return deps.ensurePrivateChannel(userId).then(channelId =>
        deps.uploadFile(channelId, filename, "image/gif", base64DataUri).then(uploaded =>
            deps.sendMessage(channelId, {
                attachments: [{
                    id: uploaded.id,
                    filename: uploaded.filename,
                    uploaded_filename: uploaded.uploadedFilename
                }]
            }).then(message => ({ channelId, messageId: message.id }))
        )
    );
}
