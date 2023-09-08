import {ElementRef, Injectable, QueryList, Renderer2} from '@angular/core';
import {Dirs, folder} from "../../../shared/types";
import {Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";
import {enviroments} from "../../../shared/environments";
import {HttpService} from "../../../shared/services/http.service";
import {CacheService} from "../../../shared/services/cache.service";
import {UserService} from "../../../core/services/user.service";
import {HTMLElementsService} from "../../../shared/services/htmlelements.service";
import {HeaderService} from "../../../core/services/header.service";
import {PopupService} from "../../../shared/services/popup.service";
import {logMessages} from "@angular-devkit/build-angular/src/tools/esbuild/utils";
import {constants} from "../../../shared/constants";
import {ToastrService} from "ngx-toastr";
import {timeout} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  hasFolders: Boolean = false ;
  hasFiles: Boolean =false ;

  constructor(
    private HttpService:HttpService,
    private CacheService:CacheService,
    private UserService:UserService,
    private Router:Router,
    private HeaderService:HeaderService,
    private PopupService:PopupService,
    private ToastrService:ToastrService,
    private HTMLElementsService:HTMLElementsService
  ) { }


  createFolder(folderName: string,folders:folder[]) {

    const payload = {
      folderName,
      parentFolderId: enviroments.currentFolder,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.HttpService.httpPOSTRequest("api/files/createFolder",JSON.stringify(payload)).subscribe(
        (response: any) => {
          const newFolder: folder = response.newFolder;
          const newCompletion = {name:newFolder.name as string,_id:newFolder._id as string}
          this.CacheService.completions.push(newCompletion)
          setTimeout(()=>{
            const lastCompletion = this.HTMLElementsService.completionDivsRefs.toArray()[this.HTMLElementsService.completionDivsRefs.length-1]
            this.addEventListenersToSingleCompletionElement(lastCompletion,this.Router)
          },0)
          folders.push(newFolder);
          this.hasFolders = true
          this.PopupService.hidePopup();
          setTimeout(()=>{
            const lastFolder = this.HTMLElementsService.foldersQL.toArray()[this.HTMLElementsService.foldersQL.length-1]
            this.makeFolderOrFileClickableEffect(lastFolder)
          },0)
        },
        (error) => {
          document.querySelector('.errorMessage')!.textContent =
            error.error.message;
        }
      );
  }

  getElementDownload(elementId: string, isFile:boolean) {
    const options = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json',
    };
    this.HttpService.httpGETRequest(`api/files/${elementId}/${isFile?"file":"folder"}/getElementInfo`).subscribe(
      (element: any) => {
        console.log(element)
      this.HttpService.httpGETRequest(`api/files/${elementId}/${isFile?"file":"folder"}/download`,options).subscribe(
        (response: any) => {
          const blob = new Blob([response], {
            type: `application/${isFile?"octet-stream":"zip"}`,
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${isFile?element.fileName:element.name}.${isFile?element.type:"zip"}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error => {
          this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
        });
    },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      });
  }

  addEventListenerToDivDir(
    divDir: ElementRef,
    index:number,
    dirs: Dirs[],
    renderer: Renderer2,
    router: Router
  ) {
    this.translateXOnDivDirElement(divDir,index)
    this.checkIfDirElementIsOnTheEndOFTheRow()
    renderer.listen(divDir.nativeElement, 'click', (e: any) => {
      const id = divDir.nativeElement.getAttribute('id');
      const startIndex = dirs.findIndex((el) => el._id === id);
      dirs.splice(startIndex + 1, dirs.length - startIndex);
      router.navigate([
        '/storage',
        { outlets: { 'storage-outlet': id } },
      ]);
    });
  }
  translateXOnDivDirElement(elementRef:ElementRef,index:number){
    const baseTranslation = 20
    this.HTMLElementsService.Renderer2.setStyle(elementRef.nativeElement,"transform",`translateX(0)`)
    // this.HTMLElementsService.Renderer2.setStyle(elementRef.nativeElement,"z-index",`${998-index}`)

  }

  addEventListenersToCompletionSection(
    urlBar: ElementRef,
    searchCompletion: ElementRef,
    renderer: Renderer2
  ) {

    renderer.listen(urlBar.nativeElement, 'focus', (event: any) => {
      renderer.setStyle(searchCompletion.nativeElement, 'display', 'block');
    });
    renderer.listen(urlBar.nativeElement, 'blur', (event: any) => {
      setTimeout(() => {
        renderer.setStyle(searchCompletion.nativeElement, 'display', 'none');
      }, 100);
    });
  }

  addEventListenerToTheMainRootBtn(
    rootBtn: ElementRef,
    dirs: Dirs[],
    renderer: Renderer2,
    router: Router
  ) {
    renderer.listen(rootBtn.nativeElement, 'click', () => {

      dirs.splice(0);
      router.navigate([
        '/storage',
        {
          outlets: {
            'storage-outlet': rootBtn.nativeElement.getAttribute('id'),
          },
        },
      ]);
    });
  }

  autoriseUserToFolder(folderId:string,email:string){
   return this.HttpService.httpPOSTRequest(`api/files/${folderId}/autoriseUserToFolder`,JSON.stringify({email}))
  }

  spliceFromList(event:any,index:number,elementType:string){

  if (event.toState === 'out') {

    if(elementType==="folder"){
      this.CacheService.folders.splice(
        index,
        1
      );
      if(this.CacheService.folders.length==0){
        this.hasFolders =false
      }
    }else if(elementType==="file"){
      this.CacheService.files.splice(
        index,
        1
      );

      if(this.CacheService.files.length==0){
        this.hasFiles =false
      }
    }
    }

    }

  deleteItem(menu: HTMLDivElement, renderer: Renderer2) {
    const elementId = menu.getAttribute('element-id');
    const elementType= menu.getAttribute('element-type')
    const payload = {
      elementId,
      elementType,
      parentFolderId: enviroments.currentFolder,
    };
    this.HttpService.httpPOSTRequest('api/files/deleteItem',JSON.stringify(payload)).subscribe(
      (response:any) => {
        renderer.setStyle(this.HTMLElementsService.rightClickMenu.nativeElement, 'display', 'none');

        if(elementType==="directory"){
          const indexInFoldersCache = this.CacheService.folders.findIndex((el) => el._id == elementId)
          const indexInCompletionCache = this.CacheService.completions.findIndex((el) => el._id == elementId)
          console.log(this.HTMLElementsService.foldersQL.toArray()[indexInFoldersCache].nativeElement)
          console.log(this.CacheService.cellCrossMarkLength);
          const crossMark = this.HTMLElementsService.foldersQL.toArray()[indexInFoldersCache].nativeElement.querySelector(".crossMark")
          this.HTMLElementsService.Renderer2.setStyle(crossMark,"width",this.CacheService.cellCrossMarkLength+"px")
          this.CacheService.folders[indexInFoldersCache].isDisappearing = true
          this.CacheService.completions.splice(indexInCompletionCache,1)


        }else{
          const index = this.CacheService.files.findIndex((el) => el._id == elementId)
          this.CacheService.files[index].isDisappearing = true



        }
        this.HttpService.httpGETRequest(`api/files/${this.UserService.rootId}/getOnlyRootInfo`).subscribe(
          (response: any) => {
            const { folder } = response;
            this.HeaderService.updateUsedStorage(
              folder.storageVolume,
              folder.usedStorage
            );
          },
          (error) => {
            this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
          }
        );
      },
      (error) => {
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    );
  }
  showUserDetailsFromIcon(event:MouseEvent){
      const element = event.target as HTMLElement
      this.HTMLElementsService.Renderer2.setAttribute(element,"isSelected","true")
    setTimeout(()=>{
      const userInfoFromIcon = element.querySelector(".userInfoFromIcon") as HTMLElement
      // Calculate the desired position
      const iconRect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const userInfoHeight = 100; // Adjust this based on your element's height
      const userInfoWidth = 100;  // Adjust this based on your element's width

      const desiredTop = iconRect.top + iconRect.height + 10; // Add some spacing
      const desiredLeft = iconRect.left - (userInfoWidth / 2) + (iconRect.width / 2);

      userInfoFromIcon!.style.top = Math.min(desiredTop, viewportHeight - userInfoHeight) + 'px';
      userInfoFromIcon!.style.left = desiredLeft + 'px';

    },0)
  }

  setCrossMarkProperly(imageContainer:ElementRef){
    const crossMark = imageContainer.nativeElement.querySelector(".crossMark")
    const rect = imageContainer.nativeElement.getBoundingClientRect();

    this.setCrossMarkLengthWithoutParentPAdding(imageContainer)
    // Calculate the diagonal angle in degrees using trigonometry
    this.setDiagonalAngleOnCrossMark(crossMark,rect)
  }
  setCrossMarkLengthWithoutParentPAdding(imageContainer:ElementRef){
    const computedStyle = window.getComputedStyle(imageContainer.nativeElement);

    // Extract the padding value (assuming it's the same for all sides)
    const padding = parseFloat(computedStyle.getPropertyValue("padding"));

    // Calculate the width and height excluding padding
    const widthWithoutPadding = imageContainer.nativeElement.offsetWidth - 2 * padding;
    const heightWithoutPadding = imageContainer.nativeElement.offsetHeight - 2 * padding;

    // Calculate the diagonal length using the Pythagorean theorem
    this.CacheService.cellCrossMarkLength = Math.sqrt(Math.pow(widthWithoutPadding, 2) + Math.pow(heightWithoutPadding, 2));
  }
  setDiagonalAngleOnCrossMark(crossMark:HTMLElement,rect:any){
    const diagonalAngleRad = Math.atan2(rect.height, rect.width);
    const diagonalAngleDeg = diagonalAngleRad * (180 / Math.PI);
    this.HTMLElementsService.Renderer2.setStyle(crossMark,"transform",`rotate(${diagonalAngleDeg}deg)`)
  }




  hideUserDetailsFromIcon(event:MouseEvent){
    this.HTMLElementsService.Renderer2.setAttribute(event.target,"isSelected","false")
  }
  addELToUserIcons(userIconsRefs:QueryList<ElementRef>){
    for (const userIconsRef of userIconsRefs.toArray()) {
      this.HTMLElementsService.Renderer2.listen(userIconsRef.nativeElement,"mouseenter",this.showUserDetailsFromIcon.bind(this))
      this.HTMLElementsService.Renderer2.listen(userIconsRef.nativeElement,"mouseleave",this.hideUserDetailsFromIcon.bind(this))
    }
  }
  showFileOrFolderDetailsSection(){
    const section =  this.HTMLElementsService.FileOrFolderDetailsAsideComponent
    this.HTMLElementsService.Renderer2.setStyle(section.nativeElement,"display","block")
  }
  hideFileOrFolderDetailsSection(){
    const section =  this.HTMLElementsService.FileOrFolderDetailsAsideComponent
    this.HTMLElementsService.Renderer2.setStyle(section.nativeElement,"display","none")
  }
  fetchDetails(id: String,elementType:String){
    return this.HttpService.httpPOSTRequest(`api/files/${id}/getDetails`,JSON.stringify({elementType}))
  }
  getDetails(menu: HTMLDivElement) {
    this.PopupService.hideAllOtherMenus()
    this.CacheService.elementInfo = undefined
    this.showFileOrFolderDetailsSection()

    const elementId = menu.getAttribute('element-id')
    const elementType = menu.getAttribute('element-type')
    this.fetchDetails(elementId!,elementType!).subscribe(
      (res:any)=>{
        this.CacheService.elementInfo = res.element
        this.CacheService.elementInfo.elementType = elementType
        setTimeout(()=>{
          this.addELToUserIcons(this.HTMLElementsService.userIconsRefs)
        },0)
      },
      (error)=>{
        this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
      }
    )
  }

  addEventListenerOnFilesAndFoldersToBeClickable(
    folders: QueryList<ElementRef>,
    files: QueryList<ElementRef>
  ) {
    if (folders) {
      for (const folderElement of folders) {
        this.makeFolderOrFileClickableEffect(folderElement)
      }
    }
    if (files) {
      for (const fileElement of files) {
        this.makeFolderOrFileClickableEffect(fileElement)
      }
    }
  }

  removeBGOnFoldersAndFiles(
    folders: QueryList<ElementRef>,
    files: QueryList<ElementRef>,
    renderer:Renderer2
  ) {
    if (folders) {
      for (const folderElement of folders) {
        renderer.removeStyle(folderElement.nativeElement, 'background-color');
      }
    }
    if (files) {
      for (const fileElement of files) {
        renderer.removeStyle(
          fileElement?.nativeElement,
          'background-color'
        );

      };
    }
  }


  getRootInfoForUpdatingHeaderStorageInfo() {
    this.HeaderService.isLoading = true
    this.HttpService.httpGETRequest(`api/files/${this.UserService.rootId}/getOnlyRootInfo`).subscribe(
      (response: any) => {
          this.HeaderService.isLoading = false
          const {folder} = response
          this.HeaderService.updateUsedStorage(folder.storageVolume, folder.usedStorage)
        },
        (error) => {
          this.HeaderService.isLoading = false
          this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
          return error
        })
  }

  makeFolderOrFileClickableEffect(element:ElementRef){
    this.HTMLElementsService.Renderer2.listen(element.nativeElement, 'click', () => {
      console.log(1121212)
      if(this.HTMLElementsService.foldersQL.length>0){
        for (const folder of this.HTMLElementsService.foldersQL) {
          this.HTMLElementsService.Renderer2.removeStyle(folder.nativeElement, 'background-color');
        }
      }
      if(this.HTMLElementsService.filesQL.length>0) {
        for (const file of this.HTMLElementsService.filesQL) {
          this.HTMLElementsService.Renderer2.removeStyle(file.nativeElement, 'background-color');
        }
      }
      this.HTMLElementsService.Renderer2.setStyle(
        element.nativeElement,
        'background-color',
        '#55beff'
      );
    });
  }

  hideAllOverflowingCellText(folders:QueryList<ElementRef>,files:QueryList<ElementRef>){
    for (const folder of folders.toArray()) {
      this.HTMLElementsService.Renderer2.removeClass(folder.nativeElement,"allowedTextOverflow")
      this.HTMLElementsService.Renderer2.setStyle(folder.nativeElement,"white-space","nowrap")
    }
    for (const file of files.toArray()) {
      this.HTMLElementsService.Renderer2.removeClass(file.nativeElement,"allowedTextOverflow")
      this.HTMLElementsService.Renderer2.setStyle(file.nativeElement,"white-space","nowrap")
    }
  }
  showOverflowingCellText(element:HTMLElement){
    this.HTMLElementsService.Renderer2.addClass(element,"allowedTextOverflow")
    this.HTMLElementsService.Renderer2.setStyle(element,"white-space","wrap")
  }

  addEventListenersToCompletionElements(
    completionDivs: QueryList<ElementRef>,
    router: Router
  ) {

    for (const div of completionDivs.toArray()) {
      this.addEventListenersToSingleCompletionElement(div,router)
    }
  }



    checkIfDirElementIsOnNextRow() {

        let flexChildren = this.HTMLElementsService.dirDivsRefs
        let previousOffset = 0;
        for (let flexChild of flexChildren ) {
          if (flexChild.nativeElement.offsetTop > previousOffset) {
            previousOffset = flexChild.nativeElement.offsetTop;
            flexChild.nativeElement.parentElement.classList.add('firstColumn');
          } else {
            flexChild.nativeElement.parentElement.classList.remove('firstColumn');
          }
        }
      }
  checkIfDirElementIsOnTheEndOFTheRow() {
    let flexChildren = this.HTMLElementsService.dirDivsRefs.toArray();
    const flexContainer = this.HTMLElementsService.divDirContainer
    let previousOffset = 0


     flexChildren.forEach((flexChild,index)=> {

      if (flexChild.nativeElement.getBoundingClientRect().right > previousOffset) {

        if(flexChildren[index-1]){
          flexChildren[index-1].nativeElement.parentElement.classList.remove('lastColumn');
        }
        previousOffset = flexChild.nativeElement.getBoundingClientRect().right
        flexChildren[index].nativeElement.parentElement.classList.add('lastColumn');
      } else {
        previousOffset = 0
        // flexChild.nativeElement.classList.add('lastColumn');
      }
    })
  }









  addDirDiv(name:string,_id:string){
      this.CacheService.dirs.push({ name, _id });
      setTimeout(()=>{
        this.checkIfDirElementIsOnNextRow()
        this.checkIfDirElementIsOnTheEndOFTheRow()
      },0)
    }

addEventListenersToSingleCompletionElement(element:ElementRef,router:Router){

  this.HTMLElementsService.Renderer2.listen(element.nativeElement, 'click', (e: any) => {
    const id = element.nativeElement.getAttribute('id');
    this.addDirDiv(element.nativeElement.textContent,id)
    this.Router.navigate([
      '/storage',
      { outlets: { 'storage-outlet': id } },
    ]);

  this.HTMLElementsService.urlBar.nativeElement.value = ""

setTimeout(()=>{
    const divDir = this.HTMLElementsService.dirDivsRefs.last;
    if (divDir) {
      this.addEventListenerToDivDir(divDir,this.HTMLElementsService.dirDivsRefs.length-1, this.CacheService.dirs, this.HTMLElementsService.Renderer2, router);
    }

},0)
  });
}
}
