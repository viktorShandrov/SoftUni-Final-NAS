import {Injectable, Renderer2} from '@angular/core';
import {HttpService} from "../../../shared/services/http.service";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {UserService} from "../../../core/services/user.service";
import {DarkModeService} from "../../../core/services/dark-mode.service";
import {constants} from "../../../shared/constants";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private SharedService:HttpService,
    private UserService:UserService,
    private DarkModeService:DarkModeService,
    private ToastrService:ToastrService,
    private HttpService:HttpService,
    private Router:Router,

  ) { }
  loginViaGoogle=(user:any)=>{
    this.HttpService.httpPOSTRequest("api/users/loginViaGoogle",JSON.stringify(user)).subscribe(
      (res:any)=>{
        const {token,rootId} = res
        if(token&&rootId){
          this.saveToLocalStorage(token,rootId)
          this.DarkModeService.toggleDarkMode()
          this.ToastrService.success("logged in","Successfully",constants.toastrOptions)
          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

  saveToLocalStorage(token:string,rootId:string){
    this.UserService.rootId=rootId
    localStorage.setItem("token",token)
    localStorage.setItem("rootId",rootId)
  }


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

          this.DarkModeService.toggleDarkMode()
          this.ToastrService.success("logged in","Successfully",constants.toastrOptions)
          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
}
