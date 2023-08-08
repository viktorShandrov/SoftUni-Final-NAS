import {
  Directive,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../../core/services/user.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {CacheService} from "../../../shared/services/cache.service";
import {StorageService} from "../services/storage.service";
import {PopupService} from "../../../shared/services/popup.service";


@Directive({
  selector: '[appFolderDoubleClick]',
})
export class DoubleClickDirective {
  clicks: number;
  DOUBLE_CLICK_THRESHOLD: number = 300;
  constructor(
    private router: Router,
    private UserService: UserService,
    private CacheService: CacheService,
    private StorageService: StorageService,
    private PopupService: PopupService,

    private HTMLElementsService: HTMLElementsService,
    private renderer: Renderer2
  ) {
    this.clicks = 0;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.clicks++;
    const element = event.target as HTMLElement;

    let parentElement = element.parentElement as HTMLElement;

    const parentParentElement = (element.parentElement as HTMLElement)
      .parentElement as HTMLElement;
    if (this.clicks === 1) {
      setTimeout(() => {
        this.clicks = 0;
      }, this.DOUBLE_CLICK_THRESHOLD);

      this.PopupService.hideAllOtherMenus()

      parentElement.addEventListener("contextmenu",(e)=>{
        e.preventDefault()
        const x = e.clientX
        const y = e.clientY
        let elementType
        let id
        if(parentElement.classList.contains("directory")){
          elementType = "directory"
          id =parentElement.getAttribute("_id")!
        }else if(parentElement.classList.contains("file")){
          elementType = "file"
          id =parentElement.getAttribute("_id")!
        }else if(parentElement.parentElement!.classList.contains("directory")){
          elementType = "directory"
          id =parentElement.parentElement!.getAttribute("_id")!
        }else if(parentElement.parentElement!.classList.contains("file")){
          elementType = "file"
          id =parentElement.parentElement!.getAttribute("_id")!
        }
        console.log(parentElement.parentElement!.classList)
        console.log(parentElement.parentElement)
        this.renderer.setAttribute(this.HTMLElementsService.rightClickMenu.nativeElement,"element-type",elementType!)
        this.renderer.setAttribute(this.HTMLElementsService.rightClickMenu.nativeElement,"element-id",id!)
        this.renderer.setStyle(this.HTMLElementsService.rightClickMenu.nativeElement,"display","flex")
        this.renderer.setStyle(this.HTMLElementsService.rightClickMenu.nativeElement,"top",y+"px")
        this.renderer.setStyle(this.HTMLElementsService.rightClickMenu.nativeElement,"left",x+"px")
      })

    } else if (this.clicks === 2) {
      if(parentElement.classList.value===""){
        parentElement = parentParentElement
      }

      if (parentElement.classList.contains('directory')||parentParentElement.classList.contains('directory')) {
        if (!parentParentElement.classList.contains('storage')&&parentParentElement.classList.value!==""||parentParentElement.classList.contains("table-view-container")) {
          this.CacheService.dirs.push({
            name: parentParentElement.textContent as string,
            _id: parentElement.getAttribute('_id') as string,
          });
          const divDir =
            this.HTMLElementsService.dirDivsRefs.last ||
            this.HTMLElementsService.dirDivsRefs.first;
          if (divDir) {
            this.StorageService.addEventListenerToDivDir(
              divDir,
              this.CacheService.dirs,
              this.renderer,
              this.router
            );
          }
          const id = parentElement.getAttribute('_id')||parentParentElement.getAttribute('_id')
          this.router.navigate([
            'storage',
            {
              outlets: {
                'storage-outlet': id,
              },
            },
          ]);
        }
      } else if (parentElement.classList.contains('file')) {
        console.log("file");

        this.StorageService.getFileDownload(parentElement.getAttribute("_id") as string)
      }
    }
  }
}

