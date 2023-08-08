import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithMeViewComponent } from './shared-with-me-view.component';

describe('SharedWithMeViewComponent', () => {
  let component: SharedWithMeViewComponent;
  let fixture: ComponentFixture<SharedWithMeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWithMeViewComponent]
    });
    fixture = TestBed.createComponent(SharedWithMeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
