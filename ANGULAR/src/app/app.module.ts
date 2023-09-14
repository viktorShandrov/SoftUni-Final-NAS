import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {FeaturesModule} from "./features/features.module";

import {MainRouterModule} from "./core/router/main-router.module";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {mainInterceptor} from "./core/router/http.interceptor";
import {MainRouterRoutingModule} from "./core/router/main-router-routing.module";
import {RouterService} from "./core/router/router.service";
import {RouteReuseStrategy, RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {HttpService} from "./shared/services/http.service";
import {ClipboardModule} from "ngx-clipboard";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [

    AppComponent
  ],
  imports: [
    ClipboardModule,
    HttpClientModule,
    BrowserModule,
    SharedModule,
    CoreModule,
    FormsModule,
    FeaturesModule,
    MainRouterRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    })


  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: mainInterceptor,
      multi: true,
    },
    RouterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
