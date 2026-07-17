import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listPending, markProcessed } from '../lib/queue.mjs';

function setupQueueDir() {
  const dir = mkdtempSync(join(tmpdir(), 'rl-queue-'));
  mkdirSync(join(dir, 'pending'));
  mkdirSync(join(dir, 'processed'));
  return dir;
}

test('listPending reads and parses all pending files, sorted by edition', () => {
  const dir = setupQueueDir();
  writeFileSync(join(dir, 'pending', '63.json'), JSON.stringify({ edition: 63, title: 'RunLetters #63' }));
  writeFileSync(join(dir, 'pending', '62.json'), JSON.stringify({ edition: 62, title: 'RunLetters #62' }));
  const result = listPending(dir);
  assert.equal(result.length, 2);
  assert.deepEqual(result.map(r => r.edition), [62, 63]);
  assert.equal(result[0].data.title, 'RunLetters #62');
});

test('listPending returns empty array when nothing pending', () => {
  const dir = setupQueueDir();
  assert.deepEqual(listPending(dir), []);
});

test('markProcessed moves the file out of pending into processed', () => {
  const dir = setupQueueDir();
  const pendingPath = join(dir, 'pending', '63.json');
  writeFileSync(pendingPath, JSON.stringify({ edition: 63 }));
  const newPath = markProcessed(pendingPath, dir);
  assert.equal(newPath, join(dir, 'processed', '63.json'));
  assert.ok(!existsSync(pendingPath));
  assert.ok(existsSync(newPath));
});
