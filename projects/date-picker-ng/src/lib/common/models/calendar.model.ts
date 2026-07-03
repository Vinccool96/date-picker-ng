import { Dayjs } from 'dayjs';

import { SingleCalendarValue } from '../types/single-calendar-value';

export interface ICalendar {
  max?: string | Dayjs;
  min?: SingleCalendarValue;
}

export interface ICalendarInternal {
  max?: Dayjs;
  min?: Dayjs;
}
