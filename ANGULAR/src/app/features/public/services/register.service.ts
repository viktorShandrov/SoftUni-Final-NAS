import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import {Injectable, Renderer2} from '@angular/core';
import { Router } from '@angular/router';

import {HttpService} from "../../../shared/services/http.service";
import {UserService} from "../../../core/services/user.service";
import {DarkModeService} from "../../../core/services/dark-mode.service";
import {constants} from "../../../shared/constants";
import {ToastrService} from "ngx-toastr";
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private HttpClient:HttpClient,
    private Router:Router,
    private HttpService:HttpService,
    private DarkModeService:DarkModeService,
    private ToastrService:ToastrService,
    private UserService:UserService,

  ) { }
   registerViaGoogle=(user:any)=>{
    this.HttpService.httpPOSTRequest("api/users/registerViaGoogle",JSON.stringify(user)).subscribe(
      (res:any)=>{
        const {token,rootId,email} = res
        if(token&&rootId&&email){
          this.saveToLocalStorage(token,rootId,email)
          this.DarkModeService.setTheTheme()
          this.ToastrService.success("registered","Successfully",constants.toastrOptions)
          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  sendConfirmationEmail(email:string,password:string,repeatPassword:string){
    this.HttpService.httpPOSTRequest("api/users/sendConfirmationEmail",{email,password,repeatPassword}).subscribe(
      (res)=>{
        this.ToastrService.info("confirmation email has been send","Check your email",constants.toastrOptions)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      })

  }
  checkIfEmailAlreadyExists(email:string,password:string,repeatPassword:string){
    this.HttpService.httpGETRequest(`api/users/checkIfEmailAlreadyExists/${email}`).subscribe(
      (res)=>{
        this.sendConfirmationEmail(email,password,repeatPassword)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)

      }

    )
  }
  saveToLocalStorage(token:string,rootId:string,email:string){
    this.UserService.rootId=rootId
    localStorage.setItem("token",token)
    localStorage.setItem("rootId",rootId)
    localStorage.setItem("email",email)
  }

  register(email:string,password:string,rePass:string,renderer:Renderer2){
    const payload= {
      email,
      password,
      repeatePassword:rePass
    }

    this.HttpService.httpPOSTRequest(constants.api.register,JSON.stringify(payload)).subscribe(
      (res:any)=>{
        const {token,rootId,email} = res

        if(token&&rootId&&email){
          this.saveToLocalStorage(token,rootId,email)


          this.DarkModeService.setTheTheme()
          this.ToastrService.success("registered","Successfully",constants.toastrOptions)
          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': rootId } }])
        }
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
}
