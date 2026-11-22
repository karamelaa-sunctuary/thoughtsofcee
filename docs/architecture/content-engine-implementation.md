# Thoughts of Cee Content Engine — Implementation Plan

**Status:** Architecture plan approved for Preview development; identity bridge code committed, local sign-in test pending  
**Scope:** Preview branch only  
**Purpose:** Build a repeatable, founder-supervised content workflow for consistent audience growth without introducing a paid AI subscription.

## 1. Product intent

The Content Engine turns approved editorial goals into a weekly content plan, prepares platform-specific drafts, routes work through specialist checks, and places founder-approved items onto a calendar.

It serves the Thoughts of Cee brand. The Creative Studio provides the production workspace. The AI Department supplies specialist drafting and review. The Brain coordinates priorities and summarizes decisions.

The engine must preserve the brand's human, honest, reflective voice. It must not turn the brand into generic agency marketing or imply clinical/therapeutic services.

## 2. Operating rules

- Free-first model access only. The current Gemini Developer API route uses `gemini-3.5-flash`. No paid fallback, subscription upgrade, billing activation, or provider switch.
- A provider quota/capacity error stops generation; it is not retried in a way that can create runaway usage.
- Existing public writings and published site content are read-only source material. The engine creates new drafts; it does not edit or overwrite existing pieces.
- The founder decides the cadence, channel mix, themes and publishing dates. The system must not invent these as settled business facts.
- Every content item has provenance: its brief, source references, producing role, review findings, version and approval state.
- The founder must explicitly approve content before it can be marked ready for publishing.
- The first release schedules content in an editorial calendar only. It does not automatically publish to Instagram, Facebook, TikTok or the website.

## 3. Proposed workflow

1. **Weekly brief:** The founder or Brain defines the week's objective, campaign/theme, audience, channel mix, cadence and any constraints.
2. **Planning:** The Content Strategist proposes a balanced calendar with format, purpose, platform, draft due date and proposed publish date.
3. **Production:** Writer & Story Architect drafts text; Creative Director prepares a visual brief; Content Distribution adapts approved source material for each selected channel.
4. **Review:** Editorial Critic checks voice and craft. Brand Guardian checks brand alignment and sensitive framing. Quality Assurance checks completeness and source/claim integrity.
5. **Synthesis:** The Brain summarizes revisions, open questions and readiness. Reviewers' dissent is retained rather than collapsed into false consensus.
6. **Founder approval:** Only the founder can approve a content item for the calendar.
7. **Scheduling:** Approved items receive a date/time in the editorial calendar. A later automation phase may prepare the next week's drafts on a schedule.
8. **Publishing:** Manual in the first release. Platform integrations and automated publishing are explicitly out of scope.

## 4. Proposed content item fields

These fields are a design proposal, not a deployed database schema:

- id, user_id, campaign_id, title, content_type, channel
- source_brief, source_refs, caption/body, visual_brief, CTA
- scheduled_for, timezone, status, version
- producing_agent, reviewer_findings, review_status
- founder_decision, decided_by, decided_at
- created_at, updated_at, published_at (only if a future publishing integration is approved)

Content status flow:

`idea → planned → drafting → review → awaiting_founder → approved → scheduled`

Alternative states:

`changes_requested`, `rejected`, `blocked`, `cancelled`, `published`

No agent may set `approved` or `published`. The founder alone approves; the publishing integration does not exist in this phase.

## 5. Technical dependencies and sequence

### Milestone A — Verified founder identity
- Complete the Supabase SSR identity bridge in the Preview app.
- Keep the existing Studio HMAC gate as a separate outer layer.
- Verify the Supabase session with `auth.getClaims()`; never use `getSession()` as server-side authorization.
- Use only the publishable key in browser configuration. Never expose a secret/service-role key.
- Test founder sign-in, refresh, sign-out and rejection of unauthenticated requests.

### Milestone B — Persistent content calendar
- Design a new private-schema calendar table and founder-scoped `SECURITY INVOKER` RPCs.
- Review and test RLS, ownership constraints, status transitions, append-only decisions and event audit before deploying a migration.
- Keep the `private` schema unexposed to PostgREST.
- Do not store raw API keys, passwords or tokens in content/task records.

### Milestone C — On-demand generation and review
- Add a Content Engine page and authenticated server routes.
- Generate a small weekly batch per explicit founder request.
- Use bounded request sizes and output schemas; do not retry provider quota errors or switch to paid capacity.
- Run content through distinct role-specific instructions and record each output/review separately.
- Save drafts as `awaiting_founder`; do not treat a model's self-review as founder approval.

### Milestone D — Controlled scheduling
- After persistent content and audit are proven, select and test a no-cost scheduler in Preview.
- Prefer a controlled weekly draft-preparation job over frequent polling.
- The job may create drafts and notify the founder only after a notification channel is explicitly configured.
- Include idempotency, run locks, retry caps, timeouts, failure records, timezone handling and a kill switch.
- Scheduled draft preparation does not grant permission to publish.

### Milestone E — Publishing integrations (future and separately approved)
- Research official platform APIs, permissions, review requirements and costs.
- Keep posting disabled until the founder approves each platform integration and publishing policy.
- Manual approval remains required unless the founder later changes this rule explicitly.

## 6. Acceptance criteria

- A weekly plan can be created, edited, saved across sessions and reviewed.
- Every draft is traceable to its source brief and producing role.
- Editorial/brand/QA review findings remain separately attributed.
- No draft is automatically approved or published.
- Founder approval is recorded as a distinct event.
- Schedule times use an explicit timezone; default can be Asia/Dubai after founder confirmation in the UI.
- Failed or quota-limited generation creates a visible failure state without a paid fallback.
- A user cannot read or modify another founder's content.
- Existing public writing and production files remain unchanged.

## 7. Explicit non-goals

- No changes to the production branch or production website.
- No writes to `app/data/writings.ts` or existing public content.
- No automated external publishing.
- No paid AI subscriptions, API plans, model fallbacks or billing activation.
- No scheduled jobs until the auth, storage and failure-control milestones are verified.
- No database migration deployment from this plan alone; schema changes must be reviewed before deployment.
