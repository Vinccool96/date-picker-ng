import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
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
import { DayCalendarService } from './day-calendar.service';

import { Dayjs, ManipulateType } from 'dayjs';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { IDay } from './day.model';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { CalendarValue } from '../common/types/calendar-value';
import { UtilsService } from '../common/services/utils/utils.service';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { IMonth } from '../month-calendar/month.model';
import { DateValidator } from '../common/types/validator.type';
import { INavEvent } from '../common/models/navigation-event.model';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { MonthCalendarComponent } from '../month-calendar/month-calendar.component';
import { CalendarNavComponent } from '../calendar-nav/calendar-nav.component';
import { NgClass } from '@angular/common';
import { WeekDays } from '../common/types/week-days.type';
import { ConfigChange } from '../common/models/config-change';
import { toObservable } from '@angular/core/rxjs-interop';
import { pairwise } from 'rxjs/internal/operators';

@Component({
  selector: 'dp-day-calendar',
  templateUrl: 'day-calendar.component.html',
  styleUrls: ['day-calendar.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme()',
  },
  providers: [
    DayCalendarService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayCalendarComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DayCalendarComponent),
      multi: true,
    },
  ],
  imports: [MonthCalendarComponent, CalendarNavComponent, NgClass, FormsModule],
})
export class DayCalendarComponent implements OnInit, ControlValueAccessor, Validator {
  public readonly config = input<IDayCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly minDate = input<Dayjs>();
  public readonly maxDate = input<Dayjs>();
  public readonly theme = input<string>('');
  @Output() public onSelect = new EventEmitter<IDay>();
  @Output() public onMonthSelect = new EventEmitter<IMonth>();
  @Output() public onNavHeaderBtnClick = new EventEmitter<ECalendarMode>();
  @Output() public onGoToCurrent = new EventEmitter<void>();
  @Output() public onLeftNav = new EventEmitter<INavEvent>();
  @Output() public onRightNav = new EventEmitter<INavEvent>();
  protected readonly CalendarMode = ECalendarMode;
  private isInited = false;
  public componentConfig: IDayCalendarConfigInternal = {};
  protected weeks: IDay[][] = [];
  protected weekdays: Dayjs[] = [];
  private inputValue: CalendarValue = '';
  private inputValueType!: ECalendarValue;
  private validateFn!: DateValidator;
  protected currentCalendarMode: ECalendarMode = ECalendarMode.Day;
  protected monthCalendarConfig: IMonthCalendarConfig = {};
  protected _shouldShowCurrent = true;
  protected navLabel = '';
  protected showLeftNav = false;
  protected showRightNav = false;
  public api = {
    moveCalendarsBy: this.moveCalendarsBy.bind(this),
    moveCalendarTo: this.moveCalendarTo.bind(this),
    toggleCalendarMode: this.toggleCalendarMode.bind(this),
  };

  public readonly dayCalendarService = inject(DayCalendarService);
  private readonly utilsService = inject(UtilsService);
  private readonly cd = inject(ChangeDetectorRef);

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

  protected _selected: Dayjs[] = [];

  private get selected(): Dayjs[] {
    return this._selected;
  }

  private set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }

  protected _currentDateView: Dayjs | null = null;

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

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  private init(): void {
    this.componentConfig = this.dayCalendarService.getConfig(this.config());
    this.currentDateView =
      this.displayDate() !== null
        ? this.utilsService.convertToDayjs(this.displayDate(), this.componentConfig.format)
        : this.utilsService.getDefaultDisplayDate(
            this.currentDateView,
            this.selected,
            this.componentConfig.allowMultiSelect,
            this.componentConfig.min,
          );
    this.weekdays = this.dayCalendarService.generateWeekdays(this.componentConfig.firstDayOfWeek as WeekDays);
    this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
    this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
    this._shouldShowCurrent = this.shouldShowCurrent();
  }

  private onChanges(change: 'config' | 'date' | 'display', configChange?: ConfigChange): void {
    if (this.isInited) {
      if (change === 'config') {
        this.handleConfigChange(configChange as ConfigChange);
      }

      this.init();

      if (change === 'date') {
        this.initValidators();
      }
    }
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

  public registerOnChange(fn: (arg: unknown) => void): void {
    this.onChangeCallback = fn;
  }

  private onChangeCallback(_: CalendarValue | undefined): void {
    // No op
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: UntypedFormControl): ValidationErrors | null {
    if (this.minDate() !== undefined || this.maxDate() !== undefined) {
      return this.validateFn(formControl.value as CalendarValue);
    } else {
      return () => null;
    }
  }

  private processOnChangeCallback(value: Dayjs[]): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      value,
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      { minDate: this.minDate(), maxDate: this.maxDate() },
      this.componentConfig.format,
      'day',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
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

  public getDayBtnText(day: IDay): string {
    return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
  }

  public getDayBtnCssClass(day: IDay): Partial<Record<string, boolean>> {
    const cssClasses: Partial<Record<string, boolean>> = {
      'dp-selected': day.selected,
      'dp-current-month': day.currentMonth,
      'dp-prev-month': day.prevMonth,
      'dp-next-month': day.nextMonth,
      'dp-current-day': day.currentDay,
    };
    const customCssClass: string = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);

    if (customCssClass !== '') {
      cssClasses[customCssClass] = true;
    }

    return cssClasses;
  }

  protected onLeftNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, -1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onLeftNav.emit({ from, to });
  }

  protected onRightNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, 1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightNav.emit({ from, to });
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

  public getWeekdayName(weekday: Dayjs): string {
    if (this.componentConfig.weekDayFormatter !== undefined) {
      return this.componentConfig.weekDayFormatter(weekday.day());
    }

    return weekday.format(this.componentConfig.weekDayFormat);
  }

  protected toggleCalendarMode(mode: ECalendarMode): void {
    if (this.currentCalendarMode !== mode) {
      this.currentCalendarMode = mode;
      this.onNavHeaderBtnClick.emit(mode);
    }

    this.cd.markForCheck();
  }

  protected monthSelected(month: IMonth): void {
    this.currentDateView = dayjsRef(month.date?.toDate());
    this.currentCalendarMode = ECalendarMode.Day;
    this.onMonthSelect.emit(month);
  }

  private moveCalendarsBy(current: Dayjs | null, amount: number, granularity: ManipulateType = 'month'): void {
    this.currentDateView = dayjsRef(current?.toDate()).add(amount, granularity);
    this.cd.markForCheck();
  }

  public moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to !== null) {
      this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
    }

    this.cd.markForCheck();
  }

  private shouldShowCurrent(): boolean {
    return this.utilsService.shouldShowCurrent(
      this.componentConfig.showGoToCurrent,
      'day',
      this.componentConfig.min,
      this.componentConfig.max,
    );
  }

  public goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  private handleConfigChange(config: ConfigChange): void {
    const prevConf: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.previousValue);
    const currentConf: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.currentValue);

    if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
      this._currentDateView = null;
    }
  }
}
