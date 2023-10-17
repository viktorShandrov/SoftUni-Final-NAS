import { Injectable } from '@angular/core';
import {constants} from "../constants";
import {HttpService} from "./http.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AddFileService {

  constructor(
    private HttpService: HttpService,
    private ToastrService: ToastrService,
  ) { }

  areBtnDisabled:Boolean= false
  storeFileToMongoDB(file:any){
    this.HttpService.httpPOSTRequest("api/files/newFileCreated",{
      fileName:file?.name,
      size:file?.size,
      type:file?.name.slice(file?.name.lastIndexOf("."))
    }).subscribe(
      (res)=>{
        this.ToastrService.success("file successfully created","Created",constants.toastrOptions)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

  uploadToGC(signedGCKey:string,file:any){
    fetch(signedGCKey, {
      method: 'PUT',
      body: file,
    })
      .then(response => {
        if (response.status === 200) {
          this.storeFileToMongoDB(file)
        } else {
          this.ToastrService.error(`File upload failed with status code: ${response.status}`,"Error",constants.toastrOptions)
        }
        this.areBtnDisabled= false
      })
      .catch(error => {
        this.areBtnDisabled= false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      });
  }
  getGCsignedKey(file:any){
    this.HttpService.httpPOSTRequest('api/files/signedGC-URI',
      {
        originalname:file!.name,
        bytes:file!.size
      }).subscribe(
      (res:any)=>{
        const signedGCKey = res.key[0]


        this.uploadToGC(signedGCKey,file)
      }
    )
  }
}


