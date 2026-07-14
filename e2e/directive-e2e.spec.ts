import { expect, Page, test } from '@playwright/test';
import dayjs from 'dayjs';

import { DemoPage } from './app.po';

test.describe('dpDayPicker directive', () => {
  let po: DemoPage;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
    await po.dayDirectiveMenu().click();
  });

  test('should check that the popup appended to body', async () => {
    await po.dayDirectiveInput().click();
    await expect(po.datePickerPopup()).toBeVisible();
    await po.clickOnBody();
    await expect(po.datePickerPopup()).toBeHidden();
  });

  test('should make sure that day directive keeps the prev state of the calendar', async () => {
    await po.dayDirectiveInput().click();
    await po.dayCalendarLeftNavBtn().click();
    await po.clickOnBody();

    await po.dayDirectiveInput().click();
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText(dayjs().subtract(1, 'month').format('MMM, YYYY'));
  });

  test('should check that the theme is added and removed', async () => {
    await po.themeOnRadio().click();
    await po.dayDirectiveInput().click();
    expect(await po.datePickerPopup().getAttribute('class')).toContain('dp-material');
    await po.themeOffRadio().click();
    await po.dayDirectiveInput().click();
    expect(await po.datePickerPopup().getAttribute('class')).not.toContain('dp-material');
    await po.themeOnRadio().click();
    await po.dayDirectiveInput().click();
    expect(await po.datePickerPopup().getAttribute('class')).toContain('dp-material');
  });

  test('should check that the onOpenDelay is working', async () => {
    await po.setText(po.onOpenDelayInput(), '1000');
    await po.openBtn().click();
    await expect(po.datePickerPopup()).toBeVisible();
    await po.clickOnBody();
    await po.sleep(200);
    await po.dayDirectiveInput().click();
    await expect(po.datePickerPopup()).toBeHidden();
    await po.sleep(1000);
    await expect(po.datePickerPopup()).toBeVisible();
  });

  test('should allow input to be modified from beginning', async () => {
    await po.setText(po.dayDirectiveInput(), '10-04-2017');
    await po.dayDirectiveInput().focus();

    for (let index = 0; index < 11; index++) {
      await page.keyboard.press('ArrowLeft');
    }

    await po.dayDirectiveInput().focus();
    await page.keyboard.press('Delete');
    await page.keyboard.press('2');
    await expect(po.dayDirectiveInput()).toHaveValue('20-04-2017');
    await expect(po.selectedDays()).toHaveCount(1);
    await expect(po.selectedDays().first()).toHaveText('20');
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText('Apr, 2017');
  });
});
