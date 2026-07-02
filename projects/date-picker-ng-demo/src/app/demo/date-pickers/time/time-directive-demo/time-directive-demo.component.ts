import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerDirective, IDatePickerConfig } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-time-directive-demo',
  templateUrl: './time-directive-demo.component.html',
  styleUrls: ['./time-directive-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
})
export class TimeDirectiveDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'HH:mm:ss',
  };
}
