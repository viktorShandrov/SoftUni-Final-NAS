import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2,
  ViewChild,
  HostBinding,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { file, folder } from 'src/app/shared/types';
import {StorageService} from "../../../services/storage.service";
import {CacheService} from "../../../../../shared/services/cache.service";
import {HttpService} from "../../../../../shared/services/http.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {enviroments} from "../../../../../shared/environments";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../../../shared/constants";
import {UserService} from "../../../../../core/services/user.service";


@Component({
  selector: 'app-storage-content',
  templateUrl: './storage-content.component.html',
  styleUrls: ['./storage-content.component.css'],
  animations:[
    trigger("crossMarkAnim",[
      // state("out",style({width:'0px'})),
      // state("in",style({width: '{{cellCrossMarkLength}}px'}),{params: {cellCrossMarkLength: '0'}}),
      transition("out => in",animate(400 ))
    ]),
    trigger("cellDisappear",[
      state("in",style({transform:"scale(1)"})),
      state("out",style({transform:"scale(0)"})),
      transition("in => out", animate(500,keyframes([
        style({
          transform:"scale(1.2)",
          offset:0.5
        }),
        style({
          transform:"scale(0)",
          offset:1
        }),
      ])))
    ]),
    trigger("tableViewDelete",[
      state("in",style({
        transform:"translateX(0)",
        opacity:1
      })),
      state("out",style({
        transform:"translateX(100px)",
        opacity:0
      })),
      transition("in =>out",animate(800))
    ])
  ]
})
export class StorageContentComponent implements AfterViewInit {
  folders!: folder[];
  files!: file[];
  haveFolder: Boolean = false;
  cellCrossMarkLength:Number = 0

  enviroments!:any
  isLoading:boolean=true
  loadingDelayPassed = false;

  fileExtensions:Array<String> = ["pdf","mp3","html","jpg","png","txt","docx","zip","rar","exe"]

  @ViewChildren("imageContainer") imageContainers!:QueryList<ElementRef>
  @ViewChildren('folderElement') foldersRef!: QueryList<ElementRef>;
  @ViewChildren('fileElement') filesRef!: QueryList<ElementRef>;

  constructor(
    private HttpService: HttpService,
    private route: ActivatedRoute,
    public StorageService: StorageService,
    public CacheService: CacheService,
    public HTMLElementsService: HTMLElementsService,
    public UserService: UserService,
    public ToastrService: ToastrService,
    public Router: Router,
    private renderer: Renderer2
  ) {
    this.enviroments = enviroments
    setTimeout(()=>{
      // this.folders[0].isDisappearing = true
    },1000)
  }

  isLoadingSet(isLoading:Boolean){
      if(isLoading){
        this.loadingDelayPassed = false;
        setTimeout(() => {
          if (!this.loadingDelayPassed) {
            this.isLoading = true;
          }
        }, 1000);
      }else{
        this.isLoading = false
        this.loadingDelayPassed = true;
      }
  }
  ngAfterViewInit(): void {


    this.folders =this.CacheService.folders;
    for (const folder of this.folders) {
      folder.isDisappearing = false
      folder.isCrossed = false
    }

    this.files = this.CacheService.files;

    this.HTMLElementsService.foldersQL = this.foldersRef
    this.HTMLElementsService.filesQL = this.filesRef

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') as String;
      if(id!=="dashboard"&&id!=="sharedWithMe"&&id!=="sharedWithUsers"){
        this.getData(id);
        this.isLoadingSet(true)
      }
    });

    setTimeout(()=>{
      for (let imageContainer of this.imageContainers) {

        this.StorageService.setCrossMarkProperly(imageContainer)

      }

    },200)
  }


  getData(dirId: String) {
    this.HttpService.httpGETRequest(`api/files/${dirId}/getDirectory`).subscribe(
      (folder: any) => {
        this.isLoadingSet(false)
        if(folder&&folder.isPublic&&folder.rootId!==this.UserService.rootId){
          this.Router.navigate(['/storage', { outlets: { 'storage-outlet': `shared-with-me/${folder._id}` } }])
          return
        }


        if (folder) {
          this.haveFolder = true;
          this.CacheService.completions.splice(0);
          this.folders.splice(0);
          this.files.splice(0);
          this.StorageService.hasFiles = false
          this.StorageService.hasFolders = false
          if(folder.dirComponents.length>0){
            this.StorageService.hasFolders = true
            for (const dirComponent of folder.dirComponents) {

              this.folders.push(dirComponent);
              this.CacheService.completions.push({
                name: dirComponent.name,
                _id: dirComponent._id,
              });
            }
            this.CacheService.allCompletions = [...this.CacheService.completions]
          }

          if(folder.fileComponents.length>0) {
            this.StorageService.hasFiles = true
            for (const fileComponent of folder.fileComponents) {
              this.files.push(fileComponent);
            }
          }

          setTimeout(() => {
            this.StorageService.addEventListenerOnFilesAndFoldersToBeClickable(
              this.foldersRef,
              this.filesRef
            );
          }, 0);
        }
      },
      (error) => {
        this.isLoadingSet(false)
        this.haveFolder = false;
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      });
  }
  crossMarkAnimationDone(event: any,element:folder|file) {
    if (event.toState === 'in') {
      element.isCrossed = true
    }
  }



}
