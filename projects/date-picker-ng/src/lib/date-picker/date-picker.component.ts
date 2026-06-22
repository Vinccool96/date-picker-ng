import { IDate } from '../common/models/date.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarMode } from '../common/types/calendar-mode';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { CalendarValue } from '../common/types/calendar-value';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { IDayCalendarConfig } from '../day-calendar/day-calendar-config.model';
import { DayCalendarComponent } from '../day-calendar/day-calendar.component';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { IDayTimeCalendarConfig } from '../day-time-calendar/day-time-calendar-config.model';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { ITimeSelectConfig } from '../time-select/time-select-config.model';
import { TimeSelectComponent } from '../time-select/time-select.component';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDatePickerConfig, IDatePickerConfigInternal } from './date-picker-config.model';
import { IDpDayPickerApi } from './date-picker.api';
import { DatePickerService } from './date-picker.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  Output,
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

import { DateValidator } from '../common/types/validator.type';
import { MonthCalendarComponent } from '../month-calendar/month-calendar.component';
import { DayTimeCalendarComponent } from '../day-time-calendar/day-time-calendar.component';
import { INavEvent } from '../common/models/navigation-event.model';
import { SelectEvent } from '../common/types/selection-event.enum';
import { ISelectionEvent } from '../common/types/selection-event.model';
import { Dayjs, UnitType } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dp-date-picker',
  templateUrl: 'date-picker.component.html',
  styleUrls: ['date-picker.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatePickerService,
    DayTimeCalendarService,
    DayCalendarService,
    TimeSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'theme()',
  },
  imports: [
    DayTimeCalendarComponent,
    DayCalendarComponent,
    MonthCalendarComponent,
    FormsModule,
    TimeSelectComponent,
    CdkConnectedOverlay,
  ],
})
export class DatePickerComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  isInitialized = false;
  public readonly config = model<IDatePickerConfig>({});
  public readonly mode = model<CalendarMode>('day');
  public readonly placeholder = input('');
  public readonly disabled = model(false);
  public readonly displayDate = model<SingleCalendarValue | null>(null);
  public readonly theme = model<string>('');
  public readonly minDate = model<SingleCalendarValue>();
  public readonly maxDate = model<SingleCalendarValue>();
  public readonly minTime = model<SingleCalendarValue>();
  public readonly maxTime = model<SingleCalendarValue>();
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<CalendarValue>();
  @Output() onGoToCurrent = new EventEmitter<void>();
  @Output() onLeftNav = new EventEmitter<INavEvent>();
  @Output() onRightNav = new EventEmitter<INavEvent>();
  @Output() onSelect = new EventEmitter<ISelectionEvent>();
  public readonly calendarContainer = viewChild<ElementRef>('container');
  public readonly dayCalendarRef = viewChild<DayCalendarComponent>('dayCalendar');
  public readonly monthCalendarRef = viewChild<MonthCalendarComponent>('monthCalendar');
  public readonly dayTimeCalendarRef = viewChild<DayTimeCalendarComponent>('daytimeCalendar');
  private readonly timeSelectRef = viewChild<TimeSelectComponent>('timeSelect');
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  componentConfig: IDatePickerConfigInternal = {};
  dayCalendarConfig: IDayCalendarConfig = {};
  dayTimeCalendarConfig: IDayTimeCalendarConfig = {};
  timeSelectConfig: ITimeSelectConfig = {};
  inputValue: CalendarValue = '';
  isFocusedTrigger = false;
  inputElementValue: string | undefined;
  calendarWrapper!: HTMLElement;
  appendToElement?: HTMLElement;
  handleInnerElementClickUnlisteners: (() => void)[] = [];
  globalListenersUnlisteners: (() => void)[] = [];
  validateFn!: DateValidator;
  api: IDpDayPickerApi = {
    open: this.showCalendars.bind(this),
    close: this.hideCalendar.bind(this),
    moveCalendarTo: this.moveCalendarTo.bind(this),
  };
  selectEvent = SelectEvent;
  origin: ElementRef | HTMLElement | null = null;
  private onOpenDelayTimeoutHandler?: NodeJS.Timeout;

  private readonly dayPickerService = inject(DatePickerService);
  private readonly renderer = inject(Renderer2);
  private readonly utilsService = inject(UtilsService);
  public readonly cd = inject(ChangeDetectorRef);

  public constructor() {
    toObservable(this.config).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.mode).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.placeholder).subscribe((): void => {
      this.onChanges();
    });
    toObservable(this.disabled).subscribe((): void => {
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

  get openOnFocus(): boolean {
    return this.componentConfig.openOnFocus ?? false;
  }

  get openOnClick(): boolean {
    return this.componentConfig.openOnClick ?? false;
  }

  areCalendarsShown = false;

  _selected: Dayjs[] = [];

  get selected(): Dayjs[] {
    return this._selected;
  }

  set selected(selected: Dayjs[]) {
    this._selected = selected;
    this.inputElementValue = (
      this.utilsService.convertFromDayjsArray(
        this.componentConfig.format,
        selected,
        ECalendarValue.StringArr,
      ) as string[]
    ).join(' | ');
    const val = this.processOnChangeCallback(selected);
    this.onChangeCallback(val, false);
    this.onChange.emit(val);
  }

  _currentDateView: Dayjs | null = null;
  overlayPosition: ConnectedPosition[] = [];

  get currentDateView(): Dayjs | null {
    return this._currentDateView;
  }

  set currentDateView(date: Dayjs | null) {
    this._currentDateView = date;

    this.dayCalendarRef()?.moveCalendarTo(date);
    this.monthCalendarRef()?.moveCalendarTo(date);
    this.dayTimeCalendarRef()?.moveCalendarTo(date);

    this.displayDate.set(date);
  }

  @HostListener('click')
  onClick(): void {
    if (!this.openOnClick) {
      return;
    }

    if (!this.isFocusedTrigger && !this.disabled()) {
      if (!this.areCalendarsShown) {
        this.showCalendars();
      }
    }
  }

  onBodyClick(event: MouseEvent) {
    if (this.inputElement().nativeElement === event.target) {
      return;
    }

    if (this.componentConfig.hideOnOutsideClick) {
      this.hideCalendar();
    }
  }

  public writeValue(value: CalendarValue): void {
    this.inputValue = value;

    if (value || value === '') {
      this.selected = this.utilsService.convertToDayjsArray(value, this.componentConfig);
      this.init();
    } else {
      this.selected = [];
    }

    this.cd.markForCheck();
  }

  public registerOnChange(fn: (arg1: CalendarValue | undefined, arg2: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  private onChangeCallback(_arg1: CalendarValue | undefined, _arg2: boolean): void {
    // No op
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback(): void {
    // No op
  }

  public validate(formControl: AbstractControl): ValidationErrors | null {
    return this.validateFn(formControl.value as CalendarValue);
  }

  processOnChangeCallback(selected: Dayjs[] | string): CalendarValue | undefined {
    if (typeof selected === 'string') {
      return selected;
    } else {
      return this.utilsService.convertFromDayjsArray(
        this.componentConfig.format,
        selected,
        this.componentConfig.returnedValueType ||
          this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect),
      );
    }
  }

  initValidators(): void {
    this.validateFn = this.utilsService.createValidator(
      {
        minDate: this.minDate(),
        maxDate: this.maxDate(),
        minTime: this.minTime(),
        maxTime: this.maxTime(),
      },
      this.componentConfig.format,
      this.mode(),
    );

    this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
  }

  ngOnInit(): void {
    this.initialize();
  }

  public initialize(): void {
    this.isInitialized = true;
    this.init();
  }

  private onChanges(): void {
    if (this.isInitialized) {
      this.init();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cd.markForCheck();
  }

  init(): void {
    this.componentConfig = this.dayPickerService.getConfig(this.config(), this.mode());
    this.currentDateView = this.displayDate()
      ? this.utilsService.convertToDayjs(this.displayDate(), this.componentConfig.format)
      : this.utilsService.getDefaultDisplayDate(
          this.currentDateView,
          this.selected,
          this.componentConfig.allowMultiSelect,
          this.componentConfig.min,
        );
    this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
    this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfig(this.componentConfig);
    this.timeSelectConfig = this.dayPickerService.getTimeConfig(this.componentConfig);
    this.initValidators();
    this.overlayPosition = this.dayPickerService.getOverlayPosition(this.componentConfig) ?? [];
    this.origin = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer);
  }

  inputFocused(): void {
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

  inputBlurred(): void {
    clearTimeout(this.onOpenDelayTimeoutHandler);
    this.onTouchedCallback();
  }

  showCalendars(): void {
    this.areCalendarsShown = true;
    this.startGlobalListeners();

    this.timeSelectRef()?.api.triggerChange();

    this.open.emit();
    this.cd.markForCheck();
  }

  hideCalendar(): void {
    this.areCalendarsShown = false;

    this.dayCalendarRef()?.api.toggleCalendarMode(ECalendarMode.Day);
    this.stopGlobalListeners();

    this.close.emit();
    this.cd.markForCheck();
  }

  onViewDateChange(value: CalendarValue): void {
    const strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
    if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
      this.selected = this.dayPickerService.convertInputValueToDayjsArray(strVal, this.componentConfig);
      this.currentDateView = this.selected.length
        ? this.utilsService.getDefaultDisplayDate(
            null,
            this.selected,
            this.componentConfig.allowMultiSelect,
            this.componentConfig.min,
          )
        : this.currentDateView;

      this.onSelect.emit({
        date: strVal,
        type: SelectEvent.INPUT,
        granularity: null,
      });
    } else {
      this._selected = this.utilsService.getValidDayjsArray(strVal, this.componentConfig.format);
      this.onChangeCallback(this.processOnChangeCallback(strVal), true);
    }
  }

  dateSelected(date: IDate, granularity: UnitType, type: SelectEvent, ignoreClose?: boolean): void {
    this.selected = this.utilsService.updateSelected(
      this.componentConfig.allowMultiSelect,
      this.selected,
      date,
      granularity,
    );
    if (!ignoreClose) {
      this.onDateClick();
    }

    this.onSelect.emit({
      date: date.date as Dayjs,
      granularity,
      type,
    });
  }

  onDateClick(): void {
    if (this.componentConfig.closeOnSelect) {
      setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
      case 'Esc':
      case 'Tab':
        this.hideCalendar();
        break;
    }
  }

  moveCalendarTo(date: SingleCalendarValue): void {
    this.currentDateView = this.utilsService.convertToDayjs(date, this.componentConfig.format);
  }

  onLeftNavClick(change: INavEvent): void {
    this.displayDate.set(change.to);
    this.onLeftNav.emit(change);
  }

  onRightNavClick(change: INavEvent): void {
    this.displayDate.set(change.to);
    this.onRightNav.emit(change);
  }

  startGlobalListeners(): void {
    this.globalListenersUnlisteners.push(
      this.renderer.listen(document, 'keydown', (e: KeyboardEvent) => {
        this.onKeyPress(e);
      }),
    );
  }

  stopGlobalListeners(): void {
    this.globalListenersUnlisteners.forEach((ul): void => {
      ul();
    });
    this.globalListenersUnlisteners = [];
  }

  public ngOnDestroy(): void {
    this.handleInnerElementClickUnlisteners.forEach((ul): void => {
      ul();
    });

    if (this.appendToElement) {
      this.appendToElement.removeChild(this.calendarWrapper);
    }
  }

  goToCurrent(): void {
    this.currentDateView = dayjsRef();
    this.onGoToCurrent.emit();
  }
}
