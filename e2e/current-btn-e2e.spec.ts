import { expect, Locator, Page, test } from '@playwright/test';
import dayjs from 'dayjs';

import { DemoPage } from './app.po';

test.describe('Move to current', () => {
  let po: DemoPage;
  let page: Page;

  const currentMonth = dayjs().format('MMM, YYYY');
  const currentYear = dayjs().format('YYYY');
  const previousMonth = dayjs().subtract(1, 'month').format('MMM, YYYY');
  const previousYear = dayjs().subtract(1, 'year').format('YYYY');

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
  });

  /**
   * Run the test for the pickers that use day
   * @param menu The menu item to get to the picker
   * @param input The input of the picker
   */
  async function runTestDay(menu: Locator, input: Locator): Promise<void> {
    await menu.click();
    await po.showGoToCurrentRadio().click();
    await input.click();
    await expect(po.currentLocationBtn()).toBeVisible();
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText(currentMonth);
    await po.dayCalendarLeftNavBtn().click();
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText(previousMonth);
    await po.currentLocationBtn().click();
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText(currentMonth);
    await po.dayCalendarNavHeaderBtn().click();
    await expect(po.dayCalendarNavMonthHeaderBtn()).toHaveText(currentYear);
    await po.monthCalendarLeftNavBtn().click();
    await expect(po.dayCalendarNavMonthHeaderBtn()).toHaveText(previousYear);
    await po.dayCalendarNavMonthHeaderBtn().click();

    await po.currentLocationBtn().click();
    await expect(po.dayCalendarNavHeaderBtn()).toHaveText(currentMonth);

    await po.hideGoToCurrentRadio().click();
    await input.click();
    await expect(po.currentLocationBtn()).toBeHidden();
    await po.dayCalendarNavHeaderBtn().click();
    await expect(po.currentLocationBtn()).toBeHidden();
  }

  /**
   * Run the test for the pickers that use month
   * @param menu The menu item to get to the picker
   * @param input The input of the picker
   */
  async function runTestMonth(menu: Locator, input: Locator): Promise<void> {
    await menu.click();
    await po.showGoToCurrentRadio().click();
    await input.click();
    await expect(po.currentLocationBtn()).toBeVisible();
    await expect(po.deyCalendarMonthNavHeader()).toHaveText(currentYear);
    await po.monthCalendarLeftNavBtn().click();
    await expect(po.deyCalendarMonthNavHeader()).toHaveText(previousYear);
    await po.currentLocationBtn().click();
    await expect(po.deyCalendarMonthNavHeader()).toHaveText(currentYear);

    await po.hideGoToCurrentRadio().click();
    await input.click();
    await expect(po.currentLocationBtn()).toBeHidden();
  }

  /* eslint-disable playwright/expect-expect */
  test.describe('daytime', () => {
    test('should check if go to current location btn is working as expected for picker', async () => {
      await runTestDay(po.daytimePickerMenu(), po.daytimePickerInput());
    });

    test('should check if go to current location btn is working as expected for directive', async () => {
      await runTestDay(po.daytimeDirectiveMenu(), po.daytimeDirectiveInput());
    });
  });

  test.describe('day', () => {
    test('should check if go to current location btn is working as expected for picker', async () => {
      await runTestDay(po.dayPickerMenu(), po.dayPickerInput());
    });

    test('should check if go to current location btn is working as expected for directive', async () => {
      await runTestDay(po.dayDirectiveMenu(), po.dayDirectiveInput());
    });
  });

  test.describe('month', () => {
    test('should check if go to current location btn is working as expected for picker', async () => {
      await runTestMonth(po.monthPickerMenu(), po.monthPickerInput());
    });

    test('should check if go to current location btn is working as expected for directive', async () => {
      await runTestMonth(po.monthDirectiveMenu(), po.monthDirectiveInput());
    });
  });
  /* eslint-enable playwright/expect-expect */

  test('should hide current date button when not between min and max', async () => {
    await po.dayPickerMenu().click();
    await po.setText(po.minSelectableInput(), dayjs().add(3, 'month').format('DD-MM-YYYY'));
    await po.dayPickerInput().click();
    await expect(po.currentLocationBtn()).toBeHidden();
  });
});
