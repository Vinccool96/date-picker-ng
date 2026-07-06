import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

import { App } from './app';

describe('App', () => {
  let spectator: Spectator<App>;
  let component: App;

  const createComponent = createComponentFactory(App);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
