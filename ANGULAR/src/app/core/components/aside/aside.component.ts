import {Component, ElementRef, ViewChildren} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  folderId!: string
  @ViewChildren("asideElement") asideElements!:ElementRef[]
  @ViewChildren("asideElementIcon") asideElementIcons!:ElementRef[]

  constructor(
    public UserService: UserService,
    public HTMLElementsService: HTMLElementsService,
    public router: Router,
    private route: ActivatedRoute
  ) {


  }

  toggleSideBar(btn:HTMLElement,container:HTMLElement) {
    const icon = btn.children[0]
    if(icon.classList.contains("fa-chevron-left")){
      //shrinking
      icon.classList.replace("fa-chevron-left","fa-chevron-right")
      this.HTMLElementsService.Renderer2.setStyle(container,"width","30px")
      this.hideElements("element")
      this.showElements("icon")
    }else if(icon.classList.contains("fa-chevron-right")){
      //expanding
      icon.classList.replace("fa-chevron-right","fa-chevron-left")
      this.HTMLElementsService.Renderer2.setStyle(container,"width","250px")
      this.hideElements("icon")
      this.showElements("element")
    }
  }
  hideElements(type:string){
    if(type==="icon"){
      for (const asideElementIcon of this.asideElementIcons) {
        this.HTMLElementsService.Renderer2.setStyle(asideElementIcon.nativeElement,"display","none")
      }
    }else if(type==="element"){
      for (const asideElement of this.asideElements) {
        this.HTMLElementsService.Renderer2.setStyle(asideElement.nativeElement,"display","none")
      }
    }
  }
  showElements(type:string){
    if(type==="icon"){
      for (const asideElementIcon of this.asideElementIcons) {
        this.HTMLElementsService.Renderer2.setStyle(asideElementIcon.nativeElement,"display","flex")
      }
    }else if(type==="element"){
      for (const asideElement of this.asideElements) {
        this.HTMLElementsService.Renderer2.setStyle(asideElement.nativeElement,"display","flex")
      }
    }
  }
}
