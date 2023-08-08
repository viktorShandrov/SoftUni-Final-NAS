import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {PopupService} from "../../../../../shared/services/popup.service";

@Component({
  selector: 'app-create-folder-or-file-menu',
  templateUrl: './create-folder-or-file-menu.component.html',
  styleUrls: ['./create-folder-or-file-menu.component.css']
})
export class CreateFolderOrFileMenuComponent implements  AfterViewInit{
  @ViewChild("menu") menu!:ElementRef
  @ViewChildren("option") options!:QueryList<ElementRef>
  constructor(
    private HTMLElementsService:HTMLElementsService,
    private PopupService:PopupService,
  ) {
  }
  ngAfterViewInit(){
    this.HTMLElementsService.createFolderOrFileMenu = this.menu
  }
  showPopUp(option:string){
    this.PopupService.showPopup(option)
  }
}
