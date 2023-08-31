import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsPopupComponent } from './user-settings-popup.component';

describe('UserSettingsPopupComponent', () => {
  let component: UserSettingsPopupComponent;
  let fixture: ComponentFixture<UserSettingsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSettingsPopupComponent]
    });
    fixture = TestBed.createComponent(UserSettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
