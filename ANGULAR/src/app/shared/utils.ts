import {enviroments} from "./enviroment";
import {Renderer2} from "@angular/core";

export function toggleDarkMode(renderer:Renderer2){
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
