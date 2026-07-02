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
  public static debounce(func: (...arg: unknown[]) => void, wait: number): () => void {
    let timeout: NodeJS.Timeout | undefined;
    return function (...args: unknown[]): void {
      /* eslint-disable @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment */
      // @ts-expect-error What the hell?
      const context = this;
      /* eslint-enable @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment */
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  public createArray(size: number): number[] {
    return new Array<number>(size).fill(1);
  }

  public convertToDayjs(date: SingleCalendarValue | null | undefined, format: string | undefined): Dayjs | null {
    if (date === null || date === undefined) {
      return null;
    } else if (typeof date === 'string') {
      return dayjsRef(date, format);
    } else {
      return dayjsRef(date.toDate());
    }
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
    } else if (minDate?.isAfter(dayjsRef()) === true) {
      return dayjsRef(minDate.toDate());
    } else if (allowMultiSelect === true) {
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
      if (!value.length) {
        return ECalendarValue.DayjsArr;
      } else if (typeof value[0] === 'string') {
        return ECalendarValue.StringArr;
      } else if (dayjsRef.isDayjs(value[0])) {
        return ECalendarValue.DayjsArr;
      }
    } else {
      if (typeof value === 'string') {
        return ECalendarValue.String;
      } else if (dayjsRef.isDayjs(value)) {
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
    let retVal: Dayjs[];
    switch (this.getInputType(value as CalendarValue, config.allowMultiSelect)) {
      case ECalendarValue.String:
        retVal = value !== undefined && value !== '' ? [dayjsRef(value as string, config.format, true)] : [];
        break;
      case ECalendarValue.StringArr:
        retVal = (value as string[])
          .map((v) => (v !== '' ? dayjsRef(v, config.format, true) : null))
          .filter((value) => value !== null);
        break;
      case ECalendarValue.Dayjs:
        retVal = value !== undefined && value !== '' ? [dayjsRef((value as Dayjs).toDate())] : [];
        break;
      case ECalendarValue.DayjsArr:
        retVal = ((value as Dayjs[] | undefined) ?? []).map((v) => dayjsRef(v.toDate()));
        break;
      default:
        retVal = [];
    }

    return retVal;
  }

  // todo:: add unit test
  public convertFromDayjsArray(
    format: string | undefined,
    value: (Dayjs | undefined)[],
    convertTo: ECalendarValue,
  ): CalendarValue | undefined {
    switch (convertTo) {
      case ECalendarValue.String:
        return value.at(0)?.format(format);
      case ECalendarValue.StringArr:
        return value.filter((v) => v !== undefined).map((v) => v.format(format));
      case ECalendarValue.Dayjs:
        return value.at(0) !== undefined ? dayjsRef(value.at(0)?.toDate()) : value[0];
      case ECalendarValue.DayjsArr:
        return (value as (Dayjs | undefined)[] | undefined) !== undefined
          ? value.map((v) => dayjsRef(v?.toDate()))
          : undefined;
      default:
        return value as unknown as CalendarValue;
    }
  }

  public convertToString(value: CalendarValue | null, format: string | undefined): string {
    let tmpVal: string[];

    if (typeof value === 'string') {
      tmpVal = [value];
    } else if (Array.isArray(value)) {
      if (value.length) {
        tmpVal = (value as SingleCalendarValue[]).map((v) => {
          return (this.convertToDayjs(v, format) as Dayjs).format(format);
        });
      } else {
        tmpVal = value as string[];
      }
    } else if (dayjsRef.isDayjs(value)) {
      tmpVal = [value.format(format)];
    } else {
      return '';
    }

    return tmpVal.filter(Boolean).join(' | ');
  }

  // todo:: add unit test
  public clearUndefined<T extends object>(obj: T | undefined): T {
    if (obj === undefined) {
      return {} as T;
    }

    Object.keys(obj).forEach(
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      (key) => obj[key as keyof typeof obj] === undefined && delete obj[key as keyof typeof obj],
    );
    return obj;
  }

  public updateSelected(
    isMultiple: boolean | undefined,
    currentlySelected: Dayjs[],
    date: IDate,
    granularity: UnitType = 'day',
  ): Dayjs[] {
    if (isMultiple === true) {
      return !date.selected
        ? currentlySelected.concat([date.date as Dayjs])
        : currentlySelected.filter((d) => !d.isSame(date.date, granularity));
    } else {
      return !date.selected ? [date.date as Dayjs] : [];
    }
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
    if (dayjsRef.isDayjs(m)) {
      return dayjsRef(m.format('HH:mm:ss'), 'HH:mm:ss');
    } else {
      return dayjsRef();
    }
  }

  private granularityFromType(calendarType: CalendarMode): UnitType {
    switch (calendarType) {
      case 'time':
        return 'second';
      case 'daytime':
        return 'second';
      default:
        return calendarType;
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
          const _isValid = value.every((val) => val.isSameOrAfter(md, granularity));
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
          const _isValid = value.every((val) => val.isSameOrBefore(md, granularity));
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
          const _isValid = value.every((val) => this.onlyTime(val).isSameOrAfter(md));
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
          const _isValid = value.every((val) => this.onlyTime(val).isSameOrBefore(md));
          isValid = isValid ? _isValid : false;
          return _isValid;
        },
      });
    }

    return (inputVal: CalendarValue) => {
      value = this.convertToDayjsArray(inputVal, {
        format,
        allowMultiSelect: true,
      }).filter(Boolean);

      if (!value.every((val) => val.isValid())) {
        return {
          format: {
            given: inputVal,
          },
        };
      }

      const errors = validators.reduce<ValidationErrors>((map, err) => {
        if (!err.isValid()) {
          map[err.key] = {
            given: value,
          };
        }

        return map;
      }, {});

      return !isValid ? errors : null;
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
  public convertPropsToDayjs(obj: Record<string, any>, format: string | undefined, props: string[]): void {
    props.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        obj[prop] = this.convertToDayjs(obj[prop] as SingleCalendarValue | null | undefined, format);
      }
    });
  }

  public shouldResetCurrentView<T extends ICalendarInternal>(
    prevConf: T | undefined | null,
    currentConf: T | undefined | null,
  ): boolean {
    if (prevConf !== undefined && prevConf !== null && currentConf !== null && currentConf !== undefined) {
      if (prevConf.min === undefined && currentConf.min !== undefined) {
        return true;
      } else if (
        prevConf.min !== undefined &&
        currentConf.min !== undefined &&
        !prevConf.min.isSame(currentConf.min, 'd')
      ) {
        return true;
      } else if (prevConf.max === undefined && currentConf.max !== undefined) {
        return true;
      } else if (
        prevConf.max !== undefined &&
        currentConf.max !== undefined &&
        !prevConf.max.isSame(currentConf.max, 'd')
      ) {
        return true;
      }

      return false;
    }

    return false;
  }

  public getNativeElement(elem: HTMLElement | string | ElementRef<HTMLElement> | undefined): HTMLElement | null {
    if (elem === undefined || elem === '') {
      return null;
    } else if (typeof elem === 'string') {
      return document.querySelector(elem);
    } else if (elem instanceof ElementRef) {
      return elem.nativeElement;
    } else {
      return elem;
    }
  }
}
