// Receives the contact form. For now it only logs the lead.
// TODO: send an email (Resend / Nodemailer) or push to a CRM / Google Sheet here.
export async function POST(req) {
  try {
    const d = await req.json();
    if (!d.name || !/^\S+@\S+\.\S+$/.test(d.email || "")) {
      return Response.json(
        { ok: false, error: "Name and a valid email are required." },
        { status: 400 },
      );
    }
    console.log("NEW LEAD:", d);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
}
