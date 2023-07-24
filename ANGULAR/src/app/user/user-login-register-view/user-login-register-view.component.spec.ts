import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginRegisterViewComponent } from './user-login-register-view.component';

describe('UserLoginRegisterViewComponent', () => {
  let component: UserLoginRegisterViewComponent;
  let fixture: ComponentFixture<UserLoginRegisterViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLoginRegisterViewComponent]
    });
    fixture = TestBed.createComponent(UserLoginRegisterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
