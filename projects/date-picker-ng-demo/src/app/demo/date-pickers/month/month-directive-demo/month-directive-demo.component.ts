import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerDirective, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-directive-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
  templateUrl: './month-directive-demo.component.html',
  styleUrls: ['./month-directive-demo.component.less'],
})
export class MonthDirectiveDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'MMM, YYYY',
  };
}
