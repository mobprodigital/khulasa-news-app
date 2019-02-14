import { TestBed } from '@angular/core/testing';

import { RoutedEventEmitterService } from './routed-event-emitter.service';

describe('RoutedEventEmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutedEventEmitterService = TestBed.get(RoutedEventEmitterService);
    expect(service).toBeTruthy();
  });
});
