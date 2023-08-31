import {ElementRef, Injectable} from '@angular/core';
import {HTMLElementsService} from "../../shared/services/htmlelements.service";

@Injectable({
  providedIn: 'root'
})
export class UserSettingsPopupService {
  usersSettingsPopup!:ElementRef
  constructor(
    private HTMLElementsService:HTMLElementsService
  ) { }

  showPopup(){
    this.HTMLElementsService.Renderer2.setStyle(this.usersSettingsPopup.nativeElement,"display","block")
  }
  hidePopup(){
    this.HTMLElementsService.Renderer2.setStyle(this.usersSettingsPopup.nativeElement,"display","none")
  }
}
