import { ECalendarValue } from '../common/types/calendar-value-enum';
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
import { IMonth } from './month.model';
import { MonthCalendarService } from './month-calendar.service';

import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
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
import { DateValidator } from '../common/types/validator.type';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { INavEvent } from '../common/models/navigation-event.model';
import { Dayjs } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { NgClass } from '@angular/common';
import { CalendarNavComponent } from '../calendar-nav/calendar-nav.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { pairwise } from 'rxjs/internal/operators';
import { ConfigChange } from '../common/models/config-change';

@Component({
  selector: 'dp-month-calendar',
  templateUrl: 'month-calendar.component.html',
  styleUrls: ['month-calendar.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme()',
  },
  providers: [
    MonthCalendarService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthCalendarComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MonthCalendarComponent),
      multi: true,
    },
  ],
  imports: [NgClass, CalendarNavComponent],
})
export class MonthCalendarComponent implements OnInit, ControlValueAccessor, Validator {
  public readonly config = input<IMonthCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly minDate = input<Dayjs>();
  public readonly maxDate = input<Dayjs>();
  public readonly theme = input<string>('');
  @Output() onSelect = new EventEmitter<IMonth>();
  @Output() onNavHeaderBtnClick = new EventEmitter<null>();
  @Output() onGoToCurrent = new EventEmitter<void>();
  @Output() onLeftNav = new EventEmitter<INavEvent>();
  @Output() onRightNav = new EventEmitter<INavEvent>();
  @Output() onLeftSecondaryNav = new EventEmitter<INavEvent>();
  @Output() onRightSecondaryNav = new EventEmitter<INavEvent>();
  isInited = false;
  componentConfig: IMonthCalendarConfigInternal = {};
  yearMonths: IMonth[][] = [];
  inputValue: CalendarValue = '';
  inputValueType!: ECalendarValue;
  validateFn!: DateValidator;
  _shouldShowCurrent = true;
  navLabel = '';
  showLeftNav = false;
  showRightNav = false;
  showSecondaryLeftNav = false;
  showSecondaryRightNav = false;
  api = {
    toggleCalendar: this.toggleCalendarMode.bind(this),
    moveCalendarTo: this.moveCalendarTo.bind(this),
  };

  public readonly monthCalendarService = inject(MonthCalendarService);
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
    this.yearMonths = this.monthCalendarService.generateYear(
      this.componentConfig,
      this._currentDateView,
      this.selected,
    );
    this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView as Dayjs);
    this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
    this.showRightNav = this.monthCalendarService.shouldShowRight(
      this.componentConfig.max,
      this.currentDateView as Dayjs,
    );
    this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation === true && this.showLeftNav;
    this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation === true && this.showRightNav;
  }

  public ngOnInit(): void {
    this.isInited = true;
    this.init();
    this.initValidators();
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

      this.cd.markForCheck();
    }
  }

  init(): void {
    this.componentConfig = this.monthCalendarService.getConfig(this.config());
    this.currentDateView =
      (this.displayDate() as Dayjs | undefined) ??
      this.utilsService.getDefaultDisplayDate(
        this.currentDateView,
        this.selected,
        this.componentConfig.allowMultiSelect,
        this.componentConfig.min,
      );
    this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
    this._shouldShowCurrent = this.shouldShowCurrent();
  }

  public writeValue(value: CalendarValue): void {
    this.inputValue = value;

    if (value) {
      this.selected = this.utilsService.convertToDayjsArray(value, this.componentConfig);
      this.yearMonths = this.monthCalendarService.generateYear(
        this.componentConfig,
        this.currentDateView as Dayjs,
        this.selected,
      );
      this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
    } else {
      this.selected = [];
      this.yearMonths = this.monthCalendarService.generateYear(
        this.componentConfig,
        this.currentDateView as Dayjs,
        this.selected,
      );
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

  processOnChangeCallback(value: Dayjs[]): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      value,
      this.componentConfig.returnedValueType || this.inputValueType,
    );
  }

  initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      { minDate: this.minDate(), maxDate: this.maxDate() },
      this.componentConfig.format,
      'month',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
  }

  monthClicked(month: IMonth): void {
    if (month.selected && !this.componentConfig.unSelectOnClick) {
      return;
    }

    this.selected = this.utilsService.updateSelected(
      this.componentConfig.allowMultiSelect,
      this.selected,
      month,
      'month',
    );
    this.yearMonths = this.monthCalendarService.generateYear(
      this.componentConfig,
      this.currentDateView as Dayjs,
      this.selected,
    );
    this.onSelect.emit(month);
  }

  onLeftNavClick() {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.subtract(1, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.yearMonths = this.monthCalendarService.generateYear(
      this.componentConfig,
      this.currentDateView as Dayjs,
      this.selected,
    );
    this.onLeftNav.emit({ from, to });
  }

  onLeftSecondaryNavClick(): void {
    let navigateBy = this.componentConfig.multipleYearsNavigateBy as number;
    const isOutsideRange =
      this.componentConfig.min && (this.currentDateView as Dayjs).year() - this.componentConfig.min.year() < navigateBy;

    if (isOutsideRange) {
      navigateBy = (this.currentDateView as Dayjs).year() - (this.componentConfig.min as Dayjs).year();
    }

    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.subtract(navigateBy, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onLeftSecondaryNav.emit({ from, to });
  }

  onRightNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.add(1, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightNav.emit({ from, to });
  }

  onRightSecondaryNavClick(): void {
    let navigateBy = this.componentConfig.multipleYearsNavigateBy as number;
    const isOutsideRange =
      this.componentConfig.max && this.componentConfig.max.year() - (this.currentDateView as Dayjs).year() < navigateBy;

    if (isOutsideRange) {
      navigateBy = (this.componentConfig.max as Dayjs).year() - (this.currentDateView as Dayjs).year();
    }

    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.add(navigateBy, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightSecondaryNav.emit({ from, to });
  }

  toggleCalendarMode(): void {
    this.onNavHeaderBtnClick.emit();
  }

  getMonthBtnCssClass(month: IMonth): Record<string, boolean> {
    const cssClass: Record<string, boolean> = {
      'dp-selected': month.selected,
      'dp-current-month': month.currentMonth,
    };
    const customCssClass: string = this.monthCalendarService.getMonthBtnCssClass(
      this.componentConfig,
      month.date as Dayjs,
    );

    if (customCssClass) {
      cssClass[customCssClass] = true;
    }

    return cssClass;
  }

  shouldShowCurrent(): boolean {
    return this.utilsService.shouldShowCurrent(
      this.componentConfig.showGoToCurrent,
      'month',
      this.componentConfig.min,
      this.componentConfig.max,
    );
  }

  goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to) {
      this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
      this.cd.markForCheck();
    }
  }

  handleConfigChange(config: ConfigChange): void {
    const prevConf: IMonthCalendarConfigInternal = this.monthCalendarService.getConfig(config.previousValue);
    const currentConf: IMonthCalendarConfigInternal = this.monthCalendarService.getConfig(config.currentValue);

    if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
      this._currentDateView = null;
    }
  }
}
