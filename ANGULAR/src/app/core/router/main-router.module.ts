import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRouterRoutingModule } from './main-router-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRouterRoutingModule
  ],
  exports:[
    MainRouterRoutingModule
  ]
})
export class MainRouterModule { }
