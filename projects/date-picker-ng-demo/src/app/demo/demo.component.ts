import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import { GaService } from './common/services/ga/ga.service';
import {
  DatePickerComponent,
  DatePickerDirective,
  debounce,
  ECalendarValue,
  IDatePickerConfig,
  INavEvent,
  ISelectionEvent,
} from 'date-picker-ng';

@Component({
  selector: 'dp-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
  standalone: false,
})
export class DemoComponent implements OnInit {
  @ViewChild('dateComponent') dateComponent: DatePickerComponent;
  @ViewChild('donateForm') donateForm: any;
  @ViewChild('dateDirectivePicker') datePickerDirective: DatePickerDirective;
  demoFormat = 'DD-MM-YYYY';
  pickerMode = 'daytimePicker';

  date: Dayjs;
  dates: Dayjs[] = [];
  material: boolean = true;
  required: boolean = false;
  disabled: boolean = false;
  validationMinDate: Dayjs;
  validationMaxDate: Dayjs;
  validationMinTime: Dayjs;
  validationMaxTime: Dayjs;
  placeholder: string = 'Choose a date...';
  displayDate: Dayjs | string;
  dateTypes: { name: string; value: ECalendarValue | null }[] = [
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
  config: IDatePickerConfig = {
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

  formGroup!: UntypedFormGroup;
  isAtTop: boolean = true;

  private readonly gaService = inject(GaService);

  ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  @HostListener('document:scroll')
  @debounce(100)
  updateIsAtTop() {
    this.isAtTop = document.body.scrollTop === 0;
  }

  validatorsChanged() {
    this.formGroup.get('datePicker')?.updateValueAndValidity();
  }

  openCalendar() {
    if (this.dateComponent) {
      this.dateComponent.api.open();
    } else if (this.datePickerDirective) {
      this.datePickerDirective.api.open();
    }
  }

  closeCalendar() {
    if (this.dateComponent) {
      this.dateComponent.api.close();
    } else if (this.datePickerDirective) {
      this.datePickerDirective.api.close();
    }
  }

  opened() {
    console.info('opened');
  }

  closed() {
    console.info('closed');
  }

  log(_) {
    // console.info(item);
  }

  onLeftNav(change: INavEvent) {
    console.info('left nav', change);
  }

  onRightNav(change: INavEvent) {
    console.info('right nav', change);
  }

  moveCalendarTo() {
    this.dateComponent.api.moveCalendarTo(dayjs('14-01-1987', this.demoFormat));
  }

  donateClicked() {
    this.gaService.emitEvent('donate', 'clicked');
    this.donateForm.nativeElement.submit();
  }

  becomeABackerClicked() {
    this.gaService.emitEvent('becomeABacker', 'clicked');
  }

  onSelect(data: ISelectionEvent) {
    console.info(data);
  }

  private buildForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      datePicker: new UntypedFormControl({ value: this.date, disabled: this.disabled }, [
        this.required ? Validators.required : () => null,
        (control) => {
          return this.validationMinDate &&
            this.config &&
            dayjs(control.value, this.config.format || DemoComponent.getDefaultFormatByMode(this.pickerMode)).isBefore(
              this.validationMinDate,
            )
            ? { minDate: 'minDate Invalid' }
            : null;
        },
        (control) =>
          this.validationMaxDate &&
          this.config &&
          dayjs(control.value, this.config.format || DemoComponent.getDefaultFormatByMode(this.pickerMode)).isAfter(
            this.validationMaxDate,
          )
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
