import { expect, Locator, Page, test } from '@playwright/test';
import dayjs from 'dayjs';

import { DemoPage } from '../app.po';

test.describe('unSelectOnClick feature', () => {
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
   * Runs the test for pickers that use day
   * @param menuItem The menu item to navigate to the picker
   * @param input The input to click if not inline
   * @param isPicker If the item is a picker
   */
  async function runTestForDay(menuItem: Locator, input: Locator | null, isPicker: boolean): Promise<void> {
    const date = dayjs().date(15);
    const dayClick = async (): Promise<void> => {
      if (isPicker) {
        await po.clickOnDayButton(date.format('DD'));
      } else {
        await po.clickOnDayButtonInline(date.format('DD'));
      }
    };

    await menuItem.click();
    await po.enableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await po.noCloseOnSelect().click();
      await po.clearInput(input);
      await input.click();
    } else {
      await dayClick();
      await dayClick();
    }

    await dayClick();
    await expect(po.selectedDay()).toBeVisible();
    await dayClick();
    await expect(po.selectedDay()).toBeHidden();

    await po.clickOnBody();

    await po.disableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await input.click();
    }

    await dayClick();

    await expect(po.selectedDay()).toBeVisible();

    await dayClick();
    await expect(po.selectedDay()).toBeVisible();

    await po.enableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await input.click();
    }

    await dayClick();
    await expect(po.selectedDay()).toBeHidden();
  }

  /**
   * Runs the test for pickers that use month
   * @param menuItem The menu item to navigate to the picker
   * @param input The input to click if not inline
   * @param isPicker If the item is a picker
   */
  async function runTestForMonth(menuItem: Locator, input: Locator | null, isPicker: boolean): Promise<void> {
    const date = dayjs();
    const monthClick = async (): Promise<void> => {
      if (isPicker) {
        await po.clickOnMonthButton(date.format('MMM'));
      } else {
        await po.clickOnMonthButtonInline(date.format('MMM'));
      }
    };

    await menuItem.click();
    await po.enableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await po.noCloseOnSelect().click();
      await po.clearInput(input);
      await input.click();
    } else {
      await po.clickOnMonthButtonInline(date.format('MMM'));
    }

    await monthClick();
    await expect(po.selectedMonth()).toBeVisible();
    await monthClick();
    await expect(po.selectedMonth()).toBeHidden();

    await po.clickOnBody();
    await po.disableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await input.click();
    }

    await monthClick();

    await expect(po.selectedMonth()).toBeVisible();

    await monthClick();
    await expect(po.selectedMonth()).toBeVisible();

    await po.enableUnselectSelected().click();

    if (isPicker) {
      if (input === null) {
        throw new Error('input is required');
      }

      await input.click();
    }

    await monthClick();
    await expect(po.selectedMonth()).toBeHidden();
  }

  /* eslint-disable playwright/expect-expect */
  test.describe('day', () => {
    test('should make sure unSelectOnClick feature works as expected for day picker', async () => {
      await runTestForDay(po.dayPickerMenu(), po.dayPickerInput(), true);
    });

    test('should make sure unSelectOnClick feature works as expected for day directive', async () => {
      await runTestForDay(po.dayDirectiveMenu(), po.dayDirectiveInput(), true);
    });

    test('should make sure unSelectOnClick feature works as expected for day inline', async () => {
      await runTestForDay(po.dayInlineMenu(), null, false);
    });
  });

  test.describe('month', () => {
    test('should make sure unSelectOnClick feature works as expected for month picker', async () => {
      await runTestForMonth(po.monthPickerMenu(), po.monthPickerInput(), true);
    });

    test('should make sure unSelectOnClick feature works as expected for month directive', async () => {
      await runTestForMonth(po.monthDirectiveMenu(), po.monthDirectiveInput(), true);
    });

    test('should make sure unSelectOnClick feature works as expected for month inline', async () => {
      await runTestForMonth(po.monthInlineMenu(), null, false);
    });
  });
  /* eslint-enable playwright/expect-expect */
});
