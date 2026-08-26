import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const videoPath = new URL("../public/hero-video/century-main-visual.mp4", import.meta.url);

test("hero video is checked out as a real MP4, not an LFS pointer", async () => {
  const [fileStats, contents] = await Promise.all([stat(videoPath), readFile(videoPath)]);

  assert.ok(fileStats.size > 1_000_000);
  assert.notEqual(contents.subarray(0, 40).toString("utf8"), "version https://git-lfs.github.com/spec/v1");
  assert.equal(contents.subarray(4, 8).toString("ascii"), "ftyp");
});
