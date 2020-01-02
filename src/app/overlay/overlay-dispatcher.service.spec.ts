import { TestBed } from '@angular/core/testing';

import { OverlayDispatcherService } from './overlay-dispatcher.service';

describe('OverlayDispatcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlayDispatcherService = TestBed.get(OverlayDispatcherService);
    expect(service).toBeTruthy();
  });
});
