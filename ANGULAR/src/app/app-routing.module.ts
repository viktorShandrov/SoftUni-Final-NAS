import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StorageViewComponent } from './storage/storage-view/storage-view.component';
import { StorageContentComponent } from './storage/storage-content/storage-content.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { UserLoginRegisterViewComponent } from './user/user-login-register-view/user-login-register-view.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AuthGuard } from './authenticated.guard';
import { SharedWithMeComponent } from './shared-with/shared-with-me/shared-with-me.component';
import { SharedWithUsersComponent } from './shared-with/shared-with-users/shared-with-users.component';


const routes: Routes = [
  {
    path: 'users',
    component: UserLoginRegisterViewComponent,
    children: [
      { path: 'login', component: LoginComponent, outlet: 'user-view' },
      { path: 'register', component: RegisterComponent, outlet: 'user-view' },
    ],
  },
  {
    path: 'storage',
    canActivate:[AuthGuard],
    component: StorageViewComponent,
    children: [
      {
        path: ':id',
        component: StorageContentComponent,
        outlet: 'storage-router-outlet',
      },
      {
        path: 'dashboard',
        component: DashboardViewComponent,
        outlet: 'storage-router-outlet',
      },
      {
        path: 'shared-with-me',
        component: SharedWithMeComponent,
        outlet: 'storage-router-outlet',
      },
      {
        path: 'shared-with-users',
        component: SharedWithUsersComponent,
        outlet: 'storage-router-outlet',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
