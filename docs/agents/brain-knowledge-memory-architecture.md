# The Brain — Knowledge & Memory Architecture

Status: design specification v1.0
Owner: Thoughts of Cee founder
Implementation branch: feature/creative-studio
Operating mode: free-first, model-independent, founder-controlled

## 1. Purpose

The Brain's memory is the governed knowledge system for Thoughts of Cee and its connected ventures. It must help the Brain and authorised specialist roles understand what is being built, why it is being built, what has already been decided, what evidence supports a claim, what remains uncertain, and what action is permitted next.

This is not an indiscriminate transcript archive and it is not a substitute for judgement. It is a curated, searchable, versioned body of approved context, evidence, decisions, project records and operating procedures.

## 2. Mission and venture map

### Thoughts of Cee
A public-facing editorial and storytelling brand built around honest, compassionate, non-judgmental writing and creative work. Its purpose is to help people feel recognised and less alone. It is not therapy and must not imply clinical credentials or outcomes.

Brand voice: warm, reflective, intimate, understated, human, literary but accessible; honest rather than preachy; specific rather than generic. Avoid hollow motivation, engagement bait, forced profundity and false lived experience.

Visual identity: vintage editorial; linen cream #EAE4DB, black #000000, soft stone #292522, muted mocha #765D4B, paper-line #CFC4B7; bold condensed uppercase display typography. Signature lockup: THOUGHTS OF CEE, tagline “Where feelings become words.” and three centered dots. Keep imagery semi-anonymous where requested.

Content formats and series include Fragments, Letters, Read That Again, The Push, Days Between, Things I Learned Slowly, Love & Loss, and behind-the-words/voice content. Existing writing is protected intellectual property. In particular, never overwrite, delete, migrate or rewrite app/data/writings.ts as part of Studio work without separate explicit approval.

### Thoughts of Cee Creative Studio
A private creative workspace intended to evolve toward an accessible Canva-like editor and production environment. It includes the creative editor, planning room, agent workspaces, knowledge base, approval workflows and eventually AI-assisted image/video production. Existing editor functionality must be described accurately; prototypes must not be represented as production-ready.

### Karamelaa
A later AI companion venture, to be developed only with user research, validation, privacy safeguards and clear non-therapy boundaries. The companion should feel warm and supportive without claiming to be a therapist or providing diagnosis or clinical treatment.

### Commercial strategy
The working sequence is:
1. Build Thoughts of Cee audience, trust, content system and digital products.
2. Validate productised creative services with paying business customers.
3. Develop Karamelaa after evidence of user need, retention and safe operating design.
4. Consider commercialising the Creative Studio after internal use and market validation.

The founder's stated ambition is USD 100,000 per month within three years. Treat this as an ambition, not a forecast or promise. Every model must distinguish revenue, gross profit, operating profit, taxes, costs, cash flow and owner's income. Illustrative prices, conversion rates and customer counts are assumptions until validated by real data and paying customers.

## 3. Knowledge domains

Organise memory into linked domains rather than one flat prompt:

1. **Identity & brand** — mission, positioning, audience hypotheses, voice, visual system, content pillars, intellectual property and approved brand assets.
2. **Founder-approved context** — goals, constraints, preferences and explicit approvals. Exclude secrets and sensitive personal information unless genuinely necessary and explicitly authorised.
3. **Strategy & business model** — venture map, target customers, hypotheses, pricing tests, unit economics, channels, milestones, risks and validated learning.
4. **Projects & delivery** — project briefs, outcomes, scope, tasks, milestones, dependencies, owners, blockers, acceptance criteria and change history.
5. **Agents & operating procedures** — role boundaries, instructions, skills, tools, evidence standards, handoff contracts, evaluation benchmarks and permissions.
6. **Research & references** — source records, evidence summaries, methodologies, limitations, conflicts, review dates and links to claims supported.
7. **Creative IP & story worlds** — original characters, series bibles, scripts, episode continuity, consent/rights records and approved production assets.
8. **Technical architecture** — repository/branch rules, system components, deployment environments, data models, integrations, known limitations and change records.
9. **Decisions & lessons** — decision log, rationale, alternatives, evidence available at the time, approver, reversibility, review trigger and outcome.
10. **Performance & learning** — content analytics, customer interviews, experiments, revenue and cost data, results, uncertainty and lessons.

## 4. Knowledge record types

