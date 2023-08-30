import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedStorageComponent } from './used-storage.component';

describe('UsedStorageComponent', () => {
  let component: UsedStorageComponent;
  let fixture: ComponentFixture<UsedStorageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsedStorageComponent]
    });
    fixture = TestBed.createComponent(UsedStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
