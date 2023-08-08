import {Injectable, Renderer2} from '@angular/core';
import {HttpService} from "../../../shared/services/http.service";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {UserService} from "../../../core/services/user.service";
import {DarkModeService} from "../../../core/services/dark-mode.service";
import {constants} from "../../../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private SharedService:HttpService,
    private UserService:UserService,
    private DarkModeService:DarkModeService,
    private Router:Router,

  ) { }



  login(email:string,password:string,renderer:Renderer2){
    const payload= {
      email,
      password,
    }
    this.SharedService.httpPOSTRequest(constants.api.login,JSON.stringify(payload)).subscribe(
      (res:any)=>{
        const {token,rootId} = res
        if(token&&rootId){
          this.UserService.rootId = rootId
          localStorage.setItem("token",token)
          localStorage.setItem("rootId",rootId)

          this.DarkModeService.toggleDarkMode(renderer)

          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (err)=>{
        console.log(err.message);
        document.querySelector(".errorContainer")!.textContent = err.error.message
      }
    )
  }
}
