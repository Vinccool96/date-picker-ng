import { Component, OnInit } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IDatePickerConfig, DatePickerDirective } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-directive-demo',
  templateUrl: './month-directive-demo.component.html',
  styleUrls: ['./month-directive-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
})
export class MonthDirectiveDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'MMM, YYYY',
  };
}
