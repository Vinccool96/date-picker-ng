import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

import { dayjsRef } from '../common/dayjs/dayjs.ref';
import { TimeSelectComponent } from './time-select.component';

describe('TimeSelectComponent', () => {
  let spectator: Spectator<TimeSelectComponent>;
  let component: TimeSelectComponent;

  const createComponent = createComponentFactory({
    component: TimeSelectComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate time parts', () => {
    component.selected = dayjsRef('5:33:44', 'H:mm:ss');
    expect(component.hours).toEqual('05');
    expect(component.minutes).toEqual('33');
    expect(component.seconds).toEqual('44');
    expect(component.meridiem).toEqual('AM');
  });
});
