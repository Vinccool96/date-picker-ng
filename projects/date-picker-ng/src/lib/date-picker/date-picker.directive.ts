import { CalendarMode } from '../common/types/calendar-mode';
import { IDatePickerDirectiveConfig } from './date-picker-directive-config.model';
import { DatePickerComponent } from './date-picker.component';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  OnInit,
  Output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarValue } from '../common/types/calendar-value';
import { ISelectionEvent } from '../common/types/selection-event.model';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { IDpDayPickerApi } from './date-picker.api';

@Directive({
  exportAs: 'dpDayPicker',
  selector: '[dpDayPicker]',
})
export class DatePickerDirective implements OnInit {
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<CalendarValue>();
  @Output() onGoToCurrent = new EventEmitter<void>();
  @Output() onLeftNav = new EventEmitter<INavEvent>();
  @Output() onRightNav = new EventEmitter<INavEvent>();
  @Output() onSelect = new EventEmitter<ISelectionEvent>();
  private datePicker!: DatePickerComponent;
  public api!: IDpDayPickerApi;
  public readonly theme = input.required<string>();
  public readonly dpDayPicker = input.required<IDatePickerDirectiveConfig>();
  private readonly config = signal<IDatePickerDirectiveConfig>({});
  public readonly mode = input<CalendarMode>('day');
  public readonly minDate = input<SingleCalendarValue>();
  public readonly maxDate = input<SingleCalendarValue>();
  public readonly minTime = input<SingleCalendarValue>();
  public readonly maxTime = input<SingleCalendarValue>();
  public readonly displayDate = input<SingleCalendarValue | null>(null);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elemRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly formControl = inject(NgControl, { optional: true });
  public readonly utilsService = inject(UtilsService);

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

  ngOnInit(): void {
    this.datePicker = this.createDatePicker();
    this.api = this.datePicker.api;
    this.updateDatepickerConfig();
    this.attachModelToDatePicker();
    this.datePicker.theme.set(this.theme());
  }

  private createDatePicker(): DatePickerComponent {
    return this.viewContainerRef.createComponent(DatePickerComponent).instance;
  }

  attachModelToDatePicker() {
    const formControl = this.formControl;

    if (formControl === null) {
      return;
    }

    this.datePicker.onViewDateChange(formControl.value);

    (formControl.valueChanges as Observable<CalendarValue>).subscribe((value) => {
      if (value !== this.datePicker.inputElementValue) {
        const strVal = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
        this.datePicker.onViewDateChange(strVal);
      }
    });

    let setup = true;

    this.datePicker.registerOnChange((value, changedByInput) => {
      if (value) {
        const isMultiselectEmpty = setup && Array.isArray(value) && !value.length;

        if (!isMultiselectEmpty && !changedByInput) {
          (formControl.control as AbstractControl).setValue(this.datePicker.inputElementValue);
        }
      }

      const errors = this.datePicker.validateFn(value);

      if (!setup) {
        (formControl.control as AbstractControl).markAsDirty({
          onlySelf: true,
        });
      } else {
        setup = false;
      }

      if (errors) {
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

  @HostListener('click')
  onClick() {
    this.datePicker.onClick();
  }

  @HostListener('focus')
  onFocus() {
    this.datePicker.inputFocused();
  }

  @HostListener('keydown.enter')
  onEnter() {
    if (this.datePicker.componentConfig.closeOnEnter) {
      this.datePicker.hideCalendar();
    }
  }

  markForCheck() {
    if (this.datePicker) {
      this.datePicker.cd.markForCheck();
    }
  }

  private updateDatepickerConfig() {
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

    if (this.datePicker.componentConfig.disableKeypress) {
      this.elemRef.nativeElement.setAttribute('readonly', 'true');
    } else {
      this.elemRef.nativeElement.removeAttribute('readonly');
    }
  }
}
