import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageViewComponent } from './components/storage-view/storage-view.component';
import { StorageNavigationComponent } from './components/storage-navigation/storage-navigation.component';
import { StorageContentComponent } from './components/storage-content/storage-content.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { CoreModule } from '../core/core.module';
import { AppRoutingModule } from '../app-routing.module';
import { StorageService } from './storage.service';
import { DoubleClickDirective } from './components/storage-content/double-click.directive';
import { AddFileBtnDirective } from './components/storage-content/add-file-btn.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RightClickMenuComponent } from './components/right-click-menu/right-click-menu.component';
import { CreateFolderOrFileMenuComponent } from './components/create-folder-or-file-menu/create-folder-or-file-menu.component';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { DashboardViewComponent } from '../dashboard/components/dashboard-view/dashboard-view.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SharedModule } from '../shared/shared.module';
import { SharedWithModule } from '../shared-with/shared-with.module';

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
    SharedWithModule,
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
