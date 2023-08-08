import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithMeFolderComponent } from './shared-with-me-folder.component';

describe('SharedWithMeFolderComponent', () => {
  let component: SharedWithMeFolderComponent;
  let fixture: ComponentFixture<SharedWithMeFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWithMeFolderComponent]
    });
    fixture = TestBed.createComponent(SharedWithMeFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
