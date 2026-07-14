import { expect, Locator, Page, test } from '@playwright/test';

import { DemoPage } from './app.po';

test.describe('format validation', () => {
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
   * @param menu The menu item to get to the picker
   * @param input The input of the picker
   */
  async function runTest(menu: Locator, input: Locator): Promise<void> {
    await menu.click();
    await input.click();
    await input.clear();
    await po.setText(input, 'lmaldlad');
    await po.clickOnBody();

    await expect(po.formatValidationMsg()).toHaveText('invalid format');
    await input.clear();
  }

  /* eslint-disable playwright/expect-expect */
  test.describe('daytime', () => {
    test('should check that the format validation is working for picker', async () => {
      await runTest(po.daytimePickerMenu(), po.daytimePickerInput());
    });

    test('should check that the format validation is working for directive', async () => {
      await runTest(po.daytimeDirectiveMenu(), po.daytimeDirectiveInput());
    });
  });

  test.describe('day', () => {
    test('should check that the format validation is working for picker', async () => {
      await runTest(po.dayPickerMenu(), po.dayPickerInput());
    });

    test('should check that the format validation is working for directive', async () => {
      await runTest(po.dayDirectiveMenu(), po.dayDirectiveInput());
    });
  });

  test.describe('month', () => {
    test('should check that the format validation is working for picker', async () => {
      await runTest(po.monthPickerMenu(), po.monthPickerInput());
    });

    test('should check that the format validation is working for directive', async () => {
      await runTest(po.monthDirectiveMenu(), po.monthDirectiveInput());
    });
  });

  test.describe('time', () => {
    test('should check that the format validation is working for picker', async () => {
      await runTest(po.timePickerMenu(), po.timePickerInput());
    });

    test('should check that the format validation is working for directive', async () => {
      await runTest(po.timeDirectiveMenu(), po.timeSelectDirectiveInput());
    });
  });
  /* eslint-enable playwright/expect-expect */
});
