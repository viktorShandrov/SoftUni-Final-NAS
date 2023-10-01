import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';
import {HTMLElementsService} from "../services/htmlelements.service";

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective implements AfterViewInit{

  constructor(
    private element:ElementRef,
    private HTMLElementsService:HTMLElementsService,

  ) { }


  ngAfterViewInit() {
    this.HTMLElementsService.menus.push(this.element)
  }
}
