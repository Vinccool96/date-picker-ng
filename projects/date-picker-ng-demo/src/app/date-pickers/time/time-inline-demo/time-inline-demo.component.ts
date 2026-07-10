import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IDatePickerConfig, TimeSelectComponent } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-time-inline-demo',
  imports: [ConfigFormComponent, TimeSelectComponent, ReactiveFormsModule],
  templateUrl: './time-inline-demo.component.html',
  styleUrls: ['./time-inline-demo.component.scss'],
})
export class TimeInlineDemoComponent extends DateComponent {
  protected override readonly config = signal<IDatePickerConfig>({
    ...DEF_CONF,
    format: 'HH:mm:ss',
  });
  protected override readonly control = this.buildForm();
}
