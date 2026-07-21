# RunLetters Brand Outreach — Weekly Routine

Runs weekly. Finds new running-focused brands, drafts a personalized cold email
in Caroline's voice for each, and leaves them as Gmail drafts for her to review
and send herself. Never sends anything automatically.

## Steps

1. `git pull` in this checked-out repo.
2. Read `brand-outreach/ledger.json`. Every brand listed there (any status) is
   off-limits this run — already contacted, already in a deal, or already an
   existing relationship (per `state/gear-backlog.json` reviews). Build a
   lowercase name+domain exclusion set from it.
3. Search the web for running-focused brands that are NOT in the exclusion set.
   Look for: running shoes/apparel, GPS watches, hydration/nutrition, recovery
   tools, race/event organizers, running apps. Prioritize brands that show
   evidence of already doing creator/influencer partnerships (an "ambassador"
   or "partners" page, visible TikTok/IG collabs, an affiliate program) — they
   convert better than cold brands with no partnership history. Prefer small
   to mid-size DTC brands over massive incumbents (Nike, Adidas) — RunLetters'
   audience size (4,600+ newsletter, ~3,300 combined social) fits a smaller
   sponsor's budget and expectations much better.
4. Pick 3 to 5 qualifying brands this run. If fewer than 3 qualify, do fewer —
   never pad with a poor fit just to hit a number.
5. For each brand, find a real public contact route from their own site
   (a press/partnerships/marketing email, or a general info@ address as
   fallback). Never guess or fabricate an email address — if none can be
   found, skip that brand and note why.
6. Draft a short cold email per brand, in Caroline's voice:
   - Peer tone, not a pitch-deck tone. Warm, direct, a little self-deprecating,
     never salesy.
   - Reference something specific and real about the brand's product (shows
     you looked, not a template).
   - State real audience numbers: 4,674 newsletter subscribers, 55%+ open
     rate (well above the ~20-25% newsletter industry average), YouTube
     @runletters (754 subs, 108K+ views), Instagram (@carolinerunsfree 2,567 +
     @runletters 765).
   - Link to `https://runletters.com/advertise/` for the full media kit and
     rates (do not attach a file, do not restate exact prices in the email
     itself — let the media kit do that).
   - No em-dash, ever. No "genuine"/"genuinely". No "it's not X, it's Y"
     phrasing. No false urgency ("limited spots", "act now"). British/European
     spelling is fine but not required.
   - Sign off as Caroline, first name only.
   - Subject line: short, specific, no "Partnership opportunity" boilerplate.
7. Create each email as a Gmail draft via the Gmail MCP tool (`create_draft`)
   addressed to the discovered contact email. Do NOT send. Drafts only.
8. Append each contacted brand to `brand-outreach/ledger.json` with:
   `{brand, domain, contact_email, date_contacted, status: "drafted", subject}`.
   Update `last_updated`.
9. Commit and push: `git add brand-outreach/ledger.json && git commit -m "outreach: week of <date>" && git push`.
10. Stop. Do not follow up on replies, do not check inbox status. That is
    Caroline's to review each week in Gmail drafts.

## Constraints

- Never send an email directly. Every email is a draft only, Caroline reviews
  and sends.
- Never fabricate a contact email. Skip the brand if none is found.
- Never re-contact a brand already in the ledger, regardless of status.
- Cap at 5 brands per run.
