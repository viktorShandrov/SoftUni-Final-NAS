import { HttpClient } from '@angular/common/http';
import {Injectable, Renderer2} from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/storage/storage.service';
import {enviroments} from "../../shared/enviroment";
import {toggleDarkMode} from "../../shared/utils";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private HttpClient:HttpClient,
    private Router:Router,
    private StorageService:StorageService,

  ) { }


  login(email:string,password:string,renderer:Renderer2){
    const payload= {
      email,
      password,
    }
    this.HttpClient.post("api/users/login",JSON.stringify(payload),{headers:{"Content-Type":"application/json"}}).subscribe(
      (res:any)=>{
        const {token,rootId} = res
        if(token&&rootId){
          this.StorageService.rootId = rootId
          localStorage.setItem("token",token)
          localStorage.setItem("rootId",rootId)

          toggleDarkMode(renderer)

          this.Router.navigate(['/storage', { outlets: { 'storage-router-outlet': rootId } }])
        }
      },
      (err)=>{
        console.log(err);
        document.querySelector(".errorContainer")!.textContent = err.error.message
      }
    )
  }
}
