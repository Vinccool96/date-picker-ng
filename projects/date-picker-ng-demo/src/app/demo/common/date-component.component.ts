import { Directive, viewChild, WritableSignal } from '@angular/core';
import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  DatePickerComponent,
  DatePickerDirective,
  IDatePickerConfig,
  INavEvent,
  SingleCalendarValue,
} from 'date-picker-ng';
import dayjs, { Dayjs } from 'dayjs';

@Directive()
export abstract class DateComponent {
  /*
   *****************************************************************************************************************
   * viewChildren
   *****************************************************************************************************************
   */

  private readonly dateComponent = viewChild<DatePickerComponent>('dateComponent');
  private readonly dateDirective = viewChild(DatePickerDirective);

  /*
   *****************************************************************************************************************
   * others
   *****************************************************************************************************************
   */

  protected abstract readonly config: WritableSignal<IDatePickerConfig>;
  protected abstract control: UntypedFormControl;

  protected displayDate: string | Dayjs = '';
  protected locale: string = dayjs.locale();
  protected material = true;
  protected placeholder = 'Choose a date...';
  protected ready = true;
  protected required = false;
  protected validationMaxDate: Dayjs | null = null;
  protected validationMinDate: Dayjs | null = null;
  private date = dayjs();
  private disabled = false;
  private validationMaxTime: Dayjs | null = null;
  private validationMinTime: Dayjs | null = null;

  protected buildForm(): UntypedFormControl {
    return new UntypedFormControl({ disabled: this.disabled, value: this.date }, this.getValidations());
  }

  protected closeCalendar(): void {
    (this.dateComponent() ?? this.dateDirective())?.api.close();
  }

  protected closed(): void {
    console.info('closed');
  }

  protected displayDateChanged(displayDate: string | Dayjs): void {
    this.displayDate = displayDate;
  }

  protected log(item: unknown): void {
    console.info(item);
  }

  protected moveCalendarTo($event: Dayjs): void {
    (this.dateComponent() ?? this.dateDirective())?.api.moveCalendarTo($event);
  }

  protected onConfigChange($event: IDatePickerConfig): void {
    this.config.set({
      ...this.config(),
      ...$event,
    });
  }

  protected onDisabledChange(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  protected onDisplayDateChange(displayDate: SingleCalendarValue | null): void {
    this.displayDate = displayDate ?? '';
  }

  protected onLeftNav(change: INavEvent): void {
    console.info('left nav', change);
  }

  protected onLocaleChange(locale: string): void {
    this.ready = false;
    this.locale = locale;
    dayjs.locale(locale);
    this.ready = true;
  }

  protected onMaterialThemeChange(isUsingMaterial: boolean): void {
    this.material = isUsingMaterial;
  }

  protected onMaxTimeValidationChange($event: Dayjs | null): void {
    this.validationMaxTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMaxValidationChange($event: Dayjs | null): void {
    this.validationMaxDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMinTimeValidationChange($event: Dayjs | null): void {
    this.validationMinTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMinValidationChange($event: Dayjs | null): void {
    this.validationMinDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onPlaceholderChange(placeholder: string): void {
    this.placeholder = placeholder;
  }

  protected onRequireValidationChange(isRequired: boolean): void {
    this.required = isRequired;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onRightNav(change: INavEvent): void {
    console.info('right nav', change);
  }

  protected onSelect(data: unknown): void {
    console.info(data);
  }

  protected openCalendar(): void {
    (this.dateComponent() ?? this.dateDirective())?.api.open();
  }

  protected opened(): void {
    console.info('opened');
  }

  private getValidations(): ValidatorFn[] {
    return [
      this.required ? Validators.required : (): ValidationErrors | null => null,
      (control: AbstractControl): ValidationErrors | null => {
        return this.validationMinDate !== null &&
          dayjs(control.value as dayjs.ConfigType, this.config().format).isBefore(this.validationMinDate)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control: AbstractControl): ValidationErrors | null => {
        return this.validationMaxDate !== null &&
          dayjs(control.value as dayjs.ConfigType, this.config().format).isAfter(this.validationMaxDate)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
      (control: AbstractControl): ValidationErrors | null => {
        return this.validationMinTime !== null &&
          dayjs(control.value as dayjs.ConfigType, this.config().format).isBefore(this.validationMinTime)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control: AbstractControl): ValidationErrors | null => {
        return this.validationMaxTime !== null &&
          dayjs(control.value as dayjs.ConfigType, this.config().format).isAfter(this.validationMaxTime)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
    ].filter(Boolean);
  }
}
