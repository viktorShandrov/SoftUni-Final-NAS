import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import {StorageService} from "../../../features/private/services/storage.service";
import {HeaderService} from "../../../core/services/header.service";
import {PopupService} from "../../services/popup.service";
import {HttpService} from "../../services/http.service";
import {UserService} from "../../../core/services/user.service";
import {enviroments} from "../../environments";
import {CacheService} from "../../services/cache.service";
import {HTMLElementsService} from "../../services/htmlelements.service";
import {constants} from "../../constants";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css'],
})
export class AddFileComponent implements AfterViewInit{
  @ViewChild('sameAsOriginalCheckBox') sameAsOriginalCheckBox!: ElementRef;
  @ViewChild('fileNameInput') fileNameInput!: ElementRef;
  @ViewChild('popupAddFile') popupAddFile!: ElementRef;
  fileForm!: FormGroup;
  selectedFile: File | undefined;
  selectedFileSizeInMB: Number | undefined;
  constructor(
    public PopupService: PopupService,
    private StorageService: StorageService,
    private HeaderService: HeaderService,
    private UserService: UserService,
    private Renderer2: Renderer2,
    private http: HttpClient,
    private ToastrService: ToastrService,
    private HttpService: HttpService,
    private HTMLElementsService: HTMLElementsService,
    private CacheService: CacheService,
    private FormBuilder: FormBuilder,

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
  ngAfterViewInit() {

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

      this.HttpService.httpPOSTRequest("api/files/checkIfStorageHaveEnoughtSpace",JSON.stringify({Bytes:this.selectedFile.size,rootId:this.UserService.rootId})).subscribe(
        (response)=>{
          this.HttpService.httpGETRequest(`api/files/${enviroments.currentFolder}/${FinalFileName}/checkIfFileNameAlreadyExists`).subscribe(
              (response: any) => {
                console.log(9)
                const originalName = this.selectedFile!.name; //contains the extension of the file

                formData.append('file', this.selectedFile!, FinalFileName);
                formData.append('rootId', this.UserService.rootId);
                formData.append(
                  'parentFolderId',
                  enviroments.currentFolder
                );
                this.HttpService.httpPOSTRequest('api/files/upload',formData,{
                  reportProgress: true,
                  observe: 'events',
                  headers : null

                }).subscribe((event:any) => {

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
                        this.CacheService.files.push(event.body)
                          this.HttpService.httpGETRequest(`api/files/${this.UserService.rootId}/getOnlyRootInfo`).subscribe(
                            (response:any) => {

                              const {folder} = response
                              this.HeaderService.updateUsedStorage(folder.storageVolume,folder.usedStorage)
                            },
                            (error)=>{
                              this.ToastrService.error(error.message,"Error",constants.toastrOptions)

                            })

                        this.PopupService.hidePopup()
                      }

                    }
                  },
                  error => {
                    this.ToastrService.error(error.message,"Error",constants.toastrOptions)
                  });
              },
              (error) => {

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
