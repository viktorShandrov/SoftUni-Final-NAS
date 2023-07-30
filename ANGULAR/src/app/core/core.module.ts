import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import {LoaderComponent} from "./loader/loader.component";
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    AsideComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    HeaderModule,
    AsideComponent,
    LoaderComponent
  ]
})
export class CoreModule { }
