import { CalendarMode } from '../common/types/calendar-mode';
import { IDatePickerDirectiveConfig } from './date-picker-directive-config.model';
import { DatePickerComponent } from './date-picker.component';
import {
  ComponentFactoryResolver,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  OnInit,
  Optional,
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
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Directive({
  exportAs: 'dpDayPicker',
  selector: '[dpDayPicker]',
})
export class DatePickerDirective implements OnInit {
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<CalendarValue>();
  @Output() onGoToCurrent: EventEmitter<void> = new EventEmitter();
  @Output() onLeftNav: EventEmitter<INavEvent> = new EventEmitter();
  @Output() onRightNav: EventEmitter<INavEvent> = new EventEmitter();
  @Output() onSelect: EventEmitter<ISelectionEvent> = new EventEmitter();
  private readonly datePicker = this.createDatePicker();
  public readonly api = this.datePicker.api;
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
  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  public readonly formControl = inject(NgControl, { optional: true });
  public readonly utilsService = inject(UtilsService);

  public constructor() {
    effect(() => {
      this.datePicker.theme = this.theme();
      this.markForCheck();
    });
    effect(() => {
      const config = this.dpDayPicker();
      this.config.set({
        ...config,
        hideInputContainer: true,
        inputElementContainer: config.inputElementContainer ?? this.elemRef,
      });
      this.updateDatepickerConfig();
      this.markForCheck();
    });
    effect(() => {
      this.datePicker.mode = this.mode();
      this.markForCheck();
    });
    effect(() => {
      this.datePicker.minDate.set(this.minDate());
      this.datePicker.initialize();
      this.markForCheck();
    });
    effect(() => {
      this.datePicker.maxDate.set(this.maxDate());
      this.datePicker.initialize();
      this.markForCheck();
    });
    effect(() => {
      this.datePicker.minTime.set(this.minTime());
      this.datePicker.initialize();
      this.markForCheck();
    });
    effect(() => {
      this.datePicker.maxTime.set(this.maxTime());
      this.datePicker.initialize();
      this.markForCheck();
    });
    toObservable(this.displayDate).subscribe(() => {
      this.updateDatepickerConfig();
      this.markForCheck();
    });
  }

  ngOnInit(): void {
    this.updateDatepickerConfig();
    this.attachModelToDatePicker();
    this.datePicker.theme = this.theme();
  }

  private createDatePicker(): DatePickerComponent {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
    return this.viewContainerRef.createComponent(factory).instance;
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
    this.datePicker.mode = this.mode();
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
