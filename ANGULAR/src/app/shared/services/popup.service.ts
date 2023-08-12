import {Injectable, ElementRef, Renderer2, ViewChild, QueryList} from '@angular/core';
import {HTMLElementsService} from "./htmlelements.service";


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
    if (this.HTMLElementsService.rightClickMenu && this.HTMLElementsService.createFolderOrFileMenu && this.HTMLElementsService.shareContainer) {
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.rightClickMenu?.nativeElement, "display", "none")
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.createFolderOrFileMenu?.nativeElement, "display", "none")
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.shareContainer?.nativeElement, "display", "none")
    }
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