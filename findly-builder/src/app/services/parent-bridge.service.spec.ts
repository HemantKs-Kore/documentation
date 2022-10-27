import { TestBed } from '@angular/core/testing';

import { ParentBridgeService } from './parent-bridge.service';

describe('ParentBridgeService', () => {
  let service: ParentBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
