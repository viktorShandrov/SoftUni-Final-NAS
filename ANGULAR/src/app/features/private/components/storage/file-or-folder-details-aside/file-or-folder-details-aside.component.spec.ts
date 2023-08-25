import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrFolderDetailsAsideComponent } from './file-or-folder-details-aside.component';

describe('FileOrFolderDetailsAsideComponent', () => {
  let component: FileOrFolderDetailsAsideComponent;
  let fixture: ComponentFixture<FileOrFolderDetailsAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileOrFolderDetailsAsideComponent]
    });
    fixture = TestBed.createComponent(FileOrFolderDetailsAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
