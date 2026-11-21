# Brain Runtime — Preview Setup & Verification

## What is implemented

- Private page: /studio/brain
- Server endpoint: POST /api/studio/brain
- Brain system instructions: docs/agents/the-brain-system-instructions.md
- Responses API integration using a server-side API key.
- Existing Studio HMAC session cookie is checked before the model request.
- The browser sends a short recent conversation window; the API request uses store=false.
- The model name is configurable through OPENAI_MODEL; default in this first pass is gpt-6.2-sol.
- The Brain card in /studio/agents links to the new console.

## Preview environment variables

Set these in the existing Vercel project thoughtsofcee, Preview environment only:
- OPENAI_API_KEY — secret API key from the OpenAI Platform project.
- OPENAI_MODEL — optional model slug available to the API project; if omitted, code uses gpt-6.2-sol.
- Existing STUDIO_ACCESS_CODE and STUDIO_SESSION_SECRET must remain configured for Preview.

Never use NEXT_PUBLIC_OPENAI_API_KEY. Never commit the API key to GitHub or paste it into source files. Do not change Production environment variables for this preview test.

## How to test

1. Wait for the feature/creative-studio Preview deployment to report Ready.
2. Open the Preview URL and unlock the Studio using the existing preview access code.
3. Open AI team → The Brain → Open Brain console.
4. Confirm the model connection status is detected.
5. Send: “Introduce yourself, explain your role and list what you can and cannot do in this pilot.”
6. Send a second test: “Prepare a work order for Writer, Audience & Storytelling, Creative Director and Editorial for The Things We Never Said. Do not claim you have called independent agents.”
7. Confirm that the Brain distinguishes proposed work orders from actual agent execution.
8. Confirm that an invalid/expired session is rejected and no API key appears in browser requests or page source.

## Current limitations

This is a first supervised Brain chat endpoint, not yet a multi-agent runtime:
- No independent specialist model calls or tool delegation.
- No durable server-side conversation history or project memory.
- No per-agent runtime settings UI.
- No persistent task queue, audit database or token/cost ledger.
- No production-grade rate limiting or user-level auth; the existing shared preview gate is used.
- No web/file retrieval tools connected to the Brain endpoint.
- No autonomous actions.

Do not enable this endpoint for public users or production workflows until authentication, rate limiting, observability, usage controls and privacy review are completed.

## API implementation notes

The route uses the OpenAI Responses API over server-side fetch. The official Responses API is the recommended interface for new agentic applications and supports instructions, text input, tools and multi-turn workflows. See:
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/api/docs/quickstart

The API key is read only on the server. The route does not persist API response state; browser chat history is temporary and cleared when the session is reset or the page reloads.

## Verification record

- Git branch: feature/creative-studio
- Latest Brain console integration commit: bb8cb111d263c8f1a5054a78a119107fb040f017
- GitHub combined status at last check: no status entries returned. This is pending/unknown, not proof of successful deployment or build.
- Manual Preview test: pending.
