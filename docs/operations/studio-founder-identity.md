# Studio founder identity — Preview setup

The Studio uses two separate checks:

1. The existing HMAC-backed Studio access cookie protects the private workspace.
2. Supabase Auth provides a verified founder UUID for private-schema operations protected by `auth.uid()` and row-level security.

## Local environment

Add these values to `.env.local` in the Preview worktree:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Use the project's publishable key only. Never place a Supabase secret/service-role key in a browser variable or in this file.

Install the pinned packages from `package.json` with `npm install`, then restart the development server.

## Supabase Auth dashboard settings

In the Supabase Dashboard for the Preview project's Auth configuration:

1. Open **Authentication → Sign In / Providers → Email** and enable the Email provider.
2. Open **Authentication → URL Configuration** and add this exact local redirect URL to the Redirect URLs allowlist: `http://localhost:3000/auth/callback`.
3. Save the changes.

The built-in Supabase email sender is limited and best-effort. It may only deliver to addresses authorized for the project's organization and currently allows a small number of emails per hour. Do not repeatedly click the send button. If the provider reports an email rate-limit error, stop and let the limit reset; do not add a paid SMTP service without founder approval.

## Sign-in

1. Unlock the Studio using the existing Studio access password.
2. Open `/studio/identity`.
3. Enter the email address on the existing founder account and request one sign-in link.
4. Open the newest email link in the same browser. Supabase redirects to `/auth/callback`, where the server exchanges the one-time code for a cookie-backed session.
5. The page verifies the session on the server using `auth.getClaims()`.

There is no sign-up control and no password is required by the Identity page. `shouldCreateUser: false` prevents this sign-in form from creating a second account.

## Security notes

- The HMAC Studio gate remains in place.
- The Supabase Proxy helper refreshes cookie sessions and validates claims; protected API handlers must still call the server-side founder check before database work.
- Do not trust `getSession()` in server code for authorization.
- Do not trust client-supplied user IDs or roles.
- Use only the authenticated server client for the private department RPCs.
- Do not enable scheduled runs or publishing from this identity milestone.
