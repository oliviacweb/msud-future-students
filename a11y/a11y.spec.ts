import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** The pages every pull request is checked on before it can merge. */
const PAGES = ['/', '/programs'];

/** WCAG 2.1 A and AA, the standard in the DOJ's Title II rule and Colorado's HB21-1110. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** Headers that mark a request as coming from a (headless) browser. */
function isBrowserOnlyHeader(name: string): boolean {
  return name === 'user-agent' || name === 'upgrade-insecure-requests' || name.startsWith('sec-');
}

/**
 * Fetch every page and asset from Node rather than from the headless browser.
 * The CDN in front of Pantheon environments can answer headless Chrome with a
 * bot challenge page, while plain HTTP clients (like the readiness step's curl)
 * get the real site. The browser still renders and styles everything, so axe
 * sees the page a visitor sees.
 */
test.beforeEach(async ({ context }) => {
  await context.route('**/*', async (route) => {
    const request = route.request();
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(request.headers())) {
      if (!isBrowserOnlyHeader(name)) headers[name] = value;
    }
    headers['user-agent'] = 'msud-accessibility-check';
    if (request.isNavigationRequest()) headers['accept'] = '*/*';

    const response = await route.fetch({ headers });
    await route.fulfill({ response });
  });
});

for (const path of PAGES) {
  test(`no serious or critical accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);

    // Judge only the real site, never a CDN challenge or error page.
    const reachedSite = page.locator('meta[name="x-app"][content="msud-future-students"]');
    if ((await reachedSite.count()) === 0) {
      throw new Error(
        `Didn't reach the site at ${path}: got a page titled "${await page.title()}". ` +
          'This is not an accessibility result.',
      );
    }

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const blocking = results.violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map((violation) => {
        const where = violation.nodes.map((node) => node.target.join(' ')).join(', ');
        return `${violation.id} (${violation.impact}): ${violation.help}. Found at: ${where}`;
      });

    expect(blocking, `Accessibility issues on ${path}`).toEqual([]);
  });
}
