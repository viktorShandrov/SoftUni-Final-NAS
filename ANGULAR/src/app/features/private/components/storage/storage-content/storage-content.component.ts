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
import {StorageService} from "../../../services/storage.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {HttpService} from "../../../../../shared/services/http.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {enviroments} from "../../../../../shared/environments";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-storage-content',
  templateUrl: './storage-content.component.html',
  styleUrls: ['./storage-content.component.css'],
  animations:[
    trigger("crossMarkAnim",[
      state("out",style({width:'0px'})),
      state("in",style({width:'130px'})),
      transition("out => in",animate(500 ))
    ])
  ]
})
export class StorageContentComponent implements AfterViewInit {
  folders!: folder[];
  files!: file[];
  haveFolder: Boolean = false;
  enviroments!:any
  isLoading:boolean=true
  crossMarkState:string = "out"

  @ViewChildren('folderElement') foldersRef!: QueryList<ElementRef>;
  @ViewChildren('fileElement') filesRef!: QueryList<ElementRef>;

  constructor(
    private HttpService: HttpService,
    private route: ActivatedRoute,
    public StorageService: StorageService,
    public CacheService: CacheService,
    public HTMLElementsService: HTMLElementsService,
    private renderer: Renderer2
  ) {
    this.enviroments = enviroments
    setTimeout(()=>{
      this.crossMarkState = "in"
    },2000)
  }


  ngAfterViewInit(): void {

    this.folders =this.CacheService.folders;
    this.files = this.CacheService.files;

    this.HTMLElementsService.foldersQL = this.foldersRef
    this.HTMLElementsService.filesQL = this.filesRef

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') as String;
      if(id!=="dashboard"&&id!=="sharedWithMe"&&id!=="sharedWithUsers"){
        this.getData(id);
        this.isLoading = true
      }
    });
  }

  getData(dirId: String) {
    this.HttpService.httpGETRequest(`api/files/${dirId}/getDirectory`).subscribe(
      (folder: any) => {
        this.isLoading = false

        if (folder) {
          this.haveFolder = true;
          this.CacheService.completions.splice(0);
          this.folders.splice(0);
          this.files.splice(0);
          for (const dirComponent of folder.dirComponents) {

            this.folders.push(dirComponent);
            this.CacheService.completions.push({
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
            '#55beff'
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
            '#55beff'
          );
        });
      }
    }
  }
}
