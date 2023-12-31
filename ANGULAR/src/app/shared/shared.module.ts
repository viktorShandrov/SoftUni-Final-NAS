import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import { PopupBGComponent } from './Components/popup-bg/popup-bg.component';
import {AddFileComponent} from "./Components/add-file/add-file.component";
import {AddFolderComponent} from "./Components/add-folder/add-folder.component";
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './Components/loader/loader.component';
import {MenuDirective} from "./directives/menu.directive";
import {FeaturesModule} from "../features/features.module";
import {CloseBtnDirective} from "./directives/close-btn.directive";




@NgModule({
  declarations: [
    PopupBGComponent,
    AddFileComponent,
    AddFolderComponent,
    LoaderComponent,
    MenuDirective,
    CloseBtnDirective
  ],
    imports: [
        CommonModule,
        RouterLink,
        ReactiveFormsModule,

    ],
    exports: [
        LoaderComponent,
        PopupBGComponent,
        MenuDirective,
        CloseBtnDirective
    ]
})
export class SharedModule { }
