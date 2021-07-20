import { TestBed } from '@angular/core/testing';

import { Auth2GuardGuard } from './auth2-guard.guard';

describe('Auth2GuardGuard', () => {
  let guard: Auth2GuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(Auth2GuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
