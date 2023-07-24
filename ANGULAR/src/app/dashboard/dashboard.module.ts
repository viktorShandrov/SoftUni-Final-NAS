import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { StorageViewComponent } from '../storage/storage-view/storage-view.component';
import { StorageModule } from '../storage/storage.module';

@NgModule({
  declarations: [DashboardViewComponent],
  imports: [CommonModule],
  exports: [DashboardViewComponent],
})
export class DashboardModule {}
