// bin/run.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { buildDeck } from '../lib/build-deck.mjs';
import { buildCaption } from '../lib/caption.mjs';
import { renderDeck } from '../lib/render.mjs';

const args = process.argv.slice(2);
const contentPath = args[0];
if (!contentPath) { console.error('usage: node bin/run.mjs <content.json> [--out <dir>]'); process.exit(1); }

const content = JSON.parse(readFileSync(contentPath, 'utf8'));
const outRoot = (args.includes('--out') ? args[args.indexOf('--out') + 1] : null) ||
  join(homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'RunLetters Newsletter carousels');
const outDir = join(outRoot, String(content.edition));
mkdirSync(outDir, { recursive: true });

const html = buildDeck(content);
const deckPath = join(outDir, `Instagram Carousel ${content.edition}.html`);
writeFileSync(deckPath, html);

const slides = await renderDeck(deckPath, outDir);
const caption = buildCaption(content);
writeFileSync(join(outDir, 'caption.txt'), caption);

console.log(JSON.stringify({ outDir, deckPath, slides, caption }, null, 2));
