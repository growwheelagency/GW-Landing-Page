import { site } from "../../../lib/site";
import { usd } from "../../../lib/shop";
import type { Billing } from "../../../lib/shop";

type Lead = {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  message?: string;
  needs?: string[];
  plan?: string; // set by the onboarding flow
  business?: string;
  bucket?: { service: string; item: string; price: number; billing: Billing }[];
  totals?: { mo: number; once: number };
};

// Plain text keeps whatever a visitor typed from being rendered as HTML.
function body(d: Lead) {
  const lines = [
    ...(d.plan ? [`Plan: ${d.plan}`, `Business: ${d.business || "Not given"}`] : []),
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone/WhatsApp: ${d.phone || "Not given"}`,
    `Website: ${d.website || "Not given"}`,
    `${d.plan ? "Main goal" : "Needs"}: ${d.needs?.length ? d.needs.join(", ") : "Not given"}`,
  ];
  if (d.bucket?.length) {
    lines.push("", `Selected services (${d.bucket.length}):`);
    d.bucket.forEach((p) =>
      lines.push(
        `- ${p.service}: ${p.item}, ${usd(p.price)}${p.billing === "mo" ? "/mo" : " one-time"}`,
      ),
    );
    if (d.totals)
      lines.push(`Total: ${usd(d.totals.mo)}/mo + ${usd(d.totals.once)} one-time${d.plan ? " (after plan discount)" : ""}`);
  }
  if (d.message) lines.push("", "Message:", d.message);
  return lines.join("\n");
}

async function sendLead(d: Lead) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's shared sender only delivers to the account's own address.
      // Switch to something like leads@yourdomain.com once a domain is verified.
      from: `${site.name} Leads <onboarding@resend.dev>`,
      to: [site.email],
      reply_to: d.email,
      subject: d.plan ? `New order: ${d.name} (${d.plan})` : `New lead: ${d.name}`,
      text: body(d),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// Adds a row to the "Grow Wheel Query" sheet through its Apps Script web app.
async function saveAudit(d: Lead) {
  const res = await fetch(process.env.SHEET_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.SHEET_SECRET,
      name: d.name,
      email: d.email,
      phone: d.phone,
      website: d.website,
      needs: d.plan ? `${d.plan} plan: ${d.bucket?.map((p) => p.item).join(", ")}` : d.needs?.join(", "),
      message: d.plan ? [d.business, ...(d.needs ?? []), d.message].filter(Boolean).join(" | ") : d.message,
    }),
  });
  // Apps Script answers 200 with a login page when access is set wrong.
  const j = await res.json().catch(() => null);
  if (!j?.ok) throw new Error(`Sheet not updated (${res.status})`);
}

export async function POST(req: Request) {
  let d: Lead;
  try {
    d = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (!d.name || !/^\S+@\S+\.\S+$/.test(d.email || "")) {
    return Response.json(
      { ok: false, error: "Name and a valid email are required." },
      { status: 400 },
    );
  }
  const results = await Promise.allSettled([sendLead(d), saveAudit(d)]);
  const failed = results.filter((r) => r.status === "rejected");
  failed.forEach((r) => console.error("LEAD STEP FAILED:", r.reason));
  // One working channel is enough: the lead has reached us either way.
  if (failed.length === results.length) {
    // Keep the lead in the logs so it can still be followed up.
    console.error("LEAD NOT SENT:", d);
    return Response.json(
      { ok: false, error: "We couldn't send that just now." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
