import { DayTimeCalendarComponent } from './day-time-calendar.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('DayTimeCalendarComponent', () => {
  let spectator: Spectator<DayTimeCalendarComponent>;
  let component: DayTimeCalendarComponent;

  const createComponent = createComponentFactory({
    component: DayTimeCalendarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('config', component.dayTimeCalendarService.getConfig({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event goToCurrent when nav emit', () => {
    vi.spyOn(component.onGoToCurrent, 'emit');
    component.dayCalendarRef().onGoToCurrent.emit();
    expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
  });
});
