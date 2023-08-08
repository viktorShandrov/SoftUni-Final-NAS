import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import { PopupBGComponent } from './Components/popup-bg/popup-bg.component';
import {AddFileComponent} from "./Components/add-file/add-file.component";
import {AddFolderComponent} from "./Components/add-folder/add-folder.component";
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './Components/loader/loader.component';




@NgModule({
  declarations: [
    PopupBGComponent,
    AddFileComponent,
    AddFolderComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
    exports: [
        LoaderComponent,
        PopupBGComponent
    ]
})
export class SharedModule { }
