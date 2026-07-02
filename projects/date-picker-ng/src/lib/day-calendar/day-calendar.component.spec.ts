import { DayCalendarComponent } from './day-calendar.component';
import { IDay } from './day.model';
import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

describe('DayCalendarComponent', () => {
  let spectator: Spectator<DayCalendarComponent>;
  let component: DayCalendarComponent;

  const createComponent = createComponentFactory({
    component: DayCalendarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('config', component.dayCalendarService.getConfig({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check getMonthBtnText default value', () => {
    expect(
      component.getDayBtnText({
        date: dayjsRef('05-04-2017', 'DD-MM-YYYY'),
      } as IDay),
    ).toEqual('05');
  });

  describe('should have the right CSS classes for', () => {
    const defaultDay: IDay = {
      date: undefined,
      selected: false,
      currentMonth: false,
      prevMonth: false,
      nextMonth: false,
      currentDay: false,
    };
    const defaultCssClasses: Record<string, boolean> = {
      'dp-selected': false,
      'dp-current-month': false,
      'dp-prev-month': false,
      'dp-next-month': false,
      'dp-current-day': false,
    };

    it('the selected day', () => {
      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
          selected: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-selected': true,
      });
    });

    it('the current month', () => {
      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
          currentMonth: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-current-month': true,
      });
    });

    it('the previous month', () => {
      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
          prevMonth: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-prev-month': true,
      });
    });

    it('the next month', () => {
      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
          nextMonth: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-next-month': true,
      });
    });

    it('the current day', () => {
      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
          currentDay: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-current-day': true,
      });
    });

    it('custom days', () => {
      component.componentConfig.dayBtnCssClassCallback = () => 'custom-class';

      expect(
        component.getDayBtnCssClass({
          ...defaultDay,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'custom-class': true,
      });
    });
  });

  describe('should have the correct weekday format', () => {
    it('weekdayFormat', () => {
      component.componentConfig.weekDayFormat = 'd';

      expect(component.getWeekdayName(dayjsRef())).toBe(dayjsRef().format('d'));
    });

    it('weekdayFormatter', () => {
      component.componentConfig.weekDayFormatter = (x: number) => x.toString();

      expect(component.getWeekdayName(dayjsRef())).toBe(dayjsRef().day().toString());
    });
  });

  it('should emit event goToCurrent function called', () => {
    vi.spyOn(component.onGoToCurrent, 'emit');
    component.goToCurrent();
    expect(component.onGoToCurrent.emit).toHaveBeenCalled();
  });
});
