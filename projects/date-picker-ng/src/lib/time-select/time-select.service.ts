import { inject, Injectable } from '@angular/core';

import { UtilsService } from '../common/services/utils/utils.service';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from './time-select-config.model';
import { Dayjs } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';

export type TimeUnit = 'hour' | 'minute' | 'second';
export const FIRST_PM_HOUR = 12;

@Injectable({
  providedIn: 'root',
})
export class TimeSelectService {
  private readonly DEFAULT_CONFIG: ITimeSelectConfigInternal = {
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showSeconds: false,
    showTwentyFourHours: false,
    timeSeparator: ':',
  };

  private readonly utilsService = inject(UtilsService);

  public getConfig(config: ITimeSelectConfig | undefined): ITimeSelectConfigInternal {
    const timeConfigs = {
      maxTime: this.utilsService.onlyTime(config && config.maxTime),
      minTime: this.utilsService.onlyTime(config && config.minTime),
    };

    return {
      ...this.DEFAULT_CONFIG,
      ...this.utilsService.clearUndefined(config),
      ...timeConfigs,
    } as ITimeSelectConfigInternal;
  }

  public getTimeFormat(config: ITimeSelectConfigInternal): string {
    return (
      (config.showTwentyFourHours ? (config.hours24Format as string) : (config.hours12Format as string)) +
      (config.timeSeparator as string) +
      (config.minutesFormat as string) +
      (config.showSeconds ? (config.timeSeparator as string) + (config.secondsFormat as string) : '') +
      (config.showTwentyFourHours ? '' : ' ' + (config.meridiemFormat as string))
    );
  }

  public getHours(config: ITimeSelectConfigInternal, t: Dayjs | null | undefined): string {
    const time = t || dayjsRef();
    return time.format(config.showTwentyFourHours ? config.hours24Format : config.hours12Format);
  }

  public getMinutes(config: ITimeSelectConfigInternal, t: Dayjs | null | undefined): string {
    const time = t || dayjsRef();
    return time.format(config.minutesFormat);
  }

  public getSeconds(config: ITimeSelectConfigInternal, t: Dayjs | null | undefined): string {
    const time = t || dayjsRef();
    return time.format(config.secondsFormat);
  }

  public getMeridiem(config: ITimeSelectConfigInternal, t: Dayjs | null | undefined): string {
    const time = t || dayjsRef();
    return time.format(config.meridiemFormat);
  }

  public decrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): Dayjs {
    let amount = 1;
    switch (unit) {
      case 'minute':
        amount = config.minutesInterval as number;
        break;
      case 'second':
        amount = config.secondsInterval as number;
        break;
    }
    return time.subtract(amount, unit);
  }

  public increase(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): Dayjs {
    let amount = 1;
    switch (unit) {
      case 'minute':
        amount = config.minutesInterval as number;
        break;
      case 'second':
        amount = config.secondsInterval as number;
        break;
    }
    return time.add(amount, unit);
  }

  public toggleMeridiem(time: Dayjs): Dayjs {
    if (time.hour() < FIRST_PM_HOUR) {
      return time.add(12, 'hour');
    } else {
      return time.subtract(12, 'hour');
    }
  }

  public shouldShowDecrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): boolean {
    if (!config.min && !config.minTime) {
      return true;
    }
    const newTime = this.decrease(config, time, unit);

    return (
      (!config.min || config.min.isSameOrBefore(newTime)) &&
      (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)))
    );
  }

  public shouldShowIncrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): boolean {
    if (!config.max && !config.maxTime) {
      return true;
    }
    const newTime = this.increase(config, time, unit);

    return (
      (!config.max || config.max.isSameOrAfter(newTime)) &&
      (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)))
    );
  }

  public shouldShowToggleMeridiem(config: ITimeSelectConfigInternal, time: Dayjs): boolean {
    if (!config.min && !config.max && !config.minTime && !config.maxTime) {
      return true;
    }
    const newTime = this.toggleMeridiem(time);
    return (
      (!config.max || config.max.isSameOrAfter(newTime)) &&
      (!config.min || config.min.isSameOrBefore(newTime)) &&
      (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime))) &&
      (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)))
    );
  }
}
