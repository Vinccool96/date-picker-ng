import { SingleCalendarValue } from '../common/types/single-calendar-value';

export interface IDpDayPickerApi {
  close: () => void;
  moveCalendarTo: (date: SingleCalendarValue) => void;
  open: () => void;
}
