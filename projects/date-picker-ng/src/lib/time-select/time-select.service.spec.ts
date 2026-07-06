import { createServiceFactory, SpectatorService } from '@ngneat/spectator/vitest';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { ITimeSelectConfigInternal } from './time-select-config.model';
import { TimeSelectService } from './time-select.service';

describe('TimeSelectService', () => {
  let spectator: SpectatorService<TimeSelectService>;
  let service: TimeSelectService;

  const createService = createServiceFactory(TimeSelectService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  const configBase: ITimeSelectConfigInternal = {
    hours12Format: 'h',
    hours24Format: 'H',
    meridiemFormat: 'a',
    minutesFormat: 'm',
    minutesInterval: 3,
    secondsFormat: 's',
    secondsInterval: 4,
    timeSeparator: '-',
  };

  it('should check the getTimeFormat method', () => {
    expect(
      service.getTimeFormat({
        ...configBase,
        showSeconds: false,
        showTwentyFourHours: false,
      }),
    ).toEqual('h-m a');
    expect(
      service.getTimeFormat({
        ...configBase,
        showSeconds: false,
        showTwentyFourHours: true,
      }),
    ).toEqual('H-m');
    expect(
      service.getTimeFormat({
        ...configBase,
        showSeconds: true,
        showTwentyFourHours: false,
      }),
    ).toEqual('h-m-s a');
    expect(
      service.getTimeFormat({
        ...configBase,
        showSeconds: true,
        showTwentyFourHours: true,
      }),
    ).toEqual('H-m-s');
  });

  it('should check the getHours method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    expect(service.getHours(configBase, time)).toEqual('1');
    expect(
      service.getHours(
        {
          ...configBase,
          showTwentyFourHours: true,
        },
        time,
      ),
    ).toEqual('13');
  });

  it('should check the decrease method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    expect(service.decrease(configBase, time, 'hour').hour()).toEqual(12);
    expect(service.decrease(configBase, time, 'minute').minute()).toEqual(9);
    expect(service.decrease(configBase, time, 'second').second()).toEqual(7);
  });

  it('should check the increase method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    expect(service.increase(configBase, time, 'hour').hour()).toEqual(14);
    expect(service.increase(configBase, time, 'minute').minute()).toEqual(15);
    expect(service.increase(configBase, time, 'second').second()).toEqual(15);
  });

  it('should check the toggleMeridiem method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    expect(service.toggleMeridiem(time).hour()).toEqual(1);
    expect(service.toggleMeridiem(service.toggleMeridiem(time)).isSame(time)).toEqual(true);
  });

  it('should check the shouldShowDecrease method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    const minConfig = {
      ...configBase,
      min: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const minTimeConfig = {
      ...configBase,
      minTime: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const minAndMinTimeConfig = {
      ...configBase,
      min: dayjsRef('11:11:11', 'HH:mm:ss'),
      minTime: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const minAndMinTimeConfig2 = {
      ...configBase,
      min: dayjsRef('13:12:11', 'HH:mm:ss'),
      minTime: dayjsRef('11:11:11', 'HH:mm:ss'),
    };
    expect(service.shouldShowDecrease(minConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowDecrease(minConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minConfig, time.clone().add(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowDecrease(minConfig, time.clone().add(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minConfig, time.clone().add(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minConfig, time.clone().add(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowDecrease(minConfig, time.clone().add(15, 'second'), 'second')).toEqual(true);
    expect(service.shouldShowDecrease(minTimeConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowDecrease(minTimeConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minTimeConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minTimeConfig, time.clone().add(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowDecrease(minTimeConfig, time.clone().add(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minTimeConfig, time.clone().add(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minTimeConfig, time.clone().add(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowDecrease(minTimeConfig, time.clone().add(15, 'second'), 'second')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time.clone().add(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time.clone().add(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time.clone().add(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time.clone().add(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig, time.clone().add(15, 'second'), 'second')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time, 'hour')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time, 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time, 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time.clone().add(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time.clone().add(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time.clone().add(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time.clone().add(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowDecrease(minAndMinTimeConfig2, time.clone().add(15, 'second'), 'second')).toEqual(true);
  });

  it('should check the shouldShowIncrease method', () => {
    const time = dayjsRef('13:12:11', 'HH:mm:ss');
    const maxConfig = {
      ...configBase,
      max: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const maxTimeConfig = {
      ...configBase,
      maxTime: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const maxAndMaxTimeConfig = {
      ...configBase,
      max: dayjsRef('15:11:11', 'HH:mm:ss'),
      maxTime: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const maxAndMaxTimeConfig2 = {
      ...configBase,
      max: dayjsRef('13:12:11', 'HH:mm:ss'),
      maxTime: dayjsRef('15:11:11', 'HH:mm:ss'),
    };
    expect(service.shouldShowIncrease(maxConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowIncrease(maxConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxConfig, time.clone().subtract(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowIncrease(maxConfig, time.clone().subtract(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxConfig, time.clone().subtract(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxConfig, time.clone().subtract(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowIncrease(maxConfig, time.clone().subtract(15, 'second'), 'second')).toEqual(true);
    expect(service.shouldShowIncrease(maxTimeConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowIncrease(maxTimeConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxTimeConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxTimeConfig, time.clone().subtract(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowIncrease(maxTimeConfig, time.clone().subtract(2, 'minute'), 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxTimeConfig, time.clone().subtract(3, 'second'), 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxTimeConfig, time.clone().subtract(10, 'minute'), 'minute')).toEqual(true);
    expect(service.shouldShowIncrease(maxTimeConfig, time.clone().subtract(15, 'second'), 'second')).toEqual(true);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time, 'hour')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time, 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time, 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time.clone().subtract(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time.clone().subtract(2, 'minute'), 'minute')).toEqual(
      false,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time.clone().subtract(3, 'second'), 'second')).toEqual(
      false,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time.clone().subtract(10, 'minute'), 'minute')).toEqual(
      true,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig, time.clone().subtract(15, 'second'), 'second')).toEqual(
      true,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time, 'hour')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time, 'minute')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time, 'second')).toEqual(false);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time.clone().subtract(1, 'hour'), 'hour')).toEqual(true);
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time.clone().subtract(2, 'minute'), 'minute')).toEqual(
      false,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time.clone().subtract(3, 'second'), 'second')).toEqual(
      false,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time.clone().subtract(10, 'minute'), 'minute')).toEqual(
      true,
    );
    expect(service.shouldShowIncrease(maxAndMaxTimeConfig2, time.clone().subtract(15, 'second'), 'second')).toEqual(
      true,
    );
  });

  it('should check the shouldShowToggleMeridiem method', () => {
    const afternoonTime = dayjsRef('13:12:11', 'HH:mm:ss');
    const morningTime = dayjsRef('10:12:11', 'HH:mm:ss');
    const minConfig = {
      ...configBase,
      min: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const maxConfig = {
      ...configBase,
      max: dayjsRef('13:12:11', 'HH:mm:ss'),
    };
    const minMaxConfig = {
      ...configBase,
      max: dayjsRef('15:12:11', 'HH:mm:ss'),
      min: dayjsRef('11:12:11', 'HH:mm:ss'),
    };
    expect(service.shouldShowToggleMeridiem(configBase, morningTime)).toEqual(true);
    expect(service.shouldShowToggleMeridiem(configBase, afternoonTime)).toEqual(true);
    expect(service.shouldShowToggleMeridiem(minConfig, morningTime)).toEqual(true);
    expect(service.shouldShowToggleMeridiem(minConfig, afternoonTime)).toEqual(false);
    expect(service.shouldShowToggleMeridiem(maxConfig, morningTime)).toEqual(false);
    expect(service.shouldShowToggleMeridiem(maxConfig, afternoonTime)).toEqual(true);
    expect(service.shouldShowToggleMeridiem(minMaxConfig, morningTime)).toEqual(false);
    expect(service.shouldShowToggleMeridiem(minMaxConfig, afternoonTime)).toEqual(false);
  });
});
