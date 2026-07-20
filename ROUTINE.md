# RunLetters Carousel — Build Routine

You run every Friday to check for a new RunLetters newsletter edition and, if
found, build its Instagram carousel and send it to Caroline in Slack for approval.

## Steps

1. `git pull` in this checked-out repo.
2. Run: `node -e "import('./lib/queue.mjs').then(m => console.log(JSON.stringify(m.listPending('queue'))))"` (queueDir is the `queue/` folder itself, containing `pending/`, `ready/`, `processed/` — not the repo root).
   If the result is `[]`, stop — nothing to do this run. Do not send any Slack message.
3. For the first pending entry (there should only ever be one — process just it):
   a. Read `data.html` from the pending JSON (the full Beehiiv post HTML Make.com already fetched).
   b. Run: `node -e "import('./lib/parse-newsletter.js').then(m => console.log(JSON.stringify(m.parseNewsletterSections(require('fs').readFileSync('/tmp/edition.html','utf8')))))"`
      — first write `data.html` to `/tmp/edition.html`, then run the above to get the 5 parsed sections (watchlist/social/events/gear/wildcard), each `{heading, text, links}`.
   c. Read `history/recent-editions.json` in this repo (create it as `[]` if it doesn't exist yet) — an array of the last 8 editions' `{edition, hook_line}`. Treat every `hook_line` in it as off-limits to reuse or closely imitate.
   d. Author a `content.json` object matching `schema/content.example.json`'s exact shape, following these rules:
      - Voice: peer not authority, relentlessly positive, honest/self-deprecating, short punchy rhythm, British/European spelling, emoji seasoned not buried. NEVER use an em-dash, "genuine"/"genuinely", or "it's not X, it's Y" phrasing.
      - `hook_line`: a full rhetorical-question or announcement first line (e.g. "Did you already check out edition #N?"), varied — must not match or closely echo anything in `history/recent-editions.json`.
      - `edition`, `date` (the pending entry's publish date, `YYYY-MM-DD`), `date_display` (e.g. "June 5, 2026") carry straight from the pending JSON.
      - Rewrite each of the 5 parsed sections into punchy on-brand slide copy for `sections.watchlist`, `sections.social`, `sections.events`, `sections.gear`, `sections.wildcard` (see `schema/content.example.json` for the exact per-section field shape: `tag`, `headline_html`, `image`/`bg_image`, `kicker`, `title_html`, `sub`, plus section-specific fields like `badges` or `stats`). Pull image URLs from the parsed section's links where present.
      - Fill `caption_lines` (one `{emoji, text}` per section) — short enough to read as one caption line each.
      - Omit any discount code or promo mention anywhere.
   e. Write `content.json` to `/tmp/content-<edition>.json`.
   f. Run: `node -e "import('./bin/run.mjs').then(m => m.buildCarousel(require('/tmp/content-<edition>.json'), 'queue').then(r => console.log(JSON.stringify(r))))"` — this renders the 8 PNGs and `caption.txt` into `queue/ready/<edition>/`.
   g. Eyeball-check: read the 8 PNG file sizes with `ls -la queue/ready/<edition>/` — each should be a real, non-trivial PNG (tens to hundreds of KB, not near-zero). If any slide looks wrong, stop and do not proceed to Slack — leave the file in `queue/pending/` for manual investigation.
   h. `git add queue/ready/<edition>/ && git commit -m "carousel: edition <edition>" && git push`.
   i. Get the public URLs for each slide: `https://raw.githubusercontent.com/carolineclaassen95-sudo/runletters-carousel-automation/main/queue/ready/<edition>/slide-N.png` for N in 1-8.
   j. Send a Slack message (Slack MCP tool, channel: `#carousel-approval`) with this exact structure. The LAST LINE must be exactly `RUNLETTERS_CAROUSEL_DATA: ` followed by one single-line JSON object with no line breaks inside it (Make.com parses this line mechanically on approval, so it must stay on one line, be the last line of the message, and use no other line starting with that marker):
      ```
      RunLetters #<edition> carousel ready to approve

      <caption text from queue/ready/<edition>/caption.txt>

      Slides:
      <slide-1 url>
      <slide-2 url>
      ... (all 8)

      Reply "approve" in this thread to post it to @runletters.
      RUNLETTERS_CAROUSEL_DATA: {"edition": <edition>, "media_urls": [<all 8 urls>], "caption": "<caption text, JSON-escaped, no literal newlines>"}
      ```
   k. Append `{edition, hook_line}` to `history/recent-editions.json`, keep only the most recent 8 entries, commit and push.
   l. Move the pending file to processed: `node -e "import('./lib/queue.mjs').then(m => m.markProcessed('queue/pending/<edition>.json', 'queue'))"`, commit and push.
4. Stop. Do not attempt anything with FeedHive or check for a Slack reply — that's handled entirely by a separate Make.com scenario.

## Constraints

- Never call `api.beehiiv.com` or `api.feedhive.com` — you cannot reach them and should not try.
- Never run `playwright install` — the browser is already at `/opt/pw-browsers/chromium` and `lib/render.mjs` finds it automatically.
- If anything fails partway (render error, git push conflict), leave the pending file where it is and stop — do not send a partial Slack message. The next Friday run (or the 5pm retry) will pick it up again.
