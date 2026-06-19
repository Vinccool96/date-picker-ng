import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

import { CalendarNavComponent } from './calendar-nav.component';

describe('CalendarNavComponent', () => {
  let spectator: Spectator<CalendarNavComponent>;
  let component: CalendarNavComponent;

  const createComponent = createComponentFactory({
    component: CalendarNavComponent,
  });

  beforeEach(() => {
    spectator = createComponent({ props: { label: 'foo' } });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when go to current click', () => {
    const goToCurrent = spectator.query('.dp-current-location-btn') as HTMLElement;

    vi.spyOn(component.onGoToCurrent, 'emit');
    goToCurrent.dispatchEvent(new Event('click'));
    expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
  });
});
