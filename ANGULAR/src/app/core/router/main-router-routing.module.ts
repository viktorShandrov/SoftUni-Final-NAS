import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersViewComponent} from "../../features/public/components/users-view/users-view.component";
import {LoginComponent} from "../../features/public/components/login/login.component";
import {RegisterComponent} from "../../features/public/components/register/register.component";
import {StorageViewComponent} from "../../features/private/components/storage/storage-view/storage-view.component";
import {
  StorageContentComponent
} from "../../features/private/components/storage/storage-content/storage-content.component";
import {AuthGuard} from "./auth-guard";
import {
  DashboardViewComponent
} from "../../features/private/components/dashboard/dashboard-view/dashboard-view.component";
import {
  SharedWithMeComponent
} from "../../features/private/components/shared-with-me/shared-with-me-page/shared-with-me.component";
import {
  SharedWithMeViewComponent
} from "../../features/private/components/shared-with-me/shared-with-me-view/shared-with-me-view.component";
import {
  SharedWithMeFolderComponent
} from "../../features/private/components/shared-with-me/shared-with-me-folder/shared-with-me-folder.component";
import {
  SharedWithUsersViewComponent
} from "../../features/private/components/shared-with-users/shared-with-users-view/shared-with-users-view.component";
import {PlansViewComponent} from "../../features/public/components/plans-view/plans-view.component";
import {AdminPanelComponent} from "../../features/private/components/admin-panel/admin-panel.component";
import {AdminGuard} from "./admin-guard";

const routes: Routes = [
  {
    path:"admin",
    pathMatch:"full",
    component:AdminPanelComponent,
    canActivate:[AdminGuard]
  },
  {
    path:"",
    pathMatch: "full",
    redirectTo:"/users/(users-view:login)"
  },
  {
    path:"plans",
    pathMatch: "full",
    component:PlansViewComponent
  },
  {path:"users",component:UsersViewComponent,
    children:
      [
      {path:"login",component:LoginComponent,outlet:"users-view"},
      {path:"register",component:RegisterComponent,outlet:"users-view"}
      ]},
  {
    path: 'storage',
    canActivate:[AuthGuard],
    component: StorageViewComponent,
    children: [
      {
        path: 'dashboard',
        pathMatch:"full",
        component: DashboardViewComponent,
        outlet: 'storage-outlet',
      },
      {
        path: 'shared-with-me',
        component: SharedWithMeViewComponent,
        outlet: 'storage-outlet',
        children:[
          {
            path:":id",
            component:SharedWithMeFolderComponent,

          },
          {
            path:"",
            pathMatch:"full",
            component:SharedWithMeComponent,

          },
        ]
      },
      {
        path: 'shared-with-users',
        component: SharedWithUsersViewComponent,
        outlet: 'storage-outlet',
      },
      {
        path: ':id',
        component: StorageContentComponent,
        outlet: 'storage-outlet',
      },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class MainRouterRoutingModule { }
