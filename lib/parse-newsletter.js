// Parses a Beehiiv post's free web HTML into the 5 recurring RunLetters sections.
const ENTITY_MAP = { amp:'&', '#39':"'", quot:'"', lt:'<', gt:'>', nbsp:' ', rsquo:'’', lsquo:'‘', rdquo:'”', ldquo:'“', mdash:'—', ndash:'–' };

function decodeEntities(s) {
  return s.replace(/&(#?\w+);/g, (m, code) => {
    if (code[0] === '#') {
      const num = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(num) ? String.fromCodePoint(num) : m;
    }
    return ENTITY_MAP[code] ?? m;
  });
}

function stripTags(html) {
  const cleaned = html.replace(/<style\b[^>]*>.*?<\/style>/gs, ' ').replace(/<script\b[^>]*>.*?<\/script>/gs, ' ');
  return decodeEntities(cleaned.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

const SECTION_MATCHERS = [
  { key: 'watchlist', test: t => /watchlist/i.test(t) },
  { key: 'social', test: t => /social spotlight/i.test(t) },
  { key: 'events', test: t => /(events?\s*&?\s*races?|races?\s*&?\s*events?)/i.test(t) },
  { key: 'gear', test: t => /gear\s*&?\s*gadgets?/i.test(t) },
  { key: 'wildcard', test: t => /wild\s*card/i.test(t) },
];

function classify(headingText) {
  for (const m of SECTION_MATCHERS) if (m.test(headingText)) return m.key;
  return null;
}

function extractLinks(sectionHtml) {
  const links = [];
  const seen = new Set();
  for (const m of sectionHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gs)) {
    const href = decodeEntities(m[1]);
    if (href.startsWith('#') || href.startsWith('mailto:')) continue;
    const text = stripTags(m[2]) || href;
    const key = href;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({ text, url: href });
  }
  for (const m of sectionHtml.matchAll(/<iframe\b[^>]*src=["']([^"']+)["']/gs)) {
    const src = decodeEntities(m[1]);
    if (seen.has(src)) continue;
    seen.add(src);
    links.push({ text: 'Video', url: src.startsWith('//') ? `https:${src}` : src });
  }
  return links;
}

function parseNewsletterSections(html) {
  if (!html) return {};
  const headingRe = /<div[^>]*\bid="([^"]+)"[^>]*>\s*<h[1-3][^>]*>(.*?)<\/h[1-3]>\s*<\/div>/gs;
  const marks = [];
  for (const m of html.matchAll(headingRe)) {
    marks.push({ id: m[1], headingText: stripTags(m[2]), start: m.index, end: m.index + m[0].length });
  }

  const sections = {};
  for (let i = 0; i < marks.length; i++) {
    const key = classify(marks[i].headingText);
    if (!key) continue;
    const bodyStart = marks[i].end;
    const bodyEnd = i + 1 < marks.length ? marks[i + 1].start : html.length;
    const bodyHtml = html.slice(bodyStart, bodyEnd);
    sections[key] = {
      heading: marks[i].headingText,
      text: stripTags(bodyHtml),
      links: extractLinks(bodyHtml),
    };
  }
  return sections;
}

export { parseNewsletterSections, stripTags, decodeEntities };
