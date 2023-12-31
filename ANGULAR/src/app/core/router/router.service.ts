import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter, take } from "rxjs/operators";
import {UserService} from "../services/user.service";
import {enviroments} from "../../shared/environments";
import {StorageService} from "../../features/private/services/storage.service";
import {HTMLElementsService} from "../../shared/services/htmlelements.service";
import {CacheService} from "../../shared/services/cache.service";
import {DashboardService} from "../../features/private/services/dashboard.service";
import {HttpService} from "../../shared/services/http.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../shared/constants";
import {HeaderService} from "../services/header.service";

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private UserService: UserService,
    private StorageService: StorageService,
    private DashboardService: DashboardService,

    private HTMLElementsService: HTMLElementsService,
    private HeaderService: HeaderService,
    private ToastrService: ToastrService,
    private HttpService: HttpService,

    private CacheService: CacheService,

  ) {

  }
  saveRootId(){
    const rootId = localStorage.getItem("rootId")
    if(rootId){
      this.UserService.rootId=rootId
    }
  }
  saveEmailId(){
    const email = localStorage.getItem("email")
    if(email){
      this.UserService.email=email
    }
  }

  navigate(section:string,outlet:string,idOrSection:string){
    this.router.navigate([
      section,
      {
        outlets: {
          [outlet]: idOrSection,
        },
      },
    ]);
  }


   detectInitialNavigation() {

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),

    ).subscribe(async (event: any) => {
      const fullUrl = window.location.href;
      const regex = /storage-outlet:([\w-]+)/;
      const match = fullUrl.match(regex);

      if(event.id==1&&match){
        console.log("Initial load:")
        this.saveRootId()
        this.saveEmailId()
        this.StorageService.getRootInfoForUpdatingHeaderStorageInfo()
        this.HeaderService.checkForNeNotifications()
      }else if(fullUrl.includes("admin")) {
        this.saveRootId()
      }else{
        this.saveRootId()
      }



      if(match&&match.length>1) {
        setTimeout(()=>{
          this.StorageService.hideFileOrFolderDetailsSection()
        },0)
        if (match[1] !== "dashboard" && match[1] !== "shared-with-me" && match[1] !== "shared-with-users") {
          //its storage
          const folderId = match[1];
          enviroments.currentFolder = folderId;
          // this.StorageService.hasFiles = false
          // this.StorageService.hasFolders = false
          setTimeout(() => {
            this.StorageService.addEventListenersToCompletionSection(
              this.HTMLElementsService.urlBar,
              this.HTMLElementsService.searchCompletion,
              this.HTMLElementsService.Renderer2
            );
            this.HTMLElementsService.completionDivsRefs.changes.pipe(take(1)).subscribe(
              (completionDivsRefs) => {
                this.StorageService.addEventListenersToCompletionElements(
                  this.HTMLElementsService.completionDivsRefs,
                  this.router
                )

              }
            )
          }, 20)
          setTimeout(()=>{
              this.StorageService.setCrossMarkProperlyOnFoldersAndFiles()
          },200)
        }
      }

    });
  }
}
