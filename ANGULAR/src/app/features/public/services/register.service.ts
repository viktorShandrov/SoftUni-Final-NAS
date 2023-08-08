import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import {Injectable, Renderer2} from '@angular/core';
import { Router } from '@angular/router';

import {HttpService} from "../../../shared/services/http.service";
import {UserService} from "../../../core/services/user.service";
import {DarkModeService} from "../../../core/services/dark-mode.service";
import {constants} from "../../../shared/constants";
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private HttpClient:HttpClient,
    private Router:Router,
    private SharedService:HttpService,
    private DarkModeService:DarkModeService,
    private UserService:UserService,

  ) { }

  register(email:string,password:string,rePass:string,renderer:Renderer2){
    const payload= {
      email,
      password,
      repeatePassword:rePass
    }

    this.SharedService.httpPOSTRequest(constants.api.register,JSON.stringify(payload)).subscribe(
      (res:any)=>{
        const {token,rootId} = res

        if(token&&rootId){

          this.UserService.rootId=rootId
          localStorage.setItem("token",token.token)
          localStorage.setItem("rootId",rootId)

          this.DarkModeService.toggleDarkMode(renderer)

          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (err)=>{
        console.log(err);
        document.querySelector(".errorContainer")!.textContent = err.error.message
      }
    )
  }
}
