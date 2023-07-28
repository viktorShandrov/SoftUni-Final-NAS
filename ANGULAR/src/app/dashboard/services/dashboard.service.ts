import { ElementRef, Injectable, QueryList, Renderer2 } from '@angular/core';
import { topExtI, topFolders } from '../../shared/types';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage/storage.service';
import { DashboardViewComponent } from '../components/dashboard-view/dashboard-view.component';
import { HeaderService } from '../../core/header/header.service';

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
    private HeaderService:HeaderService,
  ) { }


   getTopExtData(extQ:QueryList<ElementRef>,Renderer2:Renderer2){

    return new Promise((resolve,reject)=>{
      setTimeout(() => {
        this.HttpClient.get(`api/files/${this.StorageService.rootId}/topFileExts`).subscribe(
        (res:any)=>{
           const maxHeight = 200; //px
           this.topExt=res.topFileExts
           const count: number = this.topExt.reduce(
             (sum, item) => (sum += item.count),
             0
             );
             console.log('count: ', count);
           setTimeout(() => {
             extQ.forEach((bar,index) => {
              const domElementHeight = Number((( this.topExt[index]?.count / count) * maxHeight).toFixed(0));
               Renderer2.setStyle(bar.nativeElement,"height",domElementHeight+"px")
             });
           }, 0);
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
      this.HttpClient.get(`api/files/${this.StorageService.rootId}/getTopFolders`).subscribe(
      (res:any)=>{
         const maxHeight = 200; //px
         this.topFolders=res.topFolders
         console.log('res: ', res.topFolders);
         console.log('this.topExt: ', this.topFolders);
         const count: number = this.topFolders.reduce(
           (sum, item) => (sum += item.count),
           0
           );
           console.log('count: ', count);
         setTimeout(() => {
          foldersQ.forEach((bar,index) => {
            const domElementHeight = Number((( this.topFolders[index]?.count / count) * maxHeight).toFixed(0));
             Renderer2.setStyle(bar.nativeElement,"height",domElementHeight+"px")
           });
         }, 0);
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
      this.HttpClient.get(`api/files/${this.StorageService.rootId}/getOnlyRootInfo`).subscribe(
        (response: any) => {
          const { folder } = response;
          console.log('folder: ', folder);
          this.HeaderService.updateUsedStorage(
            folder.storageVolume,
            folder.usedStorage
          );
          this.storageVolume=folder.storageVolume
          this.usedStorage=folder.usedStorage
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
