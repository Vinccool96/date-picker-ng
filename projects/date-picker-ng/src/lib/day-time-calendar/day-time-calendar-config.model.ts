import { IDayCalendarConfig, IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from '../time-select/time-select-config.model';

export interface IDayTimeCalendarConfig extends IDayCalendarConfig, ITimeSelectConfig {}

export interface IDayTimeCalendarConfigInternal extends IDayCalendarConfigInternal, ITimeSelectConfigInternal {}
