import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CalendarNavComponent } from './calendar-nav/calendar-nav.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerDirective } from './date-picker/date-picker.directive';
import { DayCalendarComponent } from './day-calendar/day-calendar.component';
import { DayTimeCalendarComponent } from './day-time-calendar/day-time-calendar.component';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';
import { TimeSelectComponent } from './time-select/time-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    DatePickerComponent,
    DatePickerDirective,
    DayCalendarComponent,
    MonthCalendarComponent,
    CalendarNavComponent,
    TimeSelectComponent,
    DayTimeCalendarComponent,
  ],
  exports: [
    DatePickerComponent,
    DatePickerDirective,
    MonthCalendarComponent,
    DayCalendarComponent,
    TimeSelectComponent,
    DayTimeCalendarComponent,
  ],
})
export class DpDatePickerModule {}
