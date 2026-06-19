import { Component } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IDatePickerConfig, TimeSelectComponent } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-time-inline-demo',
  templateUrl: './time-inline-demo.component.html',
  styleUrls: ['./time-inline-demo.component.less'],
  imports: [ConfigFormComponent, TimeSelectComponent, ReactiveFormsModule],
})
export class TimeInlineDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'HH:mm:ss',
  };
}
