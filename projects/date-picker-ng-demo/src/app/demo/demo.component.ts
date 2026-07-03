import { Component, OnInit, viewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  DatePickerComponent,
  DatePickerDirective,
  debounce,
  ECalendarValue,
  IDatePickerConfig,
  INavEvent,
  ISelectionEvent,
} from 'date-picker-ng';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'dp-demo',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  host: {
    '(document:scroll)': 'updateIsAtTop()',
  },
})
export class DemoComponent implements OnInit {
  /*
   *****************************************************************************************************************
   * viewChildren
   *****************************************************************************************************************
   */

  private readonly dateComponent = viewChild<DatePickerComponent>('dateComponent');
  private readonly datePickerDirective = viewChild<DatePickerDirective>('dateDirectivePicker');

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  public displayDate!: string | Dayjs;
  protected config: IDatePickerConfig = {
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    dayBtnFormat: 'DD',
    disableKeypress: false,
    enableMonthSelector: true,
    firstDayOfWeek: 'su',
    hideInputContainer: false,
    hideOnOutsideClick: true,
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    monthBtnFormat: 'MMM',
    monthFormat: 'MMM, YYYY',
    multipleYearsNavigateBy: 10,
    onOpenDelay: 0,
    openOnClick: true,
    openOnFocus: true,
    returnedValueType: ECalendarValue.String,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showGoToCurrent: true,
    showMultipleYearsNavigation: false,
    showNearMonthDays: true,
    showSeconds: false,
    showTwentyFourHours: false,
    showWeekNumbers: false,
    timeSeparator: ':',
    unSelectOnClick: true,
    weekDayFormat: 'ddd',
    yearFormat: 'YYYY',
  };

  protected formGroup!: UntypedFormGroup;
  protected isAtTop = true;
  private date: Dayjs | null = null;
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
  private demoFormat = 'DD-MM-YYYY';
  private disabled = false;
  private material = true;
  private pickerMode = 'daytimePicker';
  private placeholder = 'Choose a date...';
  private required = false;

  private validationMaxDate: Dayjs | null = null;
  private validationMinDate: Dayjs | null = null;

  public ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  protected closeCalendar(): void {
    if (this.dateComponent() !== undefined) {
      this.dateComponent()?.api.close();
    } else if (this.datePickerDirective() !== undefined) {
      this.datePickerDirective()?.api.close();
    }
  }

  protected closed(): void {
    console.info('closed');
  }

  protected log(item: unknown): void {
    console.info(item);
  }

  protected moveCalendarTo(): void {
    this.dateComponent()?.api.moveCalendarTo(dayjs('14-01-1987', this.demoFormat));
  }

  protected onLeftNav(change: INavEvent): void {
    console.info('left nav', change);
  }

  protected onRightNav(change: INavEvent): void {
    console.info('right nav', change);
  }

  protected onSelect(data: ISelectionEvent): void {
    console.info(data);
  }

  protected openCalendar(): void {
    if (this.dateComponent() !== undefined) {
      this.dateComponent()?.api.open();
    } else if (this.datePickerDirective() !== undefined) {
      this.datePickerDirective()?.api.open();
    }
  }

  protected opened(): void {
    console.info('opened');
  }

  @debounce(100)
  protected updateIsAtTop(): void {
    this.isAtTop = document.body.scrollTop === 0;
  }

  protected validatorsChanged(): void {
    this.formGroup.get('datePicker')?.updateValueAndValidity();
  }

  private buildForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      datePicker: new UntypedFormControl({ disabled: this.disabled, value: this.date }, [
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
      case 'dayDirective':
      case 'dayDirectiveReactiveMenu':
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
    throw new Error(`Invalid mode: ${mode}`);
  }
}
