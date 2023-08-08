import { Component,AfterViewInit, ViewChild, ElementRef, Renderer2, ViewChildren } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {StorageService} from "../../../services/storage.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent implements AfterViewInit{
  @ViewChild("menu") menu!:ElementRef
  @ViewChild("optionShare") optionShare!:ElementRef
  @ViewChild("shareContainer") shareContainer!:ElementRef
  @ViewChild("onFileShareAttemptMessageContainer") onFileShareAttemptMessageContainer!:ElementRef

  elementTypeDirectory:boolean = true
  // @ViewChildren("option") options!:ElementRef[]
  formGroup:FormGroup = this.formBuilder.group({
    email:["",[Validators.required,Validators.email]]
  })
  constructor(
    public StorageService:StorageService,
    private http :HttpClient,
    private HTMLElementsService :HTMLElementsService,
    public renderer :Renderer2,
    private formBuilder: FormBuilder,
  ){}
  ngAfterViewInit(){
    this.HTMLElementsService.rightClickMenu = this.menu
    this.HTMLElementsService.shareContainer = this.shareContainer

    this.optionShare.nativeElement.addEventListener("click",(e:MouseEvent)=>{
      const shareMenu = this.menu.nativeElement as HTMLElement
      const elementType = shareMenu.getAttribute("element-type")
      const x = e.clientX
      const y = e.clientY
      if(elementType==="directory"){

        // this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","none")

        this.renderer.setAttribute(this.HTMLElementsService.shareContainer.nativeElement,"folder-id",this.HTMLElementsService.rightClickMenu.nativeElement.getAttribute("element-id"))

        this.renderer.setStyle( this.HTMLElementsService.shareContainer.nativeElement,"display","flex")
        this.renderer.setStyle( this.HTMLElementsService.shareContainer.nativeElement,"top",y+"px")
        this.renderer.setStyle( this.HTMLElementsService.shareContainer.nativeElement,"left",x+"px")
      }else if(elementType==="file"){
        this.renderer.setStyle( this.onFileShareAttemptMessageContainer.nativeElement,"display","flex")
        this.renderer.setStyle( this.onFileShareAttemptMessageContainer.nativeElement,"top",y+"px")
        this.renderer.setStyle( this.onFileShareAttemptMessageContainer.nativeElement,"left",x+"px")
        setTimeout(()=>{
          this.renderer.setStyle( this.onFileShareAttemptMessageContainer.nativeElement,"display","none")
        },1500)
      }
    })
  }
  onSubmit(form:any){
    if(this.formGroup.valid){
      const email = this.formGroup.get("email")!.value
      const folderId = this.HTMLElementsService.shareContainer.nativeElement.getAttribute("folder-id")
      this.StorageService.autoriseUserToFolder(folderId,email).subscribe(
        (res)=>{
          this.renderer.setStyle( this.HTMLElementsService.shareContainer.nativeElement,"display","none")
          form.resetForm()
        },
        (err)=>{
          document.querySelector("#error-container")!.innerHTML = err.error.message
        }
      )
    }

  }
}

