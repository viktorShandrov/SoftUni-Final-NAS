import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HeaderStatusBarComponent } from './header-status-bar/header-status-bar.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [HeaderComponent, HeaderStatusBarComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, HeaderStatusBarComponent],
})
export class HeaderModule {}
