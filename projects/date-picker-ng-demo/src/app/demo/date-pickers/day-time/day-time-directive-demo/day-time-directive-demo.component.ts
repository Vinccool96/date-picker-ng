import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DEF_CONF } from '../../../common/conts/consts';
import { DatePickerDirective, IDatePickerConfig } from 'date-picker-ng';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-directive-demo',
  templateUrl: './day-time-directive-demo.component.html',
  styleUrls: ['./day-time-directive-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
})
export class DayTimeDirectiveDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  };
}
