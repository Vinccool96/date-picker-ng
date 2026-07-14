import { expect, Locator, Page, test } from '@playwright/test';

import { DemoPage } from './app.po';

test.describe('Move to date api', () => {
  let po: DemoPage;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
  });

  /**
   * Runs the test
   * @param menuItem The menu item
   * @param input The input to click if not inline
   * @param isPicker If the item is a picker
   * @param cont The locator of the content
   */
  async function runTest(menuItem: Locator, input: Locator | null, isPicker: boolean, cont: Locator): Promise<void> {
    await menuItem.click();
    await po.moveCalendarTo().click();

    if (isPicker) {
      await input?.click();
    }

    expect(await cont.textContent()).toContain('1987');
  }

  test.describe('day', () => {
    test('should move to date API for picker', async () => {
      await runTest(po.dayPickerMenu(), po.dayPickerInput(), true, po.dayCalendarNavHeaderBtn());
    });

    test('should move to date API for directive', async () => {
      await runTest(po.dayDirectiveMenu(), po.dayDirectiveInput(), true, po.dayCalendarNavHeaderBtn());
    });

    test('should move to date API for inline', async () => {
      await runTest(po.dayInlineMenu(), null, false, po.dayCalendarNavHeaderBtnInline());
    });
  });

  test.describe('daytime', () => {
    test('should move to date API for picker', async () => {
      await runTest(po.daytimePickerMenu(), po.daytimePickerInput(), true, po.dayCalendarNavHeaderBtn());
    });

    test('should move to date API for directive', async () => {
      await runTest(po.daytimeDirectiveMenu(), po.daytimeDirectiveInput(), true, po.dayCalendarNavHeaderBtn());
    });

    test('should move to date API for inline', async () => {
      await runTest(po.daytimeInlineMenu(), null, false, po.dayTimeCalendarNavHeaderBtnInline());
    });
  });

  test.describe('month', () => {
    test('should move to date API for picker', async () => {
      await runTest(po.monthPickerMenu(), po.monthPickerInput(), true, po.navHeader());
    });

    test('should move to date API for directive', async () => {
      await runTest(po.monthDirectiveMenu(), po.monthDirectiveInput(), true, po.navHeader());
    });

    test('should move to date API for inline', async () => {
      await runTest(po.monthInlineMenu(), null, false, po.monthCalendarNavHeaderInline());
    });
  });
});
