// =====================================================================
// A-Precision — Claude proxy (Supabase Edge Function)
//
// Holds the Anthropic API key server-side so it never reaches the browser.
// The app posts the same JSON body it would send to Anthropic's Messages
// API; this function checks the caller is a signed-in user, forwards the
// request with the secret key, and returns Anthropic's reply unchanged.
//
// Secret required (Dashboard > Edge Functions > Secrets):
//   ANTHROPIC_API_KEY   an Anthropic API key (sk-ant-...)
//
// SUPABASE_URL and SUPABASE_ANON_KEY are normally provided by Supabase; the
// fallbacks are the project's public URL and publishable key (not secrets),
// for projects on the newer key format where SUPABASE_ANON_KEY isn't set.
// =====================================================================

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
// Read per request so a changed secret takes effect without waiting for the worker to restart.
// Pasted secrets often carry stray whitespace, line breaks or quote marks.
function apiKey(): string {
  return (Deno.env.get("ANTHROPIC_API_KEY") ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
}
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://gcdkxapepawiixyusjnu.supabase.co";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "sb_publishable_tb77mPEA7LCKq4cQNT2W9Q_BKZtBi7P";
const MAX_TOKENS_CAP = 16000;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Errors use Anthropic's shape ({ error: { message } }) so the app's existing
// error handling shows them without any special cases.
function fail(message: string, status: number): Response {
  return new Response(JSON.stringify({ type: "error", error: { type: "proxy_error", message } }), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// The gateway's JWT check would also accept the project's anon key, so confirm
// the token belongs to a real signed-in user before spending API credit.
async function isSignedInUser(req: Request): Promise<boolean> {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ") || !SUPABASE_URL) return false;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: auth, apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return false;
  const user = await res.json().catch(() => null);
  return !!user?.id;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return fail("Use POST.", 405);
  const API_KEY = apiKey();
  if (!API_KEY) return fail("AI is not set up yet: the ANTHROPIC_API_KEY secret is missing in Supabase.", 500);
  if (!(await isSignedInUser(req))) return fail("Please sign in again to use AI features.", 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_e) {
    return fail("Request body was not valid JSON.", 400);
  }
  if (typeof body.model !== "string" || !body.model.startsWith("claude-")) {
    return fail("Unknown model.", 400);
  }
  if (!Array.isArray(body.messages)) return fail("Missing messages.", 400);
  body.max_tokens = Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_CAP);
  delete body.stream;

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    // Anthropic rejected the key: show a fingerprint (never the key) so it can be compared with the console.
    if (upstream.status === 401) {
      await upstream.text().catch(() => "");
      const prefix = API_KEY.startsWith("sk-ant-api") ? "sk-ant-api…" : API_KEY.startsWith("sk-ant-admin") ? "sk-ant-admin… (an Admin key, which can't call Claude)" : "an unexpected start (not sk-ant-api…)";
      return fail(`Anthropic rejected the API key stored in Supabase. The stored key starts with ${prefix}, ends …${API_KEY.slice(-4)} and is ${API_KEY.length} characters long. Compare the ending with the key in console.anthropic.com → API Keys.`, 401);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return fail("Could not reach Anthropic: " + String((e as Error)?.message ?? e), 502);
  }
});
