import { NgClass } from '@angular/common';
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
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Dayjs, ManipulateType } from 'dayjs';
import { pairwise } from 'rxjs/internal/operators';

import { CalendarNavComponent } from '../calendar-nav/calendar-nav.component';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { ConfigChange } from '../common/models/config-change';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { DateValidator } from '../common/types/validator.type';
import { WeekDays } from '../common/types/week-days.type';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { MonthCalendarComponent } from '../month-calendar/month-calendar.component';
import { IMonth } from '../month-calendar/month.model';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { DayCalendarService } from './day-calendar.service';
import { IDay } from './day.model';

@Component({
  selector: 'dp-day-calendar',
  imports: [MonthCalendarComponent, CalendarNavComponent, NgClass, FormsModule],
  templateUrl: 'day-calendar.component.html',
  styleUrls: ['day-calendar.component.scss'],
  providers: [
    DayCalendarService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DayCalendarComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => DayCalendarComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
})
export class DayCalendarComponent implements ControlValueAccessor, OnInit, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<IDayCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly maxDate = input<Dayjs | null>(null);
  public readonly minDate = input<Dayjs | null>(null);
  public readonly theme = input<string>('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly onGoToCurrent = output();
  public readonly onLeftNav = output<INavEvent>();
  public readonly onMonthSelect = output<IMonth>();
  public readonly onNavHeaderBtnClick = output<ECalendarMode>();
  public readonly onRightNav = output<INavEvent>();
  public readonly onSelect = output<IDay>();

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  public readonly dayCalendarService = inject(DayCalendarService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly utilsService = inject(UtilsService);

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  public api = {
    moveCalendarsBy: this.moveCalendarsBy.bind(this),
    moveCalendarTo: this.moveCalendarTo.bind(this),
    toggleCalendarMode: this.toggleCalendarMode.bind(this),
  };
  public componentConfig: IDayCalendarConfigInternal = {};
  protected _currentDateView: Dayjs | null = null;
  protected _selected: Dayjs[] = [];
  protected _shouldShowCurrent = true;
  protected readonly CalendarMode = ECalendarMode;
  protected currentCalendarMode: ECalendarMode = ECalendarMode.Day;
  protected monthCalendarConfig: IMonthCalendarConfig = {};
  protected navLabel = '';
  protected showLeftNav = false;
  protected showRightNav = false;
  protected weekdays: Dayjs[] = [];
  protected weeks: IDay[][] = [];
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;

  private isInited = false;

  private validateFn!: DateValidator;

  public constructor() {
    toObservable(this.config)
      .pipe(pairwise())
      .subscribe(([previousValue, currentValue]): void => {
        this.onChanges('config', { currentValue, previousValue });
      });
    toObservable(this.displayDate).subscribe((): void => {
      this.onChanges('display');
    });
    toObservable(this.minDate).subscribe((): void => {
      this.onChanges('date');
    });
    toObservable(this.maxDate).subscribe((): void => {
      this.onChanges('date');
    });
  }

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  public getDayBtnCssClass(day: IDay): Partial<Record<string, boolean>> {
    const cssClasses: Partial<Record<string, boolean>> = {
      'dp-current-day': day.currentDay,
      'dp-current-month': day.currentMonth,
      'dp-next-month': day.nextMonth,
      'dp-prev-month': day.prevMonth,
      'dp-selected': day.selected,
    };
    const customCssClass: string = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);

    if (customCssClass !== '') {
      cssClasses[customCssClass] = true;
    }

    return cssClasses;
  }

  public getDayBtnText(day: IDay): string {
    return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
  }

  public getWeekdayName(weekday: Dayjs): string {
    if (this.componentConfig.weekDayFormatter !== undefined) {
      return this.componentConfig.weekDayFormatter(weekday.day());
    }

    return weekday.format(this.componentConfig.weekDayFormat);
  }

  public goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  public moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to !== null) {
      this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
    }

    this.cd.markForCheck();
  }

  public registerOnChange(callback: (argument: unknown) => void): void {
    this.onChangeCallback = callback;
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl<CalendarValue | null>): ValidationErrors | null {
    return this.minDate() !== null || this.maxDate() !== null
      ? this.validateFn(formControl.value as CalendarValue)
      : (): ValidationErrors | null => null;
  }

  public writeValue(value: CalendarValue | null): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== '') {
      this.selected = this.utilsService.convertToDayjsArray(value, this.componentConfig);
      this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
    } else {
      this.selected = [];
    }

    this.weeks = this.dayCalendarService.generateMonthArray(
      this.componentConfig,
      this.currentDateView as Dayjs,
      this.selected,
    );

    this.cd.markForCheck();
  }

  protected dayClicked(day: IDay): void {
    if (day.selected && this.componentConfig.unSelectOnClick !== true) {
      return;
    }

    this.selected = this.utilsService.updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
    this.weeks = this.dayCalendarService.generateMonthArray(
      this.componentConfig,
      this.currentDateView as Dayjs,
      this.selected,
    );
    this.onSelect.emit(day);
  }

  protected monthSelected(month: IMonth): void {
    this.currentDateView = dayjsRef(month.date?.toDate());
    this.currentCalendarMode = ECalendarMode.Day;
    this.onMonthSelect.emit(month);
  }

  protected onLeftNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, -1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onLeftNav.emit({ from, to });
  }

  protected onMonthCalendarLeftClick(change: INavEvent): void {
    this.onLeftNav.emit(change);
  }

  protected onMonthCalendarRightClick(change: INavEvent): void {
    this.onRightNav.emit(change);
  }

  protected onMonthCalendarSecondaryLeftClick(change: INavEvent): void {
    this.onRightNav.emit(change);
  }

  protected onMonthCalendarSecondaryRightClick(change: INavEvent): void {
    this.onLeftNav.emit(change);
  }

  protected onRightNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, 1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightNav.emit({ from, to });
  }

  protected toggleCalendarMode(mode: ECalendarMode): void {
    if (this.currentCalendarMode !== mode) {
      this.currentCalendarMode = mode;
      this.onNavHeaderBtnClick.emit(mode);
    }

    this.cd.markForCheck();
  }

  private handleConfigChange(config: ConfigChange): void {
    const previousConfig: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.previousValue);
    const currentConfig: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.currentValue);

    if (this.utilsService.shouldResetCurrentView(previousConfig, currentConfig)) {
      this._currentDateView = null;
    }
  }

  private init(): void {
    this.componentConfig = this.dayCalendarService.getConfig(this.config());
    this.currentDateView =
      this.displayDate() === null
        ? this.utilsService.getDefaultDisplayDate(
            this.currentDateView,
            this.selected,
            this.componentConfig.allowMultiSelect,
            this.componentConfig.min,
          )
        : this.utilsService.convertToDayjs(this.displayDate(), this.componentConfig.format);
    this.weekdays = this.dayCalendarService.generateWeekdays(this.componentConfig.firstDayOfWeek as WeekDays);
    this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
    this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
    this._shouldShowCurrent = this.shouldShowCurrent();
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      { maxDate: this.maxDate(), minDate: this.minDate() },
      this.componentConfig.format,
      'day',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  private moveCalendarsBy(current: Dayjs | null, amount: number, granularity: ManipulateType = 'month'): void {
    this.currentDateView = dayjsRef(current?.toDate()).add(amount, granularity);
    this.cd.markForCheck();
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  private onChanges(change: 'config' | 'date' | 'display', configChange?: ConfigChange): void {
    if (!this.isInited) {
      return;
    }

    if (change === 'config') {
      this.handleConfigChange(configChange as ConfigChange);
    }

    this.init();

    if (change === 'date') {
      this.initValidators();
    }
  }

  private processOnChangeCallback(value: Dayjs[]): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      value,
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

  private shouldShowCurrent(): boolean {
    return this.utilsService.shouldShowCurrent(
      this.componentConfig.showGoToCurrent,
      'day',
      this.componentConfig.min,
      this.componentConfig.max,
    );
  }

  private get currentDateView(): Dayjs | null {
    return this._currentDateView;
  }

  private set currentDateView(current: Dayjs | null) {
    this._currentDateView = dayjsRef(current?.toDate());
    this.weeks = this.dayCalendarService.generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
    this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
    this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
    this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
  }

  private get selected(): Dayjs[] {
    return this._selected;
  }

  private set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }
}
