import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupBGComponent } from './popup-bg.component';

describe('PopupBGComponent', () => {
  let component: PopupBGComponent;
  let fixture: ComponentFixture<PopupBGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupBGComponent]
    });
    fixture = TestBed.createComponent(PopupBGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
