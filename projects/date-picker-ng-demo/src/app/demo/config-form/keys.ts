const GLOBAL_OPTION_KEYS = ['theme', 'locale', 'returnedValueType', 'displayDate'];
const PICKER_OPTION_KEYS = [
  'apiclose',
  'apiopen',
  'appendTo',
  'disabled',
  'disableKeypress',
  'drops',
  'format',
  'openOnFocus',
  'openOnClick',
  'onOpenDelay',
  'opens',
  'placeholder',
  'required',
  'hideInputContainer',
  'hideOnOutsideClick',
  'closeOnEnter',
];
export const DAY_PICKER_DIRECTIVE_OPTION_KEYS = [
  'allowMultiSelect',
  'closeOnSelect',
  'closeOnSelectDelay',
  'showGoToCurrent',
  'moveCalendarTo',
  ...PICKER_OPTION_KEYS,
];
export const DAY_PICKER_OPTION_KEYS = [...DAY_PICKER_DIRECTIVE_OPTION_KEYS];
const DAY_TIME_PICKER_OPTION_KEYS = ['moveCalendarTo', ...PICKER_OPTION_KEYS];
export const TIME_PICKER_OPTION_KEYS = [...PICKER_OPTION_KEYS];
export const MONTH_CALENDAR_OPTION_KEYS = [
  'minValidation',
  'maxValidation',
  'required',
  'max',
  'min',
  'monthBtnFormat',
  'multipleYearsNavigateBy',
  'showMultipleYearsNavigation',
  'yearFormat',
  'showGoToCurrent',
  'unSelectOnClick',
  'moveCalendarTo',
  'numOfMonthRows',
  ...GLOBAL_OPTION_KEYS,
];
export const DAY_CALENDAR_OPTION_KEYS = new Set([
  'dayBtnFormat',
  'enableMonthSelector',
  'firstDayOfWeek',
  'max',
  'maxValidation',
  'min',
  'minValidation',
  'monthFormat',
  'moveCalendarTo',
  'showGoToCurrent',
  'showNearMonthDays',
  'showWeekNumbers',
  'unSelectOnClick',
  'weekdayFormat',
  'weekdayNames',
  ...MONTH_CALENDAR_OPTION_KEYS,
]);
const TIME_SELECT_SHARED_OPTION_KEYS = [
  'hours12Format',
  'hours24Format',
  'meridiemFormat',
  'minutesFormat',
  'minutesInterval',
  'secondsFormat',
  'secondsInterval',
  'showSeconds',
  'showTwentyFourHours',
  'timeSeparator',
  ...GLOBAL_OPTION_KEYS,
];
export const TIME_SELECT_OPTION_KEYS = [
  'maxTime',
  'maxTimeValidation',
  'minTime',
  'minTimeValidation',
  ...TIME_SELECT_SHARED_OPTION_KEYS,
];
export const DAY_TIME_CALENDAR_OPTION_KEYS = [
  ...DAY_TIME_PICKER_OPTION_KEYS,
  ...DAY_CALENDAR_OPTION_KEYS,
  ...TIME_SELECT_SHARED_OPTION_KEYS,
];
