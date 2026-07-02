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
  @Output() public onChange = new EventEmitter<IDate>();
  @Output() public onGoToCurrent = new EventEmitter<void>();
  @Output() public onLeftNav = new EventEmitter<INavEvent>();
  @Output() public onRightNav = new EventEmitter<INavEvent>();
  public readonly dayCalendarRef = viewChild.required<DayCalendarComponent>('dayCalendar');
  private isInited = false;
  protected componentConfig: IDayTimeCalendarConfigInternal = {};
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;
  private validateFn!: DateValidator;
  public api = {
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

  protected _selected: Dayjs | undefined;

  private get selected(): Dayjs | undefined {
    return this._selected;
  }

  private set selected(selected: Dayjs | undefined) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  private init(): void {
    this.componentConfig = this.dayTimeCalendarService.getConfig(this.config());
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  private onChanges(date = false): void {
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

  private processOnChangeCallback(value: Dayjs | undefined): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      [value],
      this.componentConfig.returnedValueType || this.inputValueType,
    );
  }

  private initValidators(): void {
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

  protected dateSelected(day: IDate): void {
    this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.componentConfig);
    this.emitChange();
  }

  protected timeChange(time: IDate): void {
    this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange.emit({ date: this.selected as Dayjs, selected: false });
  }

  public moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to) {
      this.dayCalendarRef().moveCalendarTo(to);
    }
  }

  protected onLeftNavClick(change: INavEvent): void {
    this.onLeftNav.emit(change);
  }

  protected onRightNavClick(change: INavEvent): void {
    this.onRightNav.emit(change);
  }
}
