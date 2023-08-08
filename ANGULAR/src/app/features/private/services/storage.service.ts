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

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor(
    private HttpService:HttpService,
    private CacheService:CacheService,
    private UserService:UserService,
    private HeaderService:HeaderService,
    private PopupService:PopupService,
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
          folders.push(newFolder);
          this.PopupService.hidePopup();
        },
        (error) => {
          console.log(error);
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
        });
    },
      (error)=>{
        console.log(222)
        console.log(error)
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

    renderer.listen(urlBar, 'focus', (event: any) => {
      renderer.setStyle(searchCompletion.nativeElement, 'display', 'block');
    });
    renderer.listen(urlBar, 'blur', (event: any) => {
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

  spliceFromList(event:any,index:number){

  if (event.toState === 'out') {
    console.log(index)
    this.CacheService.folders.splice(
      index,
      1
    );
    }

    }

  deleteItem(menu: HTMLDivElement, renderer: Renderer2) {
    const elementId = menu.getAttribute('element-id');
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
          const index = this.CacheService.folders.findIndex((el) => el._id == elementId)
          this.CacheService.folders[index].isDisappearing = true


        }else{
          this.CacheService.files.splice(
            this.CacheService.files.findIndex((el) => el._id == elementId),
            1
          );
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
            console.log(error.error.message);
          }
        );
      },
      (error) => {
        console.log(error);
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
          console.log(error.error.message);
          return error
        })
  }



  addEventListenersToCompletionElements(
    completionDivs: QueryList<ElementRef>,
    dirs: Dirs[],
    dirDivsRefs: QueryList<ElementRef>,
    addEventListenerToDivDir: Function,
    renderer: Renderer2,
    router: Router
  ) {
    for (const div of completionDivs.toArray()) {
      renderer.listen(div.nativeElement, 'click', (e: any) => {
        console.log(222)
        const id = div.nativeElement.getAttribute('id');
        dirs.push({ name: div.nativeElement.textContent, _id: id });
        router.navigate([
          '/storage',
          { outlets: { 'storage-outlet': id } },
        ]);
        const divDir = dirDivsRefs.last;
        if (divDir) {
          addEventListenerToDivDir(divDir, dirs, renderer, router);
        }
      });
    }
  }
}
