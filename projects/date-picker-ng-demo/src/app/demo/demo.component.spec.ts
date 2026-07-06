import { ActivatedRoute } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

import { DemoComponent } from './demo.component';

describe('DemoComponent', () => {
  let spectator: Spectator<DemoComponent>;
  let component: DemoComponent;

  const createComponent = createComponentFactory({
    component: DemoComponent,
    providers: [{ provide: ActivatedRoute, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