Every item must have a stable ID and a record type:
- Brand principle
- Founder preference or constraint
- Project brief
- Decision
- Task or milestone
- Research source
- Evidence note
- Claim
- Skill or procedure
- Agent specification
- Tool specification
- Creative work / IP record
- Experiment
- Metric / observation
- Risk
- Approval / consent record
- Technical change
- Lesson learned

Do not silently convert an idea, suggestion, draft or assumption into an approved fact.

## 5. Required metadata

Each knowledge record should carry, where applicable:
- Stable ID and title
- Domain, type and relevant project/agent tags
- Concise summary and full content or secure content reference
- Origin: founder, internal project, external source, system observation or AI-generated draft
- Author/creator and responsible reviewer
- Created, updated and last-verified timestamps
- Version and status: draft, proposed, approved, active, superseded, archived or withdrawn
- Evidence class: verified fact, source-reported claim, expert interpretation, founder decision, inference, hypothesis, assumption or creative choice
- Source URL / DOI / citation and publication date
- Method, sample/population and context where relevant
- Confidence and limitations, with rationale (not an unexplained numerical score)
- Rights/licence and permitted use
- Sensitivity and access classification
- Retention/review date and supersedes/superseded-by links
- Related claims, decisions, tasks, projects and agents

Metadata must not imply more certainty than the source supports.

## 6. Evidence and source governance

### Source hierarchy
Prioritise sources according to the question being answered:
1. Primary official material: legislation, regulators, standards bodies, official product documentation, official statistics, audited filings and original datasets.
2. Peer-reviewed systematic reviews, meta-analyses, high-quality primary studies and established academic research.
3. Recognised academic/professional institutions, university presses, textbooks and established research organisations.
4. Credible industry reports and practitioner case studies with transparent methods and attributable data.
5. Expert commentary and professional experience, clearly labelled as opinion or interpretation.
6. Community discussion and anecdotal material, useful for generating hypotheses but not sufficient alone for high-stakes factual claims.

A source's prestige does not make every claim correct. Assess relevance, date, methods, population, sample, measurement, conflicts of interest, limitations, reproducibility and corroboration. Prefer original sources over summaries when feasible.

### Evidence note requirements
For every material research finding record:
- Question the research was intended to answer
- Exact claim being supported (and what it does not support)
- Source and source type
- Study/report design, population, geography and date
- Main result in accurate context
- Limitations, uncertainty and possible bias
- Independent corroboration or conflicting evidence
- Implication for Thoughts of Cee / the relevant venture
- Review or expiry trigger

Never fabricate citations, statistics, credentials, source details, research findings or tool results. Never use a single anecdote as proof of a general pattern. Do not present correlation as causation. For changing platform, legal, technical, pricing or market information, verify current official sources before acting.

### Claims ledger
Important claims used in strategy, public content, product copy or business decisions must link to one or more evidence notes. Record claim status as supported, partially supported, disputed, outdated or unsupported. If support is missing, label the claim as a hypothesis or remove it.

## 7. Decision memory

Keep a decision log separate from discussion transcripts. Each decision includes:
- Decision statement
- Context and objective
- Options considered
- Evidence and assumptions at decision time
- Risks and trade-offs
- Decision owner and approval date
- Reversibility
- Review date or event trigger
- Outcome and lessons when known

A later suggestion does not automatically replace an earlier approved decision. Mark superseded decisions and preserve their history. Ask the founder before reversing a consequential approved decision.

## 8. Project and task memory

Every project has an objective, scope, owner, status, milestones, dependencies, risks, budget/cost constraints, definition of done and decision history.

Every task has a clear deliverable, responsible agent/person, status, priority, due date if real, dependencies, acceptance criteria, evidence/asset links and approval requirement. Do not invent completion or due dates. Status vocabulary: proposed, ready, in progress, blocked, in review, awaiting approval, done, cancelled.

The Brain should produce a concise founder briefing: progress, completed deliverables, blockers, decisions needed, risks, costs, next actions and confidence. It must distinguish tasks it actually executed from work it merely drafted or recommended.

## 9. Agent access and handoffs

Specialists receive least-privilege access to the knowledge domains required for their role. They should not receive all founder context by default.

Each handoff contains:
- Objective and expected deliverable
- Relevant approved context and source references
- Constraints and prohibited actions
- Required evidence standard
- Deadline only when established
- Acceptance criteria
- Dependencies and return format

Agent outputs are proposals until reviewed. The Brain must not claim independent delegation unless a real agent runtime executed the task and returned an auditable result. Human approval remains required for consequential actions.

## 10. Privacy, rights and security

