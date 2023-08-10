import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {RouterLink, RouterModule} from "@angular/router";
import {mainInterceptor} from "./router/http.interceptor";
import {RouterService} from "./router/router.service";
import { UploadProgressPopupComponent } from './components/upload-progress-popup/upload-progress-popup.component';



@NgModule({
  declarations: [
    HeaderComponent,
    UploadProgressPopupComponent,
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
