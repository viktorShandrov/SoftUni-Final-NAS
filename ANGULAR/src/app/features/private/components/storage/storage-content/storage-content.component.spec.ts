import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageContentComponent } from './storage-content.component';

describe('StorageContentComponent', () => {
  let component: StorageContentComponent;
  let fixture: ComponentFixture<StorageContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorageContentComponent]
    });
    fixture = TestBed.createComponent(StorageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
