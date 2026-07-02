import { Component, OnInit, viewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import {
  DatePickerComponent,
  DatePickerDirective,
  debounce,
  ECalendarValue,
  IDatePickerConfig,
  INavEvent,
  ISelectionEvent,
} from 'date-picker-ng';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'dp-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  host: {
    '(document:scroll)': 'updateIsAtTop()',
  },
})
export class DemoComponent implements OnInit {
  private readonly dateComponent = viewChild<DatePickerComponent>('dateComponent');
  private readonly datePickerDirective = viewChild<DatePickerDirective>('dateDirectivePicker');
  private demoFormat = 'DD-MM-YYYY';
  private pickerMode = 'daytimePicker';

  private date: Dayjs | null = null;
  private material = true;
  private required = false;
  private disabled = false;
  private validationMinDate: Dayjs | null = null;
  private validationMaxDate: Dayjs | null = null;
  private placeholder = 'Choose a date...';
  public displayDate!: Dayjs | string;
  private dateTypes: { name: string; value: ECalendarValue | null }[] = [
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
  protected config: IDatePickerConfig = {
    firstDayOfWeek: 'su',
    monthFormat: 'MMM, YYYY',
    disableKeypress: false,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    openOnFocus: true,
    openOnClick: true,
    onOpenDelay: 0,
    weekDayFormat: 'ddd',
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    yearFormat: 'YYYY',
    showGoToCurrent: true,
    dayBtnFormat: 'DD',
    monthBtnFormat: 'MMM',
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showSeconds: false,
    showTwentyFourHours: false,
    timeSeparator: ':',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    hideInputContainer: false,
    returnedValueType: ECalendarValue.String,
    unSelectOnClick: true,
    hideOnOutsideClick: true,
  };

  protected formGroup!: UntypedFormGroup;
  protected isAtTop = true;

  public ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  @debounce(100)
  protected updateIsAtTop(): void {
    this.isAtTop = document.body.scrollTop === 0;
  }

  protected validatorsChanged(): void {
    this.formGroup.get('datePicker')?.updateValueAndValidity();
  }

  protected openCalendar(): void {
    if (this.dateComponent() !== undefined) {
      this.dateComponent()?.api.open();
    } else if (this.datePickerDirective() !== undefined) {
      this.datePickerDirective()?.api.open();
    }
  }

  protected closeCalendar(): void {
    if (this.dateComponent() !== undefined) {
      this.dateComponent()?.api.close();
    } else if (this.datePickerDirective() !== undefined) {
      this.datePickerDirective()?.api.close();
    }
  }

  protected opened(): void {
    console.info('opened');
  }

  protected closed(): void {
    console.info('closed');
  }

  protected log(item: unknown): void {
    console.info(item);
  }

  protected onLeftNav(change: INavEvent): void {
    console.info('left nav', change);
  }

  protected onRightNav(change: INavEvent): void {
    console.info('right nav', change);
  }

  protected moveCalendarTo(): void {
    this.dateComponent()?.api.moveCalendarTo(dayjs('14-01-1987', this.demoFormat));
  }

  protected onSelect(data: ISelectionEvent): void {
    console.info(data);
  }

  private buildForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      datePicker: new UntypedFormControl({ value: this.date, disabled: this.disabled }, [
        this.required ? Validators.required : (): ValidationErrors | null => null,
        (control): ValidationErrors | null => {
          return this.validationMinDate !== null &&
            dayjs(
              control.value as dayjs.ConfigType,
              this.config.format ?? DemoComponent.getDefaultFormatByMode(this.pickerMode),
            ).isBefore(this.validationMinDate)
            ? { minDate: 'minDate Invalid' }
            : null;
        },
        (control): ValidationErrors | null =>
          this.validationMaxDate !== null &&
          dayjs(
            control.value as dayjs.ConfigType,
            this.config.format ?? DemoComponent.getDefaultFormatByMode(this.pickerMode),
          ).isAfter(this.validationMaxDate)
            ? { maxDate: 'maxDate Invalid' }
            : null,
      ]),
    });
  }

  private static getDefaultFormatByMode(mode: string): string {
    switch (mode) {
      case 'daytimePicker':
      case 'daytimeInline':
      case 'daytimeDirective':
        return 'DD-MM-YYYY HH:mm:ss';
      case 'dayPicker':
      case 'dayInline':
      case 'dayDirective':
      case 'dayDirectiveReactiveMenu':
        return 'DD-MM-YYYY';
      case 'monthPicker':
      case 'monthInline':
      case 'monthDirective':
        return 'MMM, YYYY';
      case 'timePicker':
      case 'timeInline':
      case 'timeDirective':
        return 'HH:mm:ss';
    }
    throw new Error(`Invalid mode: ${mode}`);
  }
}
