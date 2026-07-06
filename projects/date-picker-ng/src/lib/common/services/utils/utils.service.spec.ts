import { createServiceFactory, SpectatorService } from '@ngneat/spectator/vitest';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../../dayjs/dayjs.ref';
import { IDate } from '../../models/date.model';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let spectator: SpectatorService<UtilsService>;
  let service: UtilsService;

  const createService = createServiceFactory(UtilsService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  it('should check isDateValid method', () => {
    expect(service.isDateValid('13-10-2015', 'DD-MM-YYYY')).toBe(true);
    expect(service.isDateValid('13-10-2015', 'DD-MM-YY')).toBe(false);
    expect(service.isDateValid('', 'DD-MM-YY')).toBe(true);
  });

  it('should check updateSelected method for day', () => {
    const date1: IDate = {
      date: dayjsRef('21-04-2017', 'DD-MM-YYYY'),
      selected: false,
    };

    const date2: IDate = {
      date: dayjsRef('22-04-2017', 'DD-MM-YYYY'),
      selected: false,
    };

    let array1 = service.updateSelected(false, [], date1, 'day');
    expect(array1.length).toEqual(1);
    expect(array1[0]).toBe(date1.date as Dayjs);

    array1 = service.updateSelected(false, [], date2, 'day');
    expect(array1.length).toEqual(1);
    expect(array1[0]).toBe(date2.date as Dayjs);

    date1.selected = true;
    const array2 = service.updateSelected(false, array1, date1, 'day');
    expect(array2.length).toEqual(0);

    date2.selected = false;
    expect(service.updateSelected(true, [date1.date as Dayjs], date2, 'day').length).toEqual(2);

    date1.selected = true;
    expect(service.updateSelected(true, [date1.date as Dayjs], date1, 'day').length).toEqual(0);
  });

  it('should check updateSelected method for month', () => {
    const date1: IDate = {
      date: dayjsRef('21-04-2017', 'DD-MM-YYYY'),
      selected: false,
    };

    const date2: IDate = {
      date: dayjsRef('22-04-2017', 'DD-MM-YYYY'),
      selected: false,
    };

    const date3: IDate = {
      date: dayjsRef('22-05-2017', 'DD-MM-YYYY'),
      selected: false,
    };

    let array1 = service.updateSelected(false, [], date1, 'month');
    expect(array1.length).toEqual(1);
    expect(array1[0]).toBe(date1.date as Dayjs);

    array1 = service.updateSelected(false, [], date2, 'month');
    expect(array1.length).toEqual(1);
    expect(array1[0]).toBe(date2.date as Dayjs);

    date1.selected = true;
    const array2 = service.updateSelected(false, array1, date1, 'month');
    expect(array2.length).toEqual(0);

    date3.selected = false;
    expect(service.updateSelected(true, [date1.date as Dayjs], date3, 'month').length).toEqual(2);

    date1.selected = true;
    expect(service.updateSelected(true, [date1.date as Dayjs], date1, 'month').length).toEqual(0);
  });

  it('should check if date is in range', () => {
    expect(service.isDateInRange(dayjsRef(), dayjsRef().subtract(1, 'd'), dayjsRef().add(1, 'd'))).toBeTruthy();
    expect(service.isDateInRange(dayjsRef(), dayjsRef().subtract(1, 'd'), null)).toBeTruthy();
    expect(service.isDateInRange(dayjsRef(), null, dayjsRef().add(1, 'd'))).toBeTruthy();
    expect(
      service.isDateInRange(dayjsRef().subtract(2, 'd'), dayjsRef().subtract(1, 'd'), dayjsRef().add(1, 'd')),
    ).toBeFalsy();
    expect(service.isDateInRange(dayjsRef(), dayjsRef().add(3, 'd'), null)).toBeFalsy();
    expect(service.isDateInRange(dayjsRef(), null, dayjsRef().subtract(3, 'd'))).toBeFalsy();
    expect(service.isDateInRange(dayjsRef(), null, null)).toBeTruthy();
  });

  it('should convertPropsToDayjs method', () => {
    const object = { max: '14-01-1987', min: '14-01-1987' };
    service.convertPropsToDayjs(object, 'DD-MM-YYYY', ['min', 'max']);
    expect(dayjsRef.isDayjs(object.min)).toBeTruthy();
    expect(dayjsRef.isDayjs(object.max)).toBeTruthy();
  });

  it('should test datesStringToStringArray', () => {
    expect(service.datesStringToStringArray('')).toEqual([]);
    expect(service.datesStringToStringArray('14-01-1984')).toEqual(['14-01-1984']);
    expect(service.datesStringToStringArray('14-01-1984|15-01-1984')).toEqual(['14-01-1984', '15-01-1984']);

    expect(service.datesStringToStringArray('')).toEqual([]);
    expect(service.datesStringToStringArray('14,01-1984|15,01-1984')).toEqual(['14,01-1984', '15,01-1984']);
    expect(service.datesStringToStringArray('14,01-1984| asdasd')).toEqual(['14,01-1984', 'asdasd']);
  });

  it('check convertToString', () => {
    const format = 'MM/DD/YYYY';
    expect(service.convertToString(null, format)).toEqual('');
    expect(service.convertToString('', format)).toEqual('');
    expect(service.convertToString(dayjsRef(), format)).toEqual(dayjsRef().format(format));
    expect(service.convertToString([dayjsRef()], format)).toEqual(dayjsRef().format(format));
    expect(service.convertToString([dayjsRef(), dayjsRef().add(1, 'd')], format)).toEqual(
      dayjsRef().format(format) + ' | ' + dayjsRef().add(1, 'd').format(format),
    );
    expect(service.convertToString([dayjsRef().format(format), dayjsRef().add(1, 'd').format(format)], format)).toEqual(
      dayjsRef().format(format) + ' | ' + dayjsRef().add(1, 'd').format(format),
    );
  });
});
