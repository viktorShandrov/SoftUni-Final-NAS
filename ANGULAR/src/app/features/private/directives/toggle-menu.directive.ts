import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appToggleMenu]'
})
export class ToggleMenuDirective {
 isShown:boolean = false
  constructor(
    private element:ElementRef,
    private Renderer2:Renderer2,
  ) { }
  @HostListener("click") onClick(){
    this.isShown = !this.isShown
    this.Renderer2.setAttribute(this.element.nativeElement,"isShown",`${this.isShown}`)
  }

}
