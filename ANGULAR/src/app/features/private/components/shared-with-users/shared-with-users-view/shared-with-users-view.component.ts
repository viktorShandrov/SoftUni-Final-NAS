import {AfterViewInit, Component} from '@angular/core';
import {SharedWithService} from "../../../services/shared-with.service";
import {StorageService} from "../../../services/storage.service";
import {DarkModeService} from "../../../../../core/services/dark-mode.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";

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
  ){}
  ngAfterViewInit(){

            this.SharedWithService.getSharedWithUsersFolders().subscribe(
              (res:any)=>{
                this.SharedWithService.autorisedWihtUsers = res
                this.isLoading = false
              }
            )

      setTimeout(()=>{
        this.DarkModeService.toggleDarkMode(this.HTMLElementsService.Renderer2)
      },0)



        }

}
