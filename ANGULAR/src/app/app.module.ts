import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StorageModule } from './storage/storage.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { mainInterceptor } from './app.interceptor';
import { toFixedPipe } from './core/header/storage-info.pipe';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommunicationService } from './shared/communication-module/communication.service';
import { AuthGuard } from './authenticated.guard';
import { SharedWithUsersComponent } from './shared-with-users/shared-with-users.component';
import { SharedWithMeComponent } from './shared-with-me/shared-with-me.component';




@NgModule({
  declarations: [
    AppComponent,
    toFixedPipe,
    SharedWithUsersComponent,
    SharedWithMeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    StorageModule,
    SharedModule,
    HttpClientModule,
    DashboardModule,
    UserModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: mainInterceptor,
      multi: true,
    },
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
