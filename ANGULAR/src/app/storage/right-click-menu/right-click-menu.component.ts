import { Component,AfterViewInit, ViewChild, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent {
  @ViewChild("menu") menu!:ElementRef
  // @ViewChildren("option") options!:ElementRef[]
  
  constructor(
    public StorageService:StorageService,
    private http :HttpClient,
    public renderer :Renderer2
  ){}
  ngAfterViewInit(){
    this.StorageService.rightClickMenu = this.menu
  }
}
