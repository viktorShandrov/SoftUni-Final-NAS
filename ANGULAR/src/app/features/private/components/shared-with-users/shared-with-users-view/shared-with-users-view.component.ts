import {AfterViewInit, Component} from '@angular/core';
import {SharedWithService} from "../../../services/shared-with.service";
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'app-shared-with-users-view',
  templateUrl: './shared-with-users-view.component.html',
  styleUrls: ['./shared-with-users-view.component.css']
})
export class SharedWithUsersViewComponent implements AfterViewInit{
  isLoading:Boolean = true
  constructor(
    public SharedWithService:SharedWithService,
    private StorageService:StorageService,
  ){}
  ngAfterViewInit(){

            this.SharedWithService.getSharedWithUsersFolders().subscribe(
              (res:any)=>{
                this.SharedWithService.autorisedWihtUsers = res
                this.isLoading = false
              }
            )


        }

}
