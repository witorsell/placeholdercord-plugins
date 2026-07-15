import test from "node:test";
import assert from "node:assert";
import { uploadGifToSelfDM, type GifUploadDeps } from "../src/lib/gifUpload";

test("uploads in order and returns channelId/messageId on success", async () => {
    const calls: string[] = [];
    const deps: GifUploadDeps = {
        ensurePrivateChannel: (userId) => { calls.push(`ensure:${userId}`); return Promise.resolve("chan1"); },
        uploadFile: (channelId, filename) => { calls.push(`upload:${channelId}:${filename}`); return Promise.resolve({ id: "att1", filename: "a.gif", uploadedFilename: "uploaded/a.gif" }); },
        sendMessage: (channelId, message) => {
            calls.push(`send:${channelId}`);
            assert.deepEqual(message.attachments, [{ id: "att1", filename: "a.gif", uploaded_filename: "uploaded/a.gif" }]);
            return Promise.resolve({ id: "msg1" });
        }
    };
    const result = await uploadGifToSelfDM("user1", "a.gif", "data:image/gif;base64,AAAA", deps);
    assert.deepEqual(result, { channelId: "chan1", messageId: "msg1" });
    assert.deepEqual(calls, ["ensure:user1", "upload:chan1:a.gif", "send:chan1"]);
});

test("propagates ensurePrivateChannel rejection without calling upload or send", async () => {
    let uploadCalled = false;
    let sendCalled = false;
    const deps: GifUploadDeps = {
        ensurePrivateChannel: () => Promise.reject(new Error("channel failed")),
        uploadFile: () => { uploadCalled = true; return Promise.resolve({ id: "x", filename: "x", uploadedFilename: "x" }); },
        sendMessage: () => { sendCalled = true; return Promise.resolve({ id: "x" }); }
    };
    await assert.rejects(() => uploadGifToSelfDM("user1", "a.gif", "data:...", deps), /channel failed/);
    assert.equal(uploadCalled, false);
    assert.equal(sendCalled, false);
});

test("propagates uploadFile rejection without calling send", async () => {
    let sendCalled = false;
    const deps: GifUploadDeps = {
        ensurePrivateChannel: () => Promise.resolve("chan1"),
        uploadFile: () => Promise.reject(new Error("upload failed")),
        sendMessage: () => { sendCalled = true; return Promise.resolve({ id: "x" }); }
    };
    await assert.rejects(() => uploadGifToSelfDM("user1", "a.gif", "data:...", deps), /upload failed/);
    assert.equal(sendCalled, false);
});

test("propagates sendMessage rejection", async () => {
    const deps: GifUploadDeps = {
        ensurePrivateChannel: () => Promise.resolve("chan1"),
        uploadFile: () => Promise.resolve({ id: "att1", filename: "a.gif", uploadedFilename: "uploaded/a.gif" }),
        sendMessage: () => Promise.reject(new Error("send failed"))
    };
    await assert.rejects(() => uploadGifToSelfDM("user1", "a.gif", "data:...", deps), /send failed/);
});

console.log("gifUpload tests defined, run via node:test runner");
