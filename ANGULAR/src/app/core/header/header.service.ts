import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  usedStorageBar!:ElementRef
  storageUsed!:ElementRef
  storageLeft!:ElementRef
  usedStorage!:number
  totalVolume!:number
  constructor() { 
    this.usedStorage=0
    this.totalVolume=0
  }

  

  updateUsedStorage(totalVolume:number,usedStorage:number){
    console.log('usedStorage: ', usedStorage);
    this.usedStorage=usedStorage
    this.totalVolume=totalVolume-usedStorage
    let usedPercentage = (usedStorage / totalVolume) * 100;
    if(usedPercentage<3){
      usedPercentage=3
    }
    this.usedStorageBar.nativeElement.style.width =usedPercentage+"%"
  }
  
}
