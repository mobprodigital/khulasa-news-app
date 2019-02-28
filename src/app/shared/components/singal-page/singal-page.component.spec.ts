import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingalPageComponent } from './singal-page.component';

describe('SingalPageComponent', () => {
  let component: SingalPageComponent;
  let fixture: ComponentFixture<SingalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingalPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
