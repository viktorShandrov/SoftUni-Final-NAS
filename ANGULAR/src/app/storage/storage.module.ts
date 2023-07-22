import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageViewComponent } from './storage-view/storage-view.component';
import { StorageNavigationComponent } from './storage-navigation/storage-navigation.component';
import { StorageContentComponent } from './storage-content/storage-content.component';
import { AddFileComponent } from './add-file/add-file.component';
import { CoreModule } from '../core/core.module';
import { AppRoutingModule } from '../app-routing.module';
import { StorageService } from './storage.service';
import { DoubleClickDirective } from './storage-content/double-click.directive';
import { AddFileBtnDirective } from './storage-content/add-file-btn.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RightClickMenuComponent } from './right-click-menu/right-click-menu.component';
import { CreateFolderOrFileMenuComponent } from './create-folder-or-file-menu/create-folder-or-file-menu.component';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { DashboardViewComponent } from '../dashboard/dashboard-view/dashboard-view.component';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [
    StorageViewComponent,
    StorageNavigationComponent,
    StorageContentComponent,
    AddFileComponent,
    DoubleClickDirective,
    AddFileBtnDirective,
    RightClickMenuComponent,
    CreateFolderOrFileMenuComponent,
    AddFolderComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DashboardModule,
  ],
  exports: [
    StorageViewComponent,
    StorageNavigationComponent,
    StorageContentComponent,
    AddFileComponent,
    DoubleClickDirective,
    RightClickMenuComponent,
    CreateFolderOrFileMenuComponent,
    AddFolderComponent,
  ],
})
export class StorageModule {}
