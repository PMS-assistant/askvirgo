/*
  Emails every website enquiry to the owner, and sends the visitor a short
  thank-you, through Amazon SES (askvirgo.co.uk is a verified SES domain).

  Wiring: a database trigger (migration 20261107130000) calls this with the
  new row's id after every INSERT into vzir_pilot_signups. The function
  re-reads that row with the service role and stamps notified_at, so it only
  emails real enquiries, and each one only once. The form only inserts a row,
  so a failed email can never lose an enquiry: the row is already saved.

  Secrets (supabase secrets set ...):
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY   an IAM user allowed only ses:SendEmail
    AWS_REGION                                 eu-west-2
    NOTIFY_TO                                  where enquiries go, e.g. hello@askvirgo.co.uk
    NOTIFY_FROM   (optional)                   default "Virgo enquiries <enquiries@askvirgo.co.uk>"
    REPLY_FROM    (optional)                   default "Virgo <hello@askvirgo.co.uk>"

  Setup lives in README.md under "Enquiry emails".
*/

import { SESv2Client, SendEmailCommand } from 'npm:@aws-sdk/client-sesv2@3';

const env = (k: string) => Deno.env.get(k) ?? '';
const DB_URL = env('SUPABASE_URL');
const SERVICE_KEY = env('SUPABASE_SERVICE_ROLE_KEY'); // provided automatically to edge functions
const NOTIFY_TO = env('NOTIFY_TO');
const NOTIFY_FROM = env('NOTIFY_FROM') || 'Virgo enquiries <enquiries@askvirgo.co.uk>';
const REPLY_FROM = env('REPLY_FROM') || 'Virgo <hello@askvirgo.co.uk>';

const ses = new SESv2Client({
  region: env('AWS_REGION') || 'eu-west-2',
  credentials: { accessKeyId: env('AWS_ACCESS_KEY_ID'), secretAccessKey: env('AWS_SECRET_ACCESS_KEY') },
});

type Row = {
  enquiry_type?: string;
  name?: string;
  email?: string;
  hotel_name?: string;
  organisation?: string;
  message?: string;
  created_at?: string;
};

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const firstName = (n: string) => n.trim().split(/\s+/)[0] || 'there';

