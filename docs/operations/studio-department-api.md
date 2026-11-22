# Studio department API — Preview

These routes are available only through the existing Studio access gate and a verified Supabase founder session. The handlers call the public, owner-scoped RPC functions; they do not accept a user ID from the request body and do not write directly to the private schema.

## Read

- `GET /api/studio/departments/memory` — optional `?status=draft|pending_review|approved|superseded|archived`
- `GET /api/studio/departments/instructions` — optional `?scope=global|project|agent`
- `GET /api/studio/departments/tasks` — optional task `?status=` filter

Each returns `{ ok: true, items: [...] }` for the authenticated founder only.

## Create drafts

- `POST /api/studio/departments/memory`
  - Required: `memory_type`, `title`, `content`
  - Optional: `source_ref`, `provenance`
  - New memory is created as a draft with default internal sensitivity and provisional trust.
- `POST /api/studio/departments/instructions`
  - Required: `scope` (global/project/agent), `title`, `content`
  - Optional: `scope_ref`
  - New instruction is created as a draft.
- `POST /api/studio/departments/tasks`
  - Required: `title`, `objective`
  - Optional: `priority` (low/normal/high/urgent), `acceptance_criteria` (array of up to 30 strings)
  - New task is created in draft status.

## Founder actions

- `POST /api/studio/departments/memory/:id` — approve a memory draft.
- `POST /api/studio/departments/instructions/:id` — approve an instruction draft.
- `POST /api/studio/departments/tasks/:id` — record a task decision. JSON body: `{"decision":"approved|rejected|changes_requested|deferred","rationale":"optional"}`.

Approval and task-decision routes rely on the database RPCs to confirm that the record belongs to the authenticated founder and is in an allowed state.

## Safety and test notes

- All handlers verify the Supabase claim server-side with `auth.getClaims()`.
- The existing Studio HMAC access gate remains active in Preview.
- The authenticated Supabase client is used for RPC calls; no service-role key is used.
- The APIs ignore client-supplied owner IDs.
- Draft creation is a persistent write. Only call POST routes when the founder intends to create a record.
- Do not connect generation, scheduled execution, external communications, or publishing to these endpoints without separate founder approval.
