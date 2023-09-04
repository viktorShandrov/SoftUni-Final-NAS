import {
  Directive,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import {StorageService} from "../services/storage.service";
import {SharedWithService} from "../services/shared-with.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {PopupService} from "../../../shared/services/popup.service";

@Directive({
  selector: '[appSharedFolderDoubleClick]',
})
export class SharedFolderDoubleClickDirective {
  clicks: number;
  DOUBLE_CLICK_THRESHOLD: number = 300;
  constructor(
    private router: Router,
    private StorageService: StorageService,
    private SharedWithService: SharedWithService,
    private HTMLElementsService: HTMLElementsService,
    private PopupService: PopupService,
    private renderer: Renderer2
  ) {
    this.clicks = 0;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // console.log(3);
    //
    // this.clicks++;
    // const element = event.target as HTMLElement;
    //
    // const parentElement = element.parentElement as HTMLElement;
    //
    // const parentParentElement = (element.parentElement as HTMLElement)
    //   .parentElement as HTMLElement;
    // if (this.clicks === 1) {
    //   setTimeout(() => {
    //     this.clicks = 0;
    //   }, this.DOUBLE_CLICK_THRESHOLD);
    //
    //   // this.PopupService.hideAllOtherMenus()
    //
    // } else if (this.clicks === 2) {
    //   if (parentElement.classList.contains('directory')) {
    //     this.router.navigate(['/storage', { outlets: { 'storage-outlet': `shared-with-me/${parentElement.getAttribute('_id')!}` } }])
    //
    //   }else if (parentElement.classList.contains('file')) {
    //
    //     this.StorageService.getElementDownload(parentElement.getAttribute("_id") as string)
    //   }
    // }
  }
}
