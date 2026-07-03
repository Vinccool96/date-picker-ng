import { inject, Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { UtilsService } from '../common/services/utils/utils.service';
import { WeekDays } from '../common/types/week-days.type';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { IDay } from './day.model';

@Injectable({
  providedIn: 'root',
})
export class DayCalendarService {
  /*
   *****************************************************************************************************************
   * defaults
   *****************************************************************************************************************
   */

  private readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  private readonly DEFAULT_CONFIG: IDayCalendarConfig = {
    allowMultiSelect: false,
    dayBtnFormat: 'DD',
    enableMonthSelector: true,
    firstDayOfWeek: 'su',
    format: 'DD-MM-YYYY',
    monthFormat: 'MMM, YYYY',
    showNearMonthDays: true,
    showWeekNumbers: false,
    unSelectOnClick: true,
    weekDayFormat: 'ddd',
  };

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly utilsService = inject(UtilsService);

  public generateDaysIndexMap(firstDayOfWeek: WeekDays): Record<number, string> {
    const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
    const daysArray = [...this.DAYS.slice(firstDayIndex, 7), ...this.DAYS.slice(0, firstDayIndex)];
    return Object.fromEntries(daysArray.entries());
  }

  public generateDaysMap(firstDayOfWeek: WeekDays): Record<string, number> {
    const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
    const daysArray = [...this.DAYS.slice(firstDayIndex, 7), ...this.DAYS.slice(0, firstDayIndex)];
    const map: Record<string, number> = {};

    for (const [index, day] of daysArray.entries()) {
      map[day] = index;
    }

    return map;
  }

  public generateMonthArray(config: IDayCalendarConfigInternal, month: Dayjs, selected: Dayjs[]): IDay[][] {
    const parsedMonth = month.isValid() ? dayjsRef(month.toDate()) : dayjsRef();
    let monthArray: IDay[][] = [];
    const firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek as WeekDays);
    let firstDayOfBoard = parsedMonth.startOf('month');

    while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
      firstDayOfBoard = firstDayOfBoard.subtract(1, 'day');
    }

    let current = dayjsRef(firstDayOfBoard.toDate());
    const previousMonth = parsedMonth.subtract(1, 'month');
    const nextMonth = parsedMonth.add(1, 'month');
    const today = dayjsRef();

    const daysOfCalendar: IDay[] = [];

    for (let index = 0; index < 42; index++) {
      daysOfCalendar.push({
        currentDay: current.isSame(today, 'day'),
        currentMonth: current.isSame(parsedMonth, 'month'),
        date: dayjsRef(current.toDate()),
        disabled: this.isDateDisabled(current, config),
        nextMonth: current.isSame(nextMonth, 'month'),
        prevMonth: current.isSame(previousMonth, 'month'),
        selected: selected.some((selectedDay) => current.isSame(selectedDay, 'day')),
      });
      current = current.add(1, 'day');
    }

    for (const [index, day] of daysOfCalendar.entries()) {
      const weekIndex = Math.floor(index / 7);

      if (monthArray.at(weekIndex) === undefined) {
        monthArray.push([]);
      }

      monthArray[weekIndex].push(day);
    }

    if (config.showNearMonthDays !== true) {
      monthArray = this.removeNearMonthWeeks(parsedMonth, monthArray);
    }

    return monthArray;
  }

  public generateWeekdays(firstDayOfWeek: WeekDays): Dayjs[] {
    const weekdayNames: Record<string, Dayjs> = {
      fr: dayjsRef().day(5),
      mo: dayjsRef().day(1),
      sa: dayjsRef().day(6),
      su: dayjsRef().day(0),
      th: dayjsRef().day(4),
      tu: dayjsRef().day(2),
      we: dayjsRef().day(3),
    };
    const weekdays: Dayjs[] = [];
    const daysMap = this.generateDaysMap(firstDayOfWeek);

    for (const dayKey in daysMap) {
      if (Object.prototype.hasOwnProperty.call(daysMap, dayKey)) {
        weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
      }
    }

    return weekdays;
  }

  public getConfig(config: IDayCalendarConfig | undefined): IDayCalendarConfigInternal {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.utilsService.clearUndefined(config),
    };

    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    return _config as IDayCalendarConfigInternal;
  }

  public getDayBtnCssClass(config: IDayCalendarConfigInternal, day: Dayjs | undefined): string {
    if (config.dayBtnCssClassCallback !== undefined) {
      return config.dayBtnCssClassCallback(day);
    }

    return '';
  }

  public getDayBtnText(config: IDayCalendarConfigInternal, day: Dayjs | undefined): string {
    const date = day ?? dayjsRef();

    if (config.dayBtnFormatter !== undefined) {
      return config.dayBtnFormatter(date);
    }

    return date.format(config.dayBtnFormat);
  }

  // todo:: add unit tests
  public getHeaderLabel(config: IDayCalendarConfigInternal, month: Dayjs): string {
    if (config.monthFormatter !== undefined) {
      return config.monthFormatter(month);
    }

    return month.format(config.monthFormat);
  }

  public getMonthCalendarConfig(componentConfig: IDayCalendarConfigInternal): IMonthCalendarConfig {
    return this.utilsService.clearUndefined({
      allowMultiSelect: false,
      format: componentConfig.format,
      isMonthDisabledCallback: componentConfig.isMonthDisabledCallback,
      isNavHeaderBtnClickable: true,
      max: componentConfig.max,
      min: componentConfig.min,
      monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
      monthBtnFormat: componentConfig.monthBtnFormat,
      monthBtnFormatter: componentConfig.monthBtnFormatter,
      multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
      numOfMonthRows: componentConfig.numOfMonthRows,
      showGoToCurrent: componentConfig.showGoToCurrent,
      showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
      yearFormat: componentConfig.yearFormat,
      yearFormatter: componentConfig.yearFormatter,
    });
  }

  public isDateDisabled(date: Dayjs, config: IDayCalendarConfigInternal): boolean {
    if (config.isDayDisabledCallback !== undefined) {
      return config.isDayDisabledCallback(date);
    }

    if (config.min !== undefined && date.isBefore(config.min, 'day')) {
      return true;
    }

    return config.max !== undefined && date.isAfter(config.max, 'day');
  }

  // todo:: add unit tests
  public shouldShowLeft(min: Dayjs | null | undefined, currentMonthView: Dayjs | null | undefined): boolean {
    return min?.isBefore(currentMonthView, 'month') ?? true;
  }

  // todo:: add unit tests
  public shouldShowRight(max: Dayjs | null | undefined, currentMonthView: Dayjs | null | undefined): boolean {
    return max?.isAfter(currentMonthView, 'month') ?? true;
  }

  private removeNearMonthWeeks(currentMonth: Dayjs, monthArray: IDay[][]): IDay[][] {
    return (monthArray.at(-1) as IDay[]).some((day) => day.date?.isSame(currentMonth, 'month') ?? false)
      ? monthArray
      : monthArray.slice(0, -1);
  }
}
