import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { verifyPublicMedia } from "../scripts/verify-public-media.mjs";

test("all public media files are real assets, not LFS pointers", async () => {
  const result = await verifyPublicMedia();

  assert.deepEqual(result.invalid, []);
  assert.ok(result.checked > 0);
});

test("Open Graph preview is a white canvas with the centered black Century logo", async () => {
  const previewPath = new URL("../public/og/century-ai-preview.png", import.meta.url);
  const [contents, site] = await Promise.all([
    readFile(previewPath),
    readFile(new URL("../src/lib/site.ts", import.meta.url), "utf8"),
  ]);

  assert.deepEqual(contents.subarray(0, 8), Buffer.from("89504e470d0a1a0a", "hex"));
  assert.equal(contents.readUInt32BE(16), 1200);
  assert.equal(contents.readUInt32BE(20), 630);
  assert.ok(contents.length > 10_000);
  assert.match(site, /OG_IMAGE_PATH = "\/og\/century-ai-preview\.png"/);
});
