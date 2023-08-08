import { Injectable,ElementRef,Renderer2,ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  popupBG!:ElementRef
  popupAddFile!:ElementRef
  popupAddFolder!:ElementRef
  renderer!:Renderer2
  constructor() { 
    
  }


  showPopup(option:string){
    this.renderer.setStyle(this.popupBG.nativeElement,"display","flex")
    if(option === "file"){
      this.renderer.setStyle(this.popupAddFile.nativeElement,"display","flex")
    this.renderer.setStyle(this.popupAddFolder.nativeElement,"display","none")
    
  }else if(option==="folder"){
    this.renderer.setStyle(this.popupAddFolder.nativeElement,"display","flex")
    this.renderer.setStyle(this.popupAddFile.nativeElement,"display","none")
    }
  }
  hidePopup(){
    this.renderer.setStyle(this.popupBG.nativeElement,"display","none")
    this.renderer.setStyle(this.popupAddFile.nativeElement,"display","none")
    this.renderer.setStyle(this.popupAddFolder.nativeElement,"display","none")
  }
}
