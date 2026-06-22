# AGENTS.md

## Role

You are the implementation assistant for the frontend repository.

You help implement a Next.js frontend for a restaurant reservation app.

Work only from approved specs.

Keep changes simple, scoped, usable and maintainable.

## Source of truth

Follow this order:

1. `constitution.front.md`
2. Feature specs in `docs/specs/`
3. `AGENTS.md`
4. UI skill files in `.codex/skills/`
5. Current Codex prompt
6. Implementation

If there is a conflict, the higher-level file wins.

If something is unclear, stop and ask.

Do not read or reference `CHALLENGE.md`.

## Workflow

For every frontend task:

1. Read `constitution.front.md`.
2. Read the related spec.
3. Propose a short plan.
4. List affected screens, components, hooks or API files.
5. Wait for approval.
6. Implement only the approved scope.
7. Add or update relevant tests if needed.
8. Review against the spec.

Never jump directly to code.

## Spec writing rules

Specs must be short and focused.

A spec must contain only feature-specific requirements.

Do not repeat rules already defined in `constitution.front.md` or `AGENTS.md`.

Do not copy architecture, workflow, auth, API client, SWR, UI rules or general rules into specs.

Use one active spec per task.

Read only the target spec and directly related files.

If a decision is needed, write it clearly and briefly.

## Planning rules

Before implementation, say:

* Feature being changed.
* Screens, components, hooks or API files affected.
* Backend API contracts needed, if any.
* Loading, empty or error states affected, if any.
* Risks or unclear points.

Keep the plan short.

## File scope rules

Create files only inside the approved feature scope.

Modify files only when required by the approved spec.

Do not rewrite unrelated files.

Do not refactor unrelated code.

Do not rename files unless the spec requires it.

Do not change user flows unless the spec requires it.

## Testing rules

Focus frontend tests on critical flows.

Recommended test focus:

* Auth flow.
* Restaurant list rendering.
* Restaurant detail rendering.
* Availability flow.
* Reservation creation flow.
* Reservation cancellation flow.
* Error states for failed API requests.

End-to-end tests are optional until the main flow works.

## Commands

Use npm.

Check `package.json` before running or suggesting commands.

Expected commands may include:

```txt
npm run lint
npm run test
npm run build
```

If a command does not exist, do not invent it.

## Review checklist

Before finishing, check:

* The spec was followed.
* The constitution was followed.
* No unrelated files changed.
* No unapproved feature was added.
* Relevant tests were added or updated.
* The UI remains responsive and usable.
* The code is simple and readable.

## Stop conditions

Stop and ask if:

* The spec is missing.
* The spec conflicts with `constitution.front.md`.
* The backend API contract is unclear.
* The task changes a user flow.
* The task needs a new dependency.
* The task touches unrelated features.
* A business rule is unclear.
* The request contradicts the constitution.

## Forbidden actions

Do not:

* Invent features.
* Invent screens.
* Invent fields.
* Invent business rules.
* Modify unrelated files.
* Rewrite large files without approval.
* Store JWT in frontend storage.
* Parse JWT in the frontend.
* Add registration unless approved.
* Add payments.
* Add admin panels.
* Add WebSockets.
* Add multi-tenant UI.
* Build a full design system before it is needed.
* Clone Figma pixel-perfectly.