function shell(inner: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#F7F6F3;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;color:#0F1B33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #E6E4E0;border-radius:14px">
<tr><td style="padding:26px 30px">
<div style="font-weight:600;font-size:18px;margin-bottom:18px"><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#E2603F;vertical-align:-2px;margin-right:8px"></span>Virgo</div>
${inner}
<div style="margin-top:22px;padding-top:14px;border-top:1px solid #EEECE8;font-size:12px;color:#8A91A3;line-height:1.5">${footer}</div>
</td></tr></table></td></tr></table></body></html>`;
}

function ownerEmail(r: Row) {
  const investor = r.enquiry_type === 'investor';
  const name = (r.name || 'Someone').trim();
  const place = investor ? r.organisation : r.hotel_name;
  const subject = `${investor ? 'New investor enquiry' : 'New demo request'}: ${name}${place ? `, ${place.trim()}` : ''}`;
  const when = new Date(r.created_at ?? Date.now()).toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'medium', timeStyle: 'short' });
  const rows: [string, string | undefined][] = [
    ['Name', r.name], ['Email', r.email],
    investor ? ['Organisation', r.organisation] : ['Hotel', r.hotel_name],
    ['Type', investor ? 'Investor enquiry' : 'Book a demo'], ['Sent', when],
  ];
  const table = rows.filter(([, v]) => v && v.trim()).map(([k, v]) =>
    `<tr><td style="padding:9px 0;border-bottom:1px solid #EEECE8;color:#5E667A;font-size:14px;width:120px">${k}</td><td style="padding:9px 0;border-bottom:1px solid #EEECE8;font-size:14px">${esc(v!.trim())}</td></tr>`).join('');
  const msg = r.message?.trim() ? `<div style="margin-top:14px;background:#F7F6F3;border-radius:10px;padding:13px 15px;font-size:14px;color:#3A4560;white-space:pre-wrap">${esc(r.message.trim())}</div>` : '';
  const html = shell(`
<span style="display:inline-block;font-size:12px;font-weight:600;color:#C44C2E;background:#FCEFEA;border-radius:999px;padding:3px 11px;margin-bottom:12px">${investor ? 'Investor' : 'Book a demo'}</span>
<div style="font-size:20px;font-weight:600;margin-bottom:14px">${esc(name)} ${investor ? 'is interested in investing.' : 'wants a demo.'}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EEECE8">${table}</table>${msg}
<a href="mailto:${esc(r.email ?? '')}" style="display:inline-block;margin-top:18px;background:#0F1B33;color:#ffffff;text-decoration:none;border-radius:999px;padding:10px 20px;font-size:14px;font-weight:500">Reply to ${esc(firstName(name))}</a>`,
    'Sent automatically from the form on askvirgo.co.uk. The enquiry is also saved in your database.');
  const text = `${subject}\n\n${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')}${r.message ? `\n\n${r.message}` : ''}`;
  return { subject, html, text };
}

function visitorEmail(r: Row) {
  const investor = r.enquiry_type === 'investor';
  const hi = firstName(r.name ?? '');
  const subject = investor ? `Thanks for your interest in Virgo, ${hi}` : `Thanks for your demo request, ${hi}`;
  const lines = investor
    ? ['Thanks for your interest in Virgo. We’ve got your enquiry and we’ll be in touch to arrange a conversation.']
    : ['Thanks for asking to see Virgo. We’ve got your request and we’ll be in touch to find a time that suits you.',
       `In the meantime, if there’s anything you’d like us to look at${r.hotel_name?.trim() ? ` for ${r.hotel_name.trim()}` : ''}, just reply to this email.`];
  const html = shell(`<p style="font-size:15px;color:#3A4560;margin:0 0 12px">Hi ${esc(hi)},</p>
${lines.map(l => `<p style="font-size:15px;color:#3A4560;margin:0 0 12px;line-height:1.55">${esc(l)}</p>`).join('')}
<p style="font-size:15px;color:#3A4560;margin:0">The Virgo team<br>askvirgo.co.uk</p>`,
    'You’re receiving this because you contacted us through askvirgo.co.uk. Virgo is a product of ARM Technologies Limited, registered in England and Wales, company number 15163077.');
  const text = `Hi ${hi},\n\n${lines.join('\n\n')}\n\nThe Virgo team\naskvirgo.co.uk`;
  return { subject, html, text };
}

async function send(from: string, to: string, replyTo: string | undefined, m: { subject: string; html: string; text: string }) {
  await ses.send(new SendEmailCommand({
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    Content: { Simple: { Subject: { Data: m.subject }, Body: { Html: { Data: m.html }, Text: { Data: m.text } } } },
  }));
}

const db = (path: string, init: RequestInit = {}) =>
  fetch(`${DB_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!NOTIFY_TO || !DB_URL || !SERVICE_KEY) return new Response('Not configured', { status: 500 });

  let id = '';
  try { const body = await req.json(); id = String(body.id ?? body.record?.id ?? ''); } catch { /* fall through */ }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response('Bad request', { status: 400 });

  // Claim the row: only a saved enquiry that hasn't been emailed yet.
  const claim = await db(`vzir_pilot_signups?id=eq.${id}&notified_at=is.null`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ notified_at: new Date().toISOString() }),
  });
  const rows = claim.ok ? (await claim.json()) as Row[] : [];
  if (!rows.length) return new Response(JSON.stringify({ skipped: true }), { headers: { 'Content-Type': 'application/json' } });
  const row = rows[0];

  const result = { owner: false, visitor: false };
  try { await send(NOTIFY_FROM, NOTIFY_TO, row.email, ownerEmail(row)); result.owner = true; }
  catch (e) { console.error('[notify-email] owner email failed:', String(e)); }
  // The visitor's thank-you only delivers once SES is out of its sandbox.
  if (row.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email)) {
    try { await send(REPLY_FROM, row.email, undefined, visitorEmail(row)); result.visitor = true; }
    catch (e) { console.error('[notify-email] visitor email failed:', String(e)); }
  }
  // If the owner email failed, release the claim so a retry can send it.
  if (!result.owner) await db(`vzir_pilot_signups?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ notified_at: null }) });
  return new Response(JSON.stringify(result), { status: result.owner ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
});
