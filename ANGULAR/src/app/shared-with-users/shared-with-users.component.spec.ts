import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithUsersComponent } from './shared-with-users.component';

describe('SharedWithUsersComponent', () => {
  let component: SharedWithUsersComponent;
  let fixture: ComponentFixture<SharedWithUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWithUsersComponent]
    });
    fixture = TestBed.createComponent(SharedWithUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
