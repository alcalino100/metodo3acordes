// In-memory cache for recent events
const memoryEvents = [];
const MAX_MEMORY_EVENTS = 200;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        // keep as is
      }
    }

    if (!payload?.type) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const eventRecord = {
      id:
        payload.eventId ||
        `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: payload.type,
      ts: Date.now(),
      visitorId: payload.visitorId || null,
      sessionId: payload.sessionId || null,
      url: payload.url || null,
      referrer: payload.referrer || null,
      landing: payload.landing || null,
      utms: payload.utms || {},
      clickIds: payload.clickIds || {},
      screen: payload.screen || null,
      lang: payload.lang || null,
      extra: payload.extra || null,
      clientIp:
        req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
    };

    // 1. In-memory append
    memoryEvents.unshift(eventRecord);
    if (memoryEvents.length > MAX_MEMORY_EVENTS) {
      memoryEvents.length = MAX_MEMORY_EVENTS;
    }

    // 2. Upstash / Vercel KV persistence if environment variables exist
    const kvUrl =
      process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken =
      process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (kvUrl && kvToken) {
      try {
        await fetch(
          `${kvUrl}/lpush/events:metodo3acordes/${encodeURIComponent(JSON.stringify(eventRecord))}`,
          {
            headers: { Authorization: `Bearer ${kvToken}` },
          },
        );
        await fetch(`${kvUrl}/ltrim/events:metodo3acordes/0/499`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
      } catch (kvErr) {
        console.warn("KV storage warning:", kvErr);
      }
    }

    return res.status(200).json({ ok: true, id: eventRecord.id });
  } catch (err) {
    console.error("Collector error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { memoryEvents };
