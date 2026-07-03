import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-time-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './time-demo.component.html',
  styleUrls: ['./time-demo.component.less'],
})
export class TimeDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'HH:mm:ss',
  };
}
