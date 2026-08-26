import test from "node:test";
import assert from "node:assert/strict";
import { verifyPublicMedia } from "../scripts/verify-public-media.mjs";

test("all public media files are real assets, not LFS pointers", async () => {
  const result = await verifyPublicMedia();

  assert.deepEqual(result.invalid, []);
  assert.ok(result.checked > 0);
});
