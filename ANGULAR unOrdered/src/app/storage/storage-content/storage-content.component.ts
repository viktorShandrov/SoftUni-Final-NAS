import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { file, folder } from 'src/app/shared/types';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-storage-content',
  templateUrl: './storage-content.component.html',
  styleUrls: ['./storage-content.component.css'],
})
export class StorageContentComponent implements AfterViewInit {
  folders!: folder[];
  files!: file[];
  haveFolder: Boolean = false;

  isLoading:boolean=true

  @ViewChildren('folderElement') foldersRef!: QueryList<ElementRef>;
  @ViewChildren('fileElement') filesRef!: QueryList<ElementRef>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public StorageService: StorageService,
    private renderer: Renderer2
  ) {
  }


  ngAfterViewInit(): void {

    this.folders =this.StorageService.folders;
    this.files = this.StorageService.files;

    this.StorageService.foldersQL = this.foldersRef
    this.StorageService.filesQL = this.filesRef

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') as String;
      if(id!=="dashboard"&&id!=="sharedWithMe"&&id!=="sharedWithUsers"){
        this.getData(id);
        this.isLoading = true
      }
    });
  }

  getData(dirId: String) {
    this.http
      .get(`api/files/${dirId}/getDirectory`)
      .subscribe((folder: any) => {
        this.isLoading = false

        if (folder) {
          this.haveFolder = true;
          this.StorageService.completions.splice(0);
          this.folders.splice(0);
          this.files.splice(0);
          for (const dirComponent of folder.dirComponents) {
            console.log(dirComponent)
            this.folders.push(dirComponent);
            this.StorageService.completions.push({
              name: dirComponent.name,
              _id: dirComponent._id,
            });
          }
          for (const fileComponent of folder.fileComponents) {
            this.files.push(fileComponent);
          }

          setTimeout(() => {
            this.addEventListenerOnFilesAndFoldersToBeClickable(
              this.foldersRef,
              this.filesRef
            );
          }, 0);
        }
      });
  }
  addEventListenerOnFilesAndFoldersToBeClickable(
    folders: QueryList<ElementRef>,
    files: QueryList<ElementRef>
  ) {
    if (folders) {
      for (const folderElement of folders) {
        this.renderer.listen(folderElement.nativeElement, 'click', () => {
          for (const folder of folders) {
            this.renderer.removeStyle(folder.nativeElement, 'background-color');
          }
          for (const file of files) {
            this.renderer.removeStyle(file?.nativeElement, 'background-color');
          }
          this.renderer.setStyle(
            folderElement.nativeElement,
            'background-color',
            '#0f7bc1'
          );
        });
      }
    }
    if (files) {
      for (const fileElement of files) {
        this.renderer.listen(fileElement.nativeElement, 'click', () => {
          for (const folder of folders) {
            this.renderer.removeStyle(
              folder?.nativeElement,
              'background-color'
            );
          }
          for (const file of files) {
            this.renderer.removeStyle(file.nativeElement, 'background-color');
          }
          this.renderer.setStyle(
            fileElement.nativeElement,
            'background-color',
            '#0f7bc1'
          );
        });
      }
    }
  }
}
