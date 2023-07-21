import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-header-status-bar',
  templateUrl: './header-status-bar.component.html',
  styleUrls: ['./header-status-bar.component.css']
})
export class HeaderStatusBarComponent  {
  @ViewChild("usedStorageBar") usedStorageBar!:ElementRef
  // @ViewChild("storageUsed") storageUsed!:ElementRef
  // @ViewChild("storageLeft") storageLeft!:ElementRef
  constructor(
    public HeaderService:HeaderService,
    public StorageService:StorageService,
    ){}
  ngAfterViewInit(){
    this.HeaderService.usedStorageBar= this.usedStorageBar
    // this.HeaderService.storageLeft= this.storageLeft
    // this.HeaderService.storageUsed= this.storageUsed
  }
  transform(value: number): string {
    let mesure = "GB"
    let volume = value/1000000000 //GB
    if(volume<1){
        mesure = "MB"
        volume =  volume*1000 //MB
        if(volume<0.1){
          volume=0
            return `<${volume}${mesure}`
        }
    }
    return `${volume.toFixed(2)}${mesure}`
  }
}
