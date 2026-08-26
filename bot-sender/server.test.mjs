import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  createServer,
  formatTelegramMessage,
  loadConfig,
  normalizeLead,
  siteHostFromUrl,
} from "./server.mjs";

function postLead(server, body) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const request = http.request(
      { host: "127.0.0.1", port: address.port, method: "POST", path: "/send", headers: { "Content-Type": "application/json" } },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve({ statusCode: response.statusCode, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) }));
      },
    );
    request.on("error", reject);
    request.end(JSON.stringify(body));
  });
}

test("siteHostFromUrl distinguishes RU and BY", () => {
  assert.equal(siteHostFromUrl("https://century-ai.ru"), "century-ai.ru");
  assert.equal(siteHostFromUrl("https://century-ai.by/"), "century-ai.by");
  assert.throws(() => siteHostFromUrl("https://example.com"));
});

test("normalizes a valid lead and rejects bad email", () => {
  const valid = normalizeLead({ name: " Ivan ", email: " i@example.com ", company: "Acme" });
  assert.equal(valid.ok, true);
  assert.equal(valid.lead.name, "Ivan");
  assert.equal(valid.lead.email, "i@example.com");
  assert.equal(normalizeLead({ name: "Ivan", email: "bad" }).ok, false);
});

test("honeypot is treated as spam", () => {
  const result = normalizeLead({ name: "Ivan", email: "i@example.com", website: "spam.example" });
  assert.deepEqual(result, { ok: false, reason: "spam" });
});

test("Telegram message contains the server-side site", () => {
  const ruText = formatTelegramMessage(
    "century-ai.ru",
    { name: "Ivan", email: "i@example.com", company: "", role: "", message: "A&B" },
    new Date("2026-08-24T08:00:00.000Z"),
  );
  const byText = formatTelegramMessage(
    "century-ai.by",
    { name: "Alexey", email: "a@example.by", company: "Example BY", role: "CEO", message: "Consultation" },
    new Date("2026-08-24T08:00:00.000Z"),
  );
  assert.match(ruText, /Сайт: century-ai\.ru/);
  assert.match(byText, /Сайт: century-ai\.by/);
  assert.match(ruText, /Задача: A&B/);
  assert.ok(ruText.length <= 4000);
});

test("loadConfig keeps site identity server-side and parses all recipients", () => {
  const config = loadConfig({
    TELEGRAM_BOT_TOKEN: "token",
    TELEGRAM_CHAT_ID: "8562745319, 435948288, 699352926",
    SITE_URL: "https://century-ai.ru",
    PORT: "3001",
  });
  assert.equal(config.siteHost, "century-ai.ru");
  assert.deepEqual(config.chatIds, ["8562745319", "435948288", "699352926"]);
});

test("returns success when at least one recipient accepts a lead", async (t) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (_url, options) => {
    const chatId = JSON.parse(options.body).chat_id;
    calls.push(chatId);
    if (chatId === "435948288") {
      return new Response(JSON.stringify({ ok: false, description: "chat not found" }), { status: 400 });
    }
    return new Response(JSON.stringify({ ok: true, result: {} }), { status: 200 });
  };

  const server = createServer({
    botToken: "token",
    chatIds: ["8562745319", "435948288"],
    siteUrl: "https://century-ai.ru",
    siteHost: "century-ai.ru",
    port: 0,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    globalThis.fetch = originalFetch;
    server.close();
  });

  const result = await postLead(server, { name: "Ivan", email: "i@example.com" });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(calls, ["8562745319", "435948288"]);
});
