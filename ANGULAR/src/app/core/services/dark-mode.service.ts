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
  setTheTheme(){
    const theme = localStorage.getItem("theme")
    if(theme==undefined){
      localStorage.setItem("theme","light")
    }else{
      this.changeTheme(theme!)
    }
  }
  changeTheme(theme:string){
    if(theme==="light"){
      enviroments.theme = "light"
      this.clearDocumentThemeClasses()
      document.documentElement.classList.add("lightTheme")
    }else {
      enviroments.theme = "dark"
      this.clearDocumentThemeClasses()
      document.documentElement.classList.add("darkTheme")
    }
    const themeElement = document.querySelector("#theme") as HTMLSelectElement
    if(themeElement) themeElement.value = theme
    localStorage.setItem("theme",theme)

  }
  clearDocumentThemeClasses(){
    document.documentElement.classList.forEach(el=>document.documentElement.classList.remove(el))
  }
}
