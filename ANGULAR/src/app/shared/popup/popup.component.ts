import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { PopupService } from './popup.service';
import { AddFileComponent } from 'src/app/storage/add-file/add-file.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  @ViewChild('popupBG') popupBG!: ElementRef;
  @ViewChild('popupAddFile', { static: true, read: ElementRef })
  popupAddFileRef!: ElementRef;
  @ViewChild('popupAddFolder', { static: true, read: ElementRef })
  popupAddFolder!: ElementRef;
  constructor(
    private PopupService: PopupService,
    private renderer:Renderer2
    ) {
    setTimeout(() => {
      this.PopupService.popupBG = this.popupBG;
      this.PopupService.popupAddFile = this.popupAddFileRef;
      this.PopupService.popupAddFolder = this.popupAddFolder;
      this.PopupService.renderer = this.renderer;
    }, 0);
  }
}
