import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IDatePickerConfig, MonthCalendarComponent } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-inline',
  templateUrl: './month-inline-demo.component.html',
  styleUrls: ['./month-inline-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, MonthCalendarComponent],
})
export class MonthInlineDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'MMM, YYYY',
  };
}
