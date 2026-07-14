import { Locator, Page } from '@playwright/test';

export class DemoPage {
  private popupSelector = '.dp-popup.dp-main';

  public constructor(private readonly page: Page) {}

  public calendarDisabledDays(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-day[disabled]`);
  }

  public calendarFirstDayOfMonth(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-current-month`);
  }

  public calendarFirstMonthOfYear(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-calendar-month`);
  }

  public calendarFirstMonthOfYearInline(): Locator {
    return this.page.locator(`.dp-inline dp-month-calendar .dp-calendar-month`);
  }

  public async clearInput(element: Locator): Promise<void> {
    await this.setText(element, '');
  }

  public async clickOnBody(): Promise<void> {
    await this.emptyElem().click();
  }

  public async clickOnDayButton(text: string): Promise<void> {
    await this.page.locator(`${this.popupSelector} .dp-calendar-day:has-text("${text}")`).click();
  }

  public async clickOnDayButtonInline(text: string): Promise<void> {
    return this.page.locator(`.dp-calendar-day:has-text("${text}")`).click();
  }

  public clickOnMonthButton(text: string): Promise<void> {
    return this.page.locator(`${this.popupSelector} .dp-calendar-month:has-text("${text}")`).click();
  }

  public clickOnMonthButtonInline(text: string): Promise<void> {
    return this.page.locator(`.dp-calendar-month:has-text("${text}")`).click();
  }

  public closeDelayInput(): Locator {
    return this.page.locator('#closeDelay');
  }

  public currentLocationBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-current-location-btn`);
  }

  public currentMonthCalendarBtn(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-current-month`);
  }

  public dateFormatInput(): Locator {
    return this.page.locator('#dateFormat');
  }

  public datePickerPopup(): Locator {
    return this.page.locator(this.popupSelector);
  }

  public dayBtnFormatInput(): Locator {
    return this.page.locator('#dayBtnFormat');
  }

  public dayCalendarContainer(): Locator {
    return this.page.locator(`${this.popupSelector} dp-day-calendar .dp-day-calendar-container`);
  }

  public dayCalendarLeftNavBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-nav-left`);
  }

  public dayCalendarLeftSecondaryNavBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-secondary-nav-left`);
  }

  public dayCalendarNavHeaderBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-nav-header-btn`);
  }

  public dayCalendarNavHeaderBtnInline(): Locator {
    return this.page.locator(`dp-day-calendar .dp-nav-header-btn`);
  }

  public dayCalendarNavMonthHeaderBtn(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-nav-header-btn`);
  }

  public dayCalendarRightSecondaryNavBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-secondary-nav-right`);
  }

  public dayDirectiveInput(): Locator {
    return this.page.locator('input#picker');
  }

  public dayDirectiveMenu(): Locator {
    return this.page.locator('#dayDirectiveMenu');
  }

  public dayInlineMenu(): Locator {
    return this.page.locator('#dayInlineMenu');
  }

  public dayPickerInput(): Locator {
    return this.page.locator('#picker input');
  }

  public dayPickerMenu(): Locator {
    return this.page.locator('#dayPickerMenu');
  }

  public dayTimeCalendarNavHeaderBtnInline(): Locator {
    return this.page.locator(`dp-day-time-calendar .dp-nav-header-btn`);
  }

  public daytimeDirectiveInput(): Locator {
    return this.page.locator('input#picker');
  }

  public daytimeDirectiveMenu(): Locator {
    return this.page.locator('#daytimeDirectiveMenu');
  }

  public daytimeInlineMenu(): Locator {
    return this.page.locator('#daytimeInlineMenu');
  }

  public daytimePickerInput(): Locator {
    return this.page.locator('#picker input');
  }

  public daytimePickerMenu(): Locator {
    return this.page.locator('#daytimePickerMenu');
  }

  public deyCalendarMonthNavHeader(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-nav-header button`);
  }

  public disableCloseOnEnter(): Locator {
    return this.page.locator('#disableCloseOnEnter');
  }

  public disableMonthSelector(): Locator {
    return this.page.locator('#disableMonthSelector');
  }

  public disableRequiredValidationRadio(): Locator {
    return this.page.locator('#disableRequiredRadio');
  }

  public disableUnselectSelected(): Locator {
    return this.page.locator('#disableUnSelect');
  }

  public emptyElem(): Locator {
    return this.page.locator('.dp-place-holder');
  }

  public enableCloseOnEnter(): Locator {
    return this.page.locator('#enableCloseOnEnter');
  }

  public enableMultiselect(): Locator {
    return this.page.locator('#enableMultiselect');
  }

  public enableRequiredValidationRadio(): Locator {
    return this.page.locator('#enableRequiredRadio');
  }

  public enableUnselectSelected(): Locator {
    return this.page.locator('#enableUnSelect');
  }

  public firstDayOfWeekSelect(): Locator {
    return this.page.locator('#firstDayOfWeekSelect');
  }

  public formatValidationMsg(): Locator {
    return this.page.locator('#formatValidation');
  }

  public hideGoToCurrentRadio(): Locator {
    return this.page.locator('#hideGoToCurrent');
  }

  public hideInputRadio(): Locator {
    return this.page.locator('#hideInputRadio');
  }

  public hideNearMonthDaysRadio(): Locator {
    return this.page.locator('#hideNearMonthDaysRadio');
  }

  public hourDisplay(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-display-hours`);
  }

  public hourDownBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-hours > .dp-time-select-control-down`);
  }

  public hours12FormatInput(): Locator {
    return this.page.locator('#hours12Format');
  }

  public hours24FormatInput(): Locator {
    return this.page.locator('#hours24Format');
  }

  public hourUpBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-hours > .dp-time-select-control-up`);
  }

  public localeSelect(): Locator {
    return this.page.locator('#locale');
  }

  public maxDateValidationMsg(): Locator {
    return this.page.locator('#maxDateValidation');
  }

  public maxDateValidationPickerInput(): Locator {
    return this.page.locator('#maxDatePicker input');
  }

  public maxSelectableInput(): Locator {
    return this.page.locator('#maxSelectable input');
  }

  public maxTimeInput(): Locator {
    return this.page.locator('#maxTimeSelectable input');
  }

  public maxTimeValidationPickerInput(): Locator {
    return this.page.locator('#maxTimeValidation input');
  }

  public meridiemDisplay(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-display-meridiem`);
  }

  public meridiemDisplayInline(): Locator {
    return this.page.locator(`.dp-inline .dp-time-select-display-meridiem`);
  }

  public meridiemDownBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-meridiem > .dp-time-select-control-down`);
  }

  public meridiemFormatInput(): Locator {
    return this.page.locator('#meridiemFormat');
  }

  public meridiemUpBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-meridiem > .dp-time-select-control-up`);
  }

  public minDateValidationMsg(): Locator {
    return this.page.locator('#minDateValidation');
  }

  public minDateValidationPickerInput(): Locator {
    return this.page.locator('#minDatePicker input');
  }

  public minSelectableInput(): Locator {
    return this.page.locator('#minSelectable input');
  }

  public minTimeInput(): Locator {
    return this.page.locator('#minTimeSelectable input');
  }

  public minTimeValidationPickerInput(): Locator {
    return this.page.locator('#minTimeValidation input');
  }

  public minuteDisplay(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-display-minutes`);
  }

  public minuteDownBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-minutes > .dp-time-select-control-down`);
  }

  public minutesFormatInput(): Locator {
    return this.page.locator('#minutesFormat');
  }

  public minutesIntervalInput(): Locator {
    return this.page.locator('#minutesInterval');
  }

  public minuteUpBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-minutes > .dp-time-select-control-up`);
  }

  public monthBtnFormatInput(): Locator {
    return this.page.locator('#monthBtnFormat');
  }

  public monthCalendar(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar`);
  }

  public monthCalendarLeftNavBtn(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-calendar-nav-left`);
  }

  public monthCalendarNavHeaderInline(): Locator {
    return this.page.locator(`dp-month-calendar .dp-nav-header`);
  }

  public monthCalendarRightNavBtn(): Locator {
    return this.page.locator(`${this.popupSelector} dp-month-calendar .dp-calendar-nav-right`);
  }

  public monthDirectiveInput(): Locator {
    return this.page.locator('input#picker');
  }

  public monthDirectiveMenu(): Locator {
    return this.page.locator('#monthDirectiveMenu');
  }

  public monthFormatInput(): Locator {
    return this.page.locator('#monthFormatInput');
  }

  public monthInlineMenu(): Locator {
    return this.page.locator('#monthInlineMenu');
  }

  public monthPickerInput(): Locator {
    return this.page.locator('#picker input');
  }

  public monthPickerMenu(): Locator {
    return this.page.locator('#monthPickerMenu');
  }

  public monthRows(): Locator {
    return this.page.locator('.dp-months-row');
  }

  public monthWeeks(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-week`);
  }

  public moveCalendarTo(): Locator {
    return this.page.locator('#moveCalendarTo');
  }

  public multipleYearsNavigateBy(): Locator {
    return this.page.locator('#multipleYearsNavigateBy');
  }

  public navHeader(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-nav-header`);
  }

  public async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  public noCloseOnSelect(): Locator {
    return this.page.locator('#noCloseOnSelect');
  }

  public numOfMonthRowsToggle(): Locator {
    return this.page.locator('#numOfMonthRows2');
  }

  public onOpenDelayInput(): Locator {
    return this.page.locator('#onOpenDelay');
  }

  public openBtn(): Locator {
    return this.page.locator('#openBtn');
  }

  public openOnClickRadioOff(): Locator {
    return this.page.locator('#noOpenOnClick');
  }

  public openOnClickRadioOn(): Locator {
    return this.page.locator('#yesOpenOnClick');
  }

  public openOnFocusRadioOff(): Locator {
    return this.page.locator('#noOpenOnFocus');
  }

  public pickerDisabledRadio(): Locator {
    return this.page.locator('#inputDisabledRadio');
  }

  public pickerEnabledRadio(): Locator {
    return this.page.locator('#inputEnabledRadio');
  }

  public placeholderInput(): Locator {
    return this.page.locator('#placeholderInput');
  }

  public requiredValidationMsg(): Locator {
    return this.page.locator('#requiredValidation');
  }

  public async scrollIntoView(element: string): Promise<void> {
    await this.page.locator(element).scrollIntoViewIfNeeded();
  }

  public secondDisplay(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-display-seconds`);
  }

  public secondDownBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-seconds > .dp-time-select-control-down`);
  }

  public secondsFormatInput(): Locator {
    return this.page.locator('#secondsFormat');
  }

  public secondsIntervalInput(): Locator {
    return this.page.locator('#secondsInterval');
  }

  public secondUpBtn(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-control-seconds > .dp-time-select-control-up`);
  }

  public selectedDay(): Locator {
    return this.page.locator(`.dp-calendar-day.dp-selected`);
  }

  public selectedDays(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-calendar-day.dp-selected`);
  }

  public selectedMonth(): Locator {
    return this.page.locator(`.dp-calendar-month.dp-selected`);
  }

  public async setText(element: Locator, text: string): Promise<void> {
    await element.focus();
    await this.page.keyboard.press('Meta+A');
    await this.page.keyboard.press('Backspace');
    await element.fill(text);
  }

  public showGoToCurrentRadio(): Locator {
    return this.page.locator('#showGoToCurrent');
  }

  public showMultipleYearsNavigation(): Locator {
    return this.page.locator('#showMultipleYearsNavigation');
  }

  public showNearMonthDaysRadio(): Locator {
    return this.page.locator('#showNearMonthDaysRadio');
  }

  public showOnOutsideClick(): Locator {
    return this.page.locator('#showOnOutsideClick');
  }

  public showSeconds(): Locator {
    return this.page.locator('#showSeconds');
  }

  public showTwentyFourHours(): Locator {
    return this.page.locator('#showTwentyFourHours');
  }

  public showWeekNumbersRadio(): Locator {
    return this.page.locator('#showWeekNumbersRadio');
  }

  public async sleep(ms: number): Promise<void> {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(ms);
  }

  public themeOffRadio(): Locator {
    return this.page.locator('#themeOff');
  }

  public themeOnRadio(): Locator {
    return this.page.locator('#themeOn');
  }

  public timeDirectiveMenu(): Locator {
    return this.page.locator('#timeDirectiveMenu');
  }

  public timeInlineMenu(): Locator {
    return this.page.locator('#timeInlineMenu');
  }

  public timePickerInput(): Locator {
    return this.page.locator('#picker input');
  }

  public timePickerMenu(): Locator {
    return this.page.locator('#timePickerMenu');
  }

  public timeSelectDirectiveInput(): Locator {
    return this.page.locator('input#picker');
  }

  public timeSeparatorDisplay(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-time-select-separator:nth-child(2)`);
  }

  public timeSeparatorInput(): Locator {
    return this.page.locator('#timeSeparator');
  }

  public weekDayInline(): Locator {
    return this.page.locator(`.dp-inline .dp-weekdays`);
  }

  public weekDayNames(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-weekdays`);
  }

  public weekDaysFormatInput(): Locator {
    return this.page.locator('#weekDaysFormat');
  }

  public weekNumbers(): Locator {
    return this.page.locator(`${this.popupSelector} .dp-week-number`);
  }

  public yearFormat(): Locator {
    return this.page.locator('#yearFormat');
  }
}
