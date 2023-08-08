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

import { Location } from '@angular/common';

import {last, Observable, Observer} from 'rxjs';


import {StorageContentComponent} from "../storage-content/storage-content.component";
import {StorageService} from "../../../services/storage.service";
import {enviroments} from "../../../../../shared/environments";
import {HeaderService} from "../../../../../core/services/header.service";
import {SharedWithService} from "../../../services/shared-with.service";
import {DarkModeService} from "../../../../../core/services/dark-mode.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {UserService} from "../../../../../core/services/user.service";
import {constants} from "../../../../../shared/constants";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {RouterService} from "../../../../../core/router/router.service";
import {HttpService} from "../../../../../shared/services/http.service";


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
  @ViewChild('backBtn') backBtn!: ElementRef;
  @ViewChild('sortBtn') sortBtn!: ElementRef;
  @ViewChild('toggleViewBtn') toggleViewBtn!: ElementRef;

  dirs!: Dirs[];
  completions!: Completions[] ;
  rootId!: String;


  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private StorageService: StorageService,
    private HeaderService: HeaderService,
    private SharedWithService: SharedWithService,
    private CacheService: CacheService,
    private DarkModeService: DarkModeService,
    private UserService: UserService,
    private HttpService: HttpService,
    private HTMLElementsService: HTMLElementsService,

    private location: Location
  ) {
  }

  backBtnOnClick() {
    const lastDir = this.CacheService.dirs.splice(-1, 1)
    const dirIndex = this.CacheService.dirs.length - 1
    if (dirIndex == -1) {
      this.router.navigate(['/storage', {outlets: {'storage-outlet': this.UserService.rootId}}]);
    } else {
      const newLastDir = this.CacheService.dirs[dirIndex]
      this.router.navigate(['/storage', {outlets: {'storage-outlet': newLastDir._id}}]);
    }
  }

  sortFilesAndFolders(i: HTMLElement) {
    const currentIElementClass = i.classList.item(1)
    if (currentIElementClass === "fa-arrow-down-z-a") {
      //sort z-a
      i.classList.replace("fa-arrow-down-z-a", "fa-arrow-down-a-z")
      this.CacheService.files.sort((a, b) => b.fileName.toString().localeCompare(a.fileName.toString()))
      this.CacheService.folders.sort((a, b) => b.name.toString().localeCompare(a.name.toString()))
    } else if (currentIElementClass === "fa-arrow-down-a-z") {
      //sort a-z
      i.classList.replace("fa-arrow-down-a-z", "fa-arrow-down-z-a")
      this.CacheService.files.sort((a, b) => a.fileName.toString().localeCompare(b.fileName.toString()))
      this.CacheService.folders.sort((a, b) => a.name.toString().localeCompare(b.name.toString()))
    }
  }

  toggleViewStructure(i: HTMLElement) {
    const currentIElementClass = i.classList.item(1)
    if (currentIElementClass === "fa-table-cells") {
      //it switches to cell view
      i.classList.replace("fa-table-cells", "fa-table-list")
      enviroments.storageViewCellStructure = true
    } else if (currentIElementClass === "fa-table-list") {
      //it switches to list view
      i.classList.replace("fa-table-list", "fa-table-cells")
      enviroments.storageViewCellStructure = false
    }

  }

  ngAfterViewInit() {
    this.HTMLElementsService.urlBar = this.urlBarInput.nativeElement
    this.HTMLElementsService.searchCompletion = this.searchCompletion
    this.HTMLElementsService.completionDivsRefs =this.completionDivsRefs
    setTimeout(()=>{
    this.StorageService.addEventListenerToTheMainRootBtn(
        this.mainRootBtn,
        this.CacheService.dirs,
        this.HTMLElementsService.Renderer2,
        this.router
      )

    },0)
//
//     let urlTarget = "storage"
//     const rootId = localStorage.getItem("rootId")
//     if(rootId){
//       this.UserService.rootId=rootId
//     }
//     // setTimeout(() => {
//     //   this.StorageService.observer.next("storage")
//     // }, 0);
    this.dirs = this.CacheService.dirs;
    this.completions = this.CacheService.completions;
    this.HTMLElementsService.dirDivsRefs = this.dirDivsRefs;
    this.rootId = this.UserService.rootId;
    this.DarkModeService.toggleDarkMode(this.renderer)

    this.HttpService.httpGETRequest(`api/files/${enviroments.currentFolder}/getAllParentAutorisedFolders`).subscribe(
      (folders) => {
        this.CacheService.dirs.splice(0);
        for (const folder of Object.values(folders)) {
          this.CacheService.dirs.push(folder);
        }

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
        // this.StorageService.dirs = Object.values(folders).slice(0) as Dirs[];
        //TODO=> I dont know why this should be here:
        // this.dirs = this.StorageService.dirs;
        //

      });

    this.StorageService.getRootInfoForUpdatingHeaderStorageInfo()


  }
