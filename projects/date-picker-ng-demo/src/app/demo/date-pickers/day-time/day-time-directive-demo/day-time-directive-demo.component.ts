import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerDirective, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-time-directive-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerDirective],
  templateUrl: './day-time-directive-demo.component.html',
  styleUrls: ['./day-time-directive-demo.component.scss'],
})
export class DayTimeDirectiveDemoComponent extends DateComponent {
  protected override readonly config = signal<IDatePickerConfig>({
    ...DEF_CONF,
    format: 'DD-MM-YYYY HH:mm:ss',
  });
  protected override readonly control = this.buildForm();
}
