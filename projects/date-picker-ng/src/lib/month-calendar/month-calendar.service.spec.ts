import { createServiceFactory, SpectatorService } from '@ngneat/spectator/vitest';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { IMonthCalendarConfig } from './month-calendar-config';
import { MonthCalendarService } from './month-calendar.service';
import { IMonth } from './month.model';

describe('MonthCalendarService', () => {
  let spectator: SpectatorService<MonthCalendarService>;
  let service: MonthCalendarService;

  const createService = createServiceFactory(MonthCalendarService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should check the generateYear method', () => {
    const year = dayjsRef('14-01-1987', 'DD-MM-YYYY');
    const selected = dayjsRef('14-01-1987', 'DD-MM-YYYY');
    const genYear = service.generateYear({ numOfMonthRows: 4 }, year, [selected]);

    let current = year.startOf('year');

    for (const row of genYear) {
      for (const month of row) {
        expect(month.date?.isSame(current, 'month')).toBe(true);
        expect(month.selected).toBe(month.date?.format('MMM') === 'Jan');
        expect(month.currentMonth).toBe(false);

        current = current.add(1, 'month');
      }
    }
  });

  it('should check the generateYear method with [1, 2, 3, 4, 6, 12] rows', () => {
    for (const numberOfMonthRows of [1, 2, 3, 4, 6, 12]) {
      const year = dayjsRef('14-01-1987', 'DD-MM-YYYY');
      const genYear = service.generateYear({ numOfMonthRows: numberOfMonthRows }, year, []);
      expect(genYear.length).toBe(numberOfMonthRows);

      for (const row of genYear) {
        expect(row.length).toBe(12 / numberOfMonthRows);
      }
    }
  });

  it('should check the isDateDisabled method', () => {
    const month: IMonth = {
      currentMonth: false,
      date: dayjsRef('09-04-2017', 'DD-MM-YYYY'),
      disabled: false,
      selected: false,
      text: dayjsRef('09-04-2017', 'DD-MM-YYYY').format('MMM'),
    };
    const config1: IMonthCalendarConfig = {
      max: month.date?.add(1, 'month'),
      min: month.date?.subtract(1, 'month'),
    };

    expect(service.isMonthDisabled(month.date as Dayjs, config1)).toBe(false);
    month.date = (month.date as Dayjs).subtract(1, 'month');
    expect(service.isMonthDisabled(month.date, config1)).toBe(false);
    month.date = month.date.subtract(1, 'month');
    expect(service.isMonthDisabled(month.date, config1)).toBe(true);
    month.date = month.date.add(3, 'month');
    expect(service.isMonthDisabled(month.date, config1)).toBe(false);
    month.date = month.date.add(1, 'month');
    expect(service.isMonthDisabled(month.date, config1)).toBe(true);
  });

  it('should check the isDateDisabled when isMonthDisabledCallback provided', () => {
    const month: IMonth = {
      currentMonth: false,
      date: dayjsRef('01`-01-2017', 'DD-MM-YYYY'),
      disabled: false,
      selected: false,
      text: dayjsRef('01-01-2017', 'DD-MM-YYYY').format('MMM'),
    };
    const config1: IMonthCalendarConfig = {
      isMonthDisabledCallback: (m: Dayjs) => {
        return m.get('M') % 2 === 0;
      },
    };

    for (let index = 0; index < 12; index++) {
      expect(service.isMonthDisabled(month.date as Dayjs, config1)).toBe(index % 2 === 0);

      month.date = month.date?.add(1, 'month');
    }
  });

  it('should check getDayBtnText method', () => {
    const date = dayjsRef('05-04-2017', 'DD-MM-YYYY');
    expect(service.getMonthBtnText({ monthBtnFormat: 'M' }, date)).toEqual('4');
    expect(service.getMonthBtnText({ monthBtnFormat: 'MM' }, date)).toEqual('04');
    expect(service.getMonthBtnText({ monthBtnFormatter: () => 'bla' }, date)).toEqual('bla');
    expect(service.getMonthBtnText({ monthBtnFormat: 'MM', monthBtnFormatter: (m) => m.format('M') }, date)).toEqual(
      '4',
    );
  });

  it('should check getMonthBtnCssClass method', () => {
    const date = dayjsRef('05-04-2017', 'DD-MM-YYYY');
    expect(service.getMonthBtnCssClass({}, date)).toEqual('');
    expect(service.getMonthBtnCssClass({ monthBtnCssClassCallback: () => 'class1 class2' }, date)).toEqual(
      'class1 class2',
    );
  });

  it('should validate numOfMonthRows config', () => {
    for (const numberOfMonthRows of [-1, 0, 5, 7, 8, 9, 10, 11, 13]) {
      expect(() => {
        service.getConfig({ numOfMonthRows: numberOfMonthRows });
      }).toThrow('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
    }

    for (const numberOfMonthRows of [1, 2, 3, 4, 6, 12]) {
      expect(() => {
        service.getConfig({ numOfMonthRows: numberOfMonthRows });
      }).not.toThrow();
      expect(() => {
        service.getConfig({ numOfMonthRows: numberOfMonthRows });
      }).not.toThrow();
      expect(() => {
        service.getConfig({ numOfMonthRows: numberOfMonthRows });
      }).not.toThrow();
    }
  });
});
