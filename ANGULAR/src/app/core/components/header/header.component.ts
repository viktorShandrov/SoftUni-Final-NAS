import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{

  @ViewChild("usedStorageBar",{static:true}) usedStorageBar!:ElementRef
  constructor(
    public HeaderService:HeaderService,
    public Renderer2:Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private HTMLElementsService: HTMLElementsService
  ) {
  }

  ngAfterViewInit(){
    this.changeDetectorRef.detectChanges();
    this.HeaderService.usedStorageBar= this.usedStorageBar
    this.HTMLElementsService.Renderer2 = this.Renderer2
  }
}
