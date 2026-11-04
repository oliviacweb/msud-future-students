import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** The pages every pull request is checked on before it can merge. */
const PAGES = ['/', '/programs'];

/** WCAG 2.1 A and AA, the standard in the DOJ's Title II rule and Colorado's HB21-1110. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const path of PAGES) {
  test(`no serious or critical accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);

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
