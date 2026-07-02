import { inject, Injectable } from '@angular/core';

import { UtilsService } from '../common/services/utils/utils.service';
import { IMonth } from './month.model';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
import { Dayjs } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';

@Injectable({
  providedIn: 'root',
})
export class MonthCalendarService {
  private readonly DEFAULT_CONFIG: IMonthCalendarConfigInternal = {
    allowMultiSelect: false,
    yearFormat: 'YYYY',
    format: 'MM-YYYY',
    isNavHeaderBtnClickable: false,
    monthBtnFormat: 'MMM',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    unSelectOnClick: true,
    numOfMonthRows: 3,
  };

  private readonly utilsService = inject(UtilsService);

  public getConfig(config: IMonthCalendarConfig | undefined): IMonthCalendarConfigInternal {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.utilsService.clearUndefined(config),
    } as IMonthCalendarConfigInternal;

    MonthCalendarService.validateConfig(_config);
    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    return _config;
  }

  public generateYear(config: IMonthCalendarConfig, year: Dayjs, selected: Dayjs[] | null = null): IMonth[][] {
    let index = year.startOf('year');
    const numOfMonthRows = config.numOfMonthRows as number;

    return this.utilsService.createArray(numOfMonthRows).map(() => {
      return this.utilsService.createArray(12 / numOfMonthRows).map(() => {
        const date = dayjsRef(index);
        const month = {
          date,
          selected: selected?.find((s): boolean => index.isSame(s, 'month')) !== undefined,
          currentMonth: index.isSame(dayjsRef(), 'month'),
          disabled: this.isMonthDisabled(date, config),
          text: this.getMonthBtnText(config, date),
        };

        index = index.add(1, 'month');

        return month;
      });
    });
  }

  public isMonthDisabled(date: Dayjs, config: IMonthCalendarConfig): boolean {
    if (config.isMonthDisabledCallback !== undefined) {
      return config.isMonthDisabledCallback(date);
    }

    if (config.min !== undefined && date.isBefore(config.min, 'month')) {
      return true;
    }

    return config.max !== undefined && config.max !== '' && date.isAfter(config.max, 'month');
  }

  public shouldShowLeft(min: Dayjs | undefined, currentMonthView: Dayjs): boolean {
    return min !== undefined ? min.isBefore(currentMonthView, 'year') : true;
  }

  public shouldShowRight(max: Dayjs | undefined, currentMonthView: Dayjs): boolean {
    return max !== undefined ? max.isAfter(currentMonthView, 'year') : true;
  }

  public getHeaderLabel(config: IMonthCalendarConfig, year: Dayjs): string {
    if (config.yearFormatter !== undefined) {
      return config.yearFormatter(year);
    }

    return year.format(config.yearFormat);
  }

  public getMonthBtnText(config: IMonthCalendarConfig, month: Dayjs): string {
    if (config.monthBtnFormatter !== undefined) {
      return config.monthBtnFormatter(month);
    }

    return month.format(config.monthBtnFormat);
  }

  public getMonthBtnCssClass(config: IMonthCalendarConfig, month: Dayjs): string {
    if (config.monthBtnCssClassCallback !== undefined) {
      return config.monthBtnCssClassCallback(month);
    }

    return '';
  }

  private static validateConfig(config: IMonthCalendarConfigInternal): void {
    const numOfMonthRows = config.numOfMonthRows as number;

    if (numOfMonthRows < 1 || numOfMonthRows > 12 || !Number.isInteger(12 / numOfMonthRows)) {
      throw new Error('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
    }
  }
}
