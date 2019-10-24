import { TestBed } from '@angular/core/testing';

import { RealtimedatabaseService } from './realtimedatabase.service';

describe('RealtimedatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealtimedatabaseService = TestBed.get(RealtimedatabaseService);
    expect(service).toBeTruthy();
  });
});
