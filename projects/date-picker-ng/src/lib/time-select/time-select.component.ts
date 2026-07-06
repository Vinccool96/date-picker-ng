import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { IDate } from '../common/models/date.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { DateValidator } from '../common/types/validator.type';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from './time-select-config.model';
import { TimeSelectService, TimeUnit } from './time-select.service';

@Component({
  selector: 'dp-time-select',
  templateUrl: 'time-select.component.html',
  styleUrls: ['time-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TimeSelectComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => TimeSelectComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
})
export class TimeSelectComponent implements ControlValueAccessor, OnInit, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<ITimeSelectConfig>();
  public readonly displayDate = input<SingleCalendarValue>();
  public readonly maxDate = input<SingleCalendarValue | null>(null);
  public readonly maxTime = input<SingleCalendarValue>();
  public readonly minDate = input<SingleCalendarValue | null>(null);
  public readonly minTime = input<SingleCalendarValue>();
  public readonly theme = input<string>('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly onChange = output<IDate>();

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly cd = inject(ChangeDetectorRef);
  private readonly timeSelectService = inject(TimeSelectService);
  private readonly utilsService = inject(UtilsService);

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  public api = {
    triggerChange: this.emitChange.bind(this),
  };
  public hours = '';
  public meridiem = '';
  public minutes = '';
  public seconds = '';
  protected componentConfig: ITimeSelectConfigInternal = {};
  protected showDecHour = false;
  protected showDecMinute = false;
  protected showDecSecond = false;
  protected showIncHour = false;
  protected showIncMinute = false;
  protected showIncSecond = false;
  protected showToggleMeridiem = false;
  private _selected?: Dayjs;
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;
  private isInited = false;

  private validateFn!: DateValidator;

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

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  public calculateTimeParts(time: Dayjs | undefined): void {
    this.hours = this.timeSelectService.getHours(this.componentConfig, time);
    this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
    this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
    this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
  }

  public registerOnChange(onChangeFunction: (argument: unknown) => void): void {
    this.onChangeCallback = onChangeFunction;
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    return this.minDate() !== null ||
      this.maxDate() !== null ||
      this.minTime() !== undefined ||
      this.maxTime() !== undefined
      ? this.validateFn(formControl.value as CalendarValue)
      : (): ValidationErrors | null => null;
  }

  public writeValue(value: CalendarValue | null | undefined): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== undefined && value !== '') {
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
    this.onChange.emit({ date: this.selected, selected: false });
    this.cd.markForCheck();
  }

  private init(): void {
    this.componentConfig = this.timeSelectService.getConfig(this.config());
    this.selected ??= dayjsRef();
    this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      {
        maxDate: this.maxDate(),
        maxTime: this.maxTime(),
        minDate: this.minDate(),
        minTime: this.minTime(),
      },
      undefined,
      'day',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  private onChanges(): void {
    if (!this.isInited) {
      return;
    }

    this.initValidators();
    this.init();
  }

  private processOnChangeCallback(value: Dayjs | undefined): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.timeSelectService.getTimeFormat(this.componentConfig),
      [value],
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

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
}
