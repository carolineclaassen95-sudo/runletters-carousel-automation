import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCarousel } from '../bin/run.mjs';

const content = JSON.parse(readFileSync(
  fileURLToPath(new URL('../schema/content.example.json', import.meta.url)), 'utf8'));

test('buildCarousel writes 8 slides + caption.txt into queueDir/ready/<edition>', async () => {
  const queueDir = mkdtempSync(join(tmpdir(), 'rl-run-'));
  const result = await buildCarousel(content, queueDir);
  assert.equal(result.slides.length, 8);
  for (const s of result.slides) assert.ok(existsSync(s));
  assert.ok(existsSync(join(queueDir, 'ready', '57', 'caption.txt')));
  const caption = readFileSync(join(queueDir, 'ready', '57', 'caption.txt'), 'utf8');
  assert.match(caption, /^Did you already check out edition #57\?/);
});
