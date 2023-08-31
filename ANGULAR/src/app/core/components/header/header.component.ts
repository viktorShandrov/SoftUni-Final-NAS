import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {UserSettingsPopupService} from "../../services/user-settings-popup.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{

  @ViewChild("userMenu") userMenu!:ElementRef
constructor(
  private element:ElementRef,
  private renderer2:Renderer2,
  public UserSettingsPopupService:UserSettingsPopupService,
  public HTMLElementsService:HTMLElementsService,
  public HeaderService:HeaderService,
) {}

ngAfterViewInit(){
  this.HTMLElementsService.userMenu = this.userMenu
  this.renderer2.setStyle(this.element.nativeElement,"display","flex")
  this.renderer2.setStyle(this.element.nativeElement,"align-items","center")
  this.renderer2.setStyle(this.element.nativeElement,"position","relative")
  this.renderer2.setStyle(this.element.nativeElement," z-index","1")

}
}
