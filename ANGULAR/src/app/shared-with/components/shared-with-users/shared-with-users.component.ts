import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedWithService } from '../../services/shared-with.service';
import { StorageService } from 'src/app/storage/storage.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-shared-with-users',
  templateUrl: './shared-with-users.component.html',
  styleUrls: ['./shared-with-users.component.css']
})
export class SharedWithUsersComponent implements AfterViewInit {

  constructor(
    public SharedWithService:SharedWithService,
    private StorageService:StorageService,
    ){}
  ngAfterViewInit(){
      this.StorageService.sharingCurrentSection$.subscribe(
        (section)=>{
          console.log('section11111111: ', section);
          if(section==="sharedWithUsers"){

            setTimeout(() => {
              this.SharedWithService.getSharedWithUsersFolders().subscribe(
                (res:any)=>{
                  console.log('res: ', res);
                  this.SharedWithService.autorisedWihtUsers = res

                }
              )

            }, 0);
          }
        }
      )
    setTimeout(() => {

    }, 100);
  }
}
