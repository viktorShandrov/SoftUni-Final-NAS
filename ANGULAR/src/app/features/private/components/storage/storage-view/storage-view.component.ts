import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {StorageService} from "../../../services/storage.service";
import {UserService} from "../../../../../core/services/user.service";
import {enviroments} from "../../../../../shared/environments";
import {PopupService} from "../../../../../shared/services/popup.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {SharedService} from "../../../services/shared.service";

@Component({
  selector: 'app-storage-view',
  templateUrl: './storage-view.component.html',
  styleUrls: ['./storage-view.component.css']
})
export class StorageViewComponent implements AfterViewInit{
  @ViewChild("contentWrapper") contentWrapper!: ElementRef

  constructor(
    private HTMLElementsService: HTMLElementsService,
    private StorageService: StorageService,
    public SharedService: SharedService,
    private PopupService: PopupService,
    private CacheService: CacheService,
    private element: ElementRef,
    private Renderer2: Renderer2,
    private UserService: UserService
  ) {
    this.Renderer2.setStyle(this.element.nativeElement, 'display', 'block');
    this.Renderer2.setStyle(this.element.nativeElement, 'height', '100%');
  }

  removeBGOnFilesAndFolders(){
    for (const folder of this.HTMLElementsService.foldersQL) {
      this.HTMLElementsService.Renderer2.removeStyle(folder.nativeElement,"background-color")
    }
    for (const folder of this.HTMLElementsService.filesQL) {
      this.HTMLElementsService.Renderer2.removeStyle(folder.nativeElement,"background-color")
    }
  }

  ngAfterViewInit(){
    this.HTMLElementsService.Renderer2.listen(this.contentWrapper.nativeElement, "click", (e) => {
      if(e.target.classList.contains("storage")||e.target.classList.contains("tableCellView")||e.target.classList.contains("haveFolder")){
        this.PopupService.hideAllOtherMenus()
        this.removeBGOnFilesAndFolders()
      }
    })
    this.HTMLElementsService.Renderer2.listen(this.contentWrapper.nativeElement, "contextmenu", (e) => {
      if(e.target.classList.contains("storage")||e.target.classList.contains("haveFolder")){
        e.preventDefault()
        this.PopupService.hideAllOtherMenus()
        this.removeBGOnFilesAndFolders()
        const x = e.clientX
        const y = e.clientY
            this.HTMLElementsService.Renderer2.setAttribute(this.HTMLElementsService.createFolderOrFileMenu.nativeElement, "parent-folder-id", enviroments.currentFolder)
            this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.createFolderOrFileMenu.nativeElement, "display", "flex")
            this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.createFolderOrFileMenu.nativeElement, "top", y + "px")
            this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.createFolderOrFileMenu.nativeElement, "left", x + "px")
      }

    })

  }
    //   if (e.target.classList.contains("contentWrapper") || e.target.classList.contains("storage")) {
    //     this.HTMLElementsService.Renderer2.setStyle(this.StorageService.rightClickMenu.nativeElement, "display", "none")
    //     this.HTMLElementsService.Renderer2.setStyle(this.StorageService.shareContainer.nativeElement, "display", "none")
    //     this.StorageService.removeBGOnFoldersAndFiles(this.StorageService.foldersQL, this.StorageService.filesQL, this.renderer)
    //   }
    // })
    // this.HTMLElementsService.Renderer2.listen(this.wholeStorage.nativeElement, "contextmenu", (e) => {
    //   if (e.target.classList.contains("wholeStorage") || e.target.classList.contains("storage")) {
    //     e.preventDefault()
    //     this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement, "display", "none")
    //     this.renderer.setStyle(this.StorageService.shareContainer.nativeElement, "display", "none")
    //
    //   }


}
