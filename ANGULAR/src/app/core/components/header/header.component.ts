import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{

constructor(
  private element:ElementRef,
  private renderer2:Renderer2
) {}

ngAfterViewInit(){
  this.renderer2.setStyle(this.element.nativeElement,"display","flex")
  this.renderer2.setStyle(this.element.nativeElement,"align-items","center")
  this.renderer2.setStyle(this.element.nativeElement,"position","relative")
  this.renderer2.setStyle(this.element.nativeElement," z-index","1")

}
}
