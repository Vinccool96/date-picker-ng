import { inject, Injectable } from '@angular/core';

import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDayTimeCalendarConfig, IDayTimeCalendarConfigInternal } from './day-time-calendar-config.model';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { Dayjs } from 'dayjs';
import { IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';

const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;

@Injectable({
  providedIn: 'root',
})
export class DayTimeCalendarService {
  /*
   *****************************************************************************************************************
   * defaults
   *****************************************************************************************************************
   */

  private readonly DEFAULT_CONFIG: IDayTimeCalendarConfig = {};

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly utilsService = inject(UtilsService);
  private readonly dayCalendarService = inject(DayCalendarService);
  private readonly timeSelectService = inject(TimeSelectService);

  public getConfig(config: IDayTimeCalendarConfig | undefined): IDayTimeCalendarConfigInternal {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.timeSelectService.getConfig(config),
      ...this.dayCalendarService.getConfig(config),
    };

    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    return _config as IDayTimeCalendarConfigInternal;
  }

  public updateDay(current: Dayjs | undefined, day: Dayjs | undefined, config: IDayCalendarConfigInternal): Dayjs {
    const time = current ?? dayjsRef();
    const usedDay = day ?? dayjsRef();
    let updated = dayjsRef(usedDay.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);

    if (config.min !== undefined) {
      const min = config.min;
      updated = min.isAfter(updated) ? min : updated;
    }

    if (config.max !== undefined) {
      const max = config.max;
      updated = max.isBefore(updated) ? max : updated;
    }

    return updated;
  }

  public updateTime(current: Dayjs | undefined, time: Dayjs | undefined): Dayjs {
    const day = current ?? dayjsRef();
    const usedTime = time ?? dayjsRef();

    return dayjsRef(day.format(DAY_FORMAT) + usedTime.format(TIME_FORMAT), COMBINED_FORMAT);
  }
}
