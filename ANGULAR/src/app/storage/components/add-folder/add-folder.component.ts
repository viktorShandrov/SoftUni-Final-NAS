import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css'],
})
export class AddFolderComponent {
  folderForm!: FormGroup;
  constructor(
    private FormBuilder: FormBuilder,
    public PopupService: PopupService,
    public StorageService: StorageService
  ) {
    this.folderForm = this.FormBuilder.group({
      folderName: [''],
    });
  }
  onFormSubmit() {

    if (this.folderForm.get('folderName')?.value.length > 0) {

      this.StorageService.createFolder(this.folderForm.get('folderName')!.value);
    }
  }
}
