import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {RouterLink, RouterModule} from "@angular/router";
import {mainInterceptor} from "./router/http.interceptor";
import {RouterService} from "./router/router.service";



@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
    RouterModule,

  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterLink
  ]
})
export class CoreModule { }
