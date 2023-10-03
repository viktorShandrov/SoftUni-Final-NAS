import {Component, ElementRef, Renderer2} from '@angular/core';

@Component({
  selector: 'app-plans-view',
  templateUrl: './plans-view.component.html',
  styleUrls: ['./plans-view.component.css']
})
export class PlansViewComponent {
constructor(
  private element:ElementRef,
  private Renderer2:Renderer2,

) {
  this.Renderer2.setStyle(this.element.nativeElement,"display","flex")
  this.Renderer2.setStyle(this.element.nativeElement,"flex-direction","column")
  this.Renderer2.setStyle(this.element.nativeElement,"height","100% ")
}
}
