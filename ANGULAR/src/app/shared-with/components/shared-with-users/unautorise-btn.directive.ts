import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { SharedWithService } from '../../services/shared-with.service';

@Directive({
  selector: '[appUnautoriseBtn]'
})
export class UnautoriseBtnDirective {

  constructor(
    private element:ElementRef,
    private renderer:Renderer2,
    private SharedWithService:SharedWithService,
    ) {
      this.renderer.listen(element.nativeElement,"click",(e)=>this.onClick(e))
    }

    onClick(e:MouseEvent){
      const buttonElem = e.target as HTMLElement
      const tr = buttonElem.parentElement!.parentElement as HTMLElement
      const folderId = tr.getAttribute("folderId")!
      const userId = tr.getAttribute("userId")!
       this.SharedWithService.unAuthoriseUserFromFolder(folderId,userId).subscribe(
        (res:any)=>{
          const index =  this.SharedWithService.autorisedWihtUsers.findIndex((el)=>el.userId===userId)
          this.SharedWithService.autorisedWihtUsers.splice(index,1)
          console.log("successfully aunautorised");

        },
        (err)=>{
          console.log('err: ', err);

        }
       )
    }

}
