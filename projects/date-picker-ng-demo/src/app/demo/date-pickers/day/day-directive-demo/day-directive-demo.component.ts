import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerDirective, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-directive-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
  templateUrl: './day-directive-demo.component.html',
  styleUrls: ['./day-directive-demo.component.less'],
})
export class DayDirectiveDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY',
  };
}
