import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageNavigationComponent } from './storage-navigation.component';

describe('StorageNavigationComponent', () => {
  let component: StorageNavigationComponent;
  let fixture: ComponentFixture<StorageNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorageNavigationComponent]
    });
    fixture = TestBed.createComponent(StorageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
