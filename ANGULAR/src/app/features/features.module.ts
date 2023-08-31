import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './public/components/register/register.component';
import {SharedModule} from "../shared/shared.module";
import { UsersViewComponent } from './public/components/users-view/users-view.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import { StorageViewComponent } from './private/components/storage/storage-view/storage-view.component';
import {CoreModule} from "../core/core.module";
import { AsideComponent } from '../core/components/aside/aside.component';
import {LoginComponent} from "./public/components/login/login.component";
import {DoubleClickDirective} from "./private/directives/double-click.directive";
import { AddFileComponent } from '../shared/Components/add-file/add-file.component';
import { AddFolderComponent } from '../shared/Components/add-folder/add-folder.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StorageContentComponent} from "./private/components/storage/storage-content/storage-content.component";
import {StorageNavigationComponent} from "./private/components/storage/storage-navigation/storage-navigation.component";
import {RightClickMenuComponent} from "./private/components/storage/right-click-menu/right-click-menu.component";
import {
  CreateFolderOrFileMenuComponent
} from "./private/components/storage/create-folder-or-file-menu/create-folder-or-file-menu.component";
import { DashboardViewComponent } from './private/components/dashboard/dashboard-view/dashboard-view.component';
import { SharedWithMeComponent } from './private/components/shared-with-me/shared-with-me-page/shared-with-me.component';
import { SharedFolderDoubleClickDirective } from './private/directives/shared-folder-double-click.directive';
import { SharedWithMeViewComponent } from './private/components/shared-with-me/shared-with-me-view/shared-with-me-view.component';
import { SharedWithMeFolderComponent } from './private/components/shared-with-me/shared-with-me-folder/shared-with-me-folder.component';
import {
  SharedWithUsersViewComponent
} from "./private/components/shared-with-users/shared-with-users-view/shared-with-users-view.component";
import { PlansViewComponent } from './public/components/plans-view/plans-view.component';
import { UnauthoriseDirective } from './private/directives/unauthorise.directive';
import {HttpService} from "../shared/services/http.service";
import { NavigationTrimPipe } from './private/pipes/navigation-trim.pipe';
import { FileOrFolderDetailsAsideComponent } from './private/components/storage/file-or-folder-details-aside/file-or-folder-details-aside.component';
import { TrimDetailsElementNamePipe } from './private/pipes/trim-details-element-name.pipe';
import { TrimChartElementNamePipe } from './private/pipes/trim-chart-element-name.pipe';







@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UsersViewComponent,
    StorageViewComponent,
    AsideComponent,
    DoubleClickDirective,
    StorageContentComponent,
    StorageNavigationComponent,
    RightClickMenuComponent,
    CreateFolderOrFileMenuComponent,
    DashboardViewComponent,
    SharedWithMeComponent,
    SharedFolderDoubleClickDirective,
    SharedWithMeViewComponent,
    SharedWithMeFolderComponent,
    SharedWithUsersViewComponent,
    PlansViewComponent,
    UnauthoriseDirective,
    NavigationTrimPipe,
    FileOrFolderDetailsAsideComponent,
    TrimDetailsElementNamePipe,
    TrimChartElementNamePipe

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterOutlet,
    CoreModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:[
    LoginComponent,
    RegisterComponent,
    UsersViewComponent,
    StorageNavigationComponent
  ],
  providers:[HttpService]
})
export class FeaturesModule { }
