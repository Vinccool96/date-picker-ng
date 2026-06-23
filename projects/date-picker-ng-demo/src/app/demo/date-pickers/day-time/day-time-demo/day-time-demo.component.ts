import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, IDatePickerConfig } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-demo',
  templateUrl: './day-time-demo.component.html',
  styleUrls: ['./day-time-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
})
export class DayTimeDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  };
}
