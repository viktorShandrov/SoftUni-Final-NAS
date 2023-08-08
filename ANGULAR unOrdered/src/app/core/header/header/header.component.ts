import {Component, ElementRef, Renderer2} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {enviroments} from "../../../shared/enviroment";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private renderer: Renderer2
  ) {
  }
toggleDarkMode(el:HTMLButtonElement){
    if(enviroments.darkMode){
      this.renderer.removeStyle(el,"transform")
      enviroments.darkMode = false
      document.documentElement.classList.remove("darkMode")
      localStorage.setItem("darkMode","false")
    }else{
    this.renderer.setStyle(el,"transform","translateX(100%)")
      enviroments.darkMode = true
    document.documentElement.classList.add("darkMode")
      localStorage.setItem("darkMode","true")
    }

}
}
