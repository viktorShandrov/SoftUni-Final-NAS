import {AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {file, folder} from "../../../../../shared/types";
import {StorageService} from "../../../services/storage.service";
import {HeaderService} from "../../../../../core/services/header.service";

@Component({
  selector: 'app-file-or-folder-details-aside',
  templateUrl: './file-or-folder-details-aside.component.html',
  styleUrls: ['./file-or-folder-details-aside.component.css']
})
export class FileOrFolderDetailsAsideComponent implements AfterViewInit{

  @ViewChildren("userIcon") userIconsRefs!:QueryList<ElementRef>
  constructor(
    private renderer: Renderer2,
    private HTMLElementsService: HTMLElementsService,

    public HeaderService: HeaderService,
    public CacheService: CacheService,
    public StorageService: StorageService,
    private element: ElementRef
  ) {
    this.HTMLElementsService.FileOrFolderDetailsAsideComponent = this.element
    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.element.nativeElement, 'background-color', '#ffffff');
    this.renderer.setStyle(this.element.nativeElement, 'height', '100%');
    this.renderer.setStyle(this.element.nativeElement, 'padding', '20px');

  }

  ngAfterViewInit(){
    this.HTMLElementsService.userIconsRefs = this.userIconsRefs
  }
}
