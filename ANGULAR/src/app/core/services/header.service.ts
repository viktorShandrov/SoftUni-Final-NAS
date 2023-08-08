import {ElementRef, Injectable, Renderer2} from '@angular/core';
import {enviroments} from "../../shared/environments";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  usedStorageBar!:ElementRef
  storageUsed!:ElementRef
  storageLeft!:ElementRef
  usedStorage!:number
  totalVolume!:number
  isLoading!:Boolean
  constructor() {
    this.usedStorage=0
    this.totalVolume=0
  }

  toggleDarkMode(renderer:Renderer2,el:HTMLButtonElement){
    if(enviroments.darkMode){
      renderer.removeStyle(el,"transform")
      enviroments.darkMode = false
      document.documentElement.classList.remove("darkMode")
      localStorage.setItem("darkMode","false")
    }else{
      renderer.setStyle(el,"transform","translateX(100%)")
      enviroments.darkMode = true
      document.documentElement.classList.add("darkMode")
      localStorage.setItem("darkMode","true")
    }

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
    if(usedPercentage<3){
      usedPercentage=3
    }
    console.log(20)
    this.usedStorageBar.nativeElement.style.width =usedPercentage+"%"

  }

}

