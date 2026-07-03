import { ConnectedPosition } from '@angular/cdk/overlay';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';

import { UtilsService } from '../common/services/utils/utils.service';
import { CalendarMode } from '../common/types/calendar-mode';
import { IDayCalendarConfig } from '../day-calendar/day-calendar-config.model';
import { IDayTimeCalendarConfig } from '../day-time-calendar/day-time-calendar-config.model';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { ITimeSelectConfig } from '../time-select/time-select-config.model';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDatePickerConfig, IDatePickerConfigInternal } from './date-picker-config.model';

@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly onPickerClosed = new EventEmitter<null>();

  /*
   *****************************************************************************************************************
   * globals
   *****************************************************************************************************************
   */

  private readonly defaultConfig: IDatePickerConfigInternal = {
    closeOnEnter: true,
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    disableKeypress: false,
    enableMonthSelector: true,
    format: 'DD-MM-YYYY',
    hideOnOutsideClick: true,
    onOpenDelay: 0,
    openOnClick: true,
    openOnFocus: true,
    showGoToCurrent: true,
    showNearMonthDays: true,
    showWeekNumbers: false,
  };

  /*
   *****************************************************************************************************************
   * injects
   *****************************************************************************************************************
   */

  private readonly daytimeCalendarService = inject(DayTimeCalendarService);
  private readonly timeSelectService = inject(TimeSelectService);
  private readonly utilsService = inject(UtilsService);

  public convertInputValueToDayjsArray(value: string | null | undefined, config: IDatePickerConfig): Dayjs[] {
    // todo:: add unit tests
    const usedValue = value ?? '';
    const datesStringArray = this.utilsService.datesStringToStringArray(usedValue);

    return this.utilsService.convertToDayjsArray(datesStringArray, config);
  }

  public getConfig(config: IDatePickerConfig | undefined, mode: CalendarMode = 'daytime'): IDatePickerConfigInternal {
    // todo:: add unit tests
    const _config = {
      ...this.defaultConfig,
      format: DatePickerService.getDefaultFormatByMode(mode),
      ...this.utilsService.clearUndefined(config),
    } as IDatePickerConfigInternal;

    this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);

    if (config?.allowMultiSelect === true && config.closeOnSelect === undefined) {
      _config.closeOnSelect = false;
    }

    return _config;
  }

  public getDayConfigService(pickerConfig: IDatePickerConfig): IDayCalendarConfig {
    return {
      allowMultiSelect: pickerConfig.allowMultiSelect,
      dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
      dayBtnFormat: pickerConfig.dayBtnFormat,
      dayBtnFormatter: pickerConfig.dayBtnFormatter,
      enableMonthSelector: pickerConfig.enableMonthSelector,
      firstDayOfWeek: pickerConfig.firstDayOfWeek,
      format: pickerConfig.format,
      isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
      isMonthDisabledCallback: pickerConfig.isMonthDisabledCallback,
      max: pickerConfig.max,
      min: pickerConfig.min,
      monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
      monthBtnFormat: pickerConfig.monthBtnFormat,
      monthBtnFormatter: pickerConfig.monthBtnFormatter,
      monthFormat: pickerConfig.monthFormat,
      monthFormatter: pickerConfig.monthFormatter,
      multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
      numOfMonthRows: pickerConfig.numOfMonthRows,
      returnedValueType: pickerConfig.returnedValueType,
      showGoToCurrent: pickerConfig.showGoToCurrent,
      showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
      showNearMonthDays: pickerConfig.showNearMonthDays,
      showWeekNumbers: pickerConfig.showWeekNumbers,
      unSelectOnClick: pickerConfig.unSelectOnClick,
      weekDayFormat: pickerConfig.weekDayFormat,
      weekDayFormatter: pickerConfig.weekDayFormatter,
      yearFormat: pickerConfig.yearFormat,
      yearFormatter: pickerConfig.yearFormatter,
    };
  }

  public getDayTimeConfig(pickerConfig: IDatePickerConfig): IDayTimeCalendarConfig {
    return this.daytimeCalendarService.getConfig(pickerConfig);
  }

  public getOverlayPosition({ drops, opens }: IDatePickerConfig): ConnectedPosition[] | undefined {
    if (drops === 'up' && opens === undefined) {
      return [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ];
    }

    return [
      {
        originX: opens === undefined || opens === 'left' ? 'start' : 'end',
        originY: drops !== undefined && drops === 'up' ? 'top' : 'bottom',
        overlayX: opens === undefined || opens === 'left' ? 'start' : 'end',
        overlayY: drops !== undefined && drops === 'up' ? 'bottom' : 'top',
      },
    ];
  }

  public getTimeConfig(pickerConfig: IDatePickerConfig): ITimeSelectConfig {
    return this.timeSelectService.getConfig(pickerConfig);
  }

  public isValidInputDateValue(value: string | null | undefined, config: IDatePickerConfig): boolean {
    // todo:: add unit tests
    const usedValue = value ?? '';
    const datesStringArray: string[] = this.utilsService.datesStringToStringArray(usedValue);

    return datesStringArray.every((date) => this.utilsService.isDateValid(date, config.format));
  }

  public pickerClosed(): void {
    this.onPickerClosed.emit();
  }

  private static getDefaultFormatByMode(mode: CalendarMode): string {
    switch (mode) {
      case 'day': {
        return 'DD-MM-YYYY';
      }
      case 'daytime': {
        return 'DD-MM-YYYY HH:mm:ss';
      }
      case 'month': {
        return 'MMM, YYYY';
      }
      case 'time': {
        return 'HH:mm:ss';
      }
    }
  }
}
