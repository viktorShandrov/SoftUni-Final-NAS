import {AfterViewInit, Component} from '@angular/core';
import {SharedWithService} from "../../../services/shared-with.service";
import {StorageService} from "../../../services/storage.service";
import {DarkModeService} from "../../../../../core/services/dark-mode.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {constants} from "../../../../../shared/constants";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-shared-with-users-view',
  templateUrl: './shared-with-users-view.component.html',
  styleUrls: ['./shared-with-users-view.component.css']
})
export class SharedWithUsersViewComponent implements AfterViewInit{
  isLoading:Boolean = true
  constructor(
    public SharedWithService:SharedWithService,
    public DarkModeService:DarkModeService,
    public HTMLElementsService:HTMLElementsService,
    private StorageService:StorageService,
    private ToastrService:ToastrService,
  ){}
  ngAfterViewInit(){

            this.SharedWithService.getSharedWithUsersFolders().subscribe(
              (res:any)=>{
                this.SharedWithService.autorisedWihtUsers = res
                this.isLoading = false
              },
              (error)=>{
                this.isLoading = false
                this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
              }
            )

      setTimeout(()=>{
        this.DarkModeService.toggleDarkMode()
      },0)



        }

}
