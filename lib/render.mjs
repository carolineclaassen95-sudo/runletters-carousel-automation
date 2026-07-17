import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CLOUD_CHROMIUM_PATH = '/opt/pw-browsers/chromium';

export async function renderDeck(htmlPath, outDir) {
  const launchOptions = existsSync(CLOUD_CHROMIUM_PATH)
    ? { executablePath: CLOUD_CHROMIUM_PATH }
    : {};
  const browser = await chromium.launch(launchOptions);
  try {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1440 },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    const sections = await page.$$('section');
    const files = [];
    for (let i = 0; i < sections.length; i++) {
      const file = join(outDir, `slide-${i + 1}.png`);
      await sections[i].screenshot({ path: file });
      files.push(file);
    }
    return files;
  } finally {
    await browser.close();
  }
}
