import {AfterViewInit, Component, ElementRef, Renderer2} from '@angular/core';
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {file, folder} from "../../../../../shared/types";

@Component({
  selector: 'app-file-or-folder-details-aside',
  templateUrl: './file-or-folder-details-aside.component.html',
  styleUrls: ['./file-or-folder-details-aside.component.css']
})
export class FileOrFolderDetailsAsideComponent implements AfterViewInit{

  constructor(
    private renderer: Renderer2,
    private HTMLElementsService: HTMLElementsService,
    public CacheService: CacheService,
    private element: ElementRef
  ) {
    this.HTMLElementsService.FileOrFolderDetailsAsideComponent = this.element
    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.element.nativeElement, 'background-color', '#ffffff');
  }

  ngAfterViewInit(){


  }
}
