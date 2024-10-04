import { TestBed } from '@angular/core/testing';

import { HomeServicesService } from './home-services.service';

describe('HomeServicesService', () => {
  let service: HomeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
