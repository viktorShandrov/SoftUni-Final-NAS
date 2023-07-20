import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  usedStorageBar!:ElementRef
  storageUsed!:ElementRef
  storageLeft!:ElementRef
  constructor() { }

  updateUsedStorage(totalVolume:number,usedStorage:number){
    this.storageUsed.nativeElement.textContent=usedStorage
    this.storageLeft.nativeElement.textContent=totalVolume-usedStorage
  }
  
}
