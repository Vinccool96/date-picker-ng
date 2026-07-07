import { inject, Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { UtilsService } from '../common/services/utils/utils.service';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
import { IMonth } from './month.model';

@Injectable({
  providedIn: 'root',
})
export class MonthCalendarService {
  /*
   *****************************************************************************************************************
   * defaults
   *****************************************************************************************************************
   */

  private readonly DEFAULT_CONFIG: IMonthCalendarConfigInternal = {
    allowMultiSelect: false,
    format: 'MM-YYYY',
    isNavHeaderBtnClickable: false,
    monthBtnFormat: 'MMM',
    multipleYearsNavigateBy: 10,
    numOfMonthRows: 3,
    showMultipleYearsNavigation: false,
    unSelectOnClick: true,
    yearFormat: 'YYYY',
  };

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly utilsService = inject(UtilsService);

  public generateYear(config: IMonthCalendarConfig, year: Dayjs, selected: Dayjs[] | null = null): IMonth[][] {
    let index = year.startOf('year');
    const numberOfMonthRows = config.numOfMonthRows as number;

    return this.utilsService.createArray(numberOfMonthRows).map(() => {
      return this.utilsService.createArray(12 / numberOfMonthRows).map(() => {
        const date = dayjsRef(index);
        const month = {
          currentMonth: index.isSame(dayjsRef(), 'month'),
          date,
          disabled: this.isMonthDisabled(date, config),
          selected: selected?.find((s): boolean => index.isSame(s, 'month')) !== undefined,
          text: this.getMonthBtnText(config, date),
        };

        index = index.add(1, 'month');

        return month;
      });
    });
  }

  public getConfig(config: IMonthCalendarConfig | undefined): IMonthCalendarConfigInternal {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.utilsService.clearUndefined(config),
    } as IMonthCalendarConfigInternal;

    MonthCalendarService.validateConfig(_config);
    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    return _config;
  }

  public getHeaderLabel(config: IMonthCalendarConfig, year: Dayjs): string {
    if (config.yearFormatter !== undefined) {
      return config.yearFormatter(year);
    }

    return year.format(config.yearFormat);
  }

  public getMonthBtnCssClass(config: IMonthCalendarConfig, month: Dayjs): string {
    if (config.monthBtnCssClassCallback !== undefined) {
      return config.monthBtnCssClassCallback(month);
    }

    return '';
  }

  public getMonthBtnText(config: IMonthCalendarConfig, month: Dayjs): string {
    if (config.monthBtnFormatter !== undefined) {
      return config.monthBtnFormatter(month);
    }

    return month.format(config.monthBtnFormat);
  }

  public isMonthDisabled(date: Dayjs, config: IMonthCalendarConfig): boolean {
    if (config.isMonthDisabledCallback !== undefined) {
      return config.isMonthDisabledCallback(date);
    }

    if (config.min !== null && config.min !== undefined && date.isBefore(config.min, 'month')) {
      return true;
    }

    return config.max !== null && config.max !== undefined && config.max !== '' && date.isAfter(config.max, 'month');
  }

  public shouldShowLeft(min: Dayjs | undefined, currentMonthView: Dayjs): boolean {
    return min === undefined ? true : min.isBefore(currentMonthView, 'year');
  }

  public shouldShowRight(max: Dayjs | undefined, currentMonthView: Dayjs): boolean {
    return max === undefined ? true : max.isAfter(currentMonthView, 'year');
  }

  private static validateConfig(config: IMonthCalendarConfigInternal): void {
    const numberOfMonthRows = config.numOfMonthRows as number;

    if (numberOfMonthRows < 1 || numberOfMonthRows > 12 || !Number.isSafeInteger(12 / numberOfMonthRows)) {
      throw new Error('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
    }
  }
}
