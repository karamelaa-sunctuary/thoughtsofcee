# Brain Memory — Existing Supabase Schema Assessment & Implementation Plan

Date: 2026-11-22
Project: thoughtsofce (Supabase ref: naqdtescyfbuevmicxkn)
Repository branch: feature/creative-studio

## Executive summary

The Supabase project is ACTIVE_HEALTHY on PostgreSQL 17.12. The public schema currently contains 11 Studio foundation tables: studio_profiles, brand_profiles, projects, design_pages, assets, templates, design_versions, social_accounts, social_posts, ai_generations and approvals.

All 11 currently report RLS enabled. Existing row policies consistently scope authenticated users to auth.uid() = user_id, with system-template read rules. The tables are currently empty according to the table listing. The migration listing currently returns no migration records, so the existing foundation must be treated as a hosted schema whose original migration history is not yet represented in the connected project.

No database schema changes were made during this assessment.

## Important architecture and security finding

The current Studio entry flow uses a custom HMAC access-code cookie, not Supabase Auth. The existing database ownership model uses auth.uid() and authenticated-role RLS policies. Therefore the current browser session is not sufficient to safely read/write owner-scoped Supabase records.

Do not connect Brain Memory directly to the existing Studio cookie and do not weaken RLS or expose service-role credentials to the browser as a workaround.

Before private persistent memory is enabled, implement a real Supabase Auth identity/session for the founder (or a rigorously authenticated server-side bridge with an explicit ownership model). The current cookie may remain as a temporary preview gate, but it is not a substitute for database user identity.

## Data API exposure change

Supabase's 2026-04-28 breaking-change notice says that from 2026-10-30 the new default is that newly created public-schema tables are not automatically exposed to the Data API. RLS and SQL grants are separate controls. For this design, keep Brain tables inaccessible to anon and authenticated Data API roles until the Auth integration and explicit grants are ready. Do not add broad grants as part of initial table creation.

Reference: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically

## Proposed normalized schema

Use UUID primary keys, owner_id referencing auth.users(id), created_at/updated_at timestamps, and owner indexes. Avoid a single unstructured JSON blob as the only memory store. JSONB can hold flexible metadata, but core fields remain queryable and typed.

### 1. brain_knowledge_items
Curated memory records: brand principles, preferences, project briefs, agent specs, procedures, lessons, creative IP references and approved context.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); title TEXT not null; summary TEXT; body TEXT or secure content reference; record_type TEXT; domain TEXT; status TEXT (draft, proposed, approved, active, superseded, archived, withdrawn); evidence_class TEXT (verified_fact, source_reported_claim, expert_interpretation, founder_decision, inference, hypothesis, assumption, creative_choice); origin_type TEXT; sensitivity TEXT; rights_status TEXT; metadata JSONB default {}; review_due_at TIMESTAMPTZ; created_at and updated_at TIMESTAMPTZ.

### 2. brain_sources
Bibliographic and provenance records, separated so multiple items and claims can cite one source.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); title TEXT not null; authors TEXT[]; publisher TEXT; source_type TEXT; canonical_url TEXT; doi TEXT; published_at DATE; accessed_at TIMESTAMPTZ; methodology TEXT; population_context TEXT; limitations TEXT; conflicts_of_interest TEXT; rights_license TEXT; credibility_assessment TEXT; review_due_at TIMESTAMPTZ; metadata JSONB default {}; created_at and updated_at TIMESTAMPTZ.

### 3. brain_claims
Ledger of important claims and evidence status.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); claim_text TEXT not null; status TEXT (supported, partially_supported, disputed, outdated, unsupported, hypothesis); evidence_class TEXT; confidence_note TEXT; scope_limitations TEXT; review_due_at TIMESTAMPTZ; created_at and updated_at TIMESTAMPTZ.

### 4. brain_claim_sources
Many-to-many claim/source link with relationship and evidence note.
Fields: claim_id UUID references brain_claims(id) on delete cascade; source_id UUID references brain_sources(id) on delete restrict; relationship TEXT (supports, contradicts, contextualises); evidence_summary TEXT; primary key (claim_id, source_id).

