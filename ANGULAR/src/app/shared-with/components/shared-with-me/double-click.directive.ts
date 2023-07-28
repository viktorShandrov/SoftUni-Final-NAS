import {
  Directive,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storage/storage.service';
import { SharedWithService } from '../../services/shared-with.service';

@Directive({
  selector: '[appSharedFolderDoubleClick]',
})
export class DoubleClickDirective {
  clicks: number;
  DOUBLE_CLICK_THRESHOLD: number = 300;
  constructor(
    private router: Router,
    private StorageService: StorageService,
    private SharedWithService: SharedWithService,
    private renderer: Renderer2
  ) {
    this.clicks = 0;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log(3);

    this.clicks++;
    const element = event.target as HTMLElement;

    const parentElement = element.parentElement as HTMLElement;

    const parentParentElement = (element.parentElement as HTMLElement)
      .parentElement as HTMLElement;
    if (this.clicks === 1) {
      setTimeout(() => {
        this.clicks = 0;
      }, this.DOUBLE_CLICK_THRESHOLD);

      this.renderer.setStyle(
        this.StorageService.rightClickMenu.nativeElement,
        'display',
        'none'
      );
      this.renderer.setStyle(
        this.StorageService.createFolderOrFileMenu.nativeElement,
        'display',
        'none'
      );
      this.renderer.setStyle(
        this.StorageService.shareContainer.nativeElement,
        'display',
        'none'
      );
    } else if (this.clicks === 2) {
      if (parentElement.classList.contains('directory')) {
        this.SharedWithService.getFilesFromSharedFolder(
          parentElement.getAttribute('_id')!
        ).subscribe(
          (files: any) => {
            this.renderer.setStyle(this.SharedWithService.backBtn.nativeElement,"display","block")

            this.SharedWithService.folders.splice(0);
            this.SharedWithService.files = files;
          },
          (err) => {}
        );
      }else if (parentElement.classList.contains('file')) {

        this.StorageService.getFileDownload(parentElement.getAttribute("_id") as string)
      }
    }
  }
}
