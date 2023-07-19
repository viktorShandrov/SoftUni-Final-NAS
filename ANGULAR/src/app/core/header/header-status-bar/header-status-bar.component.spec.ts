import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderStatusBarComponent } from './header-status-bar.component';

describe('HeaderStatusBarComponent', () => {
  let component: HeaderStatusBarComponent;
  let fixture: ComponentFixture<HeaderStatusBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderStatusBarComponent]
    });
    fixture = TestBed.createComponent(HeaderStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
