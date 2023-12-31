import {ElementRef, Injectable, QueryList,Renderer2} from '@angular/core';
import {
  FileOrFolderDetailsAsideComponent
} from "../../features/private/components/storage/file-or-folder-details-aside/file-or-folder-details-aside.component";

@Injectable({
  providedIn: 'root'
})
export class HTMLElementsService {


  dirDivsRefs!: QueryList<ElementRef>;
  completionDivsRefs!: QueryList<ElementRef>;
  userIconsRefs!: QueryList<ElementRef>;
  menuToggles: ElementRef[] =[];
  folderCells!: QueryList<ElementRef>;
  fileCells!: QueryList<ElementRef>;
  rightClickMenu!: ElementRef;
  menus: ElementRef[] =[];
  userMenu!: ElementRef;
  notificationSection!: ElementRef;
  dashboardStorageProgressBar!: ElementRef;
  FileOrFolderDetailsAsideComponent!: ElementRef;
  divDirContainer!: ElementRef;
  usedStorageBar!: ElementRef;
  popupAddFile!: ElementRef;
  storageUsed!: ElementRef;
  backBtn!: ElementRef;
  storageLeft!: ElementRef;
  popupAddFolder!: ElementRef;
  createFolderOrFileMenu!: ElementRef;
  wholeStorage!: ElementRef;
  searchCompletion!: ElementRef;
  dashboard!: ElementRef;
  url!: ElementRef;
  sharedWithMe!: ElementRef;
  sharedWithUsers!: ElementRef;
  urlBar!: ElementRef;
  shareContainer!: ElementRef;
  foldersQL!:QueryList<ElementRef>
  filesQL!:QueryList<ElementRef>
  Renderer2!:Renderer2

  constructor() { }
}
