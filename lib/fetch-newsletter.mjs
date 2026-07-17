import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import https from 'node:https';

const EDITION_RE = /RunLetters\s*#\s*(\d+)/i;

export function pickEdition(posts) {
  const matched = (posts || [])
    .map(p => {
      const title = p.subject_line || p.title || '';
      const m = title.match(EDITION_RE);
      return m ? { id: p.id, edition: Number(m[1]), title, publish_date: p.publish_date } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b.publish_date || 0) - (a.publish_date || 0));
  return matched[0] || null;
}

export function fridayISO(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

export function displayDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleDateString('en-US',
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function getEnv(key) {
  const env = readFileSync(join(homedir(), 'runletters-command', '.env'), 'utf8');
  const m = env.match(new RegExp(`^${key}=([^#\n]+)`, 'm'));
  return m ? m[1].trim() : null;
}

function apiGet(path, key) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: 'api.beehiiv.com', path, headers: { Authorization: `Bearer ${key}` } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); } }); });
    req.on('error', reject);
    req.end();
  });
}

export async function fetchLatestNewsletter() {
  const key = getEnv('BEEHIIV_API_KEY');
  const pub = getEnv('BEEHIIV_PUBLICATION_ID');
  if (!key || !pub) throw new Error('BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not set');

  const list = await apiGet(
    `/v2/publications/${pub}/posts?limit=20&status=confirmed&order_by=publish_date&direction=desc`, key);
  if (list.errors) throw new Error(JSON.stringify(list.errors));

  const chosen = pickEdition(list.data || []);
  if (!chosen) throw new Error('No "RunLetters #" post found in latest 20 posts');

  const detail = await apiGet(
    `/v2/publications/${pub}/posts/${chosen.id}?expand[]=free_web_content&expand[]=free_email_content`, key);
  const post = detail.data || {};
  const html = post.content?.free?.web || post.content?.free?.email || '';
  if (!html) throw new Error(`No body HTML for post ${chosen.id}`);

  return {
    edition: chosen.edition,
    title: chosen.title,
    publish_date: fridayISO(chosen.publish_date),
    date_display: displayDate(chosen.publish_date),
    html,
  };
}
