import { MonthCalendarComponent } from './month-calendar.component';
import { Dayjs } from 'dayjs';
import { IMonth } from './month.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('Component: MonthCalendarComponent', () => {
  let spectator: Spectator<MonthCalendarComponent>;
  let component: MonthCalendarComponent;

  const createComponent = createComponentFactory({
    component: MonthCalendarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('config', component.monthCalendarService.getConfig({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should have the right CSS classes for', () => {
    const defaultMonth: IMonth = {
      date: undefined,
      selected: false,
      currentMonth: false,
      disabled: false,
      text: '',
    };
    const defaultCssClasses: Record<string, boolean> = {
      'dp-selected': false,
      'dp-current-month': false,
    };

    it('the selected month', () => {
      expect(
        component.getMonthBtnCssClass({
          ...defaultMonth,
          selected: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-selected': true,
      });
    });

    it('the current month', () => {
      expect(
        component.getMonthBtnCssClass({
          ...defaultMonth,
          currentMonth: true,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'dp-current-month': true,
      });
    });

    it('custom days', () => {
      component.componentConfig.monthBtnCssClassCallback = (day: Dayjs) => 'custom-class';

      expect(
        component.getMonthBtnCssClass({
          ...defaultMonth,
        }),
      ).toEqual({
        ...defaultCssClasses,
        'custom-class': true,
      });
    });

    it('should emit event goToCurrent function called', () => {
      vi.spyOn(component.onGoToCurrent, 'emit');
      component.goToCurrent();
      expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
    });
  });
});
