import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IDatePickerConfig, MonthCalendarComponent } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-inline',
  imports: [ConfigFormComponent, ReactiveFormsModule, MonthCalendarComponent],
  templateUrl: './month-inline-demo.component.html',
  styleUrls: ['./month-inline-demo.component.less'],
})
export class MonthInlineDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'MMM, YYYY',
  };
}
