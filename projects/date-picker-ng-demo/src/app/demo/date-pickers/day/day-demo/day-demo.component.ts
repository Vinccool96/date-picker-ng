import { Component, OnInit } from '@angular/core';
import { DateComponent } from '../../../common/date-component.component';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IDatePickerConfig, DatePickerComponent } from 'date-picker-ng';
import { DEF_CONF } from '../../../common/conts/consts';
import { ConfigFormComponent } from '../../../config-form/config-form.component';

@Component({
  selector: 'dp-day-demo',
  templateUrl: './day-demo.component.html',
  styleUrls: ['./day-demo.component.less'],
  imports: [ConfigFormComponent, ReactiveFormsModule, DatePickerComponent],
})
export class DayDemoComponent extends DateComponent {
  config: IDatePickerConfig = {
    ...DEF_CONF,
    format: 'DD-MM-YYYY',
  };
}
