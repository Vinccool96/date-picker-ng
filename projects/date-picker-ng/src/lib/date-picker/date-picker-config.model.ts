import { ElementRef } from '@angular/core';

import { TDrops, TOpens } from '../common/types/poistions.type';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from '../month-calendar/month-calendar-config';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from '../time-select/time-select-config.model';

export interface IConfig {
  closeOnEnter?: boolean;
  closeOnSelect?: boolean | null;
  closeOnSelectDelay?: number;
  disableKeypress?: boolean;
  drops?: TDrops | null;
  hideInputContainer?: boolean;
  hideOnOutsideClick?: boolean;
  inputElementContainer?: string | ElementRef | HTMLElement;
  onOpenDelay?: number;
  openOnClick?: boolean;
  openOnFocus?: boolean;
  opens?: TOpens | null;
}

export interface IDatePickerConfig extends IConfig, IDayCalendarConfig, IMonthCalendarConfig, ITimeSelectConfig {}

export interface IDatePickerConfigInternal
  extends IConfig, IDayCalendarConfigInternal, IMonthCalendarConfigInternal, ITimeSelectConfigInternal {}
