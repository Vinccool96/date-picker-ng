import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent, IDatePickerConfig } from 'date-picker-ng';

import { DEF_CONF } from '../../../common/conts/consts';
import { DateComponent } from '../../../common/date-component.component';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-month-demo',
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './month-demo.component.html',
  styleUrls: ['./month-demo.component.scss'],
})
export class MonthDemoComponent extends DateComponent {
  protected override readonly config = signal<IDatePickerConfig>({
    ...DEF_CONF,
    format: 'MMM, YYYY',
  });
  protected override readonly control = this.buildForm();

  protected submission(event: SubmitEvent): void {
    event.preventDefault();
  }
}
