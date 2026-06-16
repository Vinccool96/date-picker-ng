import { CalendarValue } from './calendar-value';

export type DateValidator = (inputVal: CalendarValue) => Record<string, any> | null;
