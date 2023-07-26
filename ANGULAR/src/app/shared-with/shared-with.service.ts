import { HttpBackend, HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { file, files, folder } from '../shared/types';
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
  getSharedWithMeFolders(){
    return this.HttpClient.get(`api/files/getSharedWithMeFolders`)
  }
  getFilesFromSharedFolder(folderId:string){
    return this.HttpClient.get(`api/files/${folderId}/getFilesFromSharedFolder`)
  }
}
