import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFolderOrFileMenuComponent } from './create-folder-or-file-menu.component';

describe('CreateFolderOrFileMenuComponent', () => {
  let component: CreateFolderOrFileMenuComponent;
  let fixture: ComponentFixture<CreateFolderOrFileMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFolderOrFileMenuComponent]
    });
    fixture = TestBed.createComponent(CreateFolderOrFileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