### 5. brain_knowledge_sources
Many-to-many knowledge item/source link.
Fields: knowledge_item_id UUID references brain_knowledge_items(id) on delete cascade; source_id UUID references brain_sources(id) on delete restrict; relevance_note TEXT; primary key (knowledge_item_id, source_id).

### 6. brain_decisions
Founder-approved decision log.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); project_id UUID null references projects(id); title TEXT not null; decision TEXT not null; context TEXT; options_considered JSONB default []; rationale TEXT; risks_tradeoffs TEXT; status TEXT (proposed, approved, superseded, withdrawn); approved_by UUID null references auth.users(id); approved_at TIMESTAMPTZ; review_trigger TEXT; supersedes_id UUID null references brain_decisions(id); created_at and updated_at TIMESTAMPTZ.

### 7. brain_tasks
Founder/Brain work ledger; project links reuse the existing projects table.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); project_id UUID null references projects(id); parent_task_id UUID null references brain_tasks(id); title TEXT not null; description TEXT; deliverable TEXT; assigned_role TEXT; status TEXT (proposed, ready, in_progress, blocked, in_review, awaiting_approval, done, cancelled); priority TEXT; due_at TIMESTAMPTZ; acceptance_criteria JSONB default []; dependencies JSONB default []; approval_required BOOLEAN default true; completed_at TIMESTAMPTZ; created_at and updated_at TIMESTAMPTZ.

### 8. brain_audit_events
Append-only record of important memory changes and approvals. Restrict reads/writes to trusted server-side operations; browser users must not forge audit history.
Fields: id UUID primary key; owner_id UUID not null references auth.users(id); actor_type TEXT; actor_ref TEXT; action TEXT; entity_type TEXT; entity_id UUID; before_snapshot JSONB; after_snapshot JSONB; reason TEXT; created_at TIMESTAMPTZ.

## Security baseline

- Enable RLS on every public-schema table.
- User-owned policies target TO authenticated and use (select auth.uid()) = owner_id. UPDATE requires both USING and WITH CHECK.
- No anon access.
- Do not grant Data API access until Supabase Auth is live and verified. Check explicit grants because the October 30, 2026 default changed.
- Do not rely on auth.user_metadata for authorisation.
- Never expose service_role or secret keys to client-side code.
- Keep audit event insertion server-side and append-only.
- Avoid SECURITY DEFINER unless a specific reviewed requirement justifies it; if used, place it in a non-exposed schema and explicitly check auth.uid().
- Index owner_id, project_id, status, review_due_at and common foreign-key/query paths.
- Use FK delete behavior deliberately: provenance should not disappear when a source is referenced; use RESTRICT where appropriate.
- Do not place private messages, voice notes, sensitive personal disclosures or customer information in general memory by default.
- Secrets, API keys, passwords, access codes and session cookies are never memory records.

## Implementation sequence

1. Complete Supabase Auth and bind the existing Studio access experience to a verified founder identity. Keep the preview access gate only as an additional layer if needed.
2. Confirm the correct local/preview migration workflow and establish migration history for the current hosted foundation without destructive reconciliation.
3. Generate a migration using the Supabase CLI migration workflow. Current CLI v3 behavior is local-first; inspect supabase --help and relevant migration command help before use.
4. Apply the new schema first to a development database or local stack, not the shared hosted project.
5. Run schema tests, RLS tests for unauthenticated, owner and non-owner contexts, and advisor checks.
6. Only then apply to the hosted project with explicit founder approval.
7. Add typed data access and a private knowledge-library UI.
8. Add retrieval to the Brain only after auth, permission and citation tests pass.

## Current implementation status

- Architecture specification: committed in docs/agents/brain-knowledge-memory-architecture.md.
- Existing schema assessment: completed and recorded here.
- New memory tables: NOT created.
- Supabase Auth integration: NOT implemented.
- Brain retrieval and persistent memory: NOT implemented.
- Existing public tables: unchanged.
- Existing writings: untouched.

This sequence deliberately avoids making a new persistent-memory table reachable through the Data API before identity and access controls are ready.
