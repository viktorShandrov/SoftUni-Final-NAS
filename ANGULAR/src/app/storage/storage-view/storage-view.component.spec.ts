import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageViewComponent } from './storage-view.component';

describe('StorageViewComponent', () => {
  let component: StorageViewComponent;
  let fixture: ComponentFixture<StorageViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorageViewComponent]
    });
    fixture = TestBed.createComponent(StorageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
