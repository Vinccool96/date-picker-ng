import { Dayjs } from 'dayjs';

import { SingleCalendarValue } from '../types/single-calendar-value';

export interface ICalendar {
  max?: SingleCalendarValue | null;
  min?: SingleCalendarValue | null;
}

export interface ICalendarInternal {
  max?: Dayjs;
  min?: Dayjs;
}