//         }else if(match[1]==="dashboard"){
//
//           urlTarget="dashboard"
//           setTimeout(()=>{
//             this.StorageService.sharingCurrentSection$.next("dashboard")
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
//           },1)
//           this.StorageService.getRootInfoForUpdatingHeaderStorageInfo()
//         }else if(match[1]==="sharedWithMe"){
//           // this.router.navigate(['/storage', { outlets: { 'storage-router-outlet': 'dashboard' } }]);
//           urlTarget="shared-with-me-page"
//           setTimeout(()=>{
//
//             this.StorageService.sharingCurrentSection$.next("sharedWithMe")
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//           },0)
//           this.StorageService.getRootInfoForUpdatingHeaderStorageInfo()
//         }else if(match[1]==="sharedWithUsers"){
//           // this.router.navigate(['/storage', { outlets: { 'storage-router-outlet': 'dashboard' } }]);
//           urlTarget="shared-with-users"
//           setTimeout(()=>{
//             this.StorageService.sharingCurrentSection$.next("sharedWithUsers")
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//           },0)
//           this.StorageService.getRootInfoForUpdatingHeaderStorageInfo()
//
//         }
//       }
//     }
//
//
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         const regex = /storage-router-outlet:(\w+)/;
//         const match = event.url.match(regex);
//         if (match && match.length > 1) {
//           const rootId = localStorage.getItem("rootId")
//           if(rootId){
//             this.StorageService.rootId=rootId
//           }
//           if(match[1]!=="dashboard"&&match[1]!=="sharedWithMe"&&match[1]!=="sharedWithUsers"){
//             urlTarget = "storage"
//             setTimeout(() => {
//               this.StorageService.currentFolder = match[1]
//               this.StorageService.sharingCurrentSection$.next("storage")
//               this.StorageService.addEventListenersToCompletionElements(
//                 this.completionDivsRefs,
//                 this.dirs,
//                 this.dirDivsRefs,
//                 this.StorageService.addEventListenerToDivDir,
//                 this.renderer,
//                 this.router
//               );
//             }, 0);
//
//           }else if (match[1]==="dashboard"){
//             setTimeout(() => {
//               const rootId = localStorage.getItem("rootId")
//               if(rootId){
//                 this.StorageService.rootId=rootId
//               }
//               this.StorageService.sharingCurrentSection$.next("dashboard")
//             }, 0);
//             urlTarget = "dashboard"
//           }else if (match[1]==="sharedWithMe"){
//             setTimeout(() => {
//               const rootId = localStorage.getItem("rootId")
//               if(rootId){
//                 this.StorageService.rootId=rootId
//               }
//               this.StorageService.sharingCurrentSection$.next("sharedWithMe")
//             }, 0);
//             urlTarget = "sharedWithMe"
//
//
//           }else if (match[1]==="sharedWithUsers"){
//             setTimeout(() => {
//               const rootId = localStorage.getItem("rootId")
//               if(rootId){
//                 this.StorageService.rootId=rootId
//               }
//               this.StorageService.sharingCurrentSection$.next("sharedWithUsers")
//             }, 0);
//             urlTarget = "sharedWithUsers"
//           }
//         }
//
//
//         if(urlTarget==="storage"){
//           setTimeout(() => {
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","block")
//
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//
//           }, 0);
//           const urlBar = this.urlBarInput.nativeElement;
//           const searchCompletion = this.searchCompletion.nativeElement;
//
//           this.StorageService.addEventListenersToCompletionSection(
//             urlBar,
//             searchCompletion,
//             this.renderer
//           );
//
//           this.completions = this.StorageService.completions;
//           setTimeout(() => {
//             this.StorageService.addEventListenerToTheMainRootBtn(
//               this.mainRootBtn,
//               this.dirs,
//               this.renderer,
//               this.router
//             );
//             this.StorageService.addEventListenersToCompletionElements(
//               this.completionDivsRefs,
//               this.dirs,
//               this.dirDivsRefs,
//               this.StorageService.addEventListenerToDivDir,
//               this.renderer,
//               this.router
//             );
//           }, 100);
//
//         }else if(urlTarget ==="dashboard"){
//           setTimeout(() => {
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
//           }, 0);
//         }else if(urlTarget ==="sharedWithMe"){
//           setTimeout(() => {
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","block")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//           }, 0);
//         }else if(urlTarget ==="sharedWithUsers"){
//           setTimeout(() => {
//             this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//             this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","block")
//             this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//           }, 0);
//         }
//       }
//     });
//
//     if(urlTarget==="storage"){
//       setTimeout(() => {
//         console.log(2);
//
//         this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","block")
//         this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","none")
//
//       }, 0);
//       const urlBar = this.urlBarInput.nativeElement;
//       const searchCompletion = this.searchCompletion.nativeElement;
//
//       this.StorageService.addEventListenersToCompletionSection(
//         urlBar,
//         searchCompletion,
//         this.renderer
//       );
//
//       this.completions = this.StorageService.completions;
//       setTimeout(() => {
//         this.StorageService.addEventListenerToTheMainRootBtn(
//           this.mainRootBtn,
//           this.dirs,
//           this.renderer,
//           this.router
//         );
//         this.StorageService.addEventListenersToCompletionElements(
//           this.completionDivsRefs,
//           this.dirs,
//           this.dirDivsRefs,
//           this.StorageService.addEventListenerToDivDir,
//           this.renderer,
//           this.router
//         );
//       }, 100);
//
//     }else if(urlTarget ==="dashboard"){
//       setTimeout(() => {
//         this.renderer.setStyle(this.StorageService.wholeStorage.nativeElement,"display","none")
//         this.renderer.setStyle(this.StorageService.sharedWithMe.nativeElement,"display","none")
//         this.renderer.setStyle(this.StorageService.sharedWithUsers.nativeElement,"display","none")
//         this.renderer.setStyle(this.StorageService.dashboard.nativeElement,"display","block")
//       }, 0);
//     }
//   }
// }
}