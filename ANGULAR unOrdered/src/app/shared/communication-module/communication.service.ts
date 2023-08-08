import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { StorageNavigationComponent } from 'src/app/storage/storage-navigation/storage-navigation.component';
import { StorageService } from 'src/app/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  sharedObserver!:Observer<string> 
  passTheDataToDDashboard$:Observable<string> = new Observable((observer)=>{
    this.sharedObserver = observer
  })
//   constructor(
//     private StorageService:StorageService
//   ) { 
//     this.StorageService.sharingCurrentSection$.subscribe((res)=>{
//       this.sharedObserver.next(res)
//     })
//   }
}
