import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IDatePickerConfig, MonthCalendarComponent } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-inline',
  imports: [ConfigFormComponent, ReactiveFormsModule, MonthCalendarComponent],
  templateUrl: './month-inline-demo.component.html',
  styleUrls: ['./month-inline-demo.component.scss'],
})
export class MonthInlineDemoComponent extends DateComponent {
  protected override readonly config = signal<IDatePickerConfig>({
    ...DEF_CONF,
    format: 'MMM, YYYY',
  });
  protected override readonly control = this.buildForm();
}
