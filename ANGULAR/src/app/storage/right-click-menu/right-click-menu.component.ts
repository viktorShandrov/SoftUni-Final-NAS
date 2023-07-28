import { Component,AfterViewInit, ViewChild, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent {
  @ViewChild("menu") menu!:ElementRef
  @ViewChild("optionShare") optionShare!:ElementRef
  @ViewChild("shareContainer") shareContainer!:ElementRef
  // @ViewChildren("option") options!:ElementRef[]
  formGroup:FormGroup = this.formBuilder.group({
    email:["",[Validators.required,Validators.email]]
  })
  constructor(
    public StorageService:StorageService,
    private http :HttpClient,
    public renderer :Renderer2,
    private formBuilder: FormBuilder,
  ){}
  ngAfterViewInit(){
    this.StorageService.rightClickMenu = this.menu
    this.StorageService.shareContainer = this.shareContainer

    this.optionShare.nativeElement.addEventListener("click",(e:MouseEvent)=>{
        // this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","none")
          const x = e.clientX
          const y = e.clientY

          this.renderer.setAttribute(this.StorageService.shareContainer.nativeElement,"folder-id",this.StorageService.rightClickMenu.nativeElement.getAttribute("element-id"))

          this.renderer.setStyle( this.StorageService.shareContainer.nativeElement,"display","flex")
          this.renderer.setStyle( this.StorageService.shareContainer.nativeElement,"top",y+"px")
          this.renderer.setStyle( this.StorageService.shareContainer.nativeElement,"left",x+"px")
        })
  }
  onSubmit(form:any){
    if(this.formGroup.valid){
      const email = this.formGroup.get("email")!.value
      const folderId = this.StorageService.shareContainer.nativeElement.getAttribute("folder-id")
      this.StorageService.autoriseUserToFolder(folderId,email).subscribe(
        (res)=>{
          this.renderer.setStyle( this.StorageService.shareContainer.nativeElement,"display","none")
          form.resetForm()
        },
        (err)=>{
          document.querySelector("#error-container")!.innerHTML = err.error.message
        }
      )
    }

  }
}
