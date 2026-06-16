import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  input,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Dayjs } from 'dayjs';
import { CalendarValue } from '../common/types/calendar-value';
import { UtilsService } from '../common/services/utils/utils.service';
import { IDate } from '../common/models/date.model';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDayTimeCalendarConfig, IDayTimeCalendarConfigInternal } from './day-time-calendar-config.model';
import { DayTimeCalendarService } from './day-time-calendar.service';
import { DateValidator } from '../common/types/validator.type';
import { DayCalendarComponent } from '../day-calendar/day-calendar.component';
import { INavEvent } from '../common/models/navigation-event.model';
import { TimeSelectComponent } from '../time-select/time-select.component';

@Component({
  selector: 'dp-day-time-calendar',
  templateUrl: 'day-time-calendar.component.html',
  styleUrls: ['day-time-calendar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    DayTimeCalendarService,
    DayCalendarService,
    TimeSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayTimeCalendarComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DayTimeCalendarComponent),
      multi: true,
    },
  ],
  imports: [DayCalendarComponent, TimeSelectComponent, FormsModule],
})
export class DayTimeCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
  public readonly config = input<IDayTimeCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly minDate = input<SingleCalendarValue>();
  public readonly maxDate = input<SingleCalendarValue>();
  @HostBinding('class') @Input() theme!: string;
  @Output() onChange = new EventEmitter<IDate>();
  @Output() onGoToCurrent = new EventEmitter<void>();
  @Output() onLeftNav = new EventEmitter<INavEvent>();
  @Output() onRightNav = new EventEmitter<INavEvent>();
  public readonly dayCalendarRef = viewChild.required<DayCalendarComponent>('dayCalendar');
  isInited = false;
  componentConfig: IDayTimeCalendarConfigInternal = {};
  inputValue: CalendarValue = '';
  inputValueType!: ECalendarValue;
  validateFn!: DateValidator;
  api = {
    moveCalendarTo: this.moveCalendarTo.bind(this),
  };

  constructor(
    public dayTimeCalendarService: DayTimeCalendarService,
    public utilsService: UtilsService,
    public cd: ChangeDetectorRef,
  ) {}

  _selected: Dayjs | undefined;

  get selected(): Dayjs | undefined {
    return this._selected;
  }

  set selected(selected: Dayjs | undefined) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }
  ngOnInit() {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  init() {
    this.componentConfig = this.dayTimeCalendarService.getConfig(this.config());
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInited) {
      const { minDate, maxDate } = changes;
      this.init();

      if (minDate || maxDate) {
        this.initValidators();
      }
    }
  }

  writeValue(value: CalendarValue): void {
    this.inputValue = value;

    if (value) {
      this.selected = this.utilsService.convertToDayjsArray(value, {
        format: this.componentConfig.format,
        allowMultiSelect: false,
      })[0];
      this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    } else {
      this.selected = undefined;
    }

    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  onChangeCallback(_: any) {}

  registerOnTouched(fn: any): void {}

  validate(formControl: UntypedFormControl): ValidationErrors | any {
    if (this.minDate() || this.maxDate()) {
      return this.validateFn(formControl.value);
    } else {
      return () => null;
    }
  }

  processOnChangeCallback(value: Dayjs | undefined): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      [value],
      this.componentConfig.returnedValueType || this.inputValueType,
    );
  }

  initValidators() {
    this.validateFn = this.utilsService.createValidator(
      {
        minDate: this.minDate(),
        maxDate: this.maxDate(),
      },
      undefined,
      'daytime',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  dateSelected(day: IDate) {
    this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.componentConfig);
    this.emitChange();
  }

  timeChange(time: IDate) {
    this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
    this.emitChange();
  }

  emitChange() {
    this.onChange.emit({ date: this.selected as Dayjs, selected: false });
  }

  moveCalendarTo(to: SingleCalendarValue | null) {
    if (to) {
      this.dayCalendarRef().moveCalendarTo(to);
    }
  }

  onLeftNavClick(change: INavEvent) {
    this.onLeftNav.emit(change);
  }

  onRightNavClick(change: INavEvent) {
    this.onRightNav.emit(change);
  }
}
