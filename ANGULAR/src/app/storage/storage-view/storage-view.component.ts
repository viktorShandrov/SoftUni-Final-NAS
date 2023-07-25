import { Component, ElementRef, Renderer2, ViewChild,AfterViewInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-storage-view',
  templateUrl: './storage-view.component.html',
  styleUrls: ['./storage-view.component.css']
})
export class StorageViewComponent implements AfterViewInit {
  @ViewChild("wholeStorage") wholeStorage!: ElementRef
  @ViewChild("dashboard") dashboard!: ElementRef
constructor(
  private StorageService: StorageService,
  private renderer: Renderer2,
){
  
  setTimeout(() => {
    
    this.renderer.listen(this.wholeStorage.nativeElement,"click",(e)=>{
      if(e.target.classList.contains("wholeStorage")||e.target.classList.contains("storage")){
        this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","none")
        this.renderer.setStyle(this.StorageService.shareContainer.nativeElement,"display","none")
        this.StorageService.removeBGOnFoldersAndFiles(this.StorageService.foldersQL,this.StorageService.filesQL,this.renderer)
      }
    })
    this.renderer.listen(this.wholeStorage.nativeElement,"contextmenu",(e)=>{
      if(e.target.classList.contains("wholeStorage")||e.target.classList.contains("storage")){
        e.preventDefault()
        this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","none")
        this.renderer.setStyle(this.StorageService.shareContainer.nativeElement,"display","none")
        const x = e.clientX
        const y = e.clientY
        this.renderer.setAttribute(this.StorageService.createFolderOrFileMenu.nativeElement,"parent-folder-id",this.StorageService.currentFolder)
        this.renderer.setStyle(this.StorageService.createFolderOrFileMenu.nativeElement,"display","flex")
        this.renderer.setStyle(this.StorageService.createFolderOrFileMenu.nativeElement,"top",y+"px")
        this.renderer.setStyle(this.StorageService.createFolderOrFileMenu.nativeElement,"left",x+"px")
      }
    })
    this.renderer.listen(this.wholeStorage.nativeElement,"click",(e)=>{
      this.renderer.setStyle(this.StorageService.createFolderOrFileMenu.nativeElement,"display","none")
    })
  }, 0);
  
}


ngAfterViewInit(){
  this.StorageService.wholeStorage=this.wholeStorage
  this.StorageService.dashboard=this.dashboard
  

}
}
