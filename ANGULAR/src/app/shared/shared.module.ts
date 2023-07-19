import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { AddFileComponent } from '../storage/add-file/add-file.component';
import { StorageModule } from '../storage/storage.module';



@NgModule({
  declarations: [
    PopupComponent,
  ],
  imports: [
    CommonModule,
    StorageModule
  ],
  exports:[
    PopupComponent,
  ]
})
export class SharedModule { }
