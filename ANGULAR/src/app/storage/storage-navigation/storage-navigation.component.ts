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
import { Observable, Observer } from 'rxjs';

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
      let urlTarget = "storage"
      const rootId = localStorage.getItem("rootId")
      if(rootId){
        this.StorageService.rootId=rootId
      }
      setTimeout(() => {
        this.StorageService.observer.next("storage")
      }, 0);
      this.dirs = this.StorageService.dirs;
      this.StorageService.dirDivsRefs = this.dirDivsRefs;
      this.rootId = this.StorageService.rootId;
    if (enviroments.initialLoad) {
      console.log('initialLoad');
      const fullUrl = window.location.href;
      const regex = /storage-router-outlet:(\w+)/;
      const match = fullUrl.match(regex);
      if (match && match.length > 1) {

        if(match[1]!=="dashboard"){
          setTimeout(() => {
            this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","block")
            this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
            this.StorageService.observer.next("storage")
            urlTarget="storage"
          
          }, 0);
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
      }else if(match[1]==="dashboard"){
        setTimeout(()=>{
          this.StorageService.observer.next("dashboard")
          urlTarget="dashboard"
          this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
          this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
         

        },0)
      }
    }
    }


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const regex = /storage-router-outlet:(\w+)/;
        const match = event.url.match(regex);
        if (match && match.length > 1) {
          const rootId = localStorage.getItem("rootId")
          if(rootId){
            this.StorageService.rootId=rootId
          }
          if(match[1]!=="dashboard"){
            urlTarget = "storage"
            setTimeout(() => {
              this.StorageService.currentFolder = match[1]
              this.StorageService.observer.next("storage")
              this.StorageService.addEventListenersToCompletionElements(
                this.completionDivsRefs,
                this.dirs,
                this.dirDivsRefs,
                this.StorageService.addEventListenerToDivDir,
                this.renderer,
                this.router
              );
            }, 100);

          }else{
            setTimeout(() => {
              const rootId = localStorage.getItem("rootId")
              if(rootId){
                this.StorageService.rootId=rootId
              }
            this.StorageService.observer.next("dashboard")
            
          }, 0);
          urlTarget = "dashboard"
          }
        }
        console.log('urlTarget: ', urlTarget);
        if(urlTarget==="storage"){
          setTimeout(() => {
            this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","block")
            this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
            
          }, 0);
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
    
        }else if(urlTarget ==="dashboard"){
          setTimeout(() => {
            this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
              this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
          }, 0);
        }
      }
    });

    if(urlTarget==="storage"){
      setTimeout(() => {
        this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","block")
        this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
        
      }, 0);
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

    }else if(urlTarget ==="dashboard"){
      setTimeout(() => {
        this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
          this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
      }, 0);
    }
  }
}
