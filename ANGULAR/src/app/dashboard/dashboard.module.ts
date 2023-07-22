import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

@NgModule({
  declarations: [DashboardViewComponent],
  imports: [CommonModule],
  exports: [DashboardViewComponent],
})
export class DashboardModule {}
