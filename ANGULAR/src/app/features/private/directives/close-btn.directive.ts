import {Directive, ElementRef, HostListener} from '@angular/core';
import {PopupService} from "../../../shared/services/popup.service";

@Directive({
  selector: '[appCloseBtn]'
})
export class CloseBtnDirective {

  constructor(
    private element:ElementRef,
    private PopupService:PopupService,
  ) {

  }
  @HostListener("click",["$event"])
  onClick(){
    this.PopupService.hideAllOtherMenus()
  }

}
