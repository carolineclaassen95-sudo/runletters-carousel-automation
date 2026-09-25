# Carousel build routine: backlog found, run stopped without building anything

Run date: 2026-09-25 (scheduled Friday build routine).

## What happened

`queue/pending/` should hold at most one entry per the routine's own
assumption ("there should only ever be one — process just it"). This run
found **7**:

- `65 (beehiiv support test).json` — looks like a Beehiiv connection-test
  artifact, not a real edition (title: "RunLetters #65 (beehiiv support
  test)"). Queued 2026-08-28.
- `66.json` — queued 2026-08-28
- `68.json` — queued 2026-08-28
- `70.json` — queued 2026-09-04
- `71.json` — queued 2026-09-11
- `72.json` — queued 2026-09-18
- `73.json` — queued 2026-09-25 (today's)

The last successful build was edition 69, on 2026-08-28 (see
`queue/ready/69/`, `queue/processed/69.json`, and the `history/recent-editions.json`
entry). Since then, four consecutive weekly runs (2026-09-04, -11, -18, -25)
have added new pending entries but none have been built or sent to Slack —
a full month of silent backlog with no record of why, since this is the
first run to leave a note about it.

Because the routine's instructions assume exactly one pending item and
don't say how to order or filter a backlog like this, this run did not
guess. It did not build any carousel, did not commit anything to
`queue/ready/`, and did not post to Slack.

## Also worth knowing

Every pending/processed file, including the already-approved edition 69,
has `publish_date` hardcoded to `"1970-01-21"` from the Make.com/Beehiiv
fetch step. This is not new (69 has it too) and evidently isn't what
blocked the backlog, but it flows straight into each carousel's `date`/
`date_display` fields, so every rendered carousel slide showing a date is
showing a wrong one.

## What this run did

- `git pull` (repo was in a detached-HEAD state at the correct commit;
  switched back to `main` and fast-forwarded — no code changes).
- Inspected the pending queue, git history of `queue/pending/`, and
  `queue/ready/` / `queue/processed/` / `history/recent-editions.json` to
  establish the above.
- Attempted to notify Caroline via the PushNotification tool; it rejected
  its own required `status: "proactive"` field as invalid on every attempt
  (looks like an environment-side bug, not something fixable from here).
- Checked for the Slack MCP tools this routine normally uses for the
  approval message; `ListConnectors` reports Slack as connected and
  enabled for this chat, but no `mcp__Slack__*` tools were discoverable via
  ToolSearch, so no Slack message could be sent either.
- Wrote this file instead, as the only remaining durable way to leave a
  record, and left the queue untouched.

## Needs a decision from Caroline

1. Should `65 (beehiiv support test).json` be deleted from `queue/pending/`
   (and its `65-assets/` folder), or is there a reason it's meant to be
   processed?
2. For the 6 real backlogged editions (66, 68, 70, 71, 72, 73): process
   all of them oldest-first in upcoming runs, skip the stale ones, or
   something else?
3. Is there a known reason the routine stopped completing after edition 69
   — e.g. did something change around 2026-08-28 in Make.com, the Slack
   approval flow, or this repo's automation setup?
4. The `publish_date: "1970-01-21"` placeholder — worth fixing at the
   Make.com/Beehiiv fetch step so real dates reach `content.json`.

Nothing in `queue/`, `history/`, or git history was modified by this run
beyond this file and the routine `git pull` fast-forward.
