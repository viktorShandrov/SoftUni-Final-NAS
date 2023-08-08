import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { HeaderService } from 'src/app/core/header/header.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css'],
})
export class AddFileComponent {
  @ViewChild('sameAsOriginalCheckBox') sameAsOriginalCheckBox!: ElementRef;
  @ViewChild('fileNameInput') fileNameInput!: ElementRef;
  fileForm!: FormGroup;
  selectedFile: File | undefined;
  selectedFileSizeInMB: Number | undefined;
  constructor(
    public PopupService: PopupService,
    private StorageService: StorageService,
    private HeaderService: HeaderService,
    private Renderer2: Renderer2,
    private http: HttpClient,
    private FormBuilder: FormBuilder
  ) {
    this.fileForm = this.FormBuilder.group({
      fileName: [''],
      file: [''],
    });

    setTimeout(() => {
      this.Renderer2.listen(
        this.sameAsOriginalCheckBox.nativeElement,
        'click',
        (e) => {
          if (e.target.checked) {
            this.fileNameInput.nativeElement.value = '';
            this.Renderer2.setAttribute(
              this.fileNameInput.nativeElement,
              'disabled',
              'true'
            );
          } else {
            this.Renderer2.removeAttribute(
              this.fileNameInput.nativeElement,
              'disabled'
            );
          }
        }
      );
    }, 0);
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.selectedFileSizeInMB = this.selectedFile.size / 1000000;
    } else {
      this.selectedFile = undefined;
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      let fileNameFromForm = this.fileForm.get('fileName')?.value;
      let FinalFileName = this.selectedFile.name;
      if (fileNameFromForm.length > 0) {
        FinalFileName =
          fileNameFromForm +
          this.selectedFile.name.substring(
            this.selectedFile.name.lastIndexOf('.')
          );
        }
     this.http.post("api/files/checkIfStorageHaveEnoughtSpace",JSON.stringify({Bytes:this.selectedFile.size,rootId:this.StorageService.rootId}),{headers:{"Content-type":"application/json"}}).subscribe(
      (response)=>{

        this.http
          .get(
            `api/files/${this.StorageService.currentFolder}/${FinalFileName}/checkIfFileNameAlreadyExists`
          )
          .subscribe(
            (response: any) => {
              const originalName = this.selectedFile!.name; //contains the extension of the file
              formData.append('file', this.selectedFile!, FinalFileName);
              formData.append('rootId', this.StorageService.rootId);
              formData.append(
                'parentFolderId',
                this.StorageService.currentFolder
              );
   
              this.http
                .post('api/files/upload', formData, {
                  reportProgress: true,
                  observe: 'events',
                })
                .subscribe((event:any) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    const progress = Math.round(
                      (100 * event.loaded) / (event.total?.valueOf() || 1)
                    );
                    document.getElementById(
                      'progress-bar'
                    )!.innerText = `Upload progress: ${progress}%`;
                  } else if (event instanceof HttpResponse) {
                    if(event.body?.message){
                      //if error
                      document.getElementById('progress-bar')!.innerText =
                        event.body.message?.toString();
                    }else{
                      //returns the newFile info
                      this.StorageService.files.push(event.body)
                      
                      this.http
                      .get(`api/files/${this.StorageService.rootId}/getOnlyRootInfo`)
                      .subscribe((response:any) => {
                        const {folder} = response
                        this.HeaderService.updateUsedStorage(folder.storageVolume,folder.usedStorage)
                      },
                      (error)=>{
                        console.log(error.error.message);
                        
                      })

                      this.PopupService.hidePopup()
                    }
                      
                  }
                });
            },
            (error) => {
              console.log('error.message: ', error);
              document.getElementById('progress-bar')!.innerText =
                error.error.message;
            }
          );
     },
     (error)=>{
      document.getElementById('progress-bar')!.innerText =
                error.error.message;
     })
    } else {
      console.log('no file selected');
    }
  }
}
