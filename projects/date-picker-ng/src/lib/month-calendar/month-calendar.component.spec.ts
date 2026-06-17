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
    const defaultCssClasses: { [klass: string]: boolean } = {
      'dp-selected': false,
      'dp-current-month': false,
    };

    it('the selected month', () => {
      expect(
        component.getMonthBtnCssClass({
          ...defaultMonth,
          selected: true,
        } as IMonth),
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
        } as IMonth),
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
        } as IMonth),
      ).toEqual({
        ...defaultCssClasses,
        'custom-class': true,
      });
    });

    it('should emit event goToCurrent function called', () => {
      spyOn(component.onGoToCurrent, 'emit');
      component.goToCurrent();
      expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
    });
  });
});
