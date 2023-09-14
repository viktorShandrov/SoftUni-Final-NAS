import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {UserSettingsPopupService} from "../../services/user-settings-popup.service";
import {HttpService} from "../../../shared/services/http.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../shared/constants";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{
  notifications!:[{message:string,level:number}]
  @ViewChild("userMenu") userMenu!:ElementRef
  @ViewChild("notificationSection") notificationSection!:ElementRef
constructor(
  private element:ElementRef,
  private renderer2:Renderer2,
  public UserSettingsPopupService:UserSettingsPopupService,
  public HTMLElementsService:HTMLElementsService,
  private ToastrService:ToastrService,
  public HttpService:HttpService,
  public HeaderService:HeaderService,
) {}
  getUserNotifications(){
    this.HttpService.httpGETRequest("api/users/getNotifications",).subscribe(
      (res:any)=>{
        this.notifications = res.reverse()
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

ngAfterViewInit(){
  this.HTMLElementsService.userMenu = this.userMenu
  this.HTMLElementsService.notificationSection = this.notificationSection
  this.getUserNotifications()
  this.renderer2.setStyle(this.element.nativeElement,"display","flex")
  this.renderer2.setStyle(this.element.nativeElement,"align-items","center")
  this.renderer2.setStyle(this.element.nativeElement,"position","relative")
  this.renderer2.setStyle(this.element.nativeElement," z-index","1")

}
}
