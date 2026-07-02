import { DatePickerComponent, DatePickerDirective, INavEvent } from 'date-picker-ng';
import { Directive, viewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import { IDatePickerConfig } from 'date-picker-ng';

@Directive()
export abstract class DateComponent {
  private readonly dateComponent = viewChild<DatePickerComponent>('dateComponent');
  private readonly dateDirective = viewChild(DatePickerDirective);

  protected ready = true;
  protected control: UntypedFormControl = this.buildForm();

  protected abstract config: IDatePickerConfig;
  private date = dayjs();
  protected material = true;
  protected required = false;
  private disabled = false;
  private validationMinDate?: Dayjs;
  private validationMaxDate?: Dayjs;
  private validationMinTime?: Dayjs;
  private validationMaxTime?: Dayjs;
  protected placeholder = 'Choose a date...';
  protected displayDate: Dayjs | string = '';
  protected locale: string = dayjs.locale();

  protected displayDateChanged(displayDate: Dayjs | string): void {
    this.displayDate = displayDate;
  }

  protected onDisplayDateChange(displayDate: Dayjs | string): void {
    this.displayDate = displayDate;
  }

  protected onMaterialThemeChange(material: boolean): void {
    this.material = material;
  }

  protected onDisabledChange(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  protected onRequireValidationChange(required: boolean): void {
    this.required = required;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMinValidationChange($event: Dayjs): void {
    this.validationMinDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMaxValidationChange($event: Dayjs): void {
    this.validationMaxDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMinTimeValidationChange($event: Dayjs): void {
    this.validationMinTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onMaxTimeValidationChange($event: Dayjs): void {
    this.validationMaxTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  protected onPlaceholderChange(placeholder: string): void {
    this.placeholder = placeholder;
  }

  protected onConfigChange($event: IDatePickerConfig): void {
    this.config = {
      ...this.config,
      ...$event,
    };
  }

  protected openCalendar(): void {
    (this.dateComponent() || this.dateDirective())?.api.open();
  }

  protected closeCalendar(): void {
    (this.dateComponent() || this.dateDirective())?.api.close();
  }

  protected moveCalendarTo($event: Dayjs): void {
    (this.dateComponent() || this.dateDirective())?.api.moveCalendarTo($event);
  }

  protected onLeftNav(change: INavEvent) {
    console.info('left nav', change);
  }

  protected onRightNav(change: INavEvent) {
    console.info('right nav', change);
  }

  protected opened() {
    console.info('opened');
  }

  protected closed() {
    console.info('closed');
  }

  protected onSelect(data: unknown) {
    console.info(data);
  }

  protected log(item: unknown): void {
    console.info(item);
  }

  protected onLocaleChange(locale: string): void {
    this.ready = false;
    this.locale = locale;
    dayjs.locale(locale);
    this.ready = true;
  }

  protected buildForm(): UntypedFormControl {
    return new UntypedFormControl({ value: this.date, disabled: this.disabled }, this.getValidations());
  }

  private getValidations(): ValidatorFn[] {
    return [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.required ? Validators.required : () => null,
      (control: AbstractControl) => {
        return this.validationMinDate &&
          dayjs(control.value as dayjs.ConfigType, this.config.format).isBefore(this.validationMinDate)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control: AbstractControl) => {
        return this.validationMaxDate &&
          dayjs(control.value as dayjs.ConfigType, this.config.format).isAfter(this.validationMaxDate)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
      (control: AbstractControl) => {
        return this.validationMinTime &&
          dayjs(control.value as dayjs.ConfigType, this.config.format).isBefore(this.validationMinTime)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control: AbstractControl) => {
        return this.validationMaxTime &&
          dayjs(control.value as dayjs.ConfigType, this.config.format).isAfter(this.validationMaxTime)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
    ].filter(Boolean);
  }
}
