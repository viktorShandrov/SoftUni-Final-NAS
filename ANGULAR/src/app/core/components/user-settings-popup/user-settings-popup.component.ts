import {Component, ElementRef, Renderer2} from '@angular/core';
import {UserSettingsPopupService} from "../../services/user-settings-popup.service";

@Component({
  selector: 'app-user-settings-popup',
  templateUrl: './user-settings-popup.component.html',
  styleUrls: ['./user-settings-popup.component.css']
})
export class UserSettingsPopupComponent {
constructor(
  private element:ElementRef,
  private Renderer2:Renderer2,
  public UserSettingsPopupService:UserSettingsPopupService,
) {
  this.UserSettingsPopupService.usersSettingsPopup = element
  this.Renderer2.setStyle(element.nativeElement,"position","absolute")
  this.Renderer2.setStyle(element.nativeElement,"display","none")
  this.Renderer2.setStyle(element.nativeElement,"width","100%")
  this.Renderer2.setStyle(element.nativeElement,"height","100%")
  this.Renderer2.setStyle(element.nativeElement,"z-index","9999")

}
}
