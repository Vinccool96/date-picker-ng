import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
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
  private readonly donateForm = viewChild.required<ElementRef<HTMLFormElement>>('donateForm');
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

  private readonly gaService = inject(GaService);

  public ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  @debounce(100)
  protected updateIsAtTop() {
    this.isAtTop = document.body.scrollTop === 0;
  }

  protected validatorsChanged() {
    this.formGroup.get('datePicker')?.updateValueAndValidity();
  }

  protected openCalendar() {
    if (this.dateComponent()) {
      this.dateComponent()?.api.open();
    } else if (this.datePickerDirective()) {
      this.datePickerDirective()?.api.open();
    }
  }

  protected closeCalendar() {
    if (this.dateComponent()) {
      this.dateComponent()?.api.close();
    } else if (this.datePickerDirective()) {
      this.datePickerDirective()?.api.close();
    }
  }

  protected opened() {
    console.info('opened');
  }

  protected closed() {
    console.info('closed');
  }

  protected log(item: unknown) {
    console.info(item);
  }

  protected onLeftNav(change: INavEvent) {
    console.info('left nav', change);
  }

  protected onRightNav(change: INavEvent) {
    console.info('right nav', change);
  }

  protected moveCalendarTo() {
    this.dateComponent()?.api.moveCalendarTo(dayjs('14-01-1987', this.demoFormat));
  }

  protected donateClicked() {
    this.gaService.emitEvent('donate', 'clicked');
    this.donateForm().nativeElement.submit();
  }

  protected becomeABackerClicked() {
    this.gaService.emitEvent('becomeABacker', 'clicked');
  }

  protected onSelect(data: ISelectionEvent) {
    console.info(data);
  }

  private buildForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      datePicker: new UntypedFormControl({ value: this.date, disabled: this.disabled }, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.required ? Validators.required : () => null,
        (control) => {
          return this.validationMinDate &&
            dayjs(
              control.value as dayjs.ConfigType,
              this.config.format || DemoComponent.getDefaultFormatByMode(this.pickerMode),
            ).isBefore(this.validationMinDate)
            ? { minDate: 'minDate Invalid' }
            : null;
        },
        (control) =>
          this.validationMaxDate &&
          dayjs(
            control.value as dayjs.ConfigType,
            this.config.format || DemoComponent.getDefaultFormatByMode(this.pickerMode),
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
