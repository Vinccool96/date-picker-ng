import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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

import { IDate } from '../common/models/date.model';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { DateValidator } from '../common/types/validator.type';
import { DayCalendarComponent } from '../day-calendar/day-calendar.component';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectComponent } from '../time-select/time-select.component';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDayTimeCalendarConfig, IDayTimeCalendarConfigInternal } from './day-time-calendar-config.model';
import { DayTimeCalendarService } from './day-time-calendar.service';

@Component({
  selector: 'dp-day-time-calendar',
  imports: [DayCalendarComponent, TimeSelectComponent, FormsModule],
  templateUrl: 'day-time-calendar.component.html',
  styleUrls: ['day-time-calendar.component.scss'],
  providers: [
    DayTimeCalendarService,
    DayCalendarService,
    TimeSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DayTimeCalendarComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => DayTimeCalendarComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
})
export class DayTimeCalendarComponent implements ControlValueAccessor, OnInit, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<IDayTimeCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly maxDate = input<Dayjs | null>(null);
  public readonly minDate = input<Dayjs | null>(null);
  public readonly theme = input<string>('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly onChange = output<IDate>();
  public readonly onGoToCurrent = output();
  public readonly onLeftNav = output<INavEvent>();
  public readonly onRightNav = output<INavEvent>();

  /*
   *****************************************************************************************************************
   * viewChildren
   *****************************************************************************************************************
   */

  public readonly dayCalendarRef = viewChild.required<DayCalendarComponent>('dayCalendar');

  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly dayTimeCalendarService = inject(DayTimeCalendarService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly utilsService = inject(UtilsService);

  /*
   *****************************************************************************************************************
   * other
   *****************************************************************************************************************
   */

  public api = {
    moveCalendarTo: this.moveCalendarTo.bind(this),
  };
  protected _selected: Dayjs | undefined;
  protected componentConfig: IDayTimeCalendarConfigInternal = {};
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;
  private isInited = false;

  private validateFn!: DateValidator;

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

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  public moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to !== null) {
      this.dayCalendarRef().moveCalendarTo(to);
    }
  }

  public registerOnChange(callback: (argument: unknown) => void): void {
    this.onChangeCallback = callback;
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl<CalendarValue | null>): ValidationErrors | null {
    return this.minDate() !== null || this.maxDate() !== null
      ? this.validateFn(formControl.value)
      : (): ValidationErrors | null => null;
  }

  public writeValue(value: CalendarValue | null): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== '') {
      this.selected = this.utilsService.convertToDayjsArray(value, {
        allowMultiSelect: false,
        format: this.componentConfig.format,
      })[0];
      this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    } else {
      this.selected = undefined;
    }

    this.cd.markForCheck();
  }

  protected dateSelected(day: IDate): void {
    this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.componentConfig);
    this.emitChange();
  }

  protected onLeftNavClick(change: INavEvent): void {
    this.onLeftNav.emit(change);
  }

  protected onRightNavClick(change: INavEvent): void {
    this.onRightNav.emit(change);
  }

  protected timeChange(time: IDate): void {
    this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange.emit({ date: this.selected, selected: false });
  }

  private init(): void {
    this.componentConfig = this.dayTimeCalendarService.getConfig(this.config());
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      {
        maxDate: this.maxDate(),
        minDate: this.minDate(),
      },
      undefined,
      'daytime',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  private onChanges(isDateChanged = false): void {
    if (!this.isInited) {
      return;
    }

    this.init();

    if (isDateChanged) {
      this.initValidators();
    }
  }

  private processOnChangeCallback(value: Dayjs | undefined): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      [value],
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

  private get selected(): Dayjs | undefined {
    return this._selected;
  }

  private set selected(selected: Dayjs | undefined) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }
}
