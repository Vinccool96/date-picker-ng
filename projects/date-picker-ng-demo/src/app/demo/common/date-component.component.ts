import { DatePickerComponent, DatePickerDirective, INavEvent } from 'date-picker-ng';
import { Directive, viewChild } from '@angular/core';
import { UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';

@Directive()
export abstract class DateComponent {
  private readonly dateComponent = viewChild<DatePickerComponent>('dateComponent');
  private readonly dateDirective = viewChild(DatePickerDirective);

  ready = true;
  control: UntypedFormControl = this.buildForm();

  abstract config;
  date = dayjs();
  material = true;
  required = false;
  disabled = false;
  validationMinDate?: Dayjs;
  validationMaxDate?: Dayjs;
  validationMinTime?: Dayjs;
  validationMaxTime?: Dayjs;
  placeholder = 'Choose a date...';
  displayDate: Dayjs | string = '';
  locale: string = dayjs.locale();

  displayDateChanged(displayDate: Dayjs | string): void {
    this.displayDate = displayDate;
  }

  onDisplayDateChange(displayDate: Dayjs | string): void {
    this.displayDate = displayDate;
  }

  onMaterialThemeChange(material: boolean): void {
    this.material = material;
  }

  onDisabledChange(disabled: boolean): void {
    this.disabled = disabled;
    disabled ? this.control.disable() : this.control.enable();
  }

  onRequireValidationChange(required: boolean): void {
    this.required = required;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMinValidationChange($event: Dayjs): void {
    this.validationMinDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMaxValidationChange($event: Dayjs): void {
    this.validationMaxDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMinTimeValidationChange($event: Dayjs): void {
    this.validationMinTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMaxTimeValidationChange($event: Dayjs): void {
    this.validationMaxTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onPlaceholderChange(placeholder: string): void {
    this.placeholder = placeholder;
  }

  onConfigChange($event): void {
    this.config = {
      ...this.config,
      ...$event,
    };
  }

  openCalendar(): void {
    (this.dateComponent() || this.dateDirective())?.api.open();
  }

  closeCalendar(): void {
    (this.dateComponent() || this.dateDirective())?.api.close();
  }

  moveCalendarTo($event: Dayjs): void {
    (this.dateComponent() || this.dateDirective())?.api.moveCalendarTo($event);
  }

  onLeftNav(change: INavEvent) {
    console.info('left nav', change);
  }

  onRightNav(change: INavEvent) {
    console.info('right nav', change);
  }

  opened() {
    console.info('opened');
  }

  closed() {
    console.info('closed');
  }

  onSelect(data: any) {
    console.info(data);
  }

  log(item) {
    // console.info(item);
  }

  onLocaleChange(locale: string): void {
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
      this.required ? Validators.required : () => null,
      (control) => {
        return this.validationMinDate &&
          this.config &&
          dayjs(control.value, this.config.format).isBefore(this.validationMinDate)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control) => {
        return this.validationMaxDate &&
          this.config &&
          dayjs(control.value, this.config.format).isAfter(this.validationMaxDate)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
      (control) => {
        return this.validationMinTime &&
          this.config &&
          dayjs(control.value, this.config.format).isBefore(this.validationMinTime)
          ? { minDate: 'minDate Invalid' }
          : null;
      },
      (control) => {
        return this.validationMaxTime &&
          this.config &&
          dayjs(control.value, this.config.format).isAfter(this.validationMaxTime)
          ? { maxDate: 'maxDate Invalid' }
          : null;
      },
    ].filter(Boolean);
  }
}
