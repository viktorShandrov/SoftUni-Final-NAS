import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { file, files, folder } from 'src/app/shared/types';
import { StorageService } from 'src/app/storage/storage.service';
import { SharedWithService } from '../shared-with.service';

@Component({
  selector: 'app-shared-with-me',
  templateUrl: './shared-with-me.component.html',
  styleUrls: ['./shared-with-me.component.css']
})
export class SharedWithMeComponent implements AfterViewInit {
  @ViewChild("backBtn") backBtn!:ElementRef
  haveFolder:Boolean = true
constructor(
  private StorageService:StorageService,
  public SharedWithService:SharedWithService,
  public renderer:Renderer2,

  ){}
  ngAfterViewInit(){
    this.SharedWithService.backBtn = this.backBtn
    this.renderer.listen(this.backBtn.nativeElement,"click",()=>{
      this.renderer.setStyle(this.backBtn.nativeElement,"display","none")
      this.SharedWithService.files.splice(0)
      this.getSharedWithMeFolders()
    })


    setTimeout(() => {
      this.StorageService.sharingCurrentSection$.subscribe(
        (section)=>{
          if(section==="sharedWithMe"){
           this.getSharedWithMeFolders()
        }})
      
    }, 0);
  }


  getSharedWithMeFolders(){
    this.SharedWithService.getSharedWithMeFolders().subscribe(
      (res:any)=>{
        this.SharedWithService.folders = res
        this.SharedWithService?.files.splice(0)
        
      },
      (err)=>{

      }
     )
      
    }
}
