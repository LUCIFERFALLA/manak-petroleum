// Supabase Edge Function: notify-enquiry
// Emails zigmagrs@yahoo.in whenever a new row is inserted into public.enquiries.
// Triggered by a Database Webhook (Database -> Webhooks) on INSERT.
//
// Setup (see supabase/EMAIL_SETUP.md):
//   1. Create a free Resend account, verify a sender, create an API key.
//   2. In Supabase: Edge Functions -> create "notify-enquiry", paste this file.
//   3. Add secret:  RESEND_API_KEY = re_xxx   (Edge Functions -> Manage secrets)
//   4. Database -> Webhooks -> new webhook on table "enquiries", event INSERT,
//      type "Supabase Edge Functions" -> notify-enquiry.

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    // DB webhook payload shape: { type, table, record, old_record, schema }
    const r = body.record ?? body;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const TO = Deno.env.get("NOTIFY_TO") ?? "zigmagrs@yahoo.in";
    const FROM = Deno.env.get("NOTIFY_FROM") ?? "Manak Petroleum <onboarding@resend.dev>";

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    const skip = new Set(["id", "created_at", "raw"]);
    const lines = Object.entries(r)
      .filter(([k, v]) => v && !skip.has(k))
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
      .join("\n");

    const subject = `New ${r.form_type ?? "website"} enquiry — ${r.name ?? r.company ?? "Manak Petroleum"}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: r.email || undefined,
        subject,
        text: `New enquiry from manakpetroleum.com\n\n${lines}\n\n— Auto-sent by Supabase`,
      }),
    });

    const out = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, resend: out }), {
      status: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
