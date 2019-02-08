import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivePostPage } from './archive-post.page';

describe('ArchivePostPage', () => {
  let component: ArchivePostPage;
  let fixture: ComponentFixture<ArchivePostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivePostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivePostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
