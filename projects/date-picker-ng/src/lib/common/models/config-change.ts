import { IMonthCalendarConfig } from '../../month-calendar/month-calendar-config';

export interface ConfigChange {
  currentValue?: IMonthCalendarConfig;
  previousValue?: IMonthCalendarConfig;
}
