import { Injectable } from '@angular/core';
import {constants} from "../constants";
import {HttpService} from "./http.service";
import {ToastrService} from "ngx-toastr";
import {PopupService} from "./popup.service";
import {enviroments} from "../environments";
import {CacheService} from "./cache.service";
import {StorageService} from "../../features/private/services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AddFileService {

  constructor(
    private HttpService: HttpService,
    private ToastrService: ToastrService,
    private StorageService: StorageService,
    private CacheService: CacheService,
    private PopupService: PopupService,
  ) { }

  areBtnDisabled:Boolean= false
  storeFileToMongoDB(file:any,fileName:string){
    this.HttpService.httpPOSTRequest("api/files/createNewFileOnServer",{
      fileName,
      size:file?.size,
      type:file?.name.slice(file?.name.lastIndexOf(".")+1),
      parentFolderId:enviroments.currentFolder
    }).subscribe(
      (res:any)=>{
        const fileServerRecord = res.file
        this.getGCsignedKey(file,fileServerRecord)

      },
      (error)=>{
        this.areBtnDisabled= false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

  uploadToGC(signedGCKey:string,file:any,fileServerRecord:any){


    fetch(signedGCKey, {
      method: 'PUT',
      body: file,
    })
      .then(response => {
        if (response.status === 200) {
          this.CacheService.files.push(fileServerRecord)
          this.StorageService.hasFiles = true
          this.ToastrService.success("file successfully created","Created",constants.toastrOptions)
        } else {
          this.ToastrService.error(`File upload failed with status code: ${response.status}`,"Error",constants.toastrOptions)
        }
        this.PopupService.hidePopup()
        this.areBtnDisabled= false
      })
      .catch(error => {
        this.areBtnDisabled= false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      });
  }
  deleteFileFromServer(){

  }
  getGCsignedKey(file:any,fileServerRecord:any){
    this.HttpService.httpPOSTRequest('api/files/signedGC-URI',
      {
        originalname:fileServerRecord._id.toString(),
        bytes:file!.size,
        action:"write",
        elementType:"file"
      }).subscribe(
      (res:any)=>{
        const signedGCKey = res.key[0]
        this.uploadToGC(signedGCKey,file,fileServerRecord)
      },
      (error)=>{
        this.areBtnDisabled= false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  startUploading(file:any, fileName:string){

    this.storeFileToMongoDB(file,fileName)

  }
}


