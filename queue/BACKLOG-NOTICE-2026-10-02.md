# Carousel build routine: backlog still unresolved, run stopped without building anything

Run date: 2026-10-02 (scheduled Friday build routine).

## What happened

Same situation as `queue/BACKLOG-NOTICE-2026-09-25.md`, one week later and
one entry worse. `queue/pending/` now holds **8** entries instead of the
single entry the routine assumes:

- `65 (beehiiv support test).json` — still there, still looks like a
  Beehiiv connection-test artifact, not a real edition.
- `66.json`, `68.json`, `70.json`, `71.json`, `72.json`, `73.json` — same
  as last week, untouched.
- `74.json` — new this week (queued 2026-10-02).

Last successful build is still edition 69 (2026-08-28). That's now six
consecutive weekly runs (09-04, 09-11, 09-18, 09-25, and now 10-02, plus
whatever produced 74 today) that have piled up pending entries without a
decision on how to work through them.

Per last week's note, this run did not guess at ordering/filtering and did
not build, commit to `queue/ready/`, or post anything to Slack.

## What this run did differently

Unlike last week, both the PushNotification tool and the Slack MCP tools
(`mcp__Slack__*`) are reachable from this session. Sent Caroline a push
notification summarizing this backlog and asking for the same decisions
listed below. No Slack message was sent to #carousel-approval since there
is no carousel ready to approve.

## Needs a decision from Caroline (unchanged from last week)

1. Should `65 (beehiiv support test).json` be deleted from `queue/pending/`
   (and its `65-assets/` folder), or is there a reason it's meant to be
   processed?
2. For the 7 real backlogged editions (66, 68, 70, 71, 72, 73, 74): process
   all of them oldest-first in upcoming runs, skip the stale ones, or
   something else?
3. Is there a known reason the routine stopped completing after edition 69
   — e.g. did something change around 2026-08-28 in Make.com, the Slack
   approval flow, or this repo's automation setup?
4. The `publish_date: "1970-01-21"` placeholder issue flagged last week is
   still unverified either way — worth fixing at the Make.com/Beehiiv fetch
   step if confirmed.

Nothing in `queue/`, `history/`, or git history was modified by this run
beyond this file and the routine `git pull` fast-forward.
