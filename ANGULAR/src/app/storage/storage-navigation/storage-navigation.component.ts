import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dirs, Completions } from 'src/app/shared/types';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage.service';
import { enviroments } from 'src/app/shared/enviroment';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/core/header/header.service';

@Component({
  selector: 'app-storage-navigation',
  templateUrl: './storage-navigation.component.html',
  styleUrls: ['./storage-navigation.component.css'],
})
export class StorageNavigationComponent implements AfterViewInit {
  @ViewChild('urlBarInput') urlBarInput!: ElementRef;
  @ViewChild('searchCompletion') searchCompletion!: ElementRef;
  @ViewChildren('completionDiv') completionDivsRefs!: QueryList<ElementRef>;
  @ViewChildren('dirDiv') dirDivsRefs!: QueryList<ElementRef>;
  @ViewChild('mainRootBtn') mainRootBtn!: ElementRef;

  dirs!: Dirs[];
  completions!: Completions[];
  rootId!: String;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private StorageService: StorageService,
    private HeaderService: HeaderService,
    private location: Location
    ) {}
    
    ngAfterViewInit() {
      this.dirs = this.StorageService.dirs;
      this.StorageService.dirDivsRefs = this.dirDivsRefs;
      this.rootId = this.StorageService.rootId;
    if (enviroments.initialLoad) {
      console.log('initialLoad');
      const fullUrl = window.location.href;
      const regex = /storage-router-outlet:(\w+)/;
      const match = fullUrl.match(regex);
      if (match && match.length > 1) {
        const folderId = match[1];
        this.StorageService.currentFolder = folderId;
        this.http
          .get(`api/files/${folderId}/getAllParentAutorisedFolders`)
          .subscribe((folders) => {
            this.StorageService.dirs.splice(0);
            for (const folder of Object.values(folders)) {
              this.StorageService.dirs.push(folder);
            }

            // this.StorageService.dirs = Object.values(folders).slice(0) as Dirs[];
            //TODO=> I dont know why this should be here:
            // this.dirs = this.StorageService.dirs;
            //

            setTimeout(() => {
              for (const dirDivRef of this.dirDivsRefs.toArray()) {
                this.StorageService.addEventListenerToDivDir(
                  dirDivRef,
                  this.dirs,
                  this.renderer,
                  this.router
                );
              }
            }, 0);
          });



          this.http
          .get(`api/files/${this.rootId}/getOnlyRootInfo`)
          .subscribe((response:any) => {
            const {folder} = response
            this.HeaderService.updateUsedStorage(folder.storageVolume,folder.usedStorage)
          },
          (error)=>{
            console.log(error.error.message);
            
          })
        enviroments.initialLoad = false;
      }
    }


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.StorageService.addEventListenersToCompletionElements(
            this.completionDivsRefs,
            this.dirs,
            this.dirDivsRefs,
            this.StorageService.addEventListenerToDivDir,
            this.renderer,
            this.router
          );
        }, 100);
      }
    });

    const urlBar = this.urlBarInput.nativeElement;
    const searchCompletion = this.searchCompletion.nativeElement;

    this.StorageService.addEventListenersToCompletionSection(
      urlBar,
      searchCompletion,
      this.renderer
    );

    this.completions = this.StorageService.completions;
    setTimeout(() => {
      this.StorageService.addEventListenerToTheMainRootBtn(
        this.mainRootBtn,
        this.dirs,
        this.renderer,
        this.router
      );
      this.StorageService.addEventListenersToCompletionElements(
        this.completionDivsRefs,
        this.dirs,
        this.dirDivsRefs,
        this.StorageService.addEventListenerToDivDir,
        this.renderer,
        this.router
      );
    }, 100);
  }
}
