import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ViewChildren,
  Input,
  OnChanges, ChangeDetectorRef, SimpleChanges
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {StorageService} from "../../../services/storage.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {folder} from "../../../../../shared/types";
import {HttpService} from "../../../../../shared/services/http.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../../../shared/constants";
import {PopupService} from "../../../../../shared/services/popup.service";

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
  selectedFolder!:folder

  elementTypeDirectory:boolean = true
  // @ViewChildren("option") options!:ElementRef[]
  formGroup:FormGroup = this.formBuilder.group({
    email:["",[Validators.required,Validators.email]]
  })
  constructor(
    public StorageService:StorageService,
    private http :HttpClient,
    private HTMLElementsService :HTMLElementsService,
    private ToastrService :ToastrService,
    private HttpService :HttpService,
    public renderer :Renderer2,
    private formBuilder: FormBuilder,
    public CacheService: CacheService,
    public PopupService: PopupService,
  ){}

  private observeMenuChanges() {
    const menuElement = this.menu.nativeElement;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {

        if (
          mutation.type === 'attributes'&&
          mutation.attributeName=="element-id"&&
          menuElement.getAttribute("element-id")!=="undefined"&&
          menuElement.getAttribute("element-type")==="directory"
        ) {
          // the menu's id have changed
          const index = this.CacheService.folders.findIndex((el)=>el._id==menuElement.getAttribute("element-id"))
          if(index> -1){
            this.selectedFolder = this.CacheService.folders[index]
          }
        }
      }
    });

    observer.observe(menuElement, { attributes: true });
  }

  ngAfterViewInit(){
    this.observeMenuChanges()
    this.HTMLElementsService.rightClickMenu = this.menu
    this.HTMLElementsService.shareContainer = this.shareContainer
    this.renderer.listen(this.HTMLElementsService.rightClickMenu.nativeElement,"change",()=>{
      console.log(this.HTMLElementsService.rightClickMenu.nativeElement.getAttribute("element-id"))
    })
    if(this.optionShare){
      this.optionShare.nativeElement.addEventListener("click",(e:MouseEvent)=>{
        const shareMenu = this.menu.nativeElement as HTMLElement
          this.PopupService.hideAllOtherMenus()
          this.renderer.setAttribute(this.HTMLElementsService.shareContainer.nativeElement,"folder-id",this.HTMLElementsService.rightClickMenu.nativeElement.getAttribute("element-id"))
          this.renderer.setStyle( this.HTMLElementsService.shareContainer.nativeElement,"display","flex")


      })

    }
  }
  makeFolderPublic(){
    const folderId = this.menu.nativeElement.getAttribute("element-id")
    this.HttpService.httpPOSTRequest("api/files/makeFolderPublic",JSON.stringify({folderId})).subscribe(
      (res:any)=>{
        this.ToastrService.success(res.message,"Yaaay",constants.toastrOptions)
        this.changePublicityOfFolder(folderId,true)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  unPublicFolder(){
    const folderId = this.menu.nativeElement.getAttribute("element-id")
    this.HttpService.httpPOSTRequest("api/files/unPublicFolder",JSON.stringify({folderId})).subscribe(
      (res:any)=>{
        this.ToastrService.success(res.message,"Yaaay",constants.toastrOptions)
        this.changePublicityOfFolder(folderId,false)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  changePublicityOfFolder(folderId:string,isPublic:boolean){
    const index = this.CacheService.folders.findIndex((el)=>el._id==folderId)
    if(index>-1){
      const folder = this.CacheService.folders[index]
      if(isPublic){
        folder.isPublic = true;
      }else{
        folder.isPublic = false;
      }
    }
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

