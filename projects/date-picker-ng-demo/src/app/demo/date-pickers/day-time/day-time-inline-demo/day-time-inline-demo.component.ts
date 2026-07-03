import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DayTimeCalendarComponent, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-inline-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DayTimeCalendarComponent],
  templateUrl: './day-time-inline-demo.component.html',
  styleUrls: ['./day-time-inline-demo.component.less'],
})
export class DayTimeInlineDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  };
}
