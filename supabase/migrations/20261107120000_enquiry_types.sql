/*
  # Enquiry types for the website forms (2026-11-07)

  The same table now takes two kinds of enquiry:
    - `demo`     from "Book a demo" on the homepage
    - `investor` from the Investors page

  1. Changes to `vzir_pilot_signups`
    - add `enquiry_type` (text, 'demo' or 'investor', default 'demo')
    - add `organisation` (text, the investor's organisation or fund)
    - drop the unique constraint on `email`, so the same person can send
      more than one enquiry (a demo request and later an investor note, say)

  2. Security is unchanged: anonymous INSERT only, no public reads.
*/

ALTER TABLE vzir_pilot_signups
  ADD COLUMN IF NOT EXISTS enquiry_type text NOT NULL DEFAULT 'demo',
  ADD COLUMN IF NOT EXISTS organisation text DEFAULT '';

ALTER TABLE vzir_pilot_signups
  DROP CONSTRAINT IF EXISTS enquiry_type_check;
ALTER TABLE vzir_pilot_signups
  ADD CONSTRAINT enquiry_type_check CHECK (enquiry_type IN ('demo', 'investor'));

ALTER TABLE vzir_pilot_signups
  DROP CONSTRAINT IF EXISTS vzir_pilot_signups_email_key;
