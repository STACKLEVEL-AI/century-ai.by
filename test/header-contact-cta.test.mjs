import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const headerPath = new URL("../src/components/site/StickyHeader.tsx", import.meta.url);
const copyPath = new URL("../src/lib/home-i18n.ts", import.meta.url);

test("header contact CTA links to the footer contacts", async () => {
  const [header, copy] = await Promise.all([
    readFile(headerPath, "utf8"),
    readFile(copyPath, "utf8"),
  ]);

  assert.match(header, /import \{ ActionLink \} from "@\/components\/site\/ActionLink"/);
  assert.match(header, /href="\/#contacts"/);
  assert.match(header, /trackingLabel="header_contact"/);
  assert.match(header, /\{copy\.contact\}/);
  assert.match(copy, /contact: "Связаться"/);
  assert.match(copy, /contact: "Contact us"/);
});
