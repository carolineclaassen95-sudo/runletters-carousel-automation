export function buildCaption(content) {
  const c = content.caption_lines;
  const hook = content.hook_line
    ? content.hook_line.trim()
    : `Edition #${content.edition} is live!`;
  return [
    `${hook} 🏃`,
    `In this edition:`,
    ``,
    `${c.watchlist.emoji} Watchlist: ${c.watchlist.text}`,
    `${c.social.emoji} Social Spotlight: ${c.social.text}`,
    `${c.events.emoji} Events: ${c.events.text}`,
    `${c.gear.emoji} Gear: ${c.gear.text}`,
    `${c.wildcard.emoji} Wild Card: ${c.wildcard.text}`,
    ``,
    `Comment 'NEWS' below and I'll send it straight to your inbox 💙`,
  ].join('\n');
}
