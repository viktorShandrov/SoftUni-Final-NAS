import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {PopupService} from "../../services/popup.service";
import {StorageService} from "../../../features/private/services/storage.service";
import {CacheService} from "../../services/cache.service";
import {HTMLElementsService} from "../../services/htmlelements.service";


@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css'],
})
export class AddFolderComponent implements AfterViewInit{
  @ViewChild("popupAddFolder")popupAddFolder!:ElementRef
  folderForm!: FormGroup;
  constructor(
    private FormBuilder: FormBuilder,
    public PopupService: PopupService,
    public CacheService: CacheService,
    public HTMLElementsService: HTMLElementsService,
    public StorageService: StorageService
  ) {
    this.folderForm = this.FormBuilder.group({
      folderName: [''],
    });
  }
  ngAfterViewInit() {

  }

  onFormSubmit() {

    if (this.folderForm.get('folderName')?.value.length > 0) {

      this.StorageService.createFolder(this.folderForm.get('folderName')!.value,this.CacheService.folders);
      this.folderForm.reset()


    }
  }
}
