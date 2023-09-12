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
import {readableStreamLikeToAsyncGenerator} from "rxjs/internal/util/isReadableStreamLike";
import {RouterService} from "../../../core/router/router.service";


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
    private RouterService: RouterService,

    private HTMLElementsService: HTMLElementsService,
    private renderer: Renderer2
  ) {
    this.clicks = 0;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.clicks++;
    const clickedElement = event.target as HTMLElement;

    const mainParentElement = clickedElement.closest(".cell") as HTMLElement;

    const threeDots = clickedElement.closest(".threeDots")

    if (this.clicks === 1) {
      setTimeout(() => {
        this.clicks = 0;
      }, this.DOUBLE_CLICK_THRESHOLD);




      if(mainParentElement){
        if(!mainParentElement.classList.contains("sharedWithMe")){
          this.PopupService.hideAllOtherMenus()
          this.StorageService.hideAllOverflowingCellText(this.HTMLElementsService.foldersQL,this.HTMLElementsService.filesQL)

          //if we click on the tree dots, overflowing text should not be visible
          if(!threeDots){
            this.StorageService.showOverflowingCellText(mainParentElement)
          }
          mainParentElement.addEventListener("contextmenu", (event: MouseEvent) => {
            this.StorageService.showElementContextMenu(this.HTMLElementsService, event);
          });

        }
      }

    } else if (this.clicks === 2) {

      if(mainParentElement&&!threeDots){

        if (mainParentElement.classList.contains('directory')) {
          if(!mainParentElement.classList.contains("sharedWithMe")){
            this.StorageService.addDirDiv(mainParentElement.textContent as string,mainParentElement.getAttribute('_id') as string)


            setTimeout(()=>{
              const divDir =
                this.HTMLElementsService.dirDivsRefs.last ||
                this.HTMLElementsService.dirDivsRefs.first;
              if (divDir) {
                const index = this.HTMLElementsService.dirDivsRefs.toArray().indexOf(divDir)
                this.StorageService.addEventListenerToDivDir(
                  divDir,
                  index,
                  this.CacheService.dirs,
                  this.renderer,
                  this.router
                );
              }

            },0)
          }

            const id = mainParentElement.getAttribute('_id')
            this.RouterService.navigate("storage","storage-outlet",id!)

        } else if (mainParentElement.classList.contains('file')) {
          this.StorageService.getElementDownload(mainParentElement.getAttribute("_id") as string,true)
        }
      }

    }
  }
}

