import {Injectable, ElementRef, Renderer2, ViewChild, QueryList} from '@angular/core';
import {HTMLElementsService} from "./htmlelements.service";
import {StorageService} from "../../features/private/services/storage.service";


@Injectable({
  providedIn: 'root'
})
export class PopupService {
  popupBG!:ElementRef

  popupAddFile!:ElementRef
  popupAddFolder!:ElementRef


  constructor(
    private HTMLElementsService:HTMLElementsService,



  ) {

  }

  hideAllOtherMenus() {
    this.HTMLElementsService.menuToggles.forEach((menu:ElementRef)=> {
      this.HTMLElementsService.Renderer2.setAttribute(menu.nativeElement, "isShown", "false")
    })
    for (const menu of this.HTMLElementsService.menus) {
      this.HTMLElementsService.Renderer2.setStyle(menu.nativeElement, "display", "none")
    }
    // if (this.HTMLElementsService.rightClickMenu && this.HTMLElementsService.createFolderOrFileMenu && this.HTMLElementsService.shareContainer) {
    //   this.HTMLElementsService.rightClickMenu?this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.rightClickMenu?.nativeElement, "display", "none"):null
    //   this.HTMLElementsService.createFolderOrFileMenu?this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.createFolderOrFileMenu?.nativeElement, "display", "none"):null
    //   this.HTMLElementsService.shareContainer?this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.shareContainer?.nativeElement, "display", "none"):null
    //   this.HTMLElementsService.userMenu?this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.userMenu?.nativeElement, "display", "none"):null
    //   this.HTMLElementsService.notificationSection?this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.notificationSection?.nativeElement, "display", "none"):null
    // }
  }


  showPopup(option:string){

    this.HTMLElementsService.Renderer2.setStyle(this.popupBG.nativeElement,"display","flex")
    this.hideAllOtherMenus()
    if(option === "file"){
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFile.nativeElement,"display","flex")
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFolder.nativeElement,"display","none")

    }else if(option==="folder"){
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFolder.nativeElement,"display","flex")
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFile.nativeElement,"display","none")
    }
  }
  hidePopup(){
    this.HTMLElementsService.Renderer2.setStyle(this.popupBG.nativeElement,"display","none")
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFile.nativeElement,"display","none")
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.popupAddFolder.nativeElement,"display","none")
  }
}
