import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, ECalendarValue, IDatePickerConfig, SingleCalendarValue } from 'date-picker-ng';
import dayjs, { Dayjs } from 'dayjs';

import { AttributesForm, AttributesFormValue, ConfigForm, ConfigsForm, ConfigsFormValue } from './forms';
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
  public readonly onDisplayDateChange = output<SingleCalendarValue | null>();
  public readonly onLocaleChange = output<string>();
  public readonly onMaterialThemeChange = output<boolean>();
  public readonly onMaxTimeValidationChange = output<Dayjs | null>();
  public readonly onMaxValidationChange = output<Dayjs | null>();
  public readonly onMinTimeValidationChange = output<Dayjs | null>();
  public readonly onMinValidationChange = output<Dayjs | null>();
  public readonly onPlaceholderChange = output<string>();
  public readonly onRequireValidationChange = output<boolean>();
  public readonly openCalendar = output();

  /*
   *****************************************************************************************************************
   * form
   *****************************************************************************************************************
   */

  protected readonly configForm = this.createForm();

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  protected localFormat = '';

  public ngOnInit(): void {
    this.localFormat = ConfigFormComponent.getDefaultFormatByMode(this.pickerMode());
    const config = this.config();

    this.configForm.patchValue({
      configs: {
        allowMultiSelect: config.allowMultiSelect,
        closeOnEnter: config.closeOnEnter,
        closeOnSelect: config.closeOnSelect,
        closeOnSelectDelay: config.closeOnSelectDelay,
        dayBtnFormat: config.dayBtnFormat,
        disableKeypress: config.disableKeypress,
        drops: config.drops,
        enableMonthSelector: config.enableMonthSelector,
        firstDayOfWeek: config.firstDayOfWeek ?? 'su',
        format: this.localFormat,
        hideInputContainer: config.hideInputContainer,
        hideOnOutsideClick: config.hideOnOutsideClick,
        hours12Format: config.hours12Format,
        hours24Format: config.hours24Format,
        locale: this.localeVal(),
        max: config.max,
        maxTime: config.maxTime,
        meridiemFormat: config.meridiemFormat,
        min: config.min,
        minTime: config.minTime,
        minutesFormat: config.minutesFormat,
        minutesInterval: config.minutesInterval,
        monthBtnFormat: config.monthBtnFormat,
        monthFormat: config.monthFormat,
        multipleYearsNavigateBy: config.multipleYearsNavigateBy,
        numOfMonthRows: config.numOfMonthRows,
        onOpenDelay: config.onOpenDelay,
        openOnClick: config.openOnClick,
        openOnFocus: config.openOnFocus,
        opens: config.opens,
        returnedValueType: config.returnedValueType,
        secondsFormat: config.secondsFormat,
        secondsInterval: config.secondsInterval,
        showGoToCurrent: config.showGoToCurrent,
        showMultipleYearsNavigation: config.showMultipleYearsNavigation,
        showNearMonthDays: config.showNearMonthDays,
        showSeconds: config.showSeconds,
        showTwentyFourHours: config.showTwentyFourHours,
        showWeekNumbers: config.showWeekNumbers,
        timeSeparator: config.timeSeparator,
        unSelectOnClick: config.unSelectOnClick,
        weekDayFormat: config.weekDayFormat,
        yearFormat: config.yearFormat,
      },
    });

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

  private createForm(): FormGroup<ConfigForm> {
    const formBuilder = inject(FormBuilder);

    const attributeForm = formBuilder.group<AttributesForm>({
      disabled: formBuilder.control(false, { nonNullable: true }),
      displayDate: formBuilder.control(null),
      material: formBuilder.control(true, { nonNullable: true }),
      maxTimeValidation: formBuilder.control(null),
      maxValidation: formBuilder.control(null),
      minTimeValidation: formBuilder.control(null),
      minValidation: formBuilder.control(null),
      placeholder: formBuilder.control('Select...', { nonNullable: true }),
      requireValidation: formBuilder.control(false, { nonNullable: true }),
    });

    const configsForm = formBuilder.group<ConfigsForm>({
      allowMultiSelect: formBuilder.control(null),
      closeOnEnter: formBuilder.control(true, { nonNullable: true }),
      closeOnSelect: formBuilder.control(null),
      closeOnSelectDelay: formBuilder.control(100, { nonNullable: true }),
      dayBtnFormat: formBuilder.control('DD', { nonNullable: true }),
      disableKeypress: formBuilder.control(false, { nonNullable: true }),
      drops: formBuilder.control(null),
      enableMonthSelector: formBuilder.control(true, { nonNullable: true }),
      firstDayOfWeek: formBuilder.control('su', { nonNullable: true }),
      format: formBuilder.control('DD-MM-YYYY', { nonNullable: true }),
      hideInputContainer: formBuilder.control(false, { nonNullable: true }),
      hideOnOutsideClick: formBuilder.control(true, { nonNullable: true }),
      hours12Format: formBuilder.control('hh', { nonNullable: true }),
      hours24Format: formBuilder.control('HH', { nonNullable: true }),
      locale: formBuilder.control('en', { nonNullable: true }),
      max: formBuilder.control(null),
      maxTime: formBuilder.control(null),
      meridiemFormat: formBuilder.control('A', { nonNullable: true }),
      min: formBuilder.control(null),
      minTime: formBuilder.control(null),
      minutesFormat: formBuilder.control('mm', { nonNullable: true }),
      minutesInterval: formBuilder.control(1, { nonNullable: true }),
      monthBtnFormat: formBuilder.control('MMM', { nonNullable: true }),
      monthFormat: formBuilder.control('', { nonNullable: true }),
      multipleYearsNavigateBy: formBuilder.control(10, { nonNullable: true }),
      numOfMonthRows: formBuilder.control(4, { nonNullable: true }),
      onOpenDelay: formBuilder.control(0, { nonNullable: true }),
      openOnClick: formBuilder.control(true, { nonNullable: true }),
      openOnFocus: formBuilder.control(true, { nonNullable: true }),
      opens: formBuilder.control(null),
      returnedValueType: formBuilder.control(null),
      secondsFormat: formBuilder.control('ss', { nonNullable: true }),
      secondsInterval: formBuilder.control(1, { nonNullable: true }),
      showGoToCurrent: formBuilder.control(true, { nonNullable: true }),
      showMultipleYearsNavigation: formBuilder.control(false, { nonNullable: true }),
      showNearMonthDays: formBuilder.control(true, { nonNullable: true }),
      showSeconds: formBuilder.control(false, { nonNullable: true }),
      showTwentyFourHours: formBuilder.control(false, { nonNullable: true }),
      showWeekNumbers: formBuilder.control(false, { nonNullable: true }),
      timeSeparator: formBuilder.control(':', { nonNullable: true }),
      unSelectOnClick: formBuilder.control(true, { nonNullable: true }),
      weekDayFormat: formBuilder.control('', { nonNullable: true }),
      yearFormat: formBuilder.control('', { nonNullable: true }),
    });

    return formBuilder.group<ConfigForm>({
      attributes: attributeForm,
      configs: configsForm,
    });
  }

  private initializeAttributeListeners(attributes: AttributesFormValue): void {
    if (attributes.displayDate !== undefined) {
      this.onDisplayDateChange.emit(attributes.displayDate);
    }

    if (attributes.disabled !== undefined) {
      this.onDisabledChange.emit(attributes.disabled);
    }

    if (attributes.material !== undefined) {
      this.onMaterialThemeChange.emit(attributes.material);
    }

    if (attributes.requireValidation !== undefined) {
      this.onRequireValidationChange.emit(attributes.requireValidation);
    }

    if (attributes.minValidation !== undefined) {
      const minConfig = attributes.minValidation;
      let min: Dayjs | null;

      if (minConfig === null || minConfig === '') {
        min = null;
      } else if (typeof minConfig === 'string') {
        min = dayjs(minConfig, this.config().format);
      } else {
        min = minConfig;
      }

      this.onMinValidationChange.emit(min);
    }

    if (attributes.maxValidation !== undefined) {
      const maxConfig = attributes.maxValidation;
      let max: Dayjs | null;

      if (maxConfig === null || maxConfig === '') {
        max = null;
      } else if (typeof maxConfig === 'string') {
        max = dayjs(maxConfig, this.config().format);
      } else {
        max = maxConfig;
      }

      this.onMaxValidationChange.emit(max);
    }

    if (attributes.minTimeValidation !== undefined) {
      const minTimeConfig = attributes.minTimeValidation;
      let minTime: Dayjs | null;

      if (minTimeConfig === null || minTimeConfig === '') {
        minTime = null;
      } else if (typeof minTimeConfig === 'string') {
        minTime = dayjs(minTimeConfig, this.config().format);
      } else {
        minTime = minTimeConfig;
      }

      this.onMinTimeValidationChange.emit(minTime);
    }

    if (attributes.maxTimeValidation !== undefined) {
      const maxTimeConfig = attributes.maxTimeValidation;
      let maxTime: Dayjs | null;

      if (maxTimeConfig === null || maxTimeConfig === '') {
        maxTime = null;
      } else if (typeof maxTimeConfig === 'string') {
        maxTime = dayjs(maxTimeConfig, this.config().format);
      } else {
        maxTime = maxTimeConfig;
      }

      this.onMaxTimeValidationChange.emit(maxTime);
    }

    if (attributes.placeholder !== undefined) {
      this.onPlaceholderChange.emit(attributes.placeholder);
    }
  }

  private initializeConfigsListeners(configs: ConfigsFormValue): void {
    if (configs.locale !== undefined) {
      this.onLocaleChange.emit(configs.locale);
    }

    const newConfig: Partial<IDatePickerConfig> = {};

    if (configs.format !== undefined) {
      newConfig.format = configs.format;
    }

    if (configs.firstDayOfWeek !== undefined) {
      newConfig.firstDayOfWeek = configs.firstDayOfWeek;
    }

    if (configs.monthFormat !== undefined) {
      newConfig.monthFormat = configs.monthFormat;
    }

    if (configs.min !== undefined) {
      newConfig.min = configs.min;
    }

    if (configs.max !== undefined) {
      newConfig.max = configs.max;
    }

    if (configs.minTime !== undefined) {
      newConfig.minTime = configs.minTime;
    }

    if (configs.maxTime !== undefined) {
      newConfig.maxTime = configs.maxTime;
    }

    if (configs.allowMultiSelect !== undefined) {
      newConfig.allowMultiSelect = configs.allowMultiSelect;
    }

    if (configs.closeOnSelect !== undefined) {
      newConfig.closeOnSelect = configs.closeOnSelect;
    }

    if (configs.closeOnSelectDelay !== undefined) {
      newConfig.closeOnSelectDelay = configs.closeOnSelectDelay;
    }

    if (configs.openOnFocus !== undefined) {
      newConfig.openOnFocus = configs.openOnFocus;
    }

    if (configs.openOnClick !== undefined) {
      newConfig.openOnClick = configs.openOnClick;
    }

    if (configs.onOpenDelay !== undefined) {
      newConfig.onOpenDelay = configs.onOpenDelay;
    }

    if (configs.weekDayFormat !== undefined) {
      newConfig.weekDayFormat = configs.weekDayFormat;
    }

    if (configs.disableKeypress !== undefined) {
      newConfig.disableKeypress = configs.disableKeypress;
    }

    if (configs.drops !== undefined) {
      newConfig.drops = configs.drops;
    }

    if (configs.opens !== undefined) {
      newConfig.opens = configs.opens;
    }

    if (configs.hideInputContainer !== undefined) {
      newConfig.hideInputContainer = configs.hideInputContainer;
    }

    if (configs.showNearMonthDays !== undefined) {
      newConfig.showNearMonthDays = configs.showNearMonthDays;
    }

    if (configs.showWeekNumbers !== undefined) {
      newConfig.showWeekNumbers = configs.showWeekNumbers;
    }

    if (configs.enableMonthSelector !== undefined) {
      newConfig.enableMonthSelector = configs.enableMonthSelector;
    }

    if (configs.yearFormat !== undefined) {
      newConfig.yearFormat = configs.yearFormat;
    }

    if (configs.showGoToCurrent !== undefined) {
      newConfig.showGoToCurrent = configs.showGoToCurrent;
    }

    if (configs.hideOnOutsideClick !== undefined) {
      newConfig.hideOnOutsideClick = configs.hideOnOutsideClick;
    }

    if (configs.unSelectOnClick !== undefined) {
      newConfig.unSelectOnClick = configs.unSelectOnClick;
    }

    if (configs.dayBtnFormat !== undefined) {
      newConfig.dayBtnFormat = configs.dayBtnFormat;
    }

    if (configs.monthBtnFormat !== undefined) {
      newConfig.monthBtnFormat = configs.monthBtnFormat;
    }

    if (configs.hours12Format !== undefined) {
      newConfig.hours12Format = configs.hours12Format;
    }

    if (configs.hours24Format !== undefined) {
      newConfig.hours24Format = configs.hours24Format;
    }

    if (configs.meridiemFormat !== undefined) {
      newConfig.meridiemFormat = configs.meridiemFormat;
    }

    if (configs.minutesFormat !== undefined) {
      newConfig.minutesFormat = configs.minutesFormat;
    }

    if (configs.minutesInterval !== undefined) {
      newConfig.minutesInterval = configs.minutesInterval;
    }

    if (configs.secondsFormat !== undefined) {
      newConfig.secondsFormat = configs.secondsFormat;
    }

    if (configs.secondsInterval !== undefined) {
      newConfig.secondsInterval = configs.secondsInterval;
    }

    if (configs.showSeconds !== undefined) {
      newConfig.showSeconds = configs.showSeconds;
    }

    if (configs.showTwentyFourHours !== undefined) {
      newConfig.showTwentyFourHours = configs.showTwentyFourHours;
    }

    if (configs.timeSeparator !== undefined) {
      newConfig.timeSeparator = configs.timeSeparator;
    }

    if (configs.showMultipleYearsNavigation !== undefined) {
      newConfig.showMultipleYearsNavigation = configs.showMultipleYearsNavigation;
    }

    if (configs.multipleYearsNavigateBy !== undefined) {
      newConfig.multipleYearsNavigateBy = configs.multipleYearsNavigateBy;
    }

    if (configs.returnedValueType !== undefined) {
      newConfig.returnedValueType = configs.returnedValueType;
    }

    if (configs.closeOnEnter !== undefined) {
      newConfig.closeOnEnter = configs.closeOnEnter;
    }

    if (configs.numOfMonthRows !== undefined) {
      newConfig.numOfMonthRows = configs.numOfMonthRows;
    }

    if (Object.keys(newConfig).length > 0) {
      this.onConfigChange.emit(newConfig);
    }
  }

  private initListeners(): void {
    this.configForm.valueChanges.subscribe((value) => {
      if (value.attributes !== undefined) {
        this.initializeAttributeListeners(value.attributes);
      }

      if (value.configs !== undefined) {
        this.initializeConfigsListeners(value.configs);
      }
    });
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
