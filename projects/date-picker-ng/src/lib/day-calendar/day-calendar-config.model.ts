import { Dayjs } from 'dayjs';

import { ICalendar, ICalendarInternal } from '../common/models/calendar.model';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { WeekDays } from '../common/types/week-days.type';

export interface IDayCalendarConfig extends ICalendar, IConfig {}

export interface IDayCalendarConfigInternal extends ICalendarInternal, IConfig {}

interface IConfig {
  allowMultiSelect?: boolean;
  dayBtnCssClassCallback?: (day: Dayjs | undefined) => string;
  dayBtnFormat?: string;
  dayBtnFormatter?: (day: Dayjs) => string;
  enableMonthSelector?: boolean;
  firstDayOfWeek?: WeekDays;
  format?: string;
  isDayDisabledCallback?: (date: Dayjs) => boolean;
  isMonthDisabledCallback?: (date: Dayjs) => boolean;
  monthBtnCssClassCallback?: (day: Dayjs) => string;
  monthBtnFormat?: string;
  monthBtnFormatter?: (day: Dayjs) => string;
  monthFormat?: string;
  monthFormatter?: (month: Dayjs) => string;
  multipleYearsNavigateBy?: number;
  numOfMonthRows?: number;
  returnedValueType?: ECalendarValue;
  showGoToCurrent?: boolean;
  showMultipleYearsNavigation?: boolean;
  showNearMonthDays?: boolean;
  showWeekNumbers?: boolean;
  unSelectOnClick?: boolean;
  weekDayFormat?: string;
  weekDayFormatter?: (dayIndex: number) => string;
  yearFormat?: string;
  yearFormatter?: (year: Dayjs) => string;
}
