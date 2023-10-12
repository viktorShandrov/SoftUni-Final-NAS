import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {HttpService} from "../../../../shared/services/http.service";
import {StipeService} from "../../services/stipe.service";



@Component({
  selector: 'app-plans-view',
  templateUrl: './plans-view.component.html',
  styleUrls: ['./plans-view.component.css']
})
export class PlansViewComponent implements OnInit {
  paymentHandler: any = null

  constructor(
    private element: ElementRef,
    private Renderer2: Renderer2,
    private StipeService: StipeService,
    private HttpService: HttpService,
  ) {
    this.Renderer2.setStyle(this.element.nativeElement, "display", "flex")
    this.Renderer2.setStyle(this.element.nativeElement, "flex-direction", "column")
    this.Renderer2.setStyle(this.element.nativeElement, "height", "100% ")
  }

  ngOnInit() {
    this.StipeService.checkout()
  }
}
