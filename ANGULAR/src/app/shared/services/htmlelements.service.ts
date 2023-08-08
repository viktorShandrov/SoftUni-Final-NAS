import {ElementRef, Injectable, QueryList,Renderer2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HTMLElementsService {


  dirDivsRefs!: QueryList<ElementRef>;
  completionDivsRefs!: QueryList<ElementRef>;
  rightClickMenu!: ElementRef;
  popupAddFile!: ElementRef;
  backBtn!: ElementRef;
  popupAddFolder!: ElementRef;
  createFolderOrFileMenu!: ElementRef;
  wholeStorage!: ElementRef;
  searchCompletion!: ElementRef;
  dashboard!: ElementRef;
  sharedWithMe!: ElementRef;
  sharedWithUsers!: ElementRef;
  urlBar!: ElementRef;
  shareContainer!: ElementRef;
  foldersQL!:QueryList<ElementRef>
  filesQL!:QueryList<ElementRef>
  Renderer2!:Renderer2

  constructor() { }
}
