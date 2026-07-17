// lib/build-deck.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

function fontFaces() {
  const brown = readFileSync(here('../template/fonts/BrownBeige.otf')).toString('base64');
  const spartan = readFileSync(here('../template/fonts/LeagueSpartan-VariableFont_wght.ttf')).toString('base64');
  return `
@font-face { font-family:'BrownBeige'; src:url('data:font/otf;base64,${brown}') format('opentype'); font-weight:normal; }
@font-face { font-family:'LeagueSpartan'; src:url('data:font/ttf;base64,${spartan}') format('truetype'); font-weight:100 900; }
`;
}

const swipeHint = `<div class="swipe-hint">Keep swiping <span>→</span></div>`;
const slideNum = (n) => `<div class="slide-num">${n} / 8</div>`;

function slide1(c) {
  return `
  <section id="slide-1" data-screen-label="01">
    <div class="bg-photo" style="background:url('${c.hook_bg_image}') center/cover no-repeat; opacity:0.24; filter:grayscale(1); position:absolute; inset:0;"></div>
    <div class="overlay"></div>
    <div class="content">
      <div class="kicker">${c.greeting}</div>
      <div class="big-text">${c.hook_headline_html}</div>
      <div class="sub">${c.tagline}</div>
    </div>
  </section>`;
}

function slide2(c) {
  const items = c.section_list.map(s =>
    `<div class="item"><span class="dot"></span>${s.emoji} ${s.label}</div>`).join('\n        ');
  return `
  <section id="slide-2" data-screen-label="02">
    <div class="bg-lines"></div>
    <div class="yellow-bar"></div>
    <div class="big-num">${c.edition}</div>
    <div class="content">
      <div class="edition-label">Edition #${c.edition} — ${c.date_display}</div>
      <div class="hero-headline">${c.cover_headline_html}</div>
      <div class="tagline">${c.summary}</div>
      <div class="divider"></div>
      <div class="section-list">
        ${items}
      </div>
      <div class="swipe-row">Swipe to explore →</div>
    </div>
    ${slideNum(2)}
  </section>`;
}

function featImg(s, extraOverlay = '', extraCorner = '') {
  return `
      <div class="hero-img">
        ${extraCorner}
        <img src="${s.image}" alt="">
        <div class="h-overlay">
          <div class="h-kicker">${s.kicker}</div>
          <div class="h-title">${s.title_html}</div>
          <div class="h-sub">${s.sub}</div>
        </div>
      </div>`;
}

function slide3(c) {
  const s = c.sections.watchlist;
  return `
  <section id="slide-3" class="feat" data-screen-label="03">
    <div class="content">
      <div class="section-tag">${s.tag}</div>
      <div class="section-headline">${s.headline_html}</div>
      ${featImg(s, '', '<div class="play-badge"></div>')}
    </div>
    ${swipeHint}
    ${slideNum(3)}
  </section>`;
}

function badges(list) {
  if (!list || !list.length) return '';
  return `<div class="badges-row">${list.map(b =>
    `<div class="badge"><span class="y">${b.emoji}</span> ${b.text}</div>`).join('')}</div>`;
}

function slide4(c) {
  const s = c.sections.social;
  return `
  <section id="slide-4" class="feat" data-screen-label="04">
    <div class="content">
      <div class="section-tag">${s.tag}</div>
      <div class="section-headline">${s.headline_html}</div>
      ${featImg(s)}
      ${badges(s.badges)}
    </div>
    ${swipeHint}
    ${slideNum(4)}
  </section>`;
}

