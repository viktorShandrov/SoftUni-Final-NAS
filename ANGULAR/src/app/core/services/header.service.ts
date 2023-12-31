import {ElementRef, Injectable, Renderer2} from '@angular/core';
import {enviroments} from "../../shared/environments";
import {HTMLElementsService} from "../../shared/services/htmlelements.service";
import {constants} from "../../shared/constants";
import {PopupService} from "../../shared/services/popup.service";
import {HttpService} from "../../shared/services/http.service";
import {ToastrService} from "ngx-toastr";
import {CacheService} from "../../shared/services/cache.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  usedStorage!:number
  totalVolume!:number
  notificationPanelClicks:number = 0
  notificationPanelIsLoading!:boolean
  areThereNewNotifications!:boolean
  usedStoragePercentage!:number

  isLoading!:Boolean
  constructor(
    private HTMLElementsService:HTMLElementsService,
    private HttpService:HttpService,
    private CacheService:CacheService,
    private ToastrService:ToastrService,
    private PopupService:PopupService,
  ) {
    this.usedStorage=0
    this.totalVolume=0
  }

  checkForNeNotifications(){
    this.HttpService.httpGETRequest("api/users/areThereUnSeenNotifications").subscribe(
      (res:any)=>{
        this.areThereNewNotifications = res
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  getUserNotifications(){
    this.notificationPanelIsLoading = true
    this.HttpService.httpGETRequest("api/users/getNotifications",).subscribe(
      (res:any)=>{
        this.CacheService.notifications = res.reverse()
        console.log(this.CacheService.notifications )
        this.notificationPanelIsLoading = false
      },
      (error)=>{
        this.notificationPanelIsLoading = false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

  toggleUserMenu(){
    if(this.HTMLElementsService.userMenu.nativeElement.style.display==="flex"){
      this.hideUserMenu()
    }else{
      this.PopupService.hideAllOtherMenus()
      this.showUserMenu()
    }
  }
  toggleNotificationSection(){
    if(this.HTMLElementsService.notificationSection.nativeElement.style.display==="block"){
      this.hideNotificationSection()
    }else{
      this.PopupService.hideAllOtherMenus()
      this.showNotificationSection()
    }

  }

  showUserMenu(){
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.userMenu.nativeElement,"display","flex")
  }
  showNotificationSection(){
    this.areThereNewNotifications = false
    if( ++this.notificationPanelClicks==1){
      this.getUserNotifications()
    }
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.notificationSection.nativeElement,"display","block")
  }
  hideUserMenu(){
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.userMenu.nativeElement,"display","none")
  }
  hideNotificationSection(){
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.notificationSection.nativeElement,"display","none")
  }

  transformTheHeaderStorageInfoForUpload(selectedFileSizeInMB:number){
    this.toggleStorageInfoHeaderOpacity(true)
    setTimeout(()=>{
    // this.HTMLElementsService.storageLeft.nativeElement.textContent = selectedFileSizeInMB.toFixed(2) + "MB"
    // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageUsed.nativeElement,"background-color",constants.HeaderStorageInfoColorWhenUpload)
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.usedStorageBar.nativeElement,"background-color",constants.HeaderStorageInfoColorWhenUpload)
    // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageLeft.nativeElement,"background-color",constants.HeaderStorageInfoColorWhenUpload)
    this.toggleStorageInfoHeaderOpacity(false)
    },300)
  }
  transformTheHeaderStorageInfoByDefault(){
    this.toggleStorageInfoHeaderOpacity(true)
    setTimeout(()=>{
    // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageUsed.nativeElement,"background-color",constants.HeaderStorageInfoMainColor)
    this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.usedStorageBar.nativeElement,"background-color",constants.HeaderStorageInfoMainColor)
    // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageLeft.nativeElement,"background-color",constants.HeaderStorageInfoMainColor)
    this.toggleStorageInfoHeaderOpacity(false)
    },300)

  }

  updateUploadProgressBar(percent:number){
    this.HTMLElementsService.usedStorageBar.nativeElement.style.width = percent + "%"
    // this.HTMLElementsService.storageUsed.nativeElement.textContent = percent + "%"
  }


  transform(value: number): string {
    let measure = "GB"
    let volume = value/1000000000 //GB
    if(volume<1){
      measure = "MB"
      volume =  volume*1000 //MB
      if(volume<1){
        volume=0
        return `<${volume}${measure}`
      }
    }


    return `${volume.toFixed(2)}${measure}`
  }


  updateUsedStorage(totalVolume:number,usedStorage:number){

    this.usedStorage=usedStorage
    this.totalVolume=totalVolume-usedStorage
    let usedPercentage = (usedStorage / totalVolume) * 100;
    this.usedStoragePercentage = usedPercentage
    // if(usedPercentage<3){
    //   usedPercentage=3
    // }
    this.HTMLElementsService.usedStorageBar.nativeElement.style.width =usedPercentage+"%"
    // this.HTMLElementsService.storageUsed.nativeElement.textContent =this.transform(this.usedStorage)
    // this.HTMLElementsService.storageLeft.nativeElement.textContent = this.transform(this.totalVolume)

  }

  toggleStorageInfoHeaderOpacity(isDisappearing:Boolean){
    if(isDisappearing){
      // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageUsed.nativeElement,"opacity",0)
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.usedStorageBar.nativeElement,"opacity",0)
      // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageLeft.nativeElement,"opacity",0)
    }else{
      // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageUsed.nativeElement,"opacity",1)
      this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.usedStorageBar.nativeElement,"opacity",1)
      // this.HTMLElementsService.Renderer2.setStyle(this.HTMLElementsService.storageLeft.nativeElement,"opacity",1)
    }
  }

}

