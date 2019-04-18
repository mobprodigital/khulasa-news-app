import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpdateComponent } from './check-update.component';

describe('CheckUpdateComponent', () => {
  let component: CheckUpdateComponent;
  let fixture: ComponentFixture<CheckUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
