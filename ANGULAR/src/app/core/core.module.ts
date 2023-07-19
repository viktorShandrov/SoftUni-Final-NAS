import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { HeaderModule } from './header/header.module';



@NgModule({
  declarations: [
    AsideComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HeaderModule,
    AsideComponent,
  ]
})
export class CoreModule { }
