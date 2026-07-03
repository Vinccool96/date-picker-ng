import { NgClass } from '@angular/common';
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
import { pairwise } from 'rxjs/internal/operators';

import { CalendarNavComponent } from '../calendar-nav/calendar-nav.component';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { ConfigChange } from '../common/models/config-change';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { DateValidator } from '../common/types/validator.type';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
import { MonthCalendarService } from './month-calendar.service';
import { IMonth } from './month.model';

@Component({
  selector: 'dp-month-calendar',
  imports: [NgClass, CalendarNavComponent],
  templateUrl: 'month-calendar.component.html',
  styleUrls: ['month-calendar.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MonthCalendarComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => MonthCalendarComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
})
export class MonthCalendarComponent implements ControlValueAccessor, OnInit, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = input<IMonthCalendarConfig>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly maxDate = input<Dayjs>();
  public readonly minDate = input<Dayjs>();
  public readonly theme = input<string>('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  @Output() public onGoToCurrent = new EventEmitter<void>();
  @Output() public onLeftNav = new EventEmitter<INavEvent>();
  @Output() public onLeftSecondaryNav = new EventEmitter<INavEvent>();
  @Output() public onNavHeaderBtnClick = new EventEmitter<null>();
  @Output() public onRightNav = new EventEmitter<INavEvent>();
  @Output() public onRightSecondaryNav = new EventEmitter<INavEvent>();
  @Output() public onSelect = new EventEmitter<IMonth>();

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  public readonly monthCalendarService = inject(MonthCalendarService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly utilsService = inject(UtilsService);

  /*
   *****************************************************************************************************************
   * other
   *****************************************************************************************************************
   */

  public api = {
    moveCalendarTo: this.moveCalendarTo.bind(this),
    toggleCalendar: this.toggleCalendarMode.bind(this),
  };
  public componentConfig: IMonthCalendarConfigInternal = {};
  protected _shouldShowCurrent = true;
  protected navLabel = '';
  protected showLeftNav = false;
  protected showRightNav = false;
  protected showSecondaryLeftNav = false;
  protected showSecondaryRightNav = false;
  protected yearMonths: IMonth[][] = [];
  private _currentDateView: Dayjs | null = null;
  private _selected: Dayjs[] = [];
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

  public getMonthBtnCssClass(month: IMonth): Record<string, boolean> {
    const cssClass: Record<string, boolean> = {
      'dp-current-month': month.currentMonth,
      'dp-selected': month.selected,
    };
    const customCssClass: string = this.monthCalendarService.getMonthBtnCssClass(
      this.componentConfig,
      month.date as Dayjs,
    );

    if (customCssClass !== '') {
      cssClass[customCssClass] = true;
    }

    return cssClass;
  }

  public goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  public moveCalendarTo(to: SingleCalendarValue | null): void {
    if (to === null) {
      return;
    }

    this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
    this.cd.markForCheck();
  }

  public registerOnChange(onChange: (argument: unknown) => void): void {
    this.onChangeCallback = onChange;
  }

  public registerOnTouched(_: unknown): void {
    // No op
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    return this.minDate() !== undefined || this.maxDate() !== undefined
      ? this.validateFn(formControl.value as CalendarValue)
      : (): ValidationErrors | null => null;
  }

  public writeValue(value: CalendarValue | null): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== '') {
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

  protected monthClicked(month: IMonth): void {
    if (month.selected && this.componentConfig.unSelectOnClick !== true) {
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

  protected onLeftNavClick(): void {
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

  protected onLeftSecondaryNavClick(): void {
    let navigateBy = this.componentConfig.multipleYearsNavigateBy as number;
    const isOutsideRange =
      this.componentConfig.min !== undefined &&
      (this.currentDateView as Dayjs).year() - this.componentConfig.min.year() < navigateBy;

    if (isOutsideRange) {
      navigateBy = (this.currentDateView as Dayjs).year() - (this.componentConfig.min as Dayjs).year();
    }

    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.subtract(navigateBy, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onLeftSecondaryNav.emit({ from, to });
  }

  protected onRightNavClick(): void {
    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.add(1, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightNav.emit({ from, to });
  }

  protected onRightSecondaryNavClick(): void {
    let navigateBy = this.componentConfig.multipleYearsNavigateBy as number;
    const isOutsideRange =
      this.componentConfig.max !== undefined &&
      this.componentConfig.max.year() - (this.currentDateView as Dayjs).year() < navigateBy;

    if (isOutsideRange) {
      navigateBy = (this.componentConfig.max as Dayjs).year() - (this.currentDateView as Dayjs).year();
    }

    const from = dayjsRef(this.currentDateView?.toDate());
    this.currentDateView = this.currentDateView?.add(navigateBy, 'year') ?? null;
    const to = dayjsRef(this.currentDateView?.toDate());
    this.onRightSecondaryNav.emit({ from, to });
  }

  protected shouldShowCurrent(): boolean {
    return this.utilsService.shouldShowCurrent(
      this.componentConfig.showGoToCurrent,
      'month',
      this.componentConfig.min,
      this.componentConfig.max,
    );
  }

  protected toggleCalendarMode(): void {
    this.onNavHeaderBtnClick.emit();
  }

  private handleConfigChange(config: ConfigChange): void {
    const previousConfig: IMonthCalendarConfigInternal = this.monthCalendarService.getConfig(config.previousValue);
    const currentConfig: IMonthCalendarConfigInternal = this.monthCalendarService.getConfig(config.currentValue);

    if (this.utilsService.shouldResetCurrentView(previousConfig, currentConfig)) {
      this._currentDateView = null;
    }
  }

  private init(): void {
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

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      { maxDate: this.maxDate(), minDate: this.minDate() },
      this.componentConfig.format,
      'month',
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected));
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

    this.cd.markForCheck();
  }

  private processOnChangeCallback(value: Dayjs[]): CalendarValue | undefined {
    return this.utilsService.convertFromDayjsArray(
      this.componentConfig.format,
      value,
      this.componentConfig.returnedValueType ?? this.inputValueType,
    );
  }

  private get currentDateView(): Dayjs | null {
    return this._currentDateView;
  }

  private set currentDateView(current: Dayjs | null) {
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

  private get selected(): Dayjs[] {
    return this._selected;
  }

  private set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.onChangeCallback(this.processOnChangeCallback(selected));
  }
}
