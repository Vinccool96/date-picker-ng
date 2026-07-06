import { createServiceFactory, SpectatorService } from '@ngneat/spectator/vitest';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { DatePickerService } from './date-picker.service';

describe('DatePickerService', () => {
  let spectator: SpectatorService<DatePickerService>;
  let service: DatePickerService;

  const createService = createServiceFactory(DatePickerService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should check getConfig method for dates format', () => {
    const config1 = service.getConfig({
      format: 'YYYY-MM-DD',
      max: '2017-10-25',
      min: '2016-10-25',
    });

    expect((config1.min as Dayjs).isSame(dayjsRef('2016-10-25', 'YYYY-MM-DD'), 'day')).toBe(true);
    expect((config1.max as Dayjs).isSame(dayjsRef('2017-10-25', 'YYYY-MM-DD'), 'day')).toBe(true);

    const config2 = service.getConfig({
      max: dayjsRef('2017-10-25', 'YYYY-MM-DD'),
      min: dayjsRef('2016-10-25', 'YYYY-MM-DD'),
    });

    expect((config2.min as Dayjs).isSame(dayjsRef('2016-10-25', 'YYYY-MM-DD'), 'day')).toBe(true);
    expect((config2.max as Dayjs).isSame(dayjsRef('2017-10-25', 'YYYY-MM-DD'), 'day')).toBe(true);

    expect(service.getConfig({}, 'time').format).toEqual('HH:mm:ss');
    expect(service.getConfig({}, 'daytime').format).toEqual('DD-MM-YYYY HH:mm:ss');
    expect(service.getConfig({}, 'month').format).toEqual('MMM, YYYY');
    expect(service.getConfig({}, 'day').format).toEqual('DD-MM-YYYY');
    expect(service.getConfig({}).format).toEqual('DD-MM-YYYY HH:mm:ss');
  });
});
