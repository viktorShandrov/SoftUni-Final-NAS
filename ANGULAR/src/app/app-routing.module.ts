import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/user-auth/login/login.component';
import { RegisterComponent } from './core/user-auth/register/register.component';
import { StorageViewComponent } from './storage/storage-view/storage-view.component';
import { StorageContentComponent } from './storage/storage-content/storage-content.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';

const routes: Routes = [
  {path:"login",component: LoginComponent},
  {path:"register",component: RegisterComponent},
  {path:"storage",component: StorageViewComponent,children:[
    {path:":id", component:StorageContentComponent,outlet:"storage-router-outlet"},
    {path:"dashboard", component:DashboardViewComponent,outlet:"storage-router-outlet"},
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
