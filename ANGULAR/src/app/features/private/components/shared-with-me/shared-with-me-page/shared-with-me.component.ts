import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { file, files, folder } from 'src/app/shared/types';

import {StorageService} from "../../../services/storage.service";
import {SharedWithService} from "../../../services/shared-with.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../../../shared/constants";

@Component({
  selector: 'app-shared-with-me',
  templateUrl: './shared-with-me.component.html',
  styleUrls: ['./shared-with-me.component.css']
})
export class SharedWithMeComponent implements AfterViewInit {
  @ViewChild("backBtn") backBtn!:ElementRef
  haveFolder:Boolean = false

  isLoading!:Boolean
  constructor(
    private StorageService:StorageService,
    public SharedWithService:SharedWithService,
    public HTMLElementsService:HTMLElementsService,
    public CacheService:CacheService,
    public ToastrService:ToastrService,
    public renderer:Renderer2,

  ){}
  ngAfterViewInit(){
    // this.HTMLElementsService.backBtn = this.backBtn
    // this.renderer.listen(this.backBtn.nativeElement,"click",()=>{
    //   this.renderer.setStyle(this.backBtn.nativeElement,"display","none")
    //   this.SharedWithService.files.splice(0)
    //   this.getSharedWithMeFolders()
    // })

    this.getSharedWithMeFolders()

  }


  getSharedWithMeFolders(){
    setTimeout(() => {

    }, 0);
      this.isLoading = true
      this.SharedWithService.getSharedWithMeFolders().subscribe(
        (res:any)=>{
          this.isLoading = false
          if(res.length>0){
            this.haveFolder = true
            this.SharedWithService.folders = res
          }else{
            this.haveFolder = false
          }



        },
        (error)=>{
          this.isLoading = false
            this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
        }
      )

  }
}
