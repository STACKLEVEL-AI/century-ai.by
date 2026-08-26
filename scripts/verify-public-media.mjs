import { readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MEDIA_EXTENSIONS = new Set([
  ".gif",
  ".jpeg",
  ".jpg",
  ".mp4",
  ".pdf",
  ".png",
  ".svg",
  ".webm",
  ".webp",
]);
const LFS_POINTER_PREFIX = Buffer.from("version https://git-lfs.github.com/spec/v1");

async function collectMediaFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMediaFiles(entryPath)));
    } else if (MEDIA_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

function hasBytesAt(buffer, offset, expected) {
  return buffer.subarray(offset, offset + expected.length).equals(Buffer.from(expected));
}

function mediaError(extension, buffer) {
  if (buffer.length === 0) return "empty file";
  if (buffer.subarray(0, LFS_POINTER_PREFIX.length).equals(LFS_POINTER_PREFIX)) {
    return "Git LFS pointer instead of the real asset";
  }

  const valid =
    extension === ".mp4"
      ? hasBytesAt(buffer, 4, "ftyp")
      : extension === ".webm"
          ? hasBytesAt(buffer, 0, Buffer.from("1a45dfa3", "hex"))
          : extension === ".png"
          ? hasBytesAt(buffer, 0, Buffer.from("89504e470d0a1a0a", "hex")) ||
            hasBytesAt(buffer, 0, Buffer.from("ffd8ff", "hex"))
          : extension === ".jpg" || extension === ".jpeg"
            ? hasBytesAt(buffer, 0, Buffer.from("ffd8ff", "hex"))
            : extension === ".gif"
              ? buffer.subarray(0, 6).toString("ascii").startsWith("GIF8")
              : extension === ".webp"
                ? hasBytesAt(buffer, 0, "RIFF") && hasBytesAt(buffer, 8, "WEBP")
                : extension === ".pdf"
                  ? hasBytesAt(buffer, 0, "%PDF-")
                  : true;

  return valid ? null : `invalid ${extension.slice(1).toUpperCase()} signature`;
}

export async function verifyPublicMedia(publicDirectory = fileURLToPath(new URL("../public", import.meta.url))) {
  const files = await collectMediaFiles(publicDirectory);
  const invalid = [];

  for (const file of files) {
    const extension = extname(file).toLowerCase();
    const contents = await readFile(file);
    const error = mediaError(extension, contents);
    if (error) invalid.push({ file: relative(publicDirectory, file), error });
  }

  return { checked: files.length, invalid };
}

async function main() {
  const result = await verifyPublicMedia();
  if (result.invalid.length > 0) {
    console.error("Invalid public media files:");
    for (const item of result.invalid) console.error(`- ${item.file}: ${item.error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Verified ${result.checked} public media files.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
