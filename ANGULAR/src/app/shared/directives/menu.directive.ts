import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';
import {HTMLElementsService} from "../services/htmlelements.service";

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective implements AfterViewInit,OnInit{

  constructor(
    private element:ElementRef,
    private HTMLElementsService:HTMLElementsService,

  ) { }
  ngOnInit() {
    console.log(1111)
  }

  ngAfterViewInit() {
    this.HTMLElementsService.menus.push(this.element)
  }
}
