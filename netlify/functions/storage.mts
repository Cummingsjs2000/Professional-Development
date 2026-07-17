// This function is the storage backend for the PD course site.
// It gives the page's fetch() calls somewhere to talk to, and uses
// Netlify Blobs (Netlify's built-in key-value store) to actually
// persist the data. Netlify provisions Blobs automatically per site —
// there's nothing to configure in the dashboard for this to work.
//
// Endpoints (all under /.netlify/functions/storage):
//   GET    ?key=foo            -> { value: "..." | null }
//   GET    ?prefix=foo:        -> { keys: ["foo:1", "foo:2", ...] }
//   POST    { key, value }     -> { ok: true }
//   DELETE ?key=foo            -> { ok: true }

import { getStore } from "@netlify/blobs";

const STORE_NAME = "pd_course_data";

export default async (req: Request) => {
  const store = getStore(STORE_NAME);
  const url = new URL(req.url);

  try {
    if (req.method === "GET") {
      const prefix = url.searchParams.get("prefix");
      if (prefix !== null) {
        const { blobs } = await store.list({ prefix });
        return json({ keys: blobs.map((b) => b.key) });
      }
      const key = url.searchParams.get("key");
      if (!key) return json({ error: "Missing key" }, 400);
      const value = await store.get(key);
      return json({ value: value === null ? null : value });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { key, value } = body || {};
      if (!key) return json({ error: "Missing key" }, 400);
      await store.set(key, String(value ?? ""));
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const key = url.searchParams.get("key");
      if (!key) return json({ error: "Missing key" }, 400);
      await store.delete(key);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("storage function error:", err);
    return json({ error: "Storage operation failed" }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
