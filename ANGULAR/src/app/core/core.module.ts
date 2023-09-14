import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {RouterLink, RouterModule} from "@angular/router";
import {mainInterceptor} from "./router/http.interceptor";
import {RouterService} from "./router/router.service";
import { UploadProgressPopupComponent } from './components/upload-progress-popup/upload-progress-popup.component';
import { UsedStorageComponent } from './components/used-storage/used-storage.component';
import { UserSettingsPopupComponent } from './components/user-settings-popup/user-settings-popup.component';
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    HeaderComponent,
    UploadProgressPopupComponent,
    UsedStorageComponent,
    UserSettingsPopupComponent,
  ],
    exports: [
        HeaderComponent,
        RouterModule,
        UsedStorageComponent,
        UserSettingsPopupComponent,

    ],
    imports: [
        CommonModule,
        RouterModule,
        RouterLink,
        SharedModule
    ]
})
export class CoreModule { }
