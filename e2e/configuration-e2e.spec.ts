import { expect, Page, test } from '@playwright/test';

import { DemoPage } from './app.po';

test.describe('dpDayPicker configuration', () => {
  let po: DemoPage;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
    await po.daytimePickerMenu().click();
  });

  test('openOnClick = false, should not open picker when clicked', async () => {
    await po.openOnClickRadioOff().click();
    await po.openOnFocusRadioOff().click();
    await po.daytimePickerInput().click();
    await expect(po.datePickerPopup()).toBeHidden();
  });

  test('openOnClick = true, should open picker when clicked', async () => {
    await po.openOnClickRadioOn().click();
    await po.openOnFocusRadioOff().click();
    await po.daytimePickerInput().click();
    await expect(po.datePickerPopup()).toBeVisible();
  });
});
