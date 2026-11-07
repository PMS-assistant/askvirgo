import { supabase, supabaseConfigured } from './supabase';

/* Saves a website enquiry. Both forms (Book a demo on the homepage, and the
   Investors page) write to the same table; a database webhook then emails the
   owner and sends the visitor a thank-you (supabase/functions/notify-email).

   The table name predates the Virgo rename and is kept to preserve rows.

   If the enquiry_type / organisation columns are not there yet (the migration
   20261107120000_enquiry_types.sql hasn't been applied), the insert is
   retried with the old columns only and the type folded into the message, so
   the form keeps working instead of failing. */

export type EnquiryType = 'demo' | 'investor';

export type Enquiry = {
  type: EnquiryType;
  name: string;
  email: string;
  hotel?: string;
  organisation?: string;
  message?: string;
};

export type EnquiryResult = 'ok' | 'duplicate' | 'error';

const MISSING_COLUMN = ['PGRST204', '42703'];

export async function submitEnquiry(e: Enquiry): Promise<EnquiryResult> {
  if (!supabaseConfigured) return 'error';
  const email = e.email.toLowerCase().trim();

  const full = {
    enquiry_type: e.type,
    name: e.name.trim(),
    email,
    hotel_name: (e.hotel ?? '').trim(),
    organisation: (e.organisation ?? '').trim(),
    message: (e.message ?? '').trim(),
  };

  let { error } = await supabase.from('vzir_pilot_signups').insert(full);

  if (error && MISSING_COLUMN.includes(error.code ?? '')) {
    const label = e.type === 'investor' ? `[Investor enquiry${full.organisation ? ` · ${full.organisation}` : ''}] ` : '';
    ({ error } = await supabase.from('vzir_pilot_signups').insert({
      name: full.name,
      email,
      hotel_name: full.hotel_name || full.organisation,
      message: label + full.message,
    }));
  }

  if (!error) return 'ok';
  return error.code === '23505' ? 'duplicate' : 'error';
}
