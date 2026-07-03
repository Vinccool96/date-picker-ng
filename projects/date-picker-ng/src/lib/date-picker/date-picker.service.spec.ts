import { inject, TestBed } from '@angular/core/testing';
import { Dayjs } from 'dayjs';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DatePickerService } from './date-picker.service';

describe('DatePickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePickerService, DayTimeCalendarService, DayCalendarService, TimeSelectService, UtilsService],
    });
  });

  it('should check getConfig method for dates format', inject([DatePickerService], (service: DatePickerService) => {
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
  }));
});
