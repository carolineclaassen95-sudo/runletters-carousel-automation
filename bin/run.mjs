// bin/run.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildDeck } from '../lib/build-deck.mjs';
import { buildCaption } from '../lib/caption.mjs';
import { renderDeck } from '../lib/render.mjs';

export async function buildCarousel(content, queueDir) {
  const outDir = join(queueDir, 'ready', String(content.edition));
  mkdirSync(outDir, { recursive: true });

  const html = buildDeck(content);
  const deckPath = join(outDir, `Instagram Carousel ${content.edition}.html`);
  writeFileSync(deckPath, html);

  const slides = await renderDeck(deckPath, outDir);
  const caption = buildCaption(content);
  writeFileSync(join(outDir, 'caption.txt'), caption);

  return { outDir, deckPath, slides, caption };
}

// CLI entrypoint, unchanged usage: node bin/run.mjs <content.json> [--queue-dir <dir>]
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const contentPath = args[0];
  if (!contentPath) { console.error('usage: node bin/run.mjs <content.json> [--queue-dir <dir>]'); process.exit(1); }
  const content = JSON.parse(readFileSync(contentPath, 'utf8'));
  const queueDir = args.includes('--queue-dir') ? args[args.indexOf('--queue-dir') + 1] : process.cwd();
  const result = await buildCarousel(content, queueDir);
  console.log(JSON.stringify(result, null, 2));
}
