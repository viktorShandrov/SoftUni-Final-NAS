import { HttpBackend, HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { file, files, folder, sharedWithUsersFolderIn } from '../../shared/types';
import { Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedWithService {

  constructor(
    private HttpClient:HttpClient
  ) { }
  folders!:folder[]
  files!:file[]
  backBtn!:ElementRef
  autorisedWihtUsers!:sharedWithUsersFolderIn[]
  getSharedWithMeFolders(){
    return this.HttpClient.get(`api/files/getSharedWithMeFolders`)
  }
  getSharedWithUsersFolders(){
    return this.HttpClient.get(`api/files/getAuthorisedWithUsersFolder`)
  }
  getFilesFromSharedFolder(folderId:string){
    return this.HttpClient.get(`api/files/${folderId}/getFilesFromSharedFolder`)
  }
  unAuthoriseUserFromFolder(folderId:string,userId:string){
    const payload = {
      folderId,
      userId
    }
    return this.HttpClient.post(`api/files/unAuthoriseUserFromFolder`,JSON.stringify(payload),{headers:{"Content-Type":"application/json"}})
  }
}
