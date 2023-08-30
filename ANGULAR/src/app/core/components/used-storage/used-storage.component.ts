import {ChangeDetectorRef, Component, ElementRef, ViewChild,Renderer2} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-used-storage',
  templateUrl: './used-storage.component.html',
  styleUrls: ['./used-storage.component.css']
})
export class UsedStorageComponent {
  @ViewChild("usedStorageBar",{static:true}) usedStorageBar!:ElementRef
  // @ViewChild("storageUsed") storageUsed!:ElementRef
  // @ViewChild("storageLeft") storageLeft!:ElementRef
  constructor(
    public HeaderService:HeaderService,
    public Renderer2:Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private HTMLElementsService: HTMLElementsService
  ) {
  }

  ngAfterViewInit(){
    this.changeDetectorRef.detectChanges();
    this.HTMLElementsService.Renderer2 = this.Renderer2
    this.HTMLElementsService.usedStorageBar = this.usedStorageBar
    // this.HTMLElementsService.storageUsed = this.storageUsed
    // this.HTMLElementsService.storageLeft = this.storageLeft

  }
}
