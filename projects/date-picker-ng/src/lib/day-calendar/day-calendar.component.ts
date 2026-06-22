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
  @Output() onSelect = new EventEmitter<IDay>();
  @Output() onMonthSelect = new EventEmitter<IMonth>();
  @Output() onNavHeaderBtnClick = new EventEmitter<ECalendarMode>();
  @Output() onGoToCurrent = new EventEmitter<void>();
  @Output() onLeftNav = new EventEmitter<INavEvent>();
  @Output() onRightNav = new EventEmitter<INavEvent>();
  CalendarMode = ECalendarMode;
  isInited = false;
  componentConfig: IDayCalendarConfigInternal = {};
  weeks: IDay[][] = [];
  weekdays: Dayjs[] = [];
  inputValue: CalendarValue = '';
  inputValueType!: ECalendarValue;
  validateFn!: DateValidator;
  currentCalendarMode: ECalendarMode = ECalendarMode.Day;
  monthCalendarConfig: IMonthCalendarConfig = {};
  _shouldShowCurrent = true;
  navLabel = '';
  showLeftNav = false;
  showRightNav = false;
  api = {
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

  _selected: Dayjs[] = [];

  get selected(): Dayjs[] {
    return this._selected;
  }

  set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }

  _currentDateView: Dayjs | null = null;

  get currentDateView(): Dayjs | null {
    return this._currentDateView;
  }

  set currentDateView(current: Dayjs | null) {
    this._currentDateView = dayjsRef(current?.toDate());
    this.weeks = this.dayCalendarService.generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
    this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
    this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
    this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
  }

  public ngOnInit() {
    this.isInited = true;
    this.init();
    this.initValidators();
  }

  init() {
    this.componentConfig = this.dayCalendarService.getConfig(this.config());
    this.currentDateView = this.displayDate()
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

  public writeValue(value: CalendarValue): void {
    this.inputValue = value;

    if (value) {
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
    if (this.minDate() || this.maxDate()) {
      return this.validateFn(formControl.value as CalendarValue);
    } else {
      return () => null;
    }
  }

  processOnChangeCallback(value: Dayjs[]): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      value,
      this.componentConfig.returnedValueType || this.inputValueType,
    );
  }

  initValidators() {
    this.validateFn = this.utilsService.createValidator(
      { minDate: this.minDate(), maxDate: this.maxDate() },
      this.componentConfig.format,
      'day',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  dayClicked(day: IDay) {
    if (day.selected && !this.componentConfig.unSelectOnClick) {
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

  getDayBtnText(day: IDay): string {
    return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
  }

  getDayBtnCssClass(day: IDay): Partial<Record<string, boolean>> {
    const cssClasses: Partial<Record<string, boolean>> = {
      'dp-selected': day.selected,
      'dp-current-month': day.currentMonth,
      'dp-prev-month': day.prevMonth,
      'dp-next-month': day.nextMonth,
      'dp-current-day': day.currentDay,
    };
    const customCssClass: string = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);

    if (customCssClass) {
      cssClasses[customCssClass] = true;
    }

    return cssClasses;
  }

  onLeftNavClick() {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, -1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onLeftNav.emit({ from, to });
  }

  onRightNavClick() {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.moveCalendarsBy(this.currentDateView, 1, 'month');
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightNav.emit({ from, to });
  }

  onMonthCalendarLeftClick(change: INavEvent) {
    this.onLeftNav.emit(change);
  }

  onMonthCalendarRightClick(change: INavEvent) {
    this.onRightNav.emit(change);
  }

  onMonthCalendarSecondaryLeftClick(change: INavEvent) {
    this.onRightNav.emit(change);
  }

  onMonthCalendarSecondaryRightClick(change: INavEvent) {
    this.onLeftNav.emit(change);
  }

  getWeekdayName(weekday: Dayjs): string {
    if (this.componentConfig.weekDayFormatter) {
      return this.componentConfig.weekDayFormatter(weekday.day());
    }

    return weekday.format(this.componentConfig.weekDayFormat);
  }

  toggleCalendarMode(mode: ECalendarMode) {
    if (this.currentCalendarMode !== mode) {
      this.currentCalendarMode = mode;
      this.onNavHeaderBtnClick.emit(mode);
    }

    this.cd.markForCheck();
  }

  monthSelected(month: IMonth) {
    this.currentDateView = dayjsRef(month.date?.toDate());
    this.currentCalendarMode = ECalendarMode.Day;
    this.onMonthSelect.emit(month);
  }

  moveCalendarsBy(current: Dayjs | null, amount: number, granularity: ManipulateType = 'month') {
    this.currentDateView = dayjsRef(current?.toDate()).add(amount, granularity);
    this.cd.markForCheck();
  }

  moveCalendarTo(to: SingleCalendarValue | null) {
    if (to) {
      this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
    }

    this.cd.markForCheck();
  }

  shouldShowCurrent(): boolean {
    return this.utilsService.shouldShowCurrent(
      this.componentConfig.showGoToCurrent,
      'day',
      this.componentConfig.min,
      this.componentConfig.max,
    );
  }

  goToCurrent() {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  handleConfigChange(config: ConfigChange): void {
    const prevConf: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.previousValue);
    const currentConf: IDayCalendarConfigInternal = this.dayCalendarService.getConfig(config.currentValue);

    if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
      this._currentDateView = null;
    }
  }
}
