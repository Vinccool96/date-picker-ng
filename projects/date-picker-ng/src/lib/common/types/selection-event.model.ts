import { UnitType } from 'dayjs';

import { SelectEvent } from './selection-event.enum';
import { SingleCalendarValue } from './single-calendar-value';

export interface ISelectionEvent {
  date: SingleCalendarValue;
  granularity: UnitType | null;
  type: SelectEvent;
}
