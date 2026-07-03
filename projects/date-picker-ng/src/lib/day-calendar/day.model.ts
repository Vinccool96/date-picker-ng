import { IDate } from '../common/models/date.model';

export interface IDay extends IDate {
  currentDay?: boolean;
  currentMonth?: boolean;
  disabled?: boolean;
  nextMonth?: boolean;
  prevMonth?: boolean;
}

export interface IDayEvent {
  day: IDay;
  event: MouseEvent;
}
