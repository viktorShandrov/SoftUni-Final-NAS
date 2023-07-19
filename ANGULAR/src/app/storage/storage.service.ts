import { ElementRef, Injectable, QueryList, Renderer2 } from '@angular/core';
import { Completions, Dirs, file, folder } from '../shared/types';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopupService } from '../shared/popup/popup.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  currentFolder: string;
  rootId: string;
  completions!: Completions[];
  dirs!: Dirs[];
  dirDivsRefs!: QueryList<ElementRef>;
  rightClickMenu!: ElementRef;
  createFolderOrFileMenu!: ElementRef;

  files: file[] = [];
  folders: folder[] = [];
  constructor(private router: Router, private http: HttpClient,private PopupService:PopupService) {
    this.completions = [];
    this.dirs = [];
    this.currentFolder = '';
    this.rootId = '64b28bab92d52538ca4449c2';
  }

  createFolder(folderName: string) {
    const payload = {
      folderName,
      parentFolderId: this.currentFolder,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http
      .post('api/files/createFolder', JSON.stringify(payload), { headers })
      .subscribe(
        (response: any) => {
          const newFolder: folder = response.newFolder;
          this.folders.push(newFolder);
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
    this.http.get(`api/files/${fileId}/getFileInfo`).subscribe((file: any) => {
      this.http
        .get(`api/files/${fileId}/download`, options)
        .subscribe((response: any) => {
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
        { outlets: { 'storage-router-outlet': id } },
      ]);
    });
  }

  addEventListenersToCompletionSection(
    urlBar: ElementRef,
    searchCompletion: ElementRef,
    renderer: Renderer2
  ) {
    renderer.listen(urlBar, 'focus', (event: any) => {
      renderer.setStyle(searchCompletion, 'display', 'block');
    });
    renderer.listen(urlBar, 'blur', (event: any) => {
      setTimeout(() => {
        renderer.setStyle(searchCompletion, 'display', 'none');
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
      console.log('rootBtn.nativeElement: ', rootBtn.nativeElement);
      dirs.splice(0);
      router.navigate([
        '/storage',
        {
          outlets: {
            'storage-router-outlet': rootBtn.nativeElement.getAttribute('id'),
          },
        },
      ]);
    });
  }

  deleteItem(menu: HTMLDivElement) {
    const payload = {
      elementId: menu.getAttribute('element-id'),
      elementType: menu.getAttribute('element-type'),
      parentFolderId: this.currentFolder,
    };
    this.http.post('api/files/deleteItem', payload).subscribe(
      (response) => {
        console.log(response);
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
    this.http.get('api/files/');
  }

  addEventListenersToCompletionElements(
    completionDivs: QueryList<ElementRef>,
    dirs: Dirs[],
    dirDivsRefs: QueryList<ElementRef>,
    addEventListenerToDivDir: Function,
    renderer: Renderer2,
    router: Router
  ) {
    for (const div of completionDivs) {
      renderer.listen(div.nativeElement, 'click', (e: any) => {
        const id = div.nativeElement.getAttribute('id');
        dirs.push({ name: div.nativeElement.textContent, _id: id });
        router.navigate([
          '/storage',
          { outlets: { 'storage-router-outlet': id } },
        ]);
        const divDir = dirDivsRefs.last;
        if (divDir) {
          addEventListenerToDivDir(divDir, dirs, renderer, router);
        }
      });
    }
  }
}
