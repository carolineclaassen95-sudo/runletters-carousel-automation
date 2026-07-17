import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseNewsletterSections } from '../lib/parse-newsletter.js';

const html = readFileSync(
  fileURLToPath(new URL('./fixtures/edition-61.html', import.meta.url)), 'utf8');

test('parses all 5 sections from a real edition', () => {
  const sections = parseNewsletterSections(html);
  assert.deepEqual(Object.keys(sections).sort(),
    ['events', 'gear', 'social', 'watchlist', 'wildcard']);
});

test('watchlist section has heading, text, and a video link', () => {
  const sections = parseNewsletterSections(html);
  assert.match(sections.watchlist.heading, /Watchlist/);
  assert.match(sections.watchlist.text, /Marathon du Médoc/);
  assert.ok(sections.watchlist.links.some(l => l.url.includes('youtube.com/embed')));
});

test('gear section link is a real outbound URL, not a tracking anchor-only link', () => {
  const sections = parseNewsletterSections(html);
  assert.ok(sections.gear.links.length > 0);
  assert.ok(sections.gear.links[0].url.startsWith('https://'));
});
