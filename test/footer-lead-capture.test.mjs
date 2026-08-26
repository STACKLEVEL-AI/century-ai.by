import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentPath = new URL("../src/components/site/FooterLeadCapture.tsx", import.meta.url);

test("footer keeps direct contacts without a hosted lead form", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.doesNotMatch(source, /<form/);
  assert.doesNotMatch(source, /fetch\(['"]\/api\/contact['"]/);
  assert.match(source, /footer-lead__contacts/);
  assert.match(source, /footer-copyright__inner/);
  assert.match(source, /2026 Century/);
  assert.match(source, /Все права защищены/);
});
