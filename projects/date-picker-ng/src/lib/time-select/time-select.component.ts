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
  ViewEncapsulation,
} from '@angular/core';
import { TimeSelectService, TimeUnit } from './time-select.service';

import { ITimeSelectConfig, ITimeSelectConfigInternal } from './time-select-config.model';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { CalendarValue } from '../common/types/calendar-value';
import { UtilsService } from '../common/services/utils/utils.service';
import { IDate } from '../common/models/date.model';
import { DateValidator } from '../common/types/validator.type';
import { Dayjs } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dp-time-select',
  templateUrl: 'time-select.component.html',
  styleUrls: ['time-select.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme()',
  },
  providers: [
    TimeSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeSelectComponent),
      multi: true,
    },
  ],
})
export class TimeSelectComponent implements OnInit, ControlValueAccessor, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<ITimeSelectConfig>();
  public readonly displayDate = input<SingleCalendarValue>();
  public readonly minDate = input<SingleCalendarValue>();
  public readonly maxDate = input<SingleCalendarValue>();
  public readonly minTime = input<SingleCalendarValue>();
  public readonly maxTime = input<SingleCalendarValue>();
  public readonly theme = input<string>('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  @Output() public onChange = new EventEmitter<IDate>();

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly timeSelectService = inject(TimeSelectService);
  private readonly utilsService = inject(UtilsService);
  private readonly cd = inject(ChangeDetectorRef);

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  private isInited = false;
  protected componentConfig: ITimeSelectConfigInternal = {};
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;
  private validateFn!: DateValidator;
  public hours = '';
  public minutes = '';
  public seconds = '';
  public meridiem = '';
  protected showDecHour = false;
  protected showDecMinute = false;
  protected showDecSecond = false;
  protected showIncHour = false;
  protected showIncMinute = false;
  protected showIncSecond = false;
  protected showToggleMeridiem = false;
  public api = {
    triggerChange: this.emitChange.bind(this),
  };

  public constructor() {
    toObservable(this.config).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.displayDate).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.minDate).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.maxDate).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.minTime).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.maxTime).subscribe((): void => {
      this.onChanges();
    });
  }

  private _selected?: Dayjs;

  public get selected(): Dayjs | undefined {
    return this._selected;
  }

  public set selected(selected: Dayjs | undefined) {
    this._selected = selected;
    this.calculateTimeParts(this.selected);

    this.showDecHour = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected as Dayjs, 'hour');
    this.showDecMinute = this.timeSelectService.shouldShowDecrease(
      this.componentConfig,
      this._selected as Dayjs,
      'minute',
    );
    this.showDecSecond = this.timeSelectService.shouldShowDecrease(
      this.componentConfig,
      this._selected as Dayjs,
      'second',
    );

    this.showIncHour = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected as Dayjs, 'hour');
    this.showIncMinute = this.timeSelectService.shouldShowIncrease(
      this.componentConfig,
      this._selected as Dayjs,
      'minute',
    );
    this.showIncSecond = this.timeSelectService.shouldShowIncrease(
      this.componentConfig,
      this._selected as Dayjs,
      'second',
    );

    this.showToggleMeridiem = this.timeSelectService.shouldShowToggleMeridiem(
      this.componentConfig,
      this._selected as Dayjs,
    );

    this.onChangeCallback(this.processOnChangeCallback(selected));
  }

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  private init(): void {
    this.componentConfig = this.timeSelectService.getConfig(this.config());
    this.selected ??= dayjsRef();
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  private onChanges(): void {
    if (!this.isInited) {
      return;
    }

    this.initValidators();
    this.init();
  }

  public writeValue(value: CalendarValue | null): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== '') {
      const dayjsValue = this.utilsService.convertToDayjsArray(value, {
        allowMultiSelect: false,
        format: this.timeSelectService.getTimeFormat(this.componentConfig),
      })[0];

      if (dayjsValue.isValid()) {
        this.selected = dayjsValue;
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
      }
    }

    this.cd.markForCheck();
  }

  public registerOnChange(onChangeFunction: (argument: unknown) => void): void {
    this.onChangeCallback = onChangeFunction;
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    return this.minDate() !== undefined ||
      this.maxDate() !== undefined ||
      this.minTime() !== undefined ||
      this.maxTime() !== undefined
      ? this.validateFn(formControl.value as CalendarValue)
      : (): ValidationErrors | null => null;
  }

  private processOnChangeCallback(value: Dayjs | undefined): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.timeSelectService.getTimeFormat(this.componentConfig),
      [value],
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      {
        minDate: this.minDate(),
        maxDate: this.maxDate(),
        minTime: this.minTime(),
        maxTime: this.maxTime(),
      },
      undefined,
      'day',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  protected decrease(unit: TimeUnit): void {
    this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected as Dayjs, unit);
    this.emitChange();
  }

  protected increase(unit: TimeUnit): void {
    this.selected = this.timeSelectService.increase(this.componentConfig, this.selected as Dayjs, unit);
    this.emitChange();
  }

  protected toggleMeridiem(): void {
    this.selected = this.timeSelectService.toggleMeridiem(this.selected as Dayjs);
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange.emit({ date: this.selected as Dayjs, selected: false });
    this.cd.markForCheck();
  }

  public calculateTimeParts(time: Dayjs | undefined): void {
    this.hours = this.timeSelectService.getHours(this.componentConfig, time);
    this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
    this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
    this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
  }
}
