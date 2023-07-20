import { Component, ElementRef, ViewChild, } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header-status-bar',
  templateUrl: './header-status-bar.component.html',
  styleUrls: ['./header-status-bar.component.css']
})
export class HeaderStatusBarComponent {
  @ViewChild("usedStorageBar") usedStorageBar!:ElementRef
  @ViewChild("storageUsed") storageUsed!:ElementRef
  @ViewChild("storageLeft") storageLeft!:ElementRef
  constructor(private HeaderService:HeaderService){}
  ngOnInit(){
    this.HeaderService.usedStorageBar= this.usedStorageBar
    this.HeaderService.storageLeft= this.storageLeft
    this.HeaderService.storageUsed= this.storageUsed
  }
}
