import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './day-time-demo.component.html',
  styleUrls: ['./day-time-demo.component.scss'],
})
export class DayTimeDemoComponent extends DateComponent {
  protected override readonly config = signal<IDatePickerConfig>({
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  });
  protected override readonly control = this.buildForm();
}