function slide5(c) {
  const s = c.sections.events;
  const stats = s.stats.map(st =>
    `<div class="stat"><div class="stat-val">${st.val_html}</div><div class="stat-label">${st.label}</div></div>`).join('\n          ');
  const info = s.info ? `
      <div class="info-card" style="margin-top:24px; display:flex; align-items:center; gap:20px; background:var(--yellow); border-radius:20px; padding:24px 30px;">
        <div style="font-size:28px; font-weight:800; color:var(--navy); letter-spacing:0.02em; text-transform:uppercase; line-height:1.15;">${s.info.label_html}</div>
        <div style="font-family:'BrownBeige',sans-serif; font-size:40px; color:var(--navy); line-height:1; text-transform:uppercase; margin-left:auto; white-space:nowrap;">${s.info.url}</div>
      </div>` : '';
  const note = s.note_html ? `<div class="race-note">${s.note_html}</div>` : '';
  return `
  <section id="slide-5" class="feat" data-screen-label="05">
    <div class="bg-photo" style="background:url('${s.bg_image}') center/cover no-repeat; opacity:0.4; position:absolute; inset:0;"></div>
    <div class="overlay"></div>
    <div class="content">
      <div class="section-tag">${s.tag}</div>
      <div class="section-headline">${s.headline_html}</div>
      <div class="country-tag">${s.country_html}</div>
      <div class="race-stack">
        <div class="race-card">
          <div class="city-info">
            <div class="city-name">${s.city}</div>
            <div class="city-date">${s.city_date}</div>
          </div>
          <div class="price-block">
            <div class="price">${s.price}</div>
            <div class="price-label">${s.price_label}</div>
          </div>
        </div>
        <div class="stat-strip">
          ${stats}
        </div>
      </div>
      ${note}
      ${info}
    </div>
    ${swipeHint}
    ${slideNum(5)}
  </section>`;
}

function slide6(c) {
  const s = c.sections.gear;
  const specs = s.specs.map(sp =>
    `<div class="spec"><div class="spec-label">${sp.label}</div><div class="spec-val">${sp.val_html}</div></div>`).join('\n          ');
  // NOTE: never render a promo/discount block here.
  // Gear note gets its own readable card (the .race-note class is scoped to slide-5, so style it inline here).
  const note = s.note_html ? `
      <div style="margin-top:24px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:28px 32px;">
        <div style="font-size:30px; font-weight:500; color:rgba(255,255,255,0.85); line-height:1.4;">${s.note_html}</div>
      </div>` : '';
  return `
  <section id="slide-6" class="feat" data-screen-label="06">
    <div class="bg-lines"></div>
    <div class="content">
      <div class="section-tag">${s.tag}</div>
      <div class="section-headline">${s.headline_html}</div>
      <div class="product-stage">
        <div class="new-badge">${s.badge_html}</div>
        <img src="${s.image}" alt="" style="object-position:${s.image_position || 'center'};">
        <div class="spec-row">
          ${specs}
        </div>
      </div>
      ${note}
    </div>
    ${swipeHint}
    ${slideNum(6)}
  </section>`;
}

function slide7(c) {
  const s = c.sections.wildcard;
  const corner = `<div class="diy-badge">${s.badge_html}</div>`;
  return `
  <section id="slide-7" class="feat" data-screen-label="07">
    <div class="content">
      <div class="section-tag">${s.tag}</div>
      <div class="section-headline">${s.headline_html}</div>
      ${featImg(s, '', corner)}
    </div>
    ${swipeHint}
    ${slideNum(7)}
  </section>`;
}

function slide8(c) {
  return `
  <section id="slide-8" data-screen-label="08">
    <div class="bg-lines"></div>
    <div class="yellow-bar"></div>
    <div class="content">
      <div class="cta-label">Want this in your inbox?</div>
      <div class="cta-action">COMMENT<br><span class="highlight">'NEWS'</span><br>BELOW</div>
      <div class="cta-sub">and I'll send you the latest edition of RunLetters 💙</div>
      <div class="cta-meta">
        <div class="ed-badge">Edition #${c.edition}</div>
        <div class="ed-date">${c.date_display}</div>
      </div>
    </div>
  </section>`;
}

export function buildDeck(content) {
  const css = readFileSync(here('../template/deck.css'), 'utf8');
  const sections = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8]
    .map(fn => fn(content)).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RunLetters #${content.edition} — Instagram Carousel</title>
<style>
${fontFaces()}
${css}
</style>
</head>
<body>
${sections}
</body>
</html>`;
}
