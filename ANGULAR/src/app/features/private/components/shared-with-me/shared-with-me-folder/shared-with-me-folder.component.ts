import {AfterViewInit, Component} from '@angular/core';
import {SharedWithService} from "../../../services/shared-with.service";
import {StorageService} from "../../../services/storage.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../../../shared/constants";

@Component({
  selector: 'app-shared-with-me-folder',
  templateUrl: './shared-with-me-folder.component.html',
  styleUrls: ['./shared-with-me-folder.component.css']
})
export class SharedWithMeFolderComponent implements AfterViewInit {
  isLoading : boolean = true
constructor(
  public  SharedWithService:SharedWithService,
  public  StorageService:StorageService,
  public  ToastrService:ToastrService,

) {
}

ngAfterViewInit() {
  const fullUrl = window.location.href;
  const regex = /storage-outlet:shared-with-me\/([\w-]+)/;
  const match = fullUrl.match(regex);

  this.SharedWithService.getFilesFromSharedFolder(
    match?match[1]:"null"
  ).subscribe(
    (files: any) => {
      // this.renderer.setStyle(this.SharedWithService.backBtn.nativeElement,"display","block")
      this.isLoading = false
      this.SharedWithService.files = files;

    },
    (err) => {
      this.isLoading = false
      this.ToastrService.error(err.error.message,"Error",constants.toastrOptions)
    }
  );
}
}



