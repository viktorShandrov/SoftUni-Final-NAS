import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private HttpClient:HttpClient,
    private Router:Router,
    private StorageService:StorageService
  ) { }


  login(email:string,password:string){
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
