import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, IDatePickerConfig } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-time-demo',
  templateUrl: './time-demo.component.html',
  styleUrls: ['./time-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
})
export class TimeDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'HH:mm:ss',
  };
}
