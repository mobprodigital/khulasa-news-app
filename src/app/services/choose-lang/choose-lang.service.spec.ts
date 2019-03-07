import { TestBed } from '@angular/core/testing';

import { AppLangService } from './choose-lang.service';

describe('ChooseLangService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLangService = TestBed.get(AppLangService);
    expect(service).toBeTruthy();
  });
});
