import { expect, Page, test } from '@playwright/test';

import { DemoPage } from './app.po';

test.describe('timePicker', () => {
  let po: DemoPage;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    po = new DemoPage(page);
    await po.navigateTo();
    await po.timePickerMenu().click();
    await po.clickOnBody();
  });

  test('should check if min time validation is working', async () => {
    await expect(po.minDateValidationMsg()).toBeHidden();
    await po.setText(po.minTimeValidationPickerInput(), '10:00:00');
    await po.setText(po.timePickerInput(), '09:00:00');
    await po.clickOnBody();
    await expect(po.minDateValidationMsg()).toHaveText('minDate invalid');
    await po.setText(po.minTimeValidationPickerInput(), '08:07:06');
    await po.clickOnBody();
    await expect(po.minDateValidationMsg()).toBeHidden();
  });

  test('should check if max time validation is working', async () => {
    await po.maxTimeValidationPickerInput().click();
    await po.maxTimeValidationPickerInput().clear();
    await expect(po.maxDateValidationMsg()).toBeHidden();
    await po.maxTimeValidationPickerInput().clear();
    await po.setText(po.maxTimeValidationPickerInput(), '08:07:06');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:00:00');
    await po.clickOnBody();
    await expect(po.maxDateValidationMsg()).toHaveText('maxDate invalid');
    await po.maxTimeValidationPickerInput().clear();
    await po.setText(po.maxTimeValidationPickerInput(), '10:11:12');
    await expect(po.maxDateValidationMsg()).toBeHidden();
  });

  test('should check that the min selectable time option is working', async () => {
    await po.minTimeInput().click();
    await po.minTimeInput().clear();
    await po.setText(po.minTimeInput(), '08:07:06');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:00:00');
    await expect(po.hourDownBtn()).toBeDisabled();
    await expect(po.minuteDownBtn()).toBeEnabled();
    await expect(po.meridiemUpBtn()).toBeEnabled();
    await expect(po.meridiemDownBtn()).toBeEnabled();
  });

  test('should check that the max selectable time option is working', async () => {
    await po.maxTimeInput().click();
    await po.maxTimeInput().clear();
    await po.setText(po.maxTimeInput(), '09:07:06');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:00:00');
    await expect(po.hourUpBtn()).toBeDisabled();
    await expect(po.minuteUpBtn()).toBeEnabled();
    await expect(po.meridiemUpBtn()).toBeDisabled();
    await expect(po.meridiemDownBtn()).toBeDisabled();
  });

  test('should check that the 12 hour time format options work', async () => {
    await po.showSeconds().click();
    await po.hours12FormatInput().clear();
    await po.setText(po.hours12FormatInput(), 'h');
    await po.minutesFormatInput().clear();
    await po.setText(po.minutesFormatInput(), 'm');
    await po.secondsFormatInput().clear();
    await po.setText(po.secondsFormatInput(), 's');
    await po.meridiemFormatInput().clear();
    await po.setText(po.meridiemFormatInput(), 'a');
    await po.timeSeparatorInput().clear();
    await po.setText(po.timeSeparatorInput(), '-');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:08:07');
    await expect(po.hourDisplay()).toHaveText('9');
    await expect(po.minuteDisplay()).toHaveText('8');
    await expect(po.secondDisplay()).toHaveText('7');
    await expect(po.meridiemDisplay()).toHaveText('am');
    await expect(po.timeSeparatorDisplay()).toHaveText('-');
  });

  test('should check that the 24 hour time format options work', async () => {
    await po.showTwentyFourHours().click();
    await po.showSeconds().click();
    await po.hours24FormatInput().clear();
    await po.setText(po.hours24FormatInput(), 'H');
    await po.minutesFormatInput().clear();
    await po.setText(po.minutesFormatInput(), 'm');
    await po.secondsFormatInput().clear();
    await po.setText(po.secondsFormatInput(), 's');
    await po.timeSeparatorInput().clear();
    await po.setText(po.timeSeparatorInput(), '-');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:08:07');
    await expect(po.hourDisplay()).toHaveText('9');
    await expect(po.minuteDisplay()).toHaveText('8');
    await expect(po.secondDisplay()).toHaveText('7');
    await expect(po.timeSeparatorDisplay()).toHaveText('-');
  });

  test('should check that the interval options work', async () => {
    await po.showSeconds().click();
    await po.minutesIntervalInput().clear();
    await po.setText(po.minutesIntervalInput(), '6');
    await po.secondsIntervalInput().clear();
    await po.setText(po.secondsIntervalInput(), '7');
    await po.timePickerInput().click();
    await po.timePickerInput().clear();
    await po.setText(po.timePickerInput(), '09:08:07');
    await po.minuteUpBtn().click();
    await expect(po.minuteDisplay()).toHaveText('14');
    await expect(po.timePickerInput()).toHaveValue('09:14:07');
    await po.minuteDownBtn().click();
    await expect(po.minuteDisplay()).toHaveText('08');
    await expect(po.timePickerInput()).toHaveValue('09:08:07');
    await po.secondUpBtn().click();
    await expect(po.secondDisplay()).toHaveText('14');
    await expect(po.timePickerInput()).toHaveValue('09:08:14');
    await po.secondDownBtn().click();
    await expect(po.secondDisplay()).toHaveText('07');
    await expect(po.timePickerInput()).toHaveValue('09:08:07');
  });
});
