import { Component, OnInit } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IDatePickerConfig, DayCalendarComponent } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-inline-demo',
  templateUrl: './day-inline-demo.component.html',
  styleUrls: ['./day-inline-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DayCalendarComponent],
})
export class DayInlineDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY',
  };
}
