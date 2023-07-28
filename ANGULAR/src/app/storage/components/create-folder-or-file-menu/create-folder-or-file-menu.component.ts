
import { Component,AfterViewInit, ViewChild, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-create-folder-or-file-menu',
  templateUrl: './create-folder-or-file-menu.component.html',
  styleUrls: ['./create-folder-or-file-menu.component.css']
})

export class CreateFolderOrFileMenuComponent {
  @ViewChild("menu") menu!:ElementRef
  @ViewChildren("option") options!:QueryList<ElementRef>


  constructor(
    public StorageService:StorageService,
    public PopupService:PopupService,
    private http :HttpClient,
    private renderer :Renderer2
  ){}
  ngAfterViewInit(){
    this.StorageService.createFolderOrFileMenu = this.menu
  }
  showPopUp(option:string){
    this.PopupService.showPopup(option)
  }
}

