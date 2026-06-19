import { Component, OnInit } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IDatePickerConfig, DayTimeCalendarComponent } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-inline-demo',
  templateUrl: './day-time-inline-demo.component.html',
  styleUrls: ['./day-time-inline-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DayTimeCalendarComponent],
})
export class DayTimeInlineDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  };
}
