import { ECalendarValue } from '../../types/calendar-value-enum';
import { SingleCalendarValue } from '../../types/single-calendar-value';
import { ElementRef, Injectable } from '@angular/core';

import { Dayjs, UnitType } from 'dayjs';
import { CalendarValue } from '../../types/calendar-value';
import { IDate } from '../../models/date.model';
import { CalendarMode } from '../../types/calendar-mode';
import { DateValidator } from '../../types/validator.type';
import { ICalendarInternal } from '../../models/calendar.model';
import { dayjsRef } from '../../dayjs/dayjs.ref';
import { ValidationErrors } from '@angular/forms';

export interface DateLimits {
  minDate?: SingleCalendarValue;
  maxDate?: SingleCalendarValue;
  minTime?: SingleCalendarValue;
  maxTime?: SingleCalendarValue;
}

interface Validator {
  key: string;
  isValid(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public static debounce(debouncedFunction: (...argument: unknown[]) => void, wait: number): () => void {
    let timeout: NodeJS.Timeout | undefined;
    return function (...arguments_: unknown[]): void {
      /* eslint-disable @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment, unicorn/no-this-assignment, unicorn/no-this-outside-of-class */
      // @ts-expect-error What the hell?
      const context = this;
      /* eslint-enable @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment, unicorn/no-this-assignment, unicorn/no-this-outside-of-class */
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        debouncedFunction.apply(context, arguments_);
      }, wait);
    };
  }

  public createArray(size: number): number[] {
    return Array.from({ length: size }, () => 1);
  }

  public convertToDayjs(date: SingleCalendarValue | null | undefined, format: string | undefined): Dayjs | null {
    if (date === null || date === undefined) {
      return null;
    }

    return typeof date === 'string' ? dayjsRef(date, format) : dayjsRef(date.toDate());
  }

  public isDateValid(date: string, format: string | undefined): boolean {
    if (date === '') {
      return true;
    }

    return dayjsRef(date, format, true).isValid();
  }

  // todo:: add unit test
  public getDefaultDisplayDate(
    current: Dayjs | null | undefined,
    selected: Dayjs[] | undefined,
    allowMultiSelect: boolean | undefined,
    minDate: Dayjs | undefined,
  ): Dayjs {
    if (current !== null && current !== undefined) {
      return dayjsRef(current.toDate());
    }

    if (minDate?.isAfter(dayjsRef()) === true) {
      return dayjsRef(minDate.toDate());
    }

    if (allowMultiSelect === true) {
      if (selected?.at(selected.length) !== undefined) {
        return dayjsRef(selected[selected.length].toDate());
      }
    } else if (selected?.at(0) !== undefined) {
      return dayjsRef(selected[0].toDate());
    }

    return dayjsRef();
  }

  // todo:: add unit test
  public getInputType(value: CalendarValue, allowMultiSelect: boolean | undefined): ECalendarValue {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return ECalendarValue.DayjsArr;
      }

      if (typeof value[0] === 'string') {
        return ECalendarValue.StringArr;
      }

      if (dayjsRef.isDayjs(value[0])) {
        return ECalendarValue.DayjsArr;
      }
    } else {
      if (typeof value === 'string') {
        return ECalendarValue.String;
      }

      if (dayjsRef.isDayjs(value)) {
        return ECalendarValue.Dayjs;
      }
    }

    return allowMultiSelect === true ? ECalendarValue.DayjsArr : ECalendarValue.Dayjs;
  }

  // todo:: add unit test
  public convertToDayjsArray(
    value: CalendarValue | undefined,
    config: { allowMultiSelect?: boolean; format?: string },
  ): Dayjs[] {
    let returnValue: Dayjs[];
    switch (this.getInputType(value as CalendarValue, config.allowMultiSelect)) {
      case ECalendarValue.String: {
        returnValue = value !== undefined && value !== '' ? [dayjsRef(value as string, config.format, true)] : [];
        break;
      }
      case ECalendarValue.StringArr: {
        returnValue = (value as string[])
          .map((v) => (v === '' ? null : dayjsRef(v, config.format, true)))
          .filter((value) => value !== null);
        break;
      }
      case ECalendarValue.Dayjs: {
        returnValue = value !== undefined && value !== '' ? [dayjsRef((value as Dayjs).toDate())] : [];
        break;
      }
      case ECalendarValue.DayjsArr: {
        returnValue = ((value as Dayjs[] | undefined) ?? []).map((v) => dayjsRef(v.toDate()));
        break;
      }
      default: {
        returnValue = [];
      }
    }

    return returnValue;
  }

  // todo:: add unit test
  public convertFromDayjsArray(
    format: string | undefined,
    value: (Dayjs | undefined)[],
    convertTo: ECalendarValue,
  ): CalendarValue | undefined {
    switch (convertTo) {
      case ECalendarValue.String: {
        return value.at(0)?.format(format);
      }
      case ECalendarValue.StringArr: {
        return value.filter((v) => v !== undefined).map((v) => v.format(format));
      }
      case ECalendarValue.Dayjs: {
        return value.at(0) === undefined ? value[0] : dayjsRef(value.at(0)?.toDate());
      }
      case ECalendarValue.DayjsArr: {
        return (value as (Dayjs | undefined)[] | undefined) === undefined
          ? undefined
          : value.map((v) => dayjsRef(v?.toDate()));
      }
      default: {
        return value as unknown as CalendarValue;
      }
    }
  }

  public convertToString(value: CalendarValue | null, format: string | undefined): string {
    let temporaryValue: string[];

    if (typeof value === 'string') {
      temporaryValue = [value];
    } else if (Array.isArray(value)) {
      temporaryValue =
        value.length > 0
          ? (value as SingleCalendarValue[]).map((v) => {
              return (this.convertToDayjs(v, format) as Dayjs).format(format);
            })
          : (value as string[]);
    } else if (dayjsRef.isDayjs(value)) {
      temporaryValue = [value.format(format)];
    } else {
      return '';
    }

    return temporaryValue.filter(Boolean).join(' | ');
  }

  // todo:: add unit test
  public clearUndefined<T extends object>(object: T | undefined): T {
    if (object === undefined) {
      return {} as T;
    }

    for (const key of Object.keys(object)) {
      if (object[key as keyof typeof object] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete object[key as keyof typeof object];
      }
    }
    return object;
  }

  public updateSelected(
    isMultiple: boolean | undefined,
    currentlySelected: Dayjs[],
    date: IDate,
    granularity: UnitType = 'day',
  ): Dayjs[] {
    if (isMultiple === true) {
      return date.selected
        ? currentlySelected.filter((day) => !day.isSame(date.date, granularity))
        : [...currentlySelected, date.date as Dayjs];
    }

    return date.selected ? [] : [date.date as Dayjs];
  }

  public closestParent(element: HTMLElement | null | undefined, selector: string): HTMLElement | undefined {
    if (element === null || element === undefined) {
      return undefined;
    }

    const match = element.querySelector<HTMLElement>(selector);

    if (match === null) {
      return this.closestParent(element.parentElement, selector);
    }

    return match;
  }

  public onlyTime(m: Dayjs | null | undefined): Dayjs {
    return dayjsRef.isDayjs(m) ? dayjsRef(m.format('HH:mm:ss'), 'HH:mm:ss') : dayjsRef();
  }

  private granularityFromType(calendarType: CalendarMode): UnitType {
    switch (calendarType) {
      case 'time': {
        return 'second';
      }
      case 'daytime': {
        return 'second';
      }
      default: {
        return calendarType;
      }
    }
  }

  public createValidator(
    { minDate, maxDate, minTime, maxTime }: DateLimits,
    format: string | undefined,
    calendarType: CalendarMode,
  ): DateValidator {
    let isValid = false;
    let value: Dayjs[];
    const validators: Validator[] = [];
    const granularity = this.granularityFromType(calendarType);

    if (minDate !== undefined && minDate !== '') {
      const md = this.convertToDayjs(minDate, format);
      validators.push({
        key: 'minDate',
        isValid: () => {
          const _isValid = value.every((day) => day.isSameOrAfter(md, granularity));
          isValid = isValid ? _isValid : false;
          return _isValid;
        },
      });
    }

    if (maxDate !== undefined && maxDate !== '') {
      const md = this.convertToDayjs(maxDate, format);
      validators.push({
        key: 'maxDate',
        isValid: () => {
          const _isValid = value.every((day) => day.isSameOrBefore(md, granularity));
          isValid = isValid ? _isValid : false;
          return _isValid;
        },
      });
    }

    if (minTime !== undefined && minTime !== '') {
      const md = this.onlyTime(this.convertToDayjs(minTime, format));
      validators.push({
        key: 'minTime',
        isValid: () => {
          const _isValid = value.every((day) => this.onlyTime(day).isSameOrAfter(md));
          isValid = isValid ? _isValid : false;
          return _isValid;
        },
      });
    }

    if (maxTime !== undefined && maxTime !== '') {
      const md = this.onlyTime(this.convertToDayjs(maxTime, format));
      validators.push({
        key: 'maxTime',
        isValid: () => {
          const _isValid = value.every((day) => this.onlyTime(day).isSameOrBefore(md));
          isValid = isValid ? _isValid : false;
          return _isValid;
        },
      });
    }

    return (inputValue: CalendarValue) => {
      value = this.convertToDayjsArray(inputValue, {
        format,
        allowMultiSelect: true,
      }).filter(Boolean);

      if (value.some((day) => !day.isValid())) {
        return {
          format: {
            given: inputValue,
          },
        };
      }

      const errors: ValidationErrors = {};

      for (const error of validators) {
        if (!error.isValid()) {
          errors[error.key] = {
            given: value,
          };
        }
      }

      return isValid ? null : errors;
    };
  }

  public datesStringToStringArray(value: string | null | undefined): string[] {
    return (value ?? '')
      .split('|')
      .map((m) => m.trim())
      .filter(Boolean);
  }

  public getValidDayjsArray(value: string, format: string | undefined): Dayjs[] {
    return this.datesStringToStringArray(value)
      .filter((d) => this.isDateValid(d, format))
      .map((d) => dayjsRef(d, format));
  }

  public shouldShowCurrent(
    showGoToCurrent: boolean | undefined,
    mode: CalendarMode,
    min: Dayjs | undefined,
    max: Dayjs | undefined,
  ): boolean {
    return showGoToCurrent === true && mode !== 'time' && this.isDateInRange(dayjsRef(), min, max);
  }

  public isDateInRange(
    date: Dayjs | null | undefined,
    from: Dayjs | null | undefined,
    to: Dayjs | null | undefined,
  ): boolean {
    if (date === null || date === undefined) {
      return false;
    }

    if ((from === null || from === undefined) && (to === null || to === undefined)) {
      return true;
    }

    if ((from === null || from === undefined) && to !== null && to !== undefined) {
      return date.isSameOrBefore(to);
    }

    if (from !== null && from !== undefined && (to === null || to === undefined)) {
      return date.isSameOrAfter(from);
    }

    return date.isBetween(from, to, 'day', '[]');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public convertPropsToDayjs(object: Record<string, any>, format: string | undefined, properties: string[]): void {
    for (const property of properties) {
      if (Object.prototype.hasOwnProperty.call(object, property)) {
        object[property] = this.convertToDayjs(object[property] as SingleCalendarValue | null | undefined, format);
      }
    }
  }

  public shouldResetCurrentView<T extends ICalendarInternal>(
    previousConfig: T | undefined | null,
    currentConfig: T | undefined | null,
  ): boolean {
    if (
      previousConfig === undefined ||
      previousConfig === null ||
      currentConfig === null ||
      currentConfig === undefined
    ) {
      return false;
    }

    return (
      (previousConfig.min === undefined && currentConfig.min !== undefined) ||
      (previousConfig.min !== undefined &&
        currentConfig.min !== undefined &&
        !previousConfig.min.isSame(currentConfig.min, 'd')) ||
      (previousConfig.max === undefined && currentConfig.max !== undefined) ||
      (previousConfig.max !== undefined &&
        currentConfig.max !== undefined &&
        !previousConfig.max.isSame(currentConfig.max, 'd'))
    );
  }

  public getNativeElement(element: HTMLElement | string | ElementRef<HTMLElement> | undefined): HTMLElement | null {
    if (element === undefined || element === '') {
      return null;
    }

    if (typeof element === 'string') {
      return document.querySelector(element);
    }

    return element instanceof ElementRef ? element.nativeElement : element;
  }
}
