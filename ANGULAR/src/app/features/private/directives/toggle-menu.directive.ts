import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";

@Directive({
  selector: '[appToggleMenu]'
})
export class ToggleMenuDirective {
 isShown:boolean = false
  constructor(
    private element:ElementRef,
    private Renderer2:Renderer2,
    private HTMLElementsService:HTMLElementsService,
  ) { }
  @HostListener("click") onClick(){
    this.isShown = !this.isShown
    setTimeout(()=>{
      this.HTMLElementsService.menuToggles.push(this.element)
    },0)
    this.Renderer2.setAttribute(this.element.nativeElement,"isShown",`${this.isShown}`)
  }

}
