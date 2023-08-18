import {ElementRef, Injectable, QueryList, Renderer2} from '@angular/core';
import {Dirs, folder} from "../../../shared/types";
import {Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";
import {enviroments} from "../../../shared/environments";
import {HttpService} from "../../../shared/services/http.service";
import {CacheService} from "../../../shared/services/cache.service";
import {UserService} from "../../../core/services/user.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {HeaderService} from "../../../core/services/header.service";
import {PopupService} from "../../../shared/services/popup.service";
import {logMessages} from "@angular-devkit/build-angular/src/tools/esbuild/utils";
import {constants} from "../../../shared/constants";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  hasFolders: Boolean = false ;
  hasFiles: Boolean =false ;

  constructor(
    private HttpService:HttpService,
    private CacheService:CacheService,
    private UserService:UserService,
    private Router:Router,
    private HeaderService:HeaderService,
    private PopupService:PopupService,
    private ToastrService:ToastrService,
    private HTMLElementsService:HTMLElementsService
  ) { }


  createFolder(folderName: string,folders:folder[]) {

    const payload = {
      folderName,
      parentFolderId: enviroments.currentFolder,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.HttpService.httpPOSTRequest("api/files/createFolder",JSON.stringify(payload)).subscribe(
        (response: any) => {
          const newFolder: folder = response.newFolder;
          const newCompletion = {name:newFolder.name as string,_id:newFolder._id as string}
          this.CacheService.completions.push(newCompletion)
          setTimeout(()=>{
            const lastCompletion = this.HTMLElementsService.completionDivsRefs.toArray()[this.HTMLElementsService.completionDivsRefs.length-1]
            this.addEventListenersToSingleCompletionElement(lastCompletion,this.Router)
          },0)
          folders.push(newFolder);
          this.hasFolders = true
          this.PopupService.hidePopup();
          setTimeout(()=>{
            const lastFolder = this.HTMLElementsService.foldersQL.toArray()[this.HTMLElementsService.foldersQL.length-1]
            this.makeFolderOrFileClickableEffect(lastFolder)
          },0)
        },
        (error) => {
          document.querySelector('.errorMessage')!.textContent =
            error.error.message;
        }
      );
  }

  getFileDownload(fileId: string) {
    const options = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json',
    };
    this.HttpService.httpGETRequest(`api/files/${fileId}/getFileInfo`).subscribe(
      (file: any) => {
      this.HttpService.httpGETRequest(`api/files/${fileId}/download`,options).subscribe(
        (response: any) => {
          const blob = new Blob([response], {
            type: 'application/octet-stream',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${file.fileName}.${file.type}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error => {
          this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
        });
    },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      });
  }

  addEventListenerToDivDir(
    divDir: ElementRef,
    dirs: Dirs[],
    renderer: Renderer2,
    router: Router
  ) {
    renderer.listen(divDir.nativeElement, 'click', (e: any) => {
      const id = divDir.nativeElement.getAttribute('id');
      const startIndex = dirs.findIndex((el) => el._id === id);
      dirs.splice(startIndex + 1, dirs.length - startIndex);
      router.navigate([
        '/storage',
        { outlets: { 'storage-outlet': id } },
      ]);
    });
  }

  addEventListenersToCompletionSection(
    urlBar: ElementRef,
    searchCompletion: ElementRef,
    renderer: Renderer2
  ) {

    renderer.listen(urlBar.nativeElement, 'focus', (event: any) => {
      renderer.setStyle(searchCompletion.nativeElement, 'display', 'block');
    });
    renderer.listen(urlBar.nativeElement, 'blur', (event: any) => {
      setTimeout(() => {
        renderer.setStyle(searchCompletion.nativeElement, 'display', 'none');
      }, 100);
    });
  }

  addEventListenerToTheMainRootBtn(
    rootBtn: ElementRef,
    dirs: Dirs[],
    renderer: Renderer2,
    router: Router
  ) {
    renderer.listen(rootBtn.nativeElement, 'click', () => {

      dirs.splice(0);
      router.navigate([
        '/storage',
        {
          outlets: {
            'storage-outlet': rootBtn.nativeElement.getAttribute('id'),
          },
        },
      ]);
    });
  }

  autoriseUserToFolder(folderId:string,email:string){
   return this.HttpService.httpPOSTRequest(`api/files/${folderId}/autoriseUserToFolder`,JSON.stringify({email}))
  }

  spliceFromList(event:any,index:number,elementType:string){

  if (event.toState === 'out') {

    if(elementType==="folder"){
      this.CacheService.folders.splice(
        index,
        1
      );
      if(this.CacheService.folders.length==0){
        this.hasFolders =false
      }
    }else if(elementType==="file"){
      this.CacheService.files.splice(
        index,
        1
      );

      if(this.CacheService.files.length==0){
        this.hasFiles =false
      }
    }
    }

    }

  deleteItem(menu: HTMLDivElement, renderer: Renderer2) {
    const elementId = menu.getAttribute('element-id');
    console.log(elementId)
    const elementType= menu.getAttribute('element-type')
    const payload = {
      elementId,
      elementType,
      parentFolderId: enviroments.currentFolder,
    };
    this.HttpService.httpPOSTRequest('api/files/deleteItem',JSON.stringify(payload)).subscribe(
      (response:any) => {
        renderer.setStyle(this.HTMLElementsService.rightClickMenu.nativeElement, 'display', 'none');

        if(elementType==="directory"){
          const indexInFoldersCache = this.CacheService.folders.findIndex((el) => el._id == elementId)
          const indexInCompletionCache = this.CacheService.completions.findIndex((el) => el._id == elementId)
          this.CacheService.folders[indexInFoldersCache].isDisappearing = true
          this.CacheService.completions.splice(indexInCompletionCache,1)


        }else{
          const index = this.CacheService.files.findIndex((el) => el._id == elementId)
          this.CacheService.files[index].isDisappearing = true



        }
        this.HttpService.httpGETRequest(`api/files/${this.UserService.rootId}/getOnlyRootInfo`).subscribe(
          (response: any) => {
            const { folder } = response;
            this.HeaderService.updateUsedStorage(
              folder.storageVolume,
              folder.usedStorage
            );
          },
          (error) => {
            this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
          }
        );
      },
      (error) => {
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    );
  }
  getDetails(menu: HTMLDivElement) {
    const payload = {
      id: menu.getAttribute('element-id'),
      elementType: menu.getAttribute('element-type'),
    };
    // this.http.get('api/files/');
  }

  addEventListenerOnFilesAndFoldersToBeClickable(
    folders: QueryList<ElementRef>,
    files: QueryList<ElementRef>
  ) {
    if (folders) {
      for (const folderElement of folders) {
        this.makeFolderOrFileClickableEffect(folderElement)
      }
    }
    if (files) {
      for (const fileElement of files) {
        this.makeFolderOrFileClickableEffect(fileElement)
      }
    }
  }

  removeBGOnFoldersAndFiles(
    folders: QueryList<ElementRef>,
    files: QueryList<ElementRef>,
    renderer:Renderer2
  ) {
    if (folders) {
      for (const folderElement of folders) {
        renderer.removeStyle(folderElement.nativeElement, 'background-color');
      }
    }
    if (files) {
      for (const fileElement of files) {
        renderer.removeStyle(
          fileElement?.nativeElement,
          'background-color'
        );

      };
    }
  }


  getRootInfoForUpdatingHeaderStorageInfo() {
    this.HeaderService.isLoading = true
    this.HttpService.httpGETRequest(`api/files/${this.UserService.rootId}/getOnlyRootInfo`).subscribe(
      (response: any) => {
          this.HeaderService.isLoading = false
          const {folder} = response
          this.HeaderService.updateUsedStorage(folder.storageVolume, folder.usedStorage)
        },
        (error) => {
          this.HeaderService.isLoading = false
          this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
          return error
        })
  }

  makeFolderOrFileClickableEffect(element:ElementRef){
    this.HTMLElementsService.Renderer2.listen(element.nativeElement, 'click', () => {
      console.log(1121212)
      if(this.HTMLElementsService.foldersQL.length>0){
        for (const folder of this.HTMLElementsService.foldersQL) {
          this.HTMLElementsService.Renderer2.removeStyle(folder.nativeElement, 'background-color');
        }
      }
      if(this.HTMLElementsService.filesQL.length>0) {
        for (const file of this.HTMLElementsService.filesQL) {
          this.HTMLElementsService.Renderer2.removeStyle(file.nativeElement, 'background-color');
        }
      }
      this.HTMLElementsService.Renderer2.setStyle(
        element.nativeElement,
        'background-color',
        '#55beff'
      );
    });
  }

  hideAllOverflowingCellText(folders:QueryList<ElementRef>,files:QueryList<ElementRef>){
    for (const folder of folders.toArray()) {
      this.HTMLElementsService.Renderer2.removeClass(folder.nativeElement,"allowedTextOverflow")
    }
    for (const file of files.toArray()) {
      this.HTMLElementsService.Renderer2.removeClass(file.nativeElement,"allowedTextOverflow")
    }
  }
  showOverflowingCellText(element:HTMLElement){
    this.HTMLElementsService.Renderer2.addClass(element,"allowedTextOverflow")
  }

  addEventListenersToCompletionElements(
    completionDivs: QueryList<ElementRef>,
    router: Router
  ) {

    for (const div of completionDivs.toArray()) {
      this.addEventListenersToSingleCompletionElement(div,router)
    }
  }

addEventListenersToSingleCompletionElement(element:ElementRef,router:Router){

  this.HTMLElementsService.Renderer2.listen(element.nativeElement, 'click', (e: any) => {
    const id = element.nativeElement.getAttribute('id');
    this.CacheService.dirs.push({ name: element.nativeElement.textContent, _id: id });
    this.Router.navigate([
      '/storage',
      { outlets: { 'storage-outlet': id } },
    ]);

  this.HTMLElementsService.urlBar.nativeElement.value = ""


    const divDir = this.HTMLElementsService.dirDivsRefs.last;
    if (divDir) {
      this.addEventListenerToDivDir(divDir, this.CacheService.dirs, this.HTMLElementsService.Renderer2, router);
    }
  });
}
}
