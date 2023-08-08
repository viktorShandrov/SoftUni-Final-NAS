import { Directive, HostListener,Renderer2 } from '@angular/core';
import { PopupService } from 'src/app/shared/popup/popup.service';


@Directive({
  selector: '[appAddFileBtn]'
})
export class AddFileBtnDirective {

  constructor(
    private PopupService:PopupService,
    private Renderer2:Renderer2
  ) { }
  @HostListener('click', ['$event'])
  showPopUp(){
    this.PopupService.showPopup("folder")
  }
}

//inactive
