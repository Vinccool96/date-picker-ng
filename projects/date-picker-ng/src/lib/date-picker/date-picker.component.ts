import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
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
import { Dayjs, UnitType } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { IDate } from '../common/models/date.model';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarMode } from '../common/types/calendar-mode';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SelectEvent } from '../common/types/selection-event.enum';
import { ISelectionEvent } from '../common/types/selection-event.model';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { DateValidator } from '../common/types/validator.type';
import { IDayCalendarConfig } from '../day-calendar/day-calendar-config.model';
import { DayCalendarComponent } from '../day-calendar/day-calendar.component';
import { IDayTimeCalendarConfig } from '../day-time-calendar/day-time-calendar-config.model';
import { DayTimeCalendarComponent } from '../day-time-calendar/day-time-calendar.component';
import { MonthCalendarComponent } from '../month-calendar/month-calendar.component';
import { ITimeSelectConfig } from '../time-select/time-select-config.model';
import { TimeSelectComponent } from '../time-select/time-select.component';
import { IDatePickerConfig, IDatePickerConfigInternal } from './date-picker-config.model';
import { IDpDayPickerApi } from './date-picker.api';
import { DatePickerService } from './date-picker.service';

@Component({
  selector: 'dp-date-picker',
  imports: [
    DayTimeCalendarComponent,
    DayCalendarComponent,
    MonthCalendarComponent,
    FormsModule,
    TimeSelectComponent,
    CdkConnectedOverlay,
  ],
  templateUrl: 'date-picker.component.html',
  styleUrls: ['date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'onClick()',
    '[class]': 'theme()',
  },
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges, OnDestroy, OnInit, Validator {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly config = model<IDatePickerConfig>({});
  public readonly disabled = model(false);
  public readonly displayDate = model<SingleCalendarValue | null>(null);
  public readonly maxDate = model<SingleCalendarValue | null>(null);
  public readonly maxTime = model<SingleCalendarValue>();
  public readonly minDate = model<SingleCalendarValue | null>(null);
  public readonly minTime = model<SingleCalendarValue>();
  public readonly mode = model<CalendarMode>('day');
  public readonly placeholder = input('');
  public readonly theme = model<string>('');
  private isInitialized = false;

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly close = output();
  public readonly onChange = output<CalendarValue>();
  public readonly onGoToCurrent = output();
  public readonly onLeftNav = output<INavEvent>();
  public readonly onRightNav = output<INavEvent>();
  public readonly onSelect = output<ISelectionEvent>();
  public readonly open = output();

  /*
   *****************************************************************************************************************
   * viewChildren
   *****************************************************************************************************************
   */

  public readonly calendarContainer = viewChild<ElementRef>('container');
  public readonly dayCalendarRef = viewChild<DayCalendarComponent>('dayCalendar');
  public readonly dayTimeCalendarRef = viewChild<DayTimeCalendarComponent>('daytimeCalendar');
  public readonly monthCalendarRef = viewChild<MonthCalendarComponent>('monthCalendar');
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  private readonly timeSelectRef = viewChild<TimeSelectComponent>('timeSelect');

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  public readonly cd = inject(ChangeDetectorRef);
  private readonly dayPickerService = inject(DatePickerService);
  private readonly renderer = inject(Renderer2);
  private readonly utilsService = inject(UtilsService);

  /*
   *****************************************************************************************************************
   * other
   *****************************************************************************************************************
   */

  public api: IDpDayPickerApi = {
    close: this.hideCalendar.bind(this),
    moveCalendarTo: this.moveCalendarTo.bind(this),
    open: this.showCalendars.bind(this),
  };
  public componentConfig: IDatePickerConfigInternal = {};
  public inputElementValue: string | undefined;
  public validateFn!: DateValidator;
  protected _selected: Dayjs[] = [];
  protected areCalendarsShown = false;
  protected dayCalendarConfig: IDayCalendarConfig = {};
  protected dayTimeCalendarConfig: IDayTimeCalendarConfig = {};
  protected origin: ElementRef | HTMLElement | null = null;
  protected overlayPosition: ConnectedPosition[] = [];
  protected selectEvent = SelectEvent;
  protected timeSelectConfig: ITimeSelectConfig = {};
  private _currentDateView: Dayjs | null = null;
  private appendToElement?: HTMLElement;
  private calendarWrapper!: HTMLElement;
  private globalListenersUnlisteners: (() => void)[] = [];

  private handleInnerElementClickUnlisteners: (() => void)[] = [];

  private inputValue: CalendarValue = '';

  private isFocusedTrigger = false;

  private onOpenDelayTimeoutHandler?: NodeJS.Timeout;

  public ngOnChanges(): void {
    if (this.isInitialized) {
      this.init();
    }
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngOnDestroy(): void {
    for (const ul of this.handleInnerElementClickUnlisteners) {
      ul();
    }

    if (this.appendToElement !== undefined) {
      this.calendarWrapper.remove();
    }
  }
  public hideCalendar(): void {
    this.areCalendarsShown = false;

    this.dayCalendarRef()?.api.toggleCalendarMode(ECalendarMode.Day);
    this.stopGlobalListeners();

    this.close.emit();
    this.cd.markForCheck();
  }

  public init(): void {
    this.componentConfig = this.dayPickerService.getConfig(this.config(), this.mode());
    this.currentDateView =
      this.displayDate() === null
        ? this.utilsService.getDefaultDisplayDate(
            this.currentDateView,
            this.selected,
            this.componentConfig.allowMultiSelect,
            this.componentConfig.min,
          )
        : this.utilsService.convertToDayjs(this.displayDate(), this.componentConfig.format);
    this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
    this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfig(this.componentConfig);
    this.timeSelectConfig = this.dayPickerService.getTimeConfig(this.componentConfig);
    this.initValidators();
    this.overlayPosition = this.dayPickerService.getOverlayPosition(this.componentConfig) ?? [];
    this.origin = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer);
  }

  public initialize(): void {
    this.isInitialized = true;
    this.init();
  }

  public inputFocused(): void {
    if (!this.openOnFocus) {
      return;
    }

    clearTimeout(this.onOpenDelayTimeoutHandler);
    this.isFocusedTrigger = true;
    this.onOpenDelayTimeoutHandler = setTimeout(() => {
      if (!this.areCalendarsShown) {
        this.showCalendars();
      }

      this.isFocusedTrigger = false;
      this.cd.markForCheck();
    }, this.componentConfig.onOpenDelay);
  }

  public onClick(): void {
    if (!this.openOnClick) {
      return;
    }

    if (!this.isFocusedTrigger && !this.disabled() && !this.areCalendarsShown) {
      this.showCalendars();
    }
  }

  public onTouchedCallback(): void {
    // No op
  }

  public onViewDateChange(value: CalendarValue | null): void {
    const stringValue = value === null ? '' : this.utilsService.convertToString(value, this.componentConfig.format);

    if (this.dayPickerService.isValidInputDateValue(stringValue, this.componentConfig)) {
      this.selected = this.dayPickerService.convertInputValueToDayjsArray(stringValue, this.componentConfig);
      this.currentDateView =
        this.selected.length > 0
          ? this.utilsService.getDefaultDisplayDate(
              null,
              this.selected,
              this.componentConfig.allowMultiSelect,
              this.componentConfig.min,
            )
          : this.currentDateView;

      this.onSelect.emit({
        date: stringValue,
        granularity: null,
        type: SelectEvent.INPUT,
      });
    } else {
      this._selected = this.utilsService.getValidDayjsArray(stringValue, this.componentConfig.format);
      this.onChangeCallback(this.processOnChangeCallback(stringValue), true);
    }
  }

  public registerOnChange(callback: (argument1: CalendarValue | undefined, isArgument2: boolean) => void): void {
    this.onChangeCallback = callback;
  }

  public registerOnTouched(callback: () => void): void {
    this.onTouchedCallback = callback;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cd.markForCheck();
  }

  public showCalendars(): void {
    this.areCalendarsShown = true;
    this.startGlobalListeners();

    this.timeSelectRef()?.api.triggerChange();

    this.open.emit();
    this.cd.markForCheck();
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    return this.validateFn(formControl.value as CalendarValue);
  }

  public writeValue(value: CalendarValue | null): void {
    this.inputValue = value ?? '';

    if (value !== null && value !== '') {
      this.selected = this.utilsService.convertToDayjsArray(value, this.componentConfig);
      this.init();
    } else {
      this.selected = [];
    }

    this.cd.markForCheck();
  }

  protected dateSelected(date: IDate, granularity: UnitType, type: SelectEvent, shouldIgnoreClose?: boolean): void {
    this.selected = this.utilsService.updateSelected(
      this.componentConfig.allowMultiSelect,
      this.selected,
      date,
      granularity,
    );

    if (shouldIgnoreClose !== true) {
      this.onDateClick();
    }

    this.onSelect.emit({
      date: date.date as Dayjs,
      granularity,
      type,
    });
  }

  protected goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }

  protected inputBlurred(): void {
    clearTimeout(this.onOpenDelayTimeoutHandler);
    this.onTouchedCallback();
  }

  protected onBodyClick(event: MouseEvent): void {
    if (this.inputElement().nativeElement === event.target) {
      return;
    }

    if (this.componentConfig.hideOnOutsideClick === true) {
      this.hideCalendar();
    }
  }

  protected onDateClick(): void {
    if (this.componentConfig.closeOnSelect === true) {
      setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
    }
  }

  protected onKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
      case 'Tab': {
        this.hideCalendar();
        break;
      }
    }
  }

  protected onLeftNavClick(change: INavEvent): void {
    this.displayDate.set(change.to);
    this.onLeftNav.emit(change);
  }

  protected onRightNavClick(change: INavEvent): void {
    this.displayDate.set(change.to);
    this.onRightNav.emit(change);
  }

  private initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      {
        maxDate: this.maxDate(),
        maxTime: this.maxTime(),
        minDate: this.minDate(),
        minTime: this.minTime(),
      },
      this.componentConfig.format,
      this.mode(),
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
  }

  private moveCalendarTo(date: SingleCalendarValue): void {
    this.currentDateView = this.utilsService.convertToDayjs(date, this.componentConfig.format);
  }

  private onChangeCallback(_argument1: CalendarValue | undefined, _isArgument2: boolean): void {
    // No op
  }

  private processOnChangeCallback(selected: string | Dayjs[]): CalendarValue | undefined {
    return typeof selected === 'string'
      ? selected
      : this.utilsService.convertFromDayjsArray(
          this.componentConfig.format,
          selected,
          this.componentConfig.returnedValueType ??
            this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect),
        );
  }

  private startGlobalListeners(): void {
    this.globalListenersUnlisteners.push(
      this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
        this.onKeyPress(event);
      }),
    );
  }

  private stopGlobalListeners(): void {
    for (const ul of this.globalListenersUnlisteners) {
      ul();
    }
    this.globalListenersUnlisteners = [];
  }

  private get currentDateView(): Dayjs | null {
    return this._currentDateView;
  }

  private set currentDateView(date: Dayjs | null) {
    this._currentDateView = date;

    this.dayCalendarRef()?.moveCalendarTo(date);
    this.monthCalendarRef()?.moveCalendarTo(date);
    this.dayTimeCalendarRef()?.moveCalendarTo(date);

    this.displayDate.set(date);
  }

  private get openOnClick(): boolean {
    return this.componentConfig.openOnClick ?? false;
  }

  private get openOnFocus(): boolean {
    return this.componentConfig.openOnFocus ?? false;
  }

  private get selected(): Dayjs[] {
    return this._selected;
  }

  private set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.inputElementValue = (
      this.utilsService.convertFromDayjsArray(
        this.componentConfig.format,
        selected,
        ECalendarValue.StringArr,
      ) as string[]
    ).join(' | ');
    const value = this.processOnChangeCallback(selected) as CalendarValue;
    this.onChangeCallback(value, false);
    this.onChange.emit(value);
  }
}
