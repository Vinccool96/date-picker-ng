import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AbstractControl, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarMode } from '../common/types/calendar-mode';
import { CalendarValue } from '../common/types/calendar-value';
import { ISelectionEvent } from '../common/types/selection-event.model';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { IDatePickerDirectiveConfig } from './date-picker-directive-config.model';
import { IDpDayPickerApi } from './date-picker.api';
import { DatePickerComponent } from './date-picker.component';

@Directive({
  selector: '[dpDayPicker]',
  host: {
    '(click)': 'onClick()',
    '(focus)': 'onFocus()',
    '(keydown.enter)': 'onEnter()',
  },
  exportAs: 'dpDayPicker',
})
export class DatePickerDirective implements OnInit {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly displayDate = input<SingleCalendarValue | null>(null);
  public readonly dpDayPicker = input.required<IDatePickerDirectiveConfig>();
  public readonly maxDate = input<SingleCalendarValue>();
  public readonly maxTime = input<SingleCalendarValue>();
  public readonly minDate = input<SingleCalendarValue>();
  public readonly minTime = input<SingleCalendarValue>();
  public readonly mode = input<CalendarMode>('day');
  public readonly theme = input.required<string>();
  private readonly config = signal<IDatePickerDirectiveConfig>({});

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  @Output() public close = new EventEmitter<void>();
  @Output() public onChange = new EventEmitter<CalendarValue>();
  @Output() public onGoToCurrent = new EventEmitter<void>();
  @Output() public onLeftNav = new EventEmitter<INavEvent>();
  @Output() public onRightNav = new EventEmitter<INavEvent>();
  @Output() public onSelect = new EventEmitter<ISelectionEvent>();
  @Output() public open = new EventEmitter<void>();

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  public readonly formControl = inject(NgControl, { optional: true });
  public readonly utilsService = inject(UtilsService);
  private readonly elemRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /*
   *****************************************************************************************************************
   * other
   *****************************************************************************************************************
   */

  public api!: IDpDayPickerApi;
  private datePicker!: DatePickerComponent;

  public constructor() {
    toObservable(this.theme).subscribe((theme) => {
      this.datePicker.theme.set(theme);
      this.markForCheck();
    });
    toObservable(this.dpDayPicker).subscribe((config) => {
      this.config.set({
        ...config,
        hideInputContainer: true,
        inputElementContainer: config.inputElementContainer ?? this.elemRef,
      });
      this.updateDatepickerConfig();
      this.markForCheck();
    });
    toObservable(this.mode).subscribe((mode) => {
      this.datePicker.mode.set(mode);
      this.markForCheck();
    });
    toObservable(this.minDate).subscribe((minDate) => {
      this.datePicker.minDate.set(minDate);
      this.datePicker.initialize();
      this.markForCheck();
    });
    toObservable(this.maxDate).subscribe((maxDate) => {
      this.datePicker.maxDate.set(maxDate);
      this.datePicker.initialize();
      this.markForCheck();
    });
    toObservable(this.minTime).subscribe((minTime) => {
      this.datePicker.minTime.set(minTime);
      this.datePicker.initialize();
      this.markForCheck();
    });
    toObservable(this.maxTime).subscribe((maxTime) => {
      this.datePicker.maxTime.set(maxTime);
      this.datePicker.initialize();
      this.markForCheck();
    });
    toObservable(this.displayDate).subscribe(() => {
      this.updateDatepickerConfig();
      this.markForCheck();
    });
  }

  public ngOnInit(): void {
    this.datePicker = this.createDatePicker();
    this.api = this.datePicker.api;
    this.updateDatepickerConfig();
    this.attachModelToDatePicker();
    this.datePicker.theme.set(this.theme());
  }

  protected onClick(): void {
    this.datePicker.onClick();
  }

  protected onEnter(): void {
    if (this.datePicker.componentConfig.closeOnEnter === true) {
      this.datePicker.hideCalendar();
    }
  }

  protected onFocus(): void {
    this.datePicker.inputFocused();
  }

  private attachModelToDatePicker(): void {
    const formControl = this.formControl;

    if (formControl === null) {
      return;
    }

    this.datePicker.onViewDateChange(formControl.value as CalendarValue);

    (formControl.valueChanges as Observable<CalendarValue>).subscribe((value) => {
      if (value === this.datePicker.inputElementValue) {
        return;
      }

      const stringValue = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
      this.datePicker.onViewDateChange(stringValue);
    });

    let isSetup = true;

    this.datePicker.registerOnChange((value, changedByInput) => {
      if (value !== undefined && value !== '') {
        const isMultiselectEmpty = isSetup && Array.isArray(value) && value.length === 0;

        if (!isMultiselectEmpty && !changedByInput) {
          (formControl.control as AbstractControl).setValue(this.datePicker.inputElementValue);
        }
      }

      const errors = this.datePicker.validateFn(value as CalendarValue);

      if (isSetup) {
        isSetup = false;
      } else {
        (formControl.control as AbstractControl).markAsDirty({
          onlySelf: true,
        });
      }

      if (errors !== null) {
        if (Object.prototype.hasOwnProperty.call(errors, 'format')) {
          const { given } = errors['format'] as { given: string };
          this.datePicker.inputElementValue = given;

          if (!changedByInput) {
            (formControl.control as AbstractControl).setValue(given);
          }
        }

        (formControl.control as AbstractControl).setErrors(errors);
      }
    });
  }

  private createDatePicker(): DatePickerComponent {
    return this.viewContainerRef.createComponent(DatePickerComponent).instance;
  }

  private markForCheck(): void {
    if ((this.datePicker as DatePickerComponent | undefined) !== undefined) {
      this.datePicker.cd.markForCheck();
    }
  }

  private updateDatepickerConfig(): void {
    this.datePicker.minDate.set(this.minDate());
    this.datePicker.maxDate.set(this.maxDate());
    this.datePicker.minTime.set(this.minTime());
    this.datePicker.maxTime.set(this.maxTime());
    this.datePicker.mode.set(this.mode());
    this.datePicker.displayDate.set(this.displayDate());
    this.datePicker.config.set(this.dpDayPicker());
    this.datePicker.open = this.open;
    this.datePicker.close = this.close;
    this.datePicker.onChange = this.onChange;
    this.datePicker.onGoToCurrent = this.onGoToCurrent;
    this.datePicker.onLeftNav = this.onLeftNav;
    this.datePicker.onRightNav = this.onRightNav;
    this.datePicker.onSelect = this.onSelect;

    this.datePicker.init();

    this.elemRef.nativeElement.toggleAttribute('readonly', this.datePicker.componentConfig.disableKeypress === true);
  }
}
