import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  input,
  OnInit,
  Output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
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
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dp-day-time-calendar',
  templateUrl: 'day-time-calendar.component.html',
  styleUrls: ['day-time-calendar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
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
export class DayTimeCalendarComponent implements OnInit, ControlValueAccessor, Validator {
  public readonly config = input<IDayTimeCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly minDate = input<SingleCalendarValue>();
  public readonly maxDate = input<SingleCalendarValue>();
  public readonly theme = input<string>('');
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

  public readonly dayTimeCalendarService = inject(DayTimeCalendarService);
  private readonly utilsService = inject(UtilsService);
  private readonly cd = inject(ChangeDetectorRef);

  public constructor() {
    toObservable(this.config).subscribe(() => {
      this.onChanges();
    });
    toObservable(this.displayDate).subscribe(() => {
      this.onChanges();
    });
    toObservable(this.minDate).subscribe(() => {
      this.onChanges(true);
    });
    toObservable(this.maxDate).subscribe(() => {
      this.onChanges(true);
    });
  }

  _selected: Dayjs | undefined;

  get selected(): Dayjs | undefined {
    return this._selected;
  }

  set selected(selected: Dayjs | undefined) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }

  public ngOnInit() {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  init() {
    this.componentConfig = this.dayTimeCalendarService.getConfig(this.config());
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  private onChanges(date = false) {
    if (this.isInited) {
      this.init();

      if (date) {
        this.initValidators();
      }
    }
  }

  public writeValue(value: CalendarValue): void {
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

  public registerOnChange(fn: (arg: unknown) => void): void {
    this.onChangeCallback = fn;
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    if (this.minDate() || this.maxDate()) {
      return this.validateFn(formControl.value as CalendarValue);
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