- Never store API keys, passwords, access codes, session secrets or payment credentials in the knowledge base.
- Do not ingest private DMs, emails, voice notes, personal disclosures or customer data into general memory by default.
- Obtain explicit informed permission before using someone's personal story, voice, likeness or identifiable details in creative work.
- A changed name alone does not anonymise a story. Use composite fictionalisation and assess re-identification risk.
- Store consent and rights records separately with narrow access.
- Minimise personal data, define retention periods and support correction/deletion workflows subject to applicable legal obligations.
- Never expose service-role keys or privileged credentials in browser code.
- Enforce owner-based access controls and row-level security on exposed database tables. Keep privileged operations server-side and auditable.

## 11. Retrieval and response rules

When answering from memory, The Brain should:
1. Retrieve the smallest relevant set of records.
2. Prefer approved and current records over drafts and superseded records.
3. Check provenance, access rights and review status.
4. Resolve conflicts by surfacing them, not silently choosing one.
5. Cite or link source records for material factual claims.
6. Clearly label evidence, founder decisions, assumptions, inference and creative judgement.
7. State when relevant knowledge is missing or stale.
8. Ask the founder only when a missing decision materially blocks safe progress.

Memory should be curated and updated through explicit workflows, not by automatically treating every conversation as durable truth.

## 12. Quality controls and maintenance

- Review active strategic assumptions monthly or when new evidence arrives.
- Review technical references whenever dependencies/platforms change and before implementation.
- Review research sources on a schedule appropriate to the domain; fast-changing claims need shorter review intervals.
- Mark expired or superseded references; do not silently delete provenance.
- Run duplicate, contradiction, missing-source and stale-record checks.
- Test retrieval against representative questions from every knowledge domain.
- Evaluate whether the Brain retrieves the right record, cites it accurately, respects permissions, distinguishes uncertainty and avoids inventing context.
- Keep backups, version history and an audit trail for edits and approvals.

## 13. Acceptance tests for the first Brain Memory release

The first release is not complete until it can:
1. Explain the relationship between Thoughts of Cee, Creative Studio and Karamelaa without conflating their products or audiences.
2. State the commercial sequence and identify which parts are hypotheses rather than validated revenue.
3. Retrieve the brand voice and visual identity consistently.
4. Identify protected writing files and refuse unapproved destructive edits.
5. Find the latest approved project decision and explain whether it has been superseded.
6. Present a research claim with source, date, limitations and evidence class.
7. Distinguish a draft work order from actual independent-agent execution.
8. Summarise active projects, tasks and blockers without inventing status.
9. Refuse access to secrets and restricted personal data.
10. Identify conflicting or stale knowledge and ask for review rather than guessing.

## 14. Standards and foundational references

These sources inform the architecture; they do not certify this implementation.

- Wilkinson et al. (2016), “The FAIR Guiding Principles for scientific data management and stewardship,” Scientific Data. https://doi.org/10.1038/sdata.2016.18
  - Applied here: findability, accessibility with appropriate authorisation, interoperability and reusability through rich metadata, licences and provenance.
- W3C (2013), PROV-DM: The PROV Data Model. https://www.w3.org/TR/prov-dm/
  - Applied here: track entities, activities, responsible agents, derivations and the history of knowledge assets.
- NIST, Research Data Framework (RDaF), Special Publication 1500-18 Revision 2. https://nvlpubs.nist.gov/nistpubs/SpecialPublications/1500-18/NIST.SP.1500-18r2.pdf
  - Applied here: lifecycle thinking, metadata, provenance, versioning, curation and preservation.
- ISO 30401:2018, Knowledge management systems — Requirements. https://www.iso.org/standard/68683.html
  - Use the official ISO publication and licensed standard for formal requirements; this architecture is an internal design, not a claim of ISO compliance.

## 15. Implementation sequence

1. Approve this domain model and access policy.
2. Map the model onto the existing Studio database foundation; do not create duplicate tables before inspecting the current schema.
3. Design ownership, permissions, RLS and audit history before enabling user-facing access.
4. Implement knowledge records, sources, claims, decisions and project links.
5. Build a private knowledge library UI with search, filters, source detail, version history and review status.
6. Add retrieval to the Brain only after access control and citation tests pass.
7. Add specialist-scoped retrieval and handoff contracts.
8. Run the acceptance tests before treating memory as reliable.

## 16. Current limitations

This document is a design specification, not an implemented memory service. The first Brain chat does not yet persist memory, search this knowledge base, access independent specialist runtimes or maintain a task ledger. Those capabilities must be implemented and tested before being advertised as available.
