# Brain, Shared Memory & Delegation — Implementation Blueprint

**Status:** Architecture approved; private-schema database foundation deployed to Supabase Preview; Supabase Auth application integration and live model execution remain in progress/gated  
**Scope:** Preview branch only  
**Owner:** Founder  
**Principle:** The Brain coordinates; specialists contribute; the Review Board challenges; the founder decides.

## 1. Current verified baseline

- The Studio is protected by a founder access-code flow that issues an HMAC-backed `toc_studio_session` cookie.
- `proxy.ts` validates that cookie for Studio pages and Studio API routes.
- The Brain API route intentionally returns HTTP 503. It does not call a model.
- The Brain console is a client-side UI; its conversation is held in React state and is not saved to the database.
- Agent instructions and notes currently use browser `localStorage`.
- The repository does not currently declare `@supabase/supabase-js` or `@supabase/ssr`.
- The Supabase project already has 11 public tables with RLS enabled. Their existing ownership model references `auth.users` through `user_id`; the Studio's custom HMAC cookie is not a Supabase Auth identity.
- No secrets, model connections, paid services, or production changes are included in this blueprint.

These facts mean that adding cloud persistence safely requires an explicit identity bridge. A browser-only key, a public write policy, or an exposed service-role/secret key is not an acceptable shortcut.

## 2. Target architecture

### A. Founder identity and authorization
1. Keep the current founder gate during the transition.
2. Before cloud memory is enabled, establish a verified server-side founder identity that maps to a Supabase Auth user ID.
3. Prefer Supabase Auth with server-side cookie handling and verified claims (`getUser` / `getClaims` as appropriate to the current SDK guidance). Do not use editable user metadata for authorization.
4. Do not trust a client-supplied `user_id`, agent ID, role, or approval flag.
5. Do not put Supabase secret/service-role keys in browser code or `NEXT_PUBLIC_*` variables.
6. Until the identity bridge is complete, keep all new memory writes disabled.

### B. Shared knowledge and memory layers
- **Layer 1 — Founder-controlled instructions:** approved, versioned instructions and explicit corrections. Only the founder can create, approve, supersede, or retire these.
- **Layer 2 — Organisational knowledge:** brand standards, approved constitutions, project facts, architecture decisions, research notes, policies, and reusable lessons. Each record carries source, provenance, trust classification, owner, status, and review date.
- **Layer 3 — Working context:** task briefs, temporary observations, agent outputs, handoffs, and run summaries. This layer does not silently become permanent knowledge.

### C. Memory record requirements
Each memory item should include:
- stable ID and workspace/owner scope;
- memory type and category;
- concise title and content;
- source reference and provenance;
- trust class: founder-approved, verified-primary, corroborated, provisional, or unverified;
- lifecycle state: draft, pending review, approved, superseded, or archived;
- creator, reviewer, timestamps, version, and supersedes link;
- sensitivity classification and retention/deletion handling.

Never promote a provisional observation into a founder instruction automatically. Keep private or sensitive personal details out of general organisational memory unless the founder explicitly directs otherwise and the system has a justified purpose and safeguards.

### D. Agent instruction hierarchy
Apply instructions in this order:
1. Platform safety and security constraints.
2. AI Department Constitution and approved operating policies.
3. Founder-approved global instructions.
4. Agent constitution and role-specific instructions.
5. Project-specific approved instructions.
6. Task brief and temporary context.

Lower-level instructions cannot override higher-level instructions. Conflicts must be surfaced rather than silently resolved.

## 3. Delegation workflow

