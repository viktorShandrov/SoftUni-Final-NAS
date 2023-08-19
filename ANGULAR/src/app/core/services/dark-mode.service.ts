import {Injectable, Renderer2} from '@angular/core';
import {enviroments} from "../../shared/environments";
import {HTMLElementsService} from "../../shared/services/htmlelements.service";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  constructor(
    private HTMLElementsService:HTMLElementsService
  ) { }
  toggleDarkMode(){
    const darkMode = localStorage.getItem("darkMode")
    if(darkMode==undefined){
      localStorage.setItem("darkMode","false")
    }else if(darkMode==="true"){
      const button = document.querySelector(".lightDarkModeBtn")

      this.HTMLElementsService.Renderer2.setStyle(button,"transform","translateX(100%)")
      enviroments.darkMode = true
      document.documentElement.classList.add("darkMode")
    }

  }
}
