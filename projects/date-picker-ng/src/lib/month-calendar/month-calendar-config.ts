import { Dayjs } from 'dayjs';

import { ICalendar, ICalendarInternal } from '../common/models/calendar.model';
import { IBaseConfigWithMultiple } from '../common/models/config';
import { ECalendarValue } from '../common/types/calendar-value-enum';

export interface IConfig extends IBaseConfigWithMultiple {
  format?: string;
  isMonthDisabledCallback?: (date: Dayjs) => boolean;
  isNavHeaderBtnClickable?: boolean;
  monthBtnCssClassCallback?: (day: Dayjs) => string;
  monthBtnFormat?: string;
  monthBtnFormatter?: (day: Dayjs) => string;
  multipleYearsNavigateBy?: number;
  numOfMonthRows?: number;
  returnedValueType?: ECalendarValue;
  showGoToCurrent?: boolean;
  showMultipleYearsNavigation?: boolean;
  unSelectOnClick?: boolean;
  yearFormat?: string;
  yearFormatter?: (month: Dayjs) => string;
}

export interface IMonthCalendarConfig extends ICalendar, IConfig {}

export interface IMonthCalendarConfigInternal extends ICalendarInternal, IConfig {}
