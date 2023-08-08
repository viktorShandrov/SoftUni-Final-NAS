import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {HTMLElementsService} from "../../services/htmlelements.service";

@Component({
  selector: 'app-popup-bg',
  templateUrl: './popup-bg.component.html',
  styleUrls: ['./popup-bg.component.css']
})
export class PopupBGComponent implements AfterViewInit{
  // @ViewChild('popupAddFile') popupAddFile!: ElementRef;
  // @ViewChild('popupAddFolder') popupAddFolder!: ElementRef;
  @ViewChild('popupAddFile', { static: true, read: ElementRef })popupAddFile!:ElementRef
  @ViewChild('popupAddFolder', { static: true, read: ElementRef }) popupAddFolder!:ElementRef
  @ViewChild('popupBG') popupBG!: ElementRef;
  constructor(
    private PopupService: PopupService,
    private HTMLElementsService: HTMLElementsService,
  ) {}

  ngAfterViewInit(){

    // this.PopupService.popupAddFile = this.popupAddFile
    // this.PopupService.popupAddFolder = this.popupAddFolder
    this.PopupService.popupBG = this.popupBG
    this.HTMLElementsService.popupAddFolder = this.popupAddFolder
    this.HTMLElementsService.popupAddFile = this.popupAddFile
  }
}
