import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserLoginRegisterViewComponent } from './components/user-login-register-view/user-login-register-view.component';
import { AppRoutingModule } from '../app-routing.module';
import { NgModel, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserLoginRegisterViewComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports:[
    UserLoginRegisterViewComponent,
    RegisterComponent,
    LoginComponent
  ]
})
export class UserModule { }
