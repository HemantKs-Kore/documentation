import { TestBed } from '@angular/core/testing';

import { SearchSdkService } from './search-sdk.service';

describe('SearchSdkService', () => {
  let service: SearchSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
