import {Injectable, Renderer2} from '@angular/core';
import {enviroments} from "../../shared/environments";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  constructor() { }
  toggleDarkMode(renderer:Renderer2){
    const darkMode = localStorage.getItem("darkMode")
    if(darkMode==undefined){
      localStorage.setItem("darkMode","false")
    }else if(darkMode==="true"){
      const button = document.querySelector(".lightDarkModeBtn")

      renderer.setStyle(button,"transform","translateX(100%)")
      enviroments.darkMode = true
      document.documentElement.classList.add("darkMode")
    }

  }
}
