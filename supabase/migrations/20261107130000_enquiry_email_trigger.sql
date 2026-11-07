/*
  # Email every new enquiry (2026-11-07)

  After a row is inserted into vzir_pilot_signups, call the notify-email
  edge function with the new row's id. The function re-reads the row with the
  service role, sends the emails, and stamps `notified_at`, so:
    - it only ever emails real, saved enquiries (a forged call with a made-up
      id finds nothing);
    - each enquiry is emailed at most once (a repeated call sees notified_at).
  No secret is needed in this trigger.

  pg_net makes the HTTP call after the insert commits, so a slow or failed
  email never blocks or loses the enquiry.
*/

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

ALTER TABLE vzir_pilot_signups
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

CREATE OR REPLACE FUNCTION public.notify_enquiry_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://jqxauqujvolknsanxswc.supabase.co/functions/v1/notify-email',
    body := jsonb_build_object('id', NEW.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 10000
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enquiry_email_after_insert ON vzir_pilot_signups;
CREATE TRIGGER enquiry_email_after_insert
  AFTER INSERT ON vzir_pilot_signups
  FOR EACH ROW EXECUTE FUNCTION public.notify_enquiry_email();
