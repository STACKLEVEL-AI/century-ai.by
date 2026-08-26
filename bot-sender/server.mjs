import http from "node:http";
import { pathToFileURL } from "node:url";

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const buckets = new Map();
const TELEGRAM_API_BASE_URL = "https://api.telegram.org";

export function siteHostFromUrl(siteUrl) {
  const host = new URL(siteUrl).hostname.toLowerCase();
  if (host !== "century-ai.ru" && host !== "century-ai.by") {
    throw new Error(`Unsupported SITE_URL host: ${host}`);
  }
  return host;
}

function clean(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function normalizeLead(input) {
  const lead = {
    name: clean(input?.name, 160),
    email: clean(input?.email, 320),
    company: clean(input?.company, 240),
    role: clean(input?.role, 240),
    message: clean(input?.message, 2400),
    website: clean(input?.website, 300),
  };

  if (lead.website) return { ok: false, reason: "spam" };
  if (!lead.name || !lead.email) return { ok: false, reason: "name and email are required" };
  if (!/^\S+@\S+\.\S+$/.test(lead.email)) return { ok: false, reason: "invalid email" };

  return { ok: true, lead };
}

export function formatTelegramMessage(siteHost, lead, now = new Date()) {
  const fallback = "не указано";
  return [
    "Новая заявка Century AI",
    "",
    `Сайт: ${siteHost}`,
    `Имя: ${lead.name}`,
    `Email: ${lead.email}`,
    `Компания: ${lead.company || fallback}`,
    `Роль: ${lead.role || fallback}`,
    `Задача: ${lead.message || fallback}`,
    "",
    `Время: ${now.toISOString()}`,
  ].join("\n").slice(0, 4000);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();
  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip, now = Date.now()) {
  const current = buckets.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("request too large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    const error = new Error("invalid json");
    error.statusCode = 400;
    throw error;
  }
}

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

async function sendTelegram(config, chatId, text) {
  const payload = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  };
  if (config.threadId) payload.message_thread_id = config.threadId;

  let lastError = "Telegram request failed";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let response;
    try {
      response = await fetch(`${TELEGRAM_API_BASE_URL}/bot${config.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 350));
        continue;
      }
      throw new Error(lastError);
    }

    if (response.ok) return;

    let body = {};
    try {
      body = await response.json();
    } catch {
      // Ignore malformed Telegram error payloads.
    }
    lastError = body?.description || `Telegram HTTP ${response.status}`;
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === 3) throw new Error(lastError);

    const retryAfter = Number(body?.parameters?.retry_after || 0);
    const delayMs = retryAfter > 0 ? retryAfter * 1000 : attempt * 500;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(lastError);
}

export function loadConfig(env = process.env) {
  const botToken = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = env.TELEGRAM_CHAT_ID?.split(",").map((value) => value.trim()).filter(Boolean) || [];
  const siteUrl = env.SITE_URL?.trim();
  const port = Number(env.PORT || 3001);
  const threadIdRaw = env.TELEGRAM_THREAD_ID?.trim();

  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is required");
  if (!chatIds.length) throw new Error("TELEGRAM_CHAT_ID is required");
  if (!siteUrl) throw new Error("SITE_URL is required");
  if (!Number.isInteger(port) || port <= 0 || port > 65535) throw new Error("PORT is invalid");

  const siteHost = siteHostFromUrl(siteUrl);
  const threadId = threadIdRaw ? Number(threadIdRaw) : undefined;
  if (threadIdRaw && !Number.isInteger(threadId)) throw new Error("TELEGRAM_THREAD_ID is invalid");

  return { botToken, chatIds, siteUrl, siteHost, port, threadId };
}

export function createServer(config) {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/health") return json(res, 200, { ok: true, site: config.siteHost });
      if (req.method !== "POST" || req.url !== "/send") return json(res, 404, { ok: false, error: "not_found" });

      if (isRateLimited(getClientIp(req))) return json(res, 429, { ok: false, error: "rate_limited" });

      const body = await readJson(req);
      const normalized = normalizeLead(body);
      if (!normalized.ok) {
        if (normalized.reason === "spam") return json(res, 200, { ok: true });
        return json(res, 400, { ok: false, error: normalized.reason });
      }

      const text = formatTelegramMessage(config.siteHost, normalized.lead);
      const deliveries = await Promise.allSettled(
        config.chatIds.map((chatId) => sendTelegram(config, chatId, text)),
      );
      const delivered = deliveries.filter((result) => result.status === "fulfilled").length;
      const failed = deliveries.filter((result) => result.status === "rejected");

      if (delivered === 0) {
        const firstFailure = failed[0]?.reason;
        throw firstFailure instanceof Error ? firstFailure : new Error("Telegram delivery failed");
      }
      if (failed.length) console.error(`lead delivered to ${delivered} of ${config.chatIds.length} recipients`);

      return json(res, 200, { ok: true, delivered });
    } catch (error) {
      const statusCode = Number(error?.statusCode || 500);
      if (statusCode >= 500) console.error("lead sender error:", error);
      return json(res, statusCode, {
        ok: false,
        error: statusCode >= 500 ? "telegram_delivery_failed" : String(error?.message || "bad_request"),
      });
    }
  });
}

export function start() {
  const config = loadConfig();
  const server = createServer(config);
  server.listen(config.port, "0.0.0.0", () => {
    console.log(`Century Telegram sender listening on :${config.port} for ${config.siteHost}`);
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) start();
