/*
  Sends a WhatsApp message to the A.R.M number whenever someone submits the
  pilot/enquiry form, so an enquiry lands on a phone instead of sitting in a
  table nobody checks.

  Why this runs server-side and not in the browser: the Meta access token can
  send messages as A.R.M. Anything in the React bundle is readable by every
  visitor (View Source is enough), so a token shipped to the client is a token
  anyone can use to message people as you. It has to live somewhere the public
  can't read, which is what this function is for.

  Wiring: a Supabase database webhook fires this on INSERT into
  vzir_pilot_signups. The form itself is unchanged — it still just inserts a
  row — so a failure to notify can never cost you the signup. The row is
  already committed by the time this runs; the worst case is you read it in the
  dashboard instead of on your phone.

  Setup lives in README.md under "Enquiry notifications".
*/

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const PHONE_NUMBER_ID = Deno.env.get('PHONE_NUMBER_ID');
/** Where the alert goes — the A.R.M number, not the visitor's. */
const NOTIFY_NUMBER = Deno.env.get('WHATSAPP_NOTIFY_NUMBER');
/** Shared secret, sent by the webhook as x-webhook-secret. */
const WEBHOOK_SECRET = Deno.env.get('ENQUIRY_WEBHOOK_SECRET');
/** Optional. Set it to send an approved template — see the 24-hour note below. */
const TEMPLATE_NAME = Deno.env.get('WHATSAPP_TEMPLATE_NAME');
const TEMPLATE_LANG = Deno.env.get('WHATSAPP_TEMPLATE_LANG') ?? 'en';

type Signup = {
  name?: string;
  email?: string;
  hotel_name?: string;
  message?: string;
};

/* WhatsApp rejects template parameters containing newlines, tabs, or four or
   more consecutive spaces — the whole send fails with a 132000-series error
   rather than degrading, so anything pasted into the form's message box has to
   be flattened before it goes near a template. */
function flatten(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildSummary(row: Signup) {
  const parts = [
    `New enquiry from ${row.name?.trim() || 'someone'}`,
    row.hotel_name?.trim() ? `Hotel: ${row.hotel_name.trim()}` : null,
    row.email?.trim() ? `Email: ${row.email.trim()}` : null,
    row.message?.trim() ? `Message: ${row.message.trim()}` : null,
  ].filter(Boolean) as string[];
  return parts;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Without this the function's URL is a public "send a WhatsApp as A.R.M"
  // button. The webhook is configured to send the matching header.
  if (!WEBHOOK_SECRET || req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID || !NOTIFY_NUMBER) {
    console.error('[notify-whatsapp] Missing WHATSAPP_TOKEN, PHONE_NUMBER_ID or WHATSAPP_NOTIFY_NUMBER.');
    return new Response('Not configured', { status: 500 });
  }

  let row: Signup;
  try {
    const body = await req.json();
    row = body.record ?? body;
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const to = NOTIFY_NUMBER.replace(/[^0-9]/g, '');
  const lines = buildSummary(row);

  /* Two shapes, because Meta treats them very differently:

     - A plain text message only delivers inside a 24-hour window that opens
       when that number last messaged your business number. For an alert you
       want at 3pm on a quiet Tuesday, that window is usually shut, and the
       send fails with error 131047.
     - An approved template has no such window and always delivers.

     So text is the zero-setup default for testing, and a template is what you
     actually run on. Set WHATSAPP_TEMPLATE_NAME once the template is approved. */
  const payload = TEMPLATE_NAME
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: TEMPLATE_NAME,
          language: { code: TEMPLATE_LANG },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: flatten(lines.join(' · ')).slice(0, 1024) }],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: lines.join('\n') },
      };

  const resp = await fetch(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await resp.json();

  if (!resp.ok) {
    // Logged rather than thrown: the signup row is already saved, and there is
    // nothing useful to retry against — a token or template problem will fail
    // identically every time. The dashboard logs are where you find out why.
    console.error('[notify-whatsapp] Meta rejected the send:', JSON.stringify(result));
    return new Response(JSON.stringify({ sent: false, error: result }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
