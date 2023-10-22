import { Injectable } from '@angular/core';
import {constants} from "../constants";
import {HttpService} from "./http.service";
import {ToastrService} from "ngx-toastr";
import {PopupService} from "./popup.service";
import {enviroments} from "../environments";
import {CacheService} from "./cache.service";
import {StorageService} from "../../features/private/services/storage.service";
import {HeaderService} from "../../core/services/header.service";

@Injectable({
  providedIn: 'root'
})
export class AddFileService {

  constructor(
    private HttpService: HttpService,
    private ToastrService: ToastrService,
    private StorageService: StorageService,
    private HeaderService: HeaderService,
    private CacheService: CacheService,
    private PopupService: PopupService,
  ) { }

  areBtnDisabled:Boolean= false
  // storeFileToMongoDB(file:any,fileName:string){
  //   this.HttpService.httpPOSTRequest("api/files/createNewFileOnServer",{
  //     fileName,
  //     size:file?.size,
  //     type:file?.name.slice(file?.name.lastIndexOf(".")+1),
  //     parentFolderId:enviroments.currentFolder
  //   }).subscribe(
  //     (res:any)=>{
  //       const fileServerRecord = res.file
  //       this.getGCsignedKey(file,fileServerRecord)
  //
  //     },
  //     (error)=>{
  //       this.areBtnDisabled= false
  //       this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
  //     }
  //   )
  // }

  uploadToGC(signedGCKey:string,fileServerRecord:any,fileBuffer:any){


    fetch(signedGCKey, {
      method: 'PUT',
      body: fileBuffer,
    })
      .then(response => {
        if (response.status === 200) {
          this.CacheService.files.push(fileServerRecord)
          this.StorageService.hasFiles = true
          this.HeaderService.transformTheHeaderStorageInfoByDefault()
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
  getGCsignedKey(
    fileBuffer:any,
    fileType:string,
    fileName:string,
    parentFolderId:string
  ){
    this.HttpService.httpPOSTRequest('api/files/signedGC-URI',
      {
        bytes:fileBuffer!.size,
        action:"write",
        elementType:"file",
        fileType,
        fileName,
        parentFolderId
      }).subscribe(
      (res:any)=>{
        const {key,file} = res

        this.uploadToGC(key[0],file,fileBuffer)
      },
      (error)=>{
        this.areBtnDisabled= false
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }
  startUploading(fileBuffer:any, fileName:string,currentFolder:string){
    const fileType = fileName.substring(fileName.lastIndexOf(".")+1)

    this.getGCsignedKey(fileBuffer,fileType,fileName,currentFolder)

  }
}


