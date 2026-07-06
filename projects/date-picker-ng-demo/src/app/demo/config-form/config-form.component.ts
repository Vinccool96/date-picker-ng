import { Component, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { DatePickerComponent, ECalendarValue, IDatePickerConfig } from 'date-picker-ng';
import dayjs, { Dayjs } from 'dayjs';

import {
  DAY_CALENDAR_OPTION_KEYS,
  DAY_PICKER_DIRECTIVE_OPTION_KEYS,
  DAY_PICKER_OPTION_KEYS,
  DAY_TIME_CALENDAR_OPTION_KEYS,
  MONTH_CALENDAR_OPTION_KEYS,
  TIME_PICKER_OPTION_KEYS,
  TIME_SELECT_OPTION_KEYS,
} from './keys';

@Component({
  selector: 'dp-config-form',
  imports: [ReactiveFormsModule, DatePickerComponent],
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss'],
})
export class ConfigFormComponent implements OnInit {
  /*
   *****************************************************************************************************************
   * defaults/values
   *****************************************************************************************************************
   */

  protected readonly dateTypes: { name: string; value: ECalendarValue | null }[] = [
    {
      name: 'Guess',
      value: null,
    },
    {
      name: ECalendarValue[ECalendarValue.Dayjs],
      value: ECalendarValue.Dayjs,
    },
    {
      name: ECalendarValue[ECalendarValue.DayjsArr],
      value: ECalendarValue.DayjsArr,
    },
    {
      name: ECalendarValue[ECalendarValue.String],
      value: ECalendarValue.String,
    },
    {
      name: ECalendarValue[ECalendarValue.StringArr],
      value: ECalendarValue.StringArr,
    },
  ];
  protected readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  protected readonly LANGS = [
    'en',
    'af',
    'ar-dz',
    'ar-kw',
    'ar-ly',
    'ar-ma',
    'ar-sa',
    'ar-tn',
    'ar',
    'az',
    'be',
    'bg',
    'bn',
    'bo',
    'br',
    'bs',
    'ca',
    'cs',
    'cv',
    'cy',
    'da',
    'de-at',
    'de-ch',
    'de',
    'dv',
    'el',
    'en-au',
    'en-ca',
    'en-gb',
    'en-ie',
    'en-nz',
    'eo',
    'es-do',
    'es',
    'et',
    'eu',
    'fa',
    'fi',
    'fo',
    'fr-ca',
    'fr-ch',
    'fr',
    'fy',
    'gd',
    'gl',
    'gom-latn',
    'he',
    'hi',
    'hr',
    'hu',
    'hy-am',
    'id',
    'is',
    'it',
    'ja',
    'jv',
    'ka',
    'kk',
    'km',
    'kn',
    'ko',
    'ky',
    'lb',
    'lo',
    'lt',
    'lv',
    'me',
    'mi',
    'mk',
    'ml',
    'mr',
    'ms-my',
    'ms',
    'my',
    'nb',
    'ne',
    'nl-be',
    'nl',
    'nn',
    'pa-in',
    'pl',
    'pt-br',
    'pt',
    'ro',
    'ru',
    'sd',
    'se',
    'si',
    'sk',
    'sl',
    'sq',
    'sr-cyrl',
    'sr',
    'ss',
    'sv',
    'sw',
    'ta',
    'te',
    'tet',
    'th',
    'tl-ph',
    'tlh',
    'tr',
    'tzl',
    'tzm-latn',
    'tzm',
    'uk',
    'ur',
    'uz-latn',
    'uz',
    'vi',
    'x-pseudo',
    'yo',
    'zh-cn',
    'zh-hk',
    'zh-tw',
  ];

  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<IDatePickerConfig>({});
  public readonly localeVal = input('en');
  public readonly pickerMode = input<string>();

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly closeCalendar = output();
  public readonly moveCalendarTo = output<Dayjs>();
  public readonly onConfigChange = output<Partial<IDatePickerConfig>>();
  public readonly onDisabledChange = output<boolean>();
  public readonly onDisplayDateChange = output<string | Dayjs>();
  public readonly onLocaleChange = output<string>();
  public readonly onMaterialThemeChange = output<boolean>();
  public readonly onMaxTimeValidationChange = output<Dayjs>();
  public readonly onMaxValidationChange = output<Dayjs>();
  public readonly onMinTimeValidationChange = output<Dayjs>();
  public readonly onMinValidationChange = output<Dayjs>();
  public readonly onPlaceholderChange = output<string>();
  public readonly onRequireValidationChange = output<boolean>();
  public readonly openCalendar = output();

  /*
   *****************************************************************************************************************
   * forms
   *****************************************************************************************************************
   */

  protected allowMultiSelect!: UntypedFormControl;
  protected closeOnEnter!: UntypedFormControl;
  protected closeOnSelect!: UntypedFormControl;
  protected closeOnSelectDelay!: UntypedFormControl;
  protected dayBtnFormat!: UntypedFormControl;
  protected disabled = new UntypedFormControl(false);
  protected disableKeypress!: UntypedFormControl;
  protected displayDate = new UntypedFormControl(null);
  protected drops!: UntypedFormControl;
  protected enableMonthSelector!: UntypedFormControl;
  protected firstDayOfWeek!: UntypedFormControl;
  protected format!: UntypedFormControl;
  protected hideInputContainer!: UntypedFormControl;
  protected hideOnOutsideClick!: UntypedFormControl;
  protected hours12Format!: UntypedFormControl;
  protected hours24Format!: UntypedFormControl;
  protected locale!: UntypedFormControl;
  protected material = new UntypedFormControl(true);
  protected max!: UntypedFormControl;
  protected maxTime!: UntypedFormControl;
  protected maxTimeValidation = new UntypedFormControl();
  protected maxValidation = new UntypedFormControl();
  protected meridiemFormat!: UntypedFormControl;
  protected min!: UntypedFormControl;
  protected minTime!: UntypedFormControl;
  protected minTimeValidation = new UntypedFormControl();
  protected minutesFormat!: UntypedFormControl;
  protected minutesInterval!: UntypedFormControl;
  protected minValidation = new UntypedFormControl();
  protected monthBtnFormat!: UntypedFormControl;
  protected monthFormat!: UntypedFormControl;
  protected multipleYearsNavigateBy!: UntypedFormControl;
  protected numOfMonthRows!: UntypedFormControl;
  protected onOpenDelay!: UntypedFormControl;
  protected openOnClick!: UntypedFormControl;
  protected openOnFocus!: UntypedFormControl;
  protected opens!: UntypedFormControl;
  protected placeholder = new UntypedFormControl('Select...');
  protected requireValidation = new UntypedFormControl(false);
  protected returnedValueType!: UntypedFormControl;
  protected secondsFormat!: UntypedFormControl;
  protected secondsInterval!: UntypedFormControl;
  protected showGoToCurrent!: UntypedFormControl;
  protected showMultipleYearsNavigation!: UntypedFormControl;
  protected showNearMonthDays!: UntypedFormControl;
  protected showSeconds!: UntypedFormControl;
  protected showTwentyFourHours!: UntypedFormControl;
  protected showWeekNumbers!: UntypedFormControl;
  protected timeSeparator!: UntypedFormControl;
  protected unSelectOnClick!: UntypedFormControl;
  protected weekDayFormat!: UntypedFormControl;
  protected yearFormat!: UntypedFormControl;

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  protected localFormat = '';

  public ngOnInit(): void {
    this.localFormat = ConfigFormComponent.getDefaultFormatByMode(this.pickerMode());

    this.format = new UntypedFormControl(ConfigFormComponent.getDefaultFormatByMode(this.pickerMode()));
    this.locale = new UntypedFormControl(this.localeVal());
    this.firstDayOfWeek = new UntypedFormControl(this.config().firstDayOfWeek);
    this.monthFormat = new UntypedFormControl(this.config().monthFormat);
    this.min = new UntypedFormControl(this.config().min);
    this.max = new UntypedFormControl(this.config().max);
    this.minTime = new UntypedFormControl(this.config().minTime);
    this.maxTime = new UntypedFormControl(this.config().maxTime);
    this.allowMultiSelect = new UntypedFormControl(this.config().allowMultiSelect);
    this.closeOnSelect = new UntypedFormControl(this.config().closeOnSelect);
    this.closeOnSelectDelay = new UntypedFormControl(this.config().closeOnSelectDelay);
    this.openOnFocus = new UntypedFormControl(this.config().openOnFocus);
    this.openOnClick = new UntypedFormControl(this.config().openOnClick);
    this.onOpenDelay = new UntypedFormControl(this.config().onOpenDelay);
    this.weekDayFormat = new UntypedFormControl(this.config().weekDayFormat);
    this.disableKeypress = new UntypedFormControl(this.config().disableKeypress);
    this.drops = new UntypedFormControl(this.config().drops);
    this.opens = new UntypedFormControl(this.config().opens);
    this.hideInputContainer = new UntypedFormControl(this.config().hideInputContainer);
    this.showNearMonthDays = new UntypedFormControl(this.config().showNearMonthDays);
    this.showWeekNumbers = new UntypedFormControl(this.config().showWeekNumbers);
    this.enableMonthSelector = new UntypedFormControl(this.config().enableMonthSelector);
    this.yearFormat = new UntypedFormControl(this.config().yearFormat);
    this.showGoToCurrent = new UntypedFormControl(this.config().showGoToCurrent);
    this.hideOnOutsideClick = new UntypedFormControl(this.config().hideOnOutsideClick);
    this.unSelectOnClick = new UntypedFormControl(this.config().unSelectOnClick);
    this.dayBtnFormat = new UntypedFormControl(this.config().dayBtnFormat);
    this.monthBtnFormat = new UntypedFormControl(this.config().monthBtnFormat);
    this.hours12Format = new UntypedFormControl(this.config().hours12Format);
    this.hours24Format = new UntypedFormControl(this.config().hours24Format);
    this.meridiemFormat = new UntypedFormControl(this.config().meridiemFormat);
    this.minutesFormat = new UntypedFormControl(this.config().minutesFormat);
    this.minutesInterval = new UntypedFormControl(this.config().minutesInterval);
    this.secondsFormat = new UntypedFormControl(this.config().secondsFormat);
    this.secondsInterval = new UntypedFormControl(this.config().secondsInterval);
    this.showSeconds = new UntypedFormControl(this.config().showSeconds);
    this.showTwentyFourHours = new UntypedFormControl(this.config().showTwentyFourHours);
    this.timeSeparator = new UntypedFormControl(this.config().timeSeparator);
    this.showMultipleYearsNavigation = new UntypedFormControl(this.config().showMultipleYearsNavigation);
    this.multipleYearsNavigateBy = new UntypedFormControl(this.config().multipleYearsNavigateBy);
    this.returnedValueType = new UntypedFormControl(this.config().returnedValueType);
    this.closeOnEnter = new UntypedFormControl(this.config().closeOnEnter);
    this.numOfMonthRows = new UntypedFormControl(this.config().numOfMonthRows);
    this.initListeners();
  }

  protected isValidConfig(key: string): boolean {
    switch (this.pickerMode()) {
      case 'dayDirective':
      case 'dayDirectiveReactiveMenu': {
        return [...DAY_PICKER_DIRECTIVE_OPTION_KEYS, ...DAY_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'dayInline': {
        return [...DAY_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'dayPicker': {
        return [...DAY_PICKER_OPTION_KEYS, ...DAY_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'daytime':
      case 'daytimeDirective':
      case 'daytimePicker': {
        return [...DAY_TIME_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'daytimeInline': {
        return [...DAY_TIME_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'monthDirective': {
        return [...DAY_PICKER_DIRECTIVE_OPTION_KEYS, ...MONTH_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'monthInline': {
        return [...MONTH_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'monthPicker': {
        return [...DAY_PICKER_OPTION_KEYS, ...MONTH_CALENDAR_OPTION_KEYS].includes(key);
      }
      case 'timeDirective':
      case 'timePicker': {
        return [...TIME_PICKER_OPTION_KEYS, ...TIME_SELECT_OPTION_KEYS].includes(key);
      }
      case 'timeInline': {
        return [...TIME_SELECT_OPTION_KEYS].includes(key);
      }
      default: {
        return true;
      }
    }
  }

  protected moveCalendar(): void {
    this.moveCalendarTo.emit(dayjs('14-01-1987', 'DD-MM-YYYY'));
  }

  private initListeners(): void {
    /* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
    this.displayDate.valueChanges.subscribe((value) => {
      this.onDisplayDateChange.emit(value);
    });

    this.material.valueChanges.subscribe((value) => {
      this.onMaterialThemeChange.emit(value);
    });

    this.disabled.valueChanges.subscribe((value) => {
      this.onDisabledChange.emit(value);
    });

    this.requireValidation.valueChanges.subscribe((value) => {
      this.onRequireValidationChange.emit(value);
    });

    this.minValidation.valueChanges.subscribe((value) => {
      this.onMinValidationChange.emit(value);
    });

    this.maxValidation.valueChanges.subscribe((value) => {
      this.onMaxValidationChange.emit(value);
    });

    this.minTimeValidation.valueChanges.subscribe((value) => {
      this.onMinTimeValidationChange.emit(value);
    });

    this.maxTimeValidation.valueChanges.subscribe((value) => {
      this.onMaxTimeValidationChange.emit(value);
    });

    this.placeholder.valueChanges.subscribe((value) => {
      this.onPlaceholderChange.emit(value);
    });

    this.locale.valueChanges.subscribe((locale) => {
      this.onLocaleChange.emit(locale);
    });

    this.format.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        format: value,
      });
    });

    this.firstDayOfWeek.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        firstDayOfWeek: value,
      });
    });

    this.monthFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        monthFormat: value,
      });
    });

    this.min.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        min: value,
      });
    });

    this.max.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        max: value,
      });
    });

    this.minTime.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        minTime: value,
      });
    });

    this.maxTime.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        maxTime: value,
      });
    });

    this.allowMultiSelect.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        allowMultiSelect: value,
      });
    });

    this.closeOnSelect.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        closeOnSelect: value,
      });
    });

    this.closeOnSelectDelay.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        closeOnSelectDelay: value,
      });
    });

    this.openOnFocus.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        openOnFocus: value,
      });
    });

    this.openOnClick.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        openOnClick: value,
      });
    });

    this.onOpenDelay.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        onOpenDelay: value,
      });
    });

    this.weekDayFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        weekDayFormat: value,
      });
    });

    this.disableKeypress.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        disableKeypress: value,
      });
    });

    this.drops.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        drops: value,
      });
    });

    this.opens.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        opens: value,
      });
    });

    this.hideInputContainer.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        hideInputContainer: value,
      });
    });

    this.showNearMonthDays.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showNearMonthDays: value,
      });
    });

    this.showWeekNumbers.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showWeekNumbers: value,
      });
    });

    this.enableMonthSelector.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        enableMonthSelector: value,
      });
    });

    this.yearFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        yearFormat: value,
      });
    });

    this.showGoToCurrent.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showGoToCurrent: value,
      });
    });

    this.hideOnOutsideClick.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        hideOnOutsideClick: value,
      });
    });

    this.unSelectOnClick.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        unSelectOnClick: value,
      });
    });

    this.dayBtnFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        dayBtnFormat: value,
      });
    });

    this.monthBtnFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        monthBtnFormat: value,
      });
    });

    this.hours12Format.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        hours12Format: value,
      });
    });

    this.hours24Format.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        hours24Format: value,
      });
    });

    this.meridiemFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        meridiemFormat: value,
      });
    });

    this.minutesFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        minutesFormat: value,
      });
    });

    this.minutesInterval.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        minutesInterval: value,
      });
    });

    this.secondsFormat.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        secondsFormat: value,
      });
    });

    this.secondsInterval.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        secondsInterval: value,
      });
    });

    this.showSeconds.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showSeconds: value,
      });
    });

    this.showTwentyFourHours.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showTwentyFourHours: value,
      });
    });

    this.timeSeparator.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        timeSeparator: value,
      });
    });

    this.showMultipleYearsNavigation.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        showMultipleYearsNavigation: value,
      });
    });

    this.multipleYearsNavigateBy.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        multipleYearsNavigateBy: value,
      });
    });

    this.returnedValueType.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        returnedValueType: value,
      });
    });

    this.closeOnEnter.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        closeOnEnter: value,
      });
    });

    this.numOfMonthRows.valueChanges.subscribe((value) => {
      this.onConfigChange.emit({
        numOfMonthRows: value,
      });
    });

    /* eslint-enable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
  }

  private static getDefaultFormatByMode(mode: string | undefined): string {
    switch (mode) {
      case 'dayDirective':
      case 'dayInline':
      case 'dayPicker': {
        return 'DD-MM-YYYY';
      }
      case 'daytimeDirective':
      case 'daytimeInline':
      case 'daytimePicker': {
        return 'DD-MM-YYYY HH:mm:ss';
      }
      case 'monthDirective':
      case 'monthInline':
      case 'monthPicker': {
        return 'MMM, YYYY';
      }
      case 'timeDirective':
      case 'timeInline':
      case 'timePicker': {
        return 'HH:mm:ss';
      }
    }

    throw new Error(`Wrong mode ${mode ?? '[NO MODE]'}`);
  }
}
