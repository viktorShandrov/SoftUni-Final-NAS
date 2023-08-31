import {AfterViewInit, Component} from '@angular/core';
import {DarkModeService} from "../../../../../core/services/dark-mode.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";

@Component({
  selector: 'app-shared-with-me-view',
  templateUrl: './shared-with-me-view.component.html',
  styleUrls: ['./shared-with-me-view.component.css']
})
export class SharedWithMeViewComponent implements AfterViewInit{
constructor(
  private DarkModeService:DarkModeService,
  private HTMLElementsService:HTMLElementsService,
) {
}
ngAfterViewInit(){
 setTimeout(()=>{
  this.DarkModeService.setTheTheme()
 },0)
}
}
