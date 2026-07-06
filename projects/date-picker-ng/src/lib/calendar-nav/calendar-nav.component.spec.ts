import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

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
    let goToCurrentEmitted: boolean | undefined;
    spectator.output('onGoToCurrent').subscribe(() => {
      goToCurrentEmitted = true;
    });

    spectator.click(byTestId('goToCurrentButton'));

    expect(goToCurrentEmitted).toBe(true);
  });
});
