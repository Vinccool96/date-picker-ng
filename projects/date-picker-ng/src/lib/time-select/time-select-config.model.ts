import { Dayjs } from 'dayjs';

import { ICalendar, ICalendarInternal } from '../common/models/calendar.model';
import { ECalendarValue } from '../common/types/calendar-value-enum';

export interface ITimeSelectConfig extends ICalendar, IConfig {}

export interface ITimeSelectConfigInternal extends ICalendarInternal, IConfig {}

interface IConfig {
  hours12Format?: string;
  hours24Format?: string;
  maxTime?: Dayjs | null;
  meridiemFormat?: string;
  minTime?: Dayjs | null;
  minutesFormat?: string;
  minutesInterval?: number;
  returnedValueType?: ECalendarValue;
  secondsFormat?: string;
  secondsInterval?: number;
  showSeconds?: boolean;
  showTwentyFourHours?: boolean;
  timeSeparator?: string;
}
