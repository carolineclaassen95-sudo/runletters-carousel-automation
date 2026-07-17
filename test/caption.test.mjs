// test/caption.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildCaption } from '../lib/caption.mjs';

const content = JSON.parse(readFileSync(
  fileURLToPath(new URL('../schema/content.example.json', import.meta.url)), 'utf8'));

test('caption opens with the authored hook line plus emoji', () => {
  const withHook = { ...content, hook_line: "Did you already check out edition #57?" };
  const out = buildCaption(withHook);
  assert.equal(out.split('\n')[0], 'Did you already check out edition #57? 🏃');
  assert.match(out, /^In this edition:$/m);
});

test('caption falls back to a generic hook when hook_line is absent', () => {
  const withoutHook = { ...content };
  delete withoutHook.hook_line;
  const out = buildCaption(withoutHook);
  assert.equal(out.split('\n')[0], 'Edition #57 is live! 🏃');
});

test('caption lists all five sections with per-edition emoji', () => {
  const out = buildCaption(content);
  assert.match(out, /^📺 Watchlist: Should you run a marathon untrained\? George Clarkey finds out$/m);
  assert.match(out, /^👤 Social Spotlight: Aubrey Mvula, from running fan to The Running Channel presenter$/m);
  assert.match(out, /^🗼 Events: Tokyo Legacy Half\. Ballot entry closes Jun 9$/m);
  assert.match(out, /^📚 Gear: Coach Bennett's new book is available to pre-order$/m);
  assert.match(out, /^✨ Wild Card: A finish line proposal that'll make your day$/m);
});

test('caption ends with the NEWS call to action', () => {
  const out = buildCaption(content);
  assert.equal(out.trim().split('\n').pop(),
    "Comment 'NEWS' below and I'll send it straight to your inbox 💙");
});
