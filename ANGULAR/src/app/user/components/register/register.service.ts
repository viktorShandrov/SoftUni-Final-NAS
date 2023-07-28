import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private HttpClient:HttpClient,
    private Router:Router,
    private StorageService:StorageService
  ) { }

  register(email:string,password:string,rePass:string){
    const payload= {
      email,
      password,
      repeatePassword:rePass
    }
    this.HttpClient.post("api/users/register",JSON.stringify(payload),{headers:{"Content-Type":"application/json"}}).subscribe(
      (res:any)=>{
        const {token,rootId} = res

        if(token&&rootId){
  
          this.StorageService.rootId=rootId
          localStorage.setItem("token",token.token)
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