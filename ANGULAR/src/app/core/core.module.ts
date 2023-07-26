import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AsideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    HeaderModule,
    AsideComponent,
  ]
})
export class CoreModule { }