1. **Intake:** The Brain captures the objective, intended outcome, constraints, deadline, budget/cost boundary, and acceptance criteria. It asks only for essential missing information.
2. **Triage:** It proposes a task plan and selects relevant specialists using an explicit capability map.
3. **Work orders:** Each delegated task has an ID, parent task, assigned agent, input references, expected output schema, dependencies, deadline, and status.
4. **Execution:** Initially, specialists run only when explicitly invoked. No hidden background execution or paid model calls.
5. **Synthesis:** The Brain combines results, preserves disagreements, identifies evidence gaps, and distinguishes fact from inference.
6. **Independent review:** Relevant Review Board agents review high-impact work. Reviewers must not simply echo the producing agent.
7. **Decision brief:** The Brain returns recommendation, alternatives, evidence, assumptions, uncertainty, risks, cost/time implications, and required founder decision.
8. **Approval gate:** Publishing, spending, production changes, external communications, legal commitments, and irreversible actions require explicit founder approval.
9. **Audit:** Record task transitions, agent outputs, reviews, approvals, failures, and handoffs.

### Task state model
`draft → ready → assigned → running → review → awaiting_founder → approved → completed`

Alternative terminal or paused states: `changes_requested`, `rejected`, `blocked`, `failed`, `cancelled`.

A task cannot move to `approved` or `completed` merely because an agent recommends it. Founder approval is a separate recorded event.

## 4. Proposed persistence model (not deployed)

Use a private, non-exposed schema for internal department records unless a reviewed design demonstrates that a public-schema table with strict RLS is required.

| Proposed entity | Purpose |
|---|---|
| `department_instructions` | Versioned founder-approved global and project instructions |
| `department_memory` | Shared knowledge and approved memory records |
| `agent_profiles` | Stable agent IDs, roles, capabilities, constitution versions, enabled state |
| `agent_tasks` | Parent/child work orders, assignments, state and acceptance criteria |
| `agent_runs` | One execution attempt, model/provider metadata, timing, cost and result status |
| `agent_messages` | Structured task-scoped handoffs and outputs |
| `review_decisions` | Independent reviewer verdicts, findings and requested changes |
| `founder_decisions` | Explicit approvals, rejections and decision rationale |
| `department_events` | Append-only activity/audit events |

Every row must be scoped to a verified founder/workspace identity. RLS or equivalent server-side authorization must be tested for every read/write path. Do not add a permissive `USING (true)` policy. Avoid storing model secrets or provider credentials in these tables.

## 5. API contract (proposed)

All endpoints require verified founder authorization and validate request schemas server-side.

- `GET /api/studio/department/overview` — agent statuses, queued work, approvals required, recent events.
- `GET|POST /api/studio/memory` — list or create a draft memory item; creation never implies approval.
- `POST /api/studio/memory/:id/approve` — founder-only approval and version transition.
- `GET|POST /api/studio/tasks` — list or create a task plan.
- `POST /api/studio/tasks/:id/delegate` — create child work orders from an approved plan.
- `POST /api/studio/tasks/:id/transition` — validated state transition.
- `POST /api/studio/tasks/:id/decision` — record founder approval/rejection.
- `GET /api/studio/activity` — paginated audit/activity feed.

Use idempotency keys for task creation and transitions. Enforce maximum payload sizes, rate limits, safe error messages, and server-side audit events. Never accept a browser-supplied status transition without checking the actor and allowed transition.

## 6. Model/runtime policy

- Keep the current free-first decision: no paid model/API calls, no subscriptions, and no model provider activation without explicit founder approval.
- The Brain's 503 response remains correct until a provider/runtime is selected, tested, and approved.
- Architecture and memory CRUD can be developed independently of a model.
- Every run should disclose provider/model, whether external processing occurs, and any known cost.
- No autonomous agent execution until scheduling, retries, failure handling, audit, and founder controls are implemented and tested.

## 7. Rollout sequence

