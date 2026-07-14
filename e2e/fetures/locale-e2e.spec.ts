import { expect, Page, test } from '@playwright/test';

import { DemoPage } from '../app.po';

test.describe('Locales', () => {
  let po: DemoPage;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
  });

  test('should check locale of daytime picker', async () => {
    await po.daytimePickerMenu().click();
    await po.localeSelect().selectOption('he');
    await po.daytimePickerInput().click();
    await expect(po.weekDayNames()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of daytime picker inline', async () => {
    await po.daytimeInlineMenu().click();
    await po.localeSelect().selectOption('he');
    await expect(po.weekDayInline()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of daytime picker directive', async () => {
    await po.daytimeDirectiveMenu().click();
    await po.localeSelect().selectOption('he');
    await po.daytimeDirectiveInput().click();
    await expect(po.weekDayNames()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of day picker', async () => {
    await po.dayPickerMenu().click();
    await po.localeSelect().selectOption('he');
    await po.dayPickerInput().click();
    await expect(po.weekDayNames()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of day picker inline', async () => {
    await po.dayInlineMenu().click();
    await po.localeSelect().selectOption('he');
    await expect(po.weekDayInline()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of day picker directive', async () => {
    await po.dayDirectiveMenu().click();
    await po.localeSelect().selectOption('he');
    await po.dayDirectiveInput().click();
    await expect(po.weekDayNames()).toHaveText(['א׳ב׳ג׳ד׳ה׳ו׳ש׳']);
  });

  test('should check locale of month picker', async () => {
    await po.monthPickerMenu().click();
    await po.localeSelect().selectOption('he');
    await po.monthPickerInput().click();
    await expect(po.calendarFirstMonthOfYear().first()).toHaveText('ינו');
  });

  test('should check locale of month picker inline', async () => {
    await po.monthInlineMenu().click();
    await po.localeSelect().selectOption('he');
    await expect(po.calendarFirstMonthOfYearInline().first()).toHaveText('ינו');
  });

  test('should check locale of month picker directive', async () => {
    await po.monthDirectiveMenu().click();
    await po.localeSelect().selectOption('he');
    await po.monthDirectiveInput().click();
    await expect(po.calendarFirstMonthOfYear().first()).toHaveText('ינו');
  });
});
