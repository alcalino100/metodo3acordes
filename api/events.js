import { memoryEvents } from "./collect.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let events = [];

    // 1. Check if Vercel KV / Upstash is configured
    const kvUrl =
      process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken =
      process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (kvUrl && kvToken) {
      try {
        const kvRes = await fetch(
          `${kvUrl}/lrange/events:metodo3acordes/0/200`,
          {
            headers: { Authorization: `Bearer ${kvToken}` },
          },
        );
        const kvData = await kvRes.json();
        if (kvData && Array.isArray(kvData.result)) {
          events = kvData.result
            .map((item) => {
              try {
                return typeof item === "string" ? JSON.parse(item) : item;
              } catch {
                return null;
              }
            })
            .filter(Boolean);
        }
      } catch (kvErr) {
        console.warn("KV fetch warning:", kvErr);
      }
    }

    // 2. Fallback to memoryEvents if KV returned nothing
    if (events.length === 0 && memoryEvents && memoryEvents.length > 0) {
      events = [...memoryEvents];
    }

    return res.status(200).json({ ok: true, events });
  } catch (err) {
    console.error("Events fetch error:", err);
    return res.status(500).json({ error: "Internal server error", events: [] });
  }
}
