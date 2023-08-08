import { HttpBackend, HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { file, files, folder, sharedWithUsersFolderIn } from '../../../shared/types';
import { Observable, Observer } from 'rxjs';
import {HttpService} from "../../../shared/services/http.service";


@Injectable({
  providedIn: 'root'
})
export class SharedWithService {

  constructor(
    private HttpService:HttpService
  ) { }
  folders:folder[]=[]
  files:file[] =[]
  backBtn!:ElementRef
  autorisedWihtUsers!:sharedWithUsersFolderIn[]
  getSharedWithMeFolders(){
    return this.HttpService.httpGETRequest(`api/files/getSharedWithMeFolders`)
  }
  getSharedWithUsersFolders(){
    return this.HttpService.httpGETRequest(`api/files/getAuthorisedWithUsersFolder`)
  }
  getFilesFromSharedFolder(folderId:string){
    return this.HttpService.httpGETRequest(`api/files/${folderId}/getFilesFromSharedFolder`)
  }
  unAuthoriseUserFromFolder(folderId:string,userId:string){
    const payload = {
      folderId,
      userId
    }
    return this.HttpService.httpPOSTRequest(`api/files/unAuthoriseUserFromFolder`,JSON.stringify(payload))
  }
}

