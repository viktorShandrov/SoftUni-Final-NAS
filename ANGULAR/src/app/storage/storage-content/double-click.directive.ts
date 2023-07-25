import {
  Directive,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Directive({
  selector: '[appFolderDoubleClick]',
})
export class DoubleClickDirective {
  clicks: number;
  DOUBLE_CLICK_THRESHOLD: number = 300;
  constructor(
    private router: Router,
    private StorageService: StorageService,
    private renderer: Renderer2
  ) {
    this.clicks = 0;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.clicks++;
    const element = event.target as HTMLElement;

    const parentElement = element.parentElement as HTMLElement;

    const parentParentElement = (element.parentElement as HTMLElement)
      .parentElement as HTMLElement;
    if (this.clicks === 1) {
      setTimeout(() => {
        this.clicks = 0;
      }, this.DOUBLE_CLICK_THRESHOLD);

      this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","none")
      this.renderer.setStyle(this.StorageService.createFolderOrFileMenu.nativeElement,"display","none")
      this.renderer.setStyle(this.StorageService.shareContainer.nativeElement,"display","none")

      


        parentElement.addEventListener("contextmenu",(e)=>{
          e.preventDefault()
          const x = e.clientX
          const y = e.clientY
          this.renderer.setAttribute(this.StorageService.rightClickMenu.nativeElement,"element-type",parentElement.classList[0])
          this.renderer.setAttribute(this.StorageService.rightClickMenu.nativeElement,"element-id",parentElement.getAttribute("_id")!)
          this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"display","flex")
          this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"top",y+"px")
          this.renderer.setStyle(this.StorageService.rightClickMenu.nativeElement,"left",x+"px")
        })

    } else if (this.clicks === 2) {
      if (parentElement.classList.contains('directory')) {
        if (!parentParentElement.classList.contains('storage')) {
          this.StorageService.dirs.push({
            name: parentParentElement.textContent as string,
            _id: parentElement.getAttribute('_id') as string,
          });
          const divDir =
            this.StorageService.dirDivsRefs.last ||
            this.StorageService.dirDivsRefs.first;
          if (divDir) {
            this.StorageService.addEventListenerToDivDir(
              divDir,
              this.StorageService.dirs,
              this.renderer,
              this.router
            );
          }
          this.router.navigate([
            'storage',
            {
              outlets: {
                'storage-router-outlet': parentElement.getAttribute('_id'),
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
