import { ElementRef } from '@angular/core';

import { TDrops, TOpens } from '../common/types/poistions.type';
import { IDayCalendarConfig } from '../day-calendar/day-calendar-config.model';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { ITimeSelectConfig } from '../time-select/time-select-config.model';

export interface IDatePickerDirectiveConfig extends IDayCalendarConfig, IMonthCalendarConfig, ITimeSelectConfig {
  closeOnSelect?: boolean;
  closeOnSelectDelay?: number;
  disableKeypress?: boolean;
  drops?: TDrops;
  hideInputContainer?: boolean;
  inputElementContainer?: ElementRef | HTMLElement;
  onOpenDelay?: number;
  opens?: TOpens;
}
