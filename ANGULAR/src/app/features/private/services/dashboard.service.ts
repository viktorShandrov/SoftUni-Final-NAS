import { ElementRef, Injectable, QueryList, Renderer2 } from '@angular/core';
import { topExtI, topFolders } from '../../../shared/types';
import { HttpClient } from '@angular/common/http';

import {HeaderService} from "../../../core/services/header.service";
import {DashboardViewComponent} from "../components/dashboard/dashboard-view/dashboard-view.component";
import {StorageService} from "./storage.service";
import {UserService} from "../../../core/services/user.service";


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  topExt!: topExtI[];
  topFolders!: topFolders[];
  storageVolume!:number
  usedStorage!:number
  storageLeft!:number

  constructor(
    private HttpClient : HttpClient,
    private StorageService:StorageService,
    private UserService:UserService,
    private HeaderService:HeaderService,
  ) { }

setTopExtBarsWidth(Renderer2:Renderer2,extQ:QueryList<ElementRef>,res:any){
  for (let i=0;i<this.topExt.length;i++){
    const percentage  = (this.topExt[i].count/res.fileCount)*100
    Renderer2.setStyle(extQ.toArray()[i].nativeElement,"width",percentage+"%")

  }
}
setTopFoldersBarsWidth(Renderer2:Renderer2,foldersQ:QueryList<ElementRef>,res:any){
  for (let i=0;i<this.topFolders.length;i++){
    const percentage  = (this.topFolders[i].count/res.fileCount)*100
    console.log(percentage);
    Renderer2.setStyle(foldersQ.toArray()[i].nativeElement,"width",percentage+"%")

  }
}
  getTopExtData(extQ:QueryList<ElementRef>,Renderer2:Renderer2){

    return new Promise((resolve,reject)=>{
      setTimeout(() => {
        this.HttpClient.get(`api/files/${this.UserService.rootId}/topFileExts`).subscribe(
          (res:any)=>{
            this.topExt=res.topFileExts
            setTimeout(()=>{
              this.setTopExtBarsWidth(Renderer2,extQ,res)

            },0)
            resolve(1)
          },
          (err)=>{
            reject(0)
          }
        )

      }, 0);

    })
  }
  getTopFoldersData(foldersQ:QueryList<ElementRef>,Renderer2:Renderer2){

    return new Promise((resolve,reject)=>{
      this.HttpClient.get(`api/files/${this.UserService.rootId}/getTopFolders`).subscribe(
        (res:any)=>{
          console.log(res)
          this.topFolders = res.topFolders
            setTimeout(()=>{
              this.setTopFoldersBarsWidth(Renderer2,foldersQ,res)

            },0)
            resolve(1)
          },
            (err)=>{
              reject(0)
            }
      )

    })
  }
  getStorageVolumeInfo(){

    return new Promise((resolve,reject)=>{
      this.HttpClient.get(`api/files/${this.UserService.rootId}/getStorageVolumeInfo`).subscribe(
        (response: any) => {
          console.log(response)
          this.HeaderService.updateUsedStorage(
            response.storageVolume,
            response.usedStorage
          );
          this.storageVolume=response.storageVolume
          this.usedStorage=response.usedStorage
          this.storageLeft=this.storageVolume-this.usedStorage
          resolve(1)
        },
        (error) => {
          console.log(error.error.message);
          reject(0)
        }
      );
    })
  }
}

