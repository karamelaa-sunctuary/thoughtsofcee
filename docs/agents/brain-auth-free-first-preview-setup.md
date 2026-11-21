# Founder Auth & Free-First Brain — Preview Setup

## Locked decisions
- Sole founder: `thoughtsofcee@gmail.com`.
- No public Studio registration or additional users.
- No paid model/API usage.
- All code changes target `feature/creative-studio`; production `main` is untouched.

## Authentication
The Studio uses Supabase Auth email OTP. It only requests a code for the fixed founder address and sends `create_user: false`, so the app cannot create arbitrary accounts. The verification action validates the code with Supabase Auth, calls `/auth/v1/user`, checks the confirmed founder email, then sets HttpOnly cookies. The Next.js 16 `proxy.ts` validates the Supabase identity on every Studio/API request and refreshes expired access tokens server-side. The legacy HMAC cookie is issued only after verified founder authentication so existing Studio page guards remain compatible during the transition.

## Required Vercel Preview environment variables
Set these only in the existing Vercel project's **Preview** environment:
- `SUPABASE_URL` = existing project URL.
- `SUPABASE_ANON_KEY` = project's publishable/anon key (not service_role or secret key).
- `STUDIO_SESSION_SECRET` = existing random secret used by legacy page guards.

Never commit secrets or put them in browser code or `NEXT_PUBLIC_` variables.

## One-time Supabase dashboard setup
1. Open Authentication → Users.
2. Invite `thoughtsofcee@gmail.com` if it is not already an existing confirmed user. Keep public sign-ups disabled.
3. Confirm the user is verified/confirmed.
4. Check Authentication → Providers → Email is enabled and email OTP is enabled.
5. Keep existing production URL configuration unchanged.

The built-in email sender may have rate/recipient limits on the free plan. If delivery is limited, use an SMTP provider you control; do not buy anything without reviewing the free tier and terms first.

## Free-first AI boundary
The current Brain API route calls the paid OpenAI API. The no-paid-API decision means that route must not be activated with a paid key. ChatGPT subscriptions do not include API credits. Until a genuinely free model runtime is selected and tested, do not describe the Brain as a live generative AI assistant. The Studio can still hold structured founder knowledge, decisions, sources, plans and tasks without a model API.

## Memory rollout gate
Do not create or expose Brain tables until founder sign-in works in Preview, the current hosted schema migration baseline is reconciled, and RLS tests cover anonymous, founder and non-founder contexts. The existing 11 Studio tables and all writing content remain unchanged during this authentication stage.
