import { inject, TestBed } from '@angular/core/testing';

import { GaService } from './ga.service';

describe('GaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GaService],
    });
  });

  it('should create', inject([GaService], (service: GaService) => {
    expect(service).toBeTruthy();
  }));
});
