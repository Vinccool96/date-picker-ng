import { createServiceFactory, SpectatorService } from '@ngneat/spectator/vitest';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';
import { DayTimeCalendarService } from './day-time-calendar.service';

const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;

describe('DayTimeCalendarService', () => {
  let spectator: SpectatorService<DayTimeCalendarService>;
  let service: DayTimeCalendarService;

  const createService = createServiceFactory(DayTimeCalendarService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should check the updateDay method', () => {
    const daytime = dayjsRef('2011091313:12:11', COMBINED_FORMAT);
    const day = dayjsRef('10110203', DAY_FORMAT);
    expect(service.updateDay(daytime, day, {}).format(COMBINED_FORMAT)).toEqual('1011020313:12:11');
  });

  it('should check the updateTime method when time is before min', () => {
    const daytime = dayjsRef('2011091313:12:11', COMBINED_FORMAT);
    const config: IDayCalendarConfigInternal = {
      max: daytime.add(50, 'm'),
      min: daytime.add(10, 'm'),
    };

    const time = daytime.clone();
    expect(service.updateDay(daytime, time, config).format(COMBINED_FORMAT)).toEqual(
      daytime.add(10, 'm').format(COMBINED_FORMAT),
    );

    expect(service.updateDay(daytime, time, {}).format(COMBINED_FORMAT)).toEqual(daytime.format(COMBINED_FORMAT));
  });

  it('should check the updateTime method when time is before max', () => {
    const daytime = dayjsRef('2011091313:12:11', COMBINED_FORMAT);
    const config: IDayCalendarConfigInternal = {
      max: daytime.subtract(10, 'm'),
      min: daytime.subtract(50, 'm'),
    };

    const time = daytime.clone();
    expect(service.updateDay(daytime, time, config).format(COMBINED_FORMAT)).toEqual(
      daytime.subtract(10, 'm').format(COMBINED_FORMAT),
    );

    expect(service.updateDay(daytime, time, {}).format(COMBINED_FORMAT)).toEqual(daytime.format(COMBINED_FORMAT));
  });

  it('should check the updateTime method', () => {
    const daytime = dayjsRef('2011091313:12:11', COMBINED_FORMAT);
    const time = dayjsRef('03:11:10', TIME_FORMAT);
    expect(service.updateTime(daytime, time).format(COMBINED_FORMAT)).toEqual('2011091303:11:10');
  });
});
