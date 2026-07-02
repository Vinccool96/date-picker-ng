import { inject, Injectable } from '@angular/core';

import { WeekDays } from '../common/types/week-days.type';
import { UtilsService } from '../common/services/utils/utils.service';
import { IDay } from './day.model';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { Dayjs } from 'dayjs';
import { dayjsRef } from '../common/dayjs/dayjs.ref';

@Injectable({
  providedIn: 'root',
})
export class DayCalendarService {
  private readonly DEFAULT_CONFIG: IDayCalendarConfig = {
    showNearMonthDays: true,
    showWeekNumbers: false,
    firstDayOfWeek: 'su',
    weekDayFormat: 'ddd',
    format: 'DD-MM-YYYY',
    allowMultiSelect: false,
    monthFormat: 'MMM, YYYY',
    enableMonthSelector: true,
    dayBtnFormat: 'DD',
    unSelectOnClick: true,
  };
  private readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

  private readonly utilsService = inject(UtilsService);

  public getConfig(config: IDayCalendarConfig | undefined): IDayCalendarConfigInternal {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.utilsService.clearUndefined(config),
    };

    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    return _config as IDayCalendarConfigInternal;
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
        date: dayjsRef(current.toDate()),
        selected: selected.some((selectedDay) => current.isSame(selectedDay, 'day')),
        currentMonth: current.isSame(parsedMonth, 'month'),
        prevMonth: current.isSame(previousMonth, 'month'),
        nextMonth: current.isSame(nextMonth, 'month'),
        currentDay: current.isSame(today, 'day'),
        disabled: this.isDateDisabled(current, config),
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
      su: dayjsRef().day(0),
      mo: dayjsRef().day(1),
      tu: dayjsRef().day(2),
      we: dayjsRef().day(3),
      th: dayjsRef().day(4),
      fr: dayjsRef().day(5),
      sa: dayjsRef().day(6),
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
  public getHeaderLabel(config: IDayCalendarConfigInternal, month: Dayjs): string {
    if (config.monthFormatter !== undefined) {
      return config.monthFormatter(month);
    }

    return month.format(config.monthFormat);
  }

  // todo:: add unit tests
  public shouldShowLeft(min: Dayjs | null | undefined, currentMonthView: Dayjs | null | undefined): boolean {
    return min?.isBefore(currentMonthView, 'month') ?? true;
  }

  // todo:: add unit tests
  public shouldShowRight(max: Dayjs | null | undefined, currentMonthView: Dayjs | null | undefined): boolean {
    return max?.isAfter(currentMonthView, 'month') ?? true;
  }

  public generateDaysIndexMap(firstDayOfWeek: WeekDays): Record<number, string> {
    const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
    const daysArray = [...this.DAYS.slice(firstDayIndex, 7), ...this.DAYS.slice(0, firstDayIndex)];
    return Object.fromEntries(daysArray.entries());
  }

  public getMonthCalendarConfig(componentConfig: IDayCalendarConfigInternal): IMonthCalendarConfig {
    return this.utilsService.clearUndefined({
      min: componentConfig.min,
      max: componentConfig.max,
      format: componentConfig.format,
      isNavHeaderBtnClickable: true,
      allowMultiSelect: false,
      yearFormat: componentConfig.yearFormat,
      yearFormatter: componentConfig.yearFormatter,
      monthBtnFormat: componentConfig.monthBtnFormat,
      monthBtnFormatter: componentConfig.monthBtnFormatter,
      monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
      isMonthDisabledCallback: componentConfig.isMonthDisabledCallback,
      multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
      showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
      showGoToCurrent: componentConfig.showGoToCurrent,
      numOfMonthRows: componentConfig.numOfMonthRows,
    });
  }

  public getDayBtnText(config: IDayCalendarConfigInternal, day: Dayjs | undefined): string {
    const date = day ?? dayjsRef();

    if (config.dayBtnFormatter !== undefined) {
      return config.dayBtnFormatter(date);
    }

    return date.format(config.dayBtnFormat);
  }

  public getDayBtnCssClass(config: IDayCalendarConfigInternal, day: Dayjs | undefined): string {
    if (config.dayBtnCssClassCallback !== undefined) {
      return config.dayBtnCssClassCallback(day);
    }

    return '';
  }

  private removeNearMonthWeeks(currentMonth: Dayjs, monthArray: IDay[][]): IDay[][] {
    return (monthArray.at(-1) as IDay[]).some((day) => day.date?.isSame(currentMonth, 'month') ?? false)
      ? monthArray
      : monthArray.slice(0, -1);
  }
}