### Phase 0 — Foundation and security (partially complete)
- Confirmed one existing Supabase Auth user is present and has a confirmed email/password credential; no email address or credential material is included in this document.
- Deployed the private `private` schema and nine founder-scoped tables: `department_instructions`, `department_memory`, `agent_profiles`, `agent_tasks`, `agent_runs`, `agent_messages`, `review_decisions`, `founder_decisions`, and `department_events`.
- Enabled RLS on all nine tables. Added ownership constraints to prevent child records from referencing another founder's tasks/runs/agents. Made messages, reviews, founder decisions and department events append-only for authenticated users.
- Added indexes for ownership and foreign-key paths.
- Recorded the three deployed migrations in `supabase/migrations/` on the Preview branch.
- Verified 9/9 tables have RLS enabled and all 9 cross-record ownership constraints exist. Supabase health advisor returned no findings. Security advisor still reports the pre-existing leaked-password protection warning. Performance advisor now reports unused indexes because the new tables are empty; it no longer reports missing foreign-key indexes.
- Next: implement Supabase SSR cookie auth and server-side authorization in the Next.js 16 app, then add tightly scoped public RPC functions for the private tables. Do not expose the `private` schema through PostgREST.
- Confirm required Vercel Preview environment variables without exposing their values. Do not configure or reveal secrets in chat.

### Phase 1 — Shared memory (database foundation deployed; application layer next)
- Add cookie-based Supabase SSR auth and verified founder identity checks.
- Add narrowly scoped authenticated RPC functions for private persistence and typed server-only data access; keep `private` out of the exposed API schemas.
- Build read/write/approve/version APIs.
- Replace localStorage as the source of truth while retaining an export/import path for existing browser notes.
- Test cross-session persistence, authorization failures, ownership isolation, and version history.

### Phase 2 — Task and delegation engine
- Add task/work-order persistence, state transitions, dependencies and handoff records.
- Build Brain planning UI and a Department Activity Monitor.
- Initially allow manual/on-demand specialist assignments only.

### Phase 3 — Review and decision controls
- Add independent reviewer assignment, structured verdicts, revision cycles, founder decision records and approval gates.
- Add conflict and dissent visibility.

### Phase 4 — Controlled runtime
- Only after explicit provider approval, connect a verified no-cost or approved model runtime.
- Test model output handling, prompt-injection boundaries, tool permissions, data minimisation and failure behavior.
- Keep scheduled/event-triggered work disabled until separately reviewed and approved.

## 8. Acceptance criteria

- The founder can save an instruction and retrieve it in a new browser session.
- Unapproved drafts are never treated as authoritative instructions.
- A task can be delegated to a specialist and traced through every state transition.
- Agent outputs and reviewer verdicts remain distinct and attributable.
- Conflicting agent recommendations are preserved and surfaced.
- No browser user can read or modify another workspace's records.
- No secret is sent to the browser.
- No agent can publish, spend, alter production, or make external commitments without explicit founder approval.
- The Brain clearly distinguishes planned, delegated, running, completed, failed, and unverified work.
- Database tests and Supabase security advisors pass before any production rollout.

## 9. Explicit non-goals for this phase

- No production branch changes or deployment.
- No modification of public writing content or `app/data/writings.ts`.
- No paid AI model, API, connector, or subscription.
- No autonomous publishing, spending, or external actions.
- No scheduled/background runs until the runtime and control plane are proven.
- No hosted database DDL until the founder approves the reviewed migration and identity design.

## 10. Current blocker and founder decision

The current Studio uses a custom HMAC session cookie, while the existing Supabase data model is built around `auth.users` and `auth.uid()`. These are not interchangeable identities.

**Recommended path:** integrate a verified Supabase Auth founder identity on Preview, retain the Studio access gate as an additional layer during migration, then apply private-schema memory/task persistence with least-privilege policies. This avoids a broad service-role bypass and aligns with the existing ownership model.

Founder approval for the Supabase Auth identity bridge and private-schema database foundation was given in chat on 22 Nov 2026. The first three migrations are now deployed to the Supabase project associated with Preview. The remaining operational prerequisite is configuring the Preview environment with the project URL and publishable key, and completing the auth UI/SSR integration. No service-role key is required in the browser. No production changes have been made.
