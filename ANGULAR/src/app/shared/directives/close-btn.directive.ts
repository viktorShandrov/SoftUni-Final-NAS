import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {PopupService} from "../services/popup.service";
import {FormGroupDirective} from "@angular/forms";

@Directive({
  selector: '[appCloseBtn]'
})
export class CloseBtnDirective {
  @Input("form") form!: FormGroupDirective
  constructor(
    private element:ElementRef,
    private PopupService:PopupService,
  ) {

  }
  @HostListener("click",["$event"])
  onClick(){
    this.PopupService.hideAllOtherMenus()
    if(this.form){
      this.form.reset()
    }
  }

}
