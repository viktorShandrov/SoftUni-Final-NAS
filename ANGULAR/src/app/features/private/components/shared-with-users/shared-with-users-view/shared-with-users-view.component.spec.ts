import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithUsersViewComponent } from './shared-with-users-view.component';

describe('SharedWithUsersViewComponent', () => {
  let component: SharedWithUsersViewComponent;
  let fixture: ComponentFixture<SharedWithUsersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWithUsersViewComponent]
    });
    fixture = TestBed.createComponent(SharedWithUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
