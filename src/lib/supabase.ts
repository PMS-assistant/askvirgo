import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* Whether the client can actually reach a real project.
 *
 * These used to fall back to 'https://placeholder.supabase.co' / 'placeholder-key'
 * silently, which is how a missing .env.local turned into a visitor seeing
 * "Something went wrong. Please try again." on the pilot form: every insert
 * was posting to a domain that doesn't resolve. Nothing failed at build time,
 * so a deploy missing these two vars would look completely healthy while
 * dropping every signup on the floor.
 *
 * The placeholders are kept — createClient throws on an empty URL, which would
 * take the whole page down over one broken form — but the flag makes the
 * failure legible instead, and the console error means it can't ship unnoticed. */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.error(
    '[supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. '
    + 'The pilot signup form cannot submit. Add both to .env.local (see README) '
    + 'and restart the dev server.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
);
