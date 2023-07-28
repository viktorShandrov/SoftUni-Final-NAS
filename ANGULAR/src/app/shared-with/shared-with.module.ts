import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedWithMeComponent } from './components/shared-with-me/shared-with-me.component';
import { SharedWithUsersComponent } from './components/shared-with-users/shared-with-users.component';
import { DoubleClickDirective } from './components/shared-with-me/double-click.directive';
import { UnautoriseBtnDirective } from './components/shared-with-users/unautorise-btn.directive';

@NgModule({
  declarations: [SharedWithMeComponent, SharedWithUsersComponent,DoubleClickDirective, UnautoriseBtnDirective],
  imports: [CommonModule],
  exports:[SharedWithMeComponent, SharedWithUsersComponent]
})
export class SharedWithModule {}
