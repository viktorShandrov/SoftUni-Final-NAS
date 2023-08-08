import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedWithMeComponent } from './shared-with-me/shared-with-me.component';
import { SharedWithUsersComponent } from './shared-with-users/shared-with-users.component';
import { DoubleClickDirective } from './shared-with-me/double-click.directive';
import { UnautoriseBtnDirective } from './shared-with-users/unautorise-btn.directive';
import {CoreModule} from "../core/core.module";

@NgModule({
  declarations: [SharedWithMeComponent, SharedWithUsersComponent,DoubleClickDirective, UnautoriseBtnDirective],
    imports: [CommonModule, CoreModule],
  exports:[SharedWithMeComponent, SharedWithUsersComponent]
})
export class SharedWithModule {}
