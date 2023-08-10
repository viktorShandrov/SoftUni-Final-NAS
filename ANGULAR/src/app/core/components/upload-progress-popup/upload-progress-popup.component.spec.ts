import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProgressPopupComponent } from './upload-progress-popup.component';

describe('UploadProgressPopupComponent', () => {
  let component: UploadProgressPopupComponent;
  let fixture: ComponentFixture<UploadProgressPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadProgressPopupComponent]
    });
    fixture = TestBed.createComponent(UploadProgressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
