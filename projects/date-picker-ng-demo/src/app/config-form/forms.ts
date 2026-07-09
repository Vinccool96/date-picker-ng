import { FormControl, FormGroup } from '@angular/forms';
import { ECalendarValue, SingleCalendarValue, TDrops, TOpens, WeekDays } from 'date-picker-ng';
import { Dayjs } from 'dayjs';

export interface AttributesForm {
  disabled: FormControl<boolean>;
  displayDate: FormControl<SingleCalendarValue | null>;
  material: FormControl<boolean>;
  maxTimeValidation: FormControl<SingleCalendarValue | null>;
  maxValidation: FormControl<SingleCalendarValue | null>;
  minTimeValidation: FormControl<SingleCalendarValue | null>;
  minValidation: FormControl<SingleCalendarValue | null>;
  placeholder: FormControl<string>;
  requireValidation: FormControl<boolean>;
}

export type AttributesFormValue = FormGroup<AttributesForm>['value'];

export interface ConfigForm {
  attributes: FormGroup<AttributesForm>;
  configs: FormGroup<ConfigsForm>;
}

export interface ConfigsForm {
  allowMultiSelect: FormControl<boolean | null>;
  closeOnEnter: FormControl<boolean>;
  closeOnSelect: FormControl<boolean | null>;
  closeOnSelectDelay: FormControl<number>;
  dayBtnFormat: FormControl<string>;
  disableKeypress: FormControl<boolean>;
  drops: FormControl<TDrops | null>;
  enableMonthSelector: FormControl<boolean>;
  firstDayOfWeek: FormControl<WeekDays>;
  format: FormControl<string>;
  hideInputContainer: FormControl<boolean>;
  hideOnOutsideClick: FormControl<boolean>;
  hours12Format: FormControl<string>;
  hours24Format: FormControl<string>;
  locale: FormControl<string>;
  max: FormControl<SingleCalendarValue | null>;
  maxTime: FormControl<Dayjs | null>;
  meridiemFormat: FormControl<string>;
  min: FormControl<SingleCalendarValue | null>;
  minTime: FormControl<Dayjs | null>;
  minutesFormat: FormControl<string>;
  minutesInterval: FormControl<number>;
  monthBtnFormat: FormControl<string>;
  monthFormat: FormControl<string>;
  multipleYearsNavigateBy: FormControl<number>;
  numOfMonthRows: FormControl<number>;
  onOpenDelay: FormControl<number>;
  openOnClick: FormControl<boolean>;
  openOnFocus: FormControl<boolean>;
  opens: FormControl<TOpens | null>;
  returnedValueType: FormControl<ECalendarValue | null>;
  secondsFormat: FormControl<string>;
  secondsInterval: FormControl<number>;
  showGoToCurrent: FormControl<boolean>;
  showMultipleYearsNavigation: FormControl<boolean>;
  showNearMonthDays: FormControl<boolean>;
  showSeconds: FormControl<boolean>;
  showTwentyFourHours: FormControl<boolean>;
  showWeekNumbers: FormControl<boolean>;
  timeSeparator: FormControl<string>;
  unSelectOnClick: FormControl<boolean>;
  weekDayFormat: FormControl<string>;
  yearFormat: FormControl<string>;
}

export type ConfigsFormValue = FormGroup<ConfigsForm>['value'];
