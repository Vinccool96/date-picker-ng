import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { DatePickerComponent, ECalendarValue, IDatePickerConfig, SingleCalendarValue, WeekDays } from 'date-picker-ng';
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

interface AttributesForm {
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

type AttributesFormValue = FormGroup<AttributesForm>['value'];

interface ConfigForm {
  attributes: FormGroup<AttributesForm>;
  configs: FormGroup<ConfigsForm>;
}

interface ConfigsForm {
  firstDayOfWeek: FormControl<WeekDays>;
  format: FormControl<string>;
  locale: FormControl<string>;
  max: FormControl<SingleCalendarValue | null>;
  maxTime: FormControl<Dayjs | null>;
  min: FormControl<SingleCalendarValue | null>;
  minTime: FormControl<Dayjs | null>;
  monthFormat: FormControl<string>;
}

type ConfigsFormValue = FormGroup<ConfigsForm>['value'];

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
   * forms
   *****************************************************************************************************************
   */

  protected allowMultiSelect!: UntypedFormControl;
  protected closeOnEnter!: UntypedFormControl;
  protected closeOnSelect!: UntypedFormControl;
  protected closeOnSelectDelay!: UntypedFormControl;
  protected dayBtnFormat!: UntypedFormControl;
  protected disableKeypress!: UntypedFormControl;
  protected drops!: UntypedFormControl;
  protected enableMonthSelector!: UntypedFormControl;
  protected format!: UntypedFormControl;
  protected hideInputContainer!: UntypedFormControl;
  protected hideOnOutsideClick!: UntypedFormControl;
  protected hours12Format!: UntypedFormControl;
  protected hours24Format!: UntypedFormControl;
  protected meridiemFormat!: UntypedFormControl;
  protected minutesFormat!: UntypedFormControl;
  protected minutesInterval!: UntypedFormControl;
  protected monthBtnFormat!: UntypedFormControl;
  protected monthFormat!: UntypedFormControl;
  protected multipleYearsNavigateBy!: UntypedFormControl;
  protected numOfMonthRows!: UntypedFormControl;
  protected onOpenDelay!: UntypedFormControl;
  protected openOnClick!: UntypedFormControl;
  protected openOnFocus!: UntypedFormControl;
  protected opens!: UntypedFormControl;
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
    const config = this.config();

    this.configForm.patchValue({
      configs: {
        firstDayOfWeek: config.firstDayOfWeek ?? 'su',
        format: this.localFormat,
        locale: this.localeVal(),
        max: config.max,
        maxTime: config.maxTime,
        min: config.min,
        minTime: config.minTime,
        monthFormat: config.monthFormat,
      },
    });

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

    const pickerMode = this.pickerMode();

    const configsForm = formBuilder.group<ConfigsForm>({
      firstDayOfWeek: formBuilder.control('su', { nonNullable: true }),
      format: formBuilder.control(ConfigFormComponent.getDefaultFormatByMode(pickerMode), { nonNullable: true }),
      locale: formBuilder.control('en', { nonNullable: true }),
      max: formBuilder.control(null),
      maxTime: formBuilder.control(null),
      min: formBuilder.control(null),
      minTime: formBuilder.control(null),
      monthFormat: formBuilder.control('', { nonNullable: true }),
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
      this.onMinValidationChange.emit(attributes.minValidation as Dayjs | null);
    }

    if (attributes.maxValidation !== undefined) {
      this.onMaxValidationChange.emit(attributes.maxValidation as Dayjs | null);
    }

    if (attributes.minTimeValidation !== undefined) {
      this.onMinTimeValidationChange.emit(attributes.minTimeValidation as Dayjs | null);
    }

    if (attributes.maxTimeValidation !== undefined) {
      this.onMaxTimeValidationChange.emit(attributes.maxTimeValidation as Dayjs | null);
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

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
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
