
import { Directive, ElementRef, Renderer2 } from '@angular/core';
import {SharedWithService} from "../services/shared-with.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../shared/constants";


@Directive({
  selector: '[appUnauthorise]'
})
export class UnauthoriseDirective {

  constructor(
    private element:ElementRef,
    private renderer:Renderer2,
    private SharedWithService:SharedWithService,
    private ToastrService:ToastrService,
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

      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)

      }
    )
  }

}
