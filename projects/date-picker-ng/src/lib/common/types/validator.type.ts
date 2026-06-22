import { CalendarValue } from './calendar-value';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DateValidator = (inputVal: CalendarValue) => Record<string, any> | null;
