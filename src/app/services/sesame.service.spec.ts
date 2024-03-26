import { TestBed } from '@angular/core/testing';

import { SesameService } from './sesame.service';

describe('SesameService', () => {
  let service: SesameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SesameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
