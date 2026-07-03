import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DayCalendarComponent, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-inline-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DayCalendarComponent],
  templateUrl: './day-inline-demo.component.html',
  styleUrls: ['./day-inline-demo.component.scss'],
})
export class DayInlineDemoComponent extends DateComponent {
  protected config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY',
  };
}
