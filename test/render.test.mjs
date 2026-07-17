// test/render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { renderDeck } from '../lib/render.mjs';

const FIXTURE = `<!DOCTYPE html><html><head><style>
section{width:1080px;height:1440px;position:relative;overflow:hidden;background:#11296b;}
</style></head><body>
<section id="a"></section><section id="b"></section>
</body></html>`;

function pngSize(p) {
  const out = execFileSync('python3', ['-c',
    `from PIL import Image;im=Image.open(r'${p}');print(im.size[0],im.size[1])`]).toString().trim();
  return out.split(' ').map(Number);
}

test('renders one 1080x1440 png per section', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'rl-render-'));
  const html = join(dir, 'deck.html');
  writeFileSync(html, FIXTURE);
  const files = await renderDeck(html, dir);
  assert.equal(files.length, 2);
  for (const f of files) {
    assert.ok(existsSync(f), `${f} exists`);
    assert.deepEqual(pngSize(f), [1080, 1440]);
  }
});
