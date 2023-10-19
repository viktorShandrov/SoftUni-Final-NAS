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
import * as JSZip from 'jszip';




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
            console.log(lastFolder)
            const imageContainer = lastFolder.nativeElement.querySelector(".image")
            this.setCrossMarkProperly(imageContainer)
            this.makeFolderOrFileClickableEffect(lastFolder)
          },0)
        },
        (error) => {
          document.querySelector('.errorMessage')!.textContent =
            error.error.message;
        }
      );
  }

  dowloadFolder(){
    const zip = new JSZip();

    const fetchPromises:any = [];
    const elementsToDownload:any=[
      { fileName:"ivan",
        key:"https://storage.googleapis.com/theconfederacyfiles/652fc5fd794933510d2ec890?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=borispavelbasnki%40storage-nas-angular.iam.gserviceaccount.com%2F20231018%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20231018T134616Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=ab8b15ce4545d405e8caeba0e82e5a7abdae3765553c4491f73f2cb6e07c518557c406475599b33fcf6f0da7e84f93c5939e67b7e2afe8dce088801eb6b58e7b2b8a4894a5075bbb0ba25bcb678355ea256cbadd91213aabbb37c826493dad77a835c07e0be1c49558c251141aaee2a06390e1deeff646c7e73bbf32bf93ce7f072779fdf7bdcc864168c712fe5a7028e9ae2b135070b93388f9d5f871c286537a2bff7b0af1178b1ad68d18c9cf50dfb5d9ed43406bbd05f62844e11ea55b77484afa00d106ba19cf37a707592f85e8096369b0c39871ee930ef99cd30649465b56348fd3829911443653cbe0877e872776c4262679931ca4b8eb06d1530320"},
       { fileName:"di",
        key:"https://storage.googleapis.com/theconfederacyfiles/652fc5fd794933510d2ec890?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=borispavelbasnki%40storage-nas-angular.iam.gserviceaccount.com%2F20231018%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20231018T134616Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=ab8b15ce4545d405e8caeba0e82e5a7abdae3765553c4491f73f2cb6e07c518557c406475599b33fcf6f0da7e84f93c5939e67b7e2afe8dce088801eb6b58e7b2b8a4894a5075bbb0ba25bcb678355ea256cbadd91213aabbb37c826493dad77a835c07e0be1c49558c251141aaee2a06390e1deeff646c7e73bbf32bf93ce7f072779fdf7bdcc864168c712fe5a7028e9ae2b135070b93388f9d5f871c286537a2bff7b0af1178b1ad68d18c9cf50dfb5d9ed43406bbd05f62844e11ea55b77484afa00d106ba19cf37a707592f85e8096369b0c39871ee930ef99cd30649465b56348fd3829911443653cbe0877e872776c4262679931ca4b8eb06d1530320"},

       ]
// Fetch each file and add it to the ZIP archive
    elementsToDownload.forEach((element:any) => {
      const fetchPromise = fetch(element.key)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); // Convert the response to a Blob
        })
        .then((blob) => {
          // Add the fetched file to the ZIP archive
          zip.file(element.fileName+".txt", blob);
          zip.folder("te")
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error(error);
        });

      fetchPromises.push(fetchPromise);
    });

// After all promises are resolved, generate the ZIP archive
    Promise.all(fetchPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then(function (blob:any) {
        // Handle the ZIP archive here
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'myArchive.zip'; // Set the desired file name
        a.click();
      });
    });
  }
  downloadFile(key:string,element:any){

    fetch(key)
      .then((response) => {
      if (!response.ok) {
        this.ToastrService.error('Network response was not ok', "Error", constants.toastrOptions)
      }
      return response.blob(); // Convert the response to a Blob
    })
      .then((response: any) => {
        // Handle the downloaded file.
        const blob = new Blob([response], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${element.fileName}.${element.type}`; // Set the desired file name.
        a.click();
      })
      .catch((error) => {
        this.ToastrService.error(error.error.message, "Error", constants.toastrOptions)
      })

  }
  getSignedURI(element:any){
    this.HttpService.httpPOSTRequest("api/files/signedGC-URI", {action: "read",originalname:element._id}).subscribe(
      (res: any) => {
        const {key} = res
        console.log(key)
        this.downloadFile(key,element)
      },
      (error) => {
        this.ToastrService.error(error.error.message, "Error", constants.toastrOptions)
      }
    )
  }

  getElementDownload(elementId: string, isFile:boolean) {
    this.HttpService.httpGETRequest(`api/files/${elementId}/${isFile?"file":"folder"}/getElementInfo`).subscribe(
          (element: any) => {
            if(isFile){
              this.getSignedURI(element)
            }


          },
      (error)=>{
        this.ToastrService.error(error.error.message, "Error", constants.toastrOptions)
      }
      )




    //LEGACY

  //   const options = {
  //     headers: new HttpHeaders(),
  //     responseType: 'blob' as 'json',
  //   };
  //   this.HttpService.httpGETRequest(`api/files/${elementId}/${isFile?"file":"folder"}/getElementInfo`).subscribe(
  //     (element: any) => {
  //       console.log(element)
  //     this.HttpService.httpGETRequest(`api/files/${elementId}/${isFile?"file":"folder"}/download`,options).subscribe(
  //       (response: any) => {
  //         const blob = new Blob([response], {
  //           type: `application/${isFile?"octet-stream":"zip"}`,
  //         });
  //         const url = window.URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = `${isFile?element.fileName:element.name}.${isFile?element.type:"zip"}`;
  //         link.click();
  //         window.URL.revokeObjectURL(url);
  //       },
  //       error => {
  //         this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
  //       });
  //   },
  //     (error)=>{
  //       this.ToastrService.error(error.error.message,"Error",constants.toastrOptions)
  //     });
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
      setTimeout(()=>{
        renderer.setStyle(searchCompletion.nativeElement,"width",this.HTMLElementsService.url.nativeElement.getBoundingClientRect().width+"px")

      },400)
    });
    renderer.listen(urlBar.nativeElement, 'blur', (event: any) => {
      setTimeout(() => {
        renderer.setStyle(searchCompletion.nativeElement, 'display', 'none');
        renderer.setStyle(searchCompletion.nativeElement,"width",0)
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
            this.CacheService.folders[indexInFoldersCache].isDisappearing = true
            this.CacheService.completions.splice(indexInCompletionCache,1)
              if(enviroments.storageViewCellStructure){
                this.setCrossMarkLength(indexInFoldersCache,"directory")

              }


        }else if(elementType==="file"){
          const index = this.CacheService.files.findIndex((el) => el._id == elementId)
          this.CacheService.files[index].isDisappearing = true
          if (enviroments.storageViewCellStructure){
            this.setCrossMarkLength(index,"file")

          }



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

  setCrossMarkLength(indexInQL:number,type:String){
    if(type==="directory"){
      const crossMark = this.HTMLElementsService.foldersQL.toArray()[indexInQL].nativeElement.querySelector(".crossMark")
      this.HTMLElementsService.Renderer2.setStyle(crossMark,"width",this.CacheService.cellCrossMarkLength+"px")
    }else {
      const crossMark = this.HTMLElementsService.filesQL.toArray()[indexInQL].nativeElement.querySelector(".crossMark")
      this.HTMLElementsService.Renderer2.setStyle(crossMark,"width",this.CacheService.cellCrossMarkLength+"px")
    }
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
  setCrossMarkProperlyOnFoldersAndFiles(){
    for (const folderCell of this.HTMLElementsService.folderCells) {
      this.setCrossMarkProperly(folderCell.nativeElement)
    }
    for (const fileCell of this.HTMLElementsService.fileCells) {
      this.setCrossMarkProperly(fileCell.nativeElement)
    }
  }
  setCrossMarkProperly(cell:HTMLElement){
    const crossMarkContainer = cell.querySelector(".crossMarkContainer")
    const crossMark = crossMarkContainer!.querySelector(".crossMark")
    const rect = crossMarkContainer!.getBoundingClientRect();

    this.setCrossMarkLengthWithoutParentPadding(crossMarkContainer!)
    // Calculate the diagonal angle in degrees using trigonometry
    this.setDiagonalAngleOnCrossMark(crossMark!,rect)
  }
  setCrossMarkLengthWithoutParentPadding(crossMarkContainer:Element){
    const computedStyle = window.getComputedStyle(crossMarkContainer);
    // Extract the padding value (assuming it's the same for all sides)
    const padding = parseFloat(computedStyle.getPropertyValue("padding"));

    // Calculate the width and height excluding padding
    const crossMarkContainerHTMLEl = crossMarkContainer as HTMLElement
    const widthWithoutPadding = crossMarkContainerHTMLEl.offsetWidth - 2 * padding;
    const heightWithoutPadding = crossMarkContainerHTMLEl.offsetHeight - 2 * padding;

    // Calculate the diagonal length using the Pythagorean theorem
    this.CacheService.cellCrossMarkLength = Math.sqrt(Math.pow(widthWithoutPadding, 2) + Math.pow(heightWithoutPadding, 2));
  }
  setDiagonalAngleOnCrossMark(crossMark:Element,rect:any){
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
    if(section&&this.HTMLElementsService.Renderer2){
      this.HTMLElementsService.Renderer2.setStyle(section.nativeElement,"display","none")
    }
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
      this.HTMLElementsService.Renderer2.removeClass(folder.nativeElement,"allowedTextOverflowing")
      // this.HTMLElementsService.Renderer2.setStyle(folder.nativeElement,"white-space","nowrap")
    }
    for (const file of files.toArray()) {
      this.HTMLElementsService.Renderer2.removeClass(file.nativeElement,"allowedTextOverflowing")
      // this.HTMLElementsService.Renderer2.setStyle(file.nativeElement,"white-space","nowrap")
    }
  }
  showOverflowingCellText(element:HTMLElement){

    this.HTMLElementsService.Renderer2.addClass(element,"allowedTextOverflowing")
    // this.HTMLElementsService.Renderer2.setStyle(element,"white-space","wrap")
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
recalculateContextMenusPosition(x:number,y:number,contextMenu:HTMLElement,elementType:string){
  const menuWidth =contextMenu.getBoundingClientRect().width
  const menuHeight =contextMenu.getBoundingClientRect().height
  const mainWrapper = document.querySelector(".mainWrapper")
  const mainWrapperRightSidePosition = mainWrapper!.getBoundingClientRect().right
  const mainWrapperBottomSidePosition = mainWrapper!.getBoundingClientRect().bottom
  const menuRightSidePosition = x+menuWidth
  const menuBottomSidePosition = y+menuHeight
  let margin
  if(elementType==="directory"){
    margin = 70
  }else{
    margin =0
  }
  if(menuRightSidePosition>mainWrapperRightSidePosition){
    x -=  menuRightSidePosition - mainWrapperRightSidePosition+margin;
  }
  if(menuBottomSidePosition>mainWrapperBottomSidePosition){
    y -=  menuBottomSidePosition - mainWrapperBottomSidePosition+margin;
  }
    return {x,y}
}


  showElementContextMenu(HTMLElementsService:HTMLElementsService,event:MouseEvent){
    event.preventDefault()
    const element = event!.target! as HTMLElement
    const mainParentElement = element.closest(".cell") as HTMLElement;
    if(mainParentElement.getAttribute("isLocked")) return
    const renderer = this.HTMLElementsService.Renderer2
    let x = event.clientX-20
    const y = event.clientY-20
    let elementType:string
    let id
    if(mainParentElement.classList.contains("directory")){
      elementType = "directory"
      id = mainParentElement.getAttribute("_id")!
    }else if(mainParentElement.classList.contains("file")) {
      elementType = "file"
      id = mainParentElement.getAttribute("_id")!
    }
    setTimeout(()=>{
      const contextMenu = this.HTMLElementsService.rightClickMenu.nativeElement as HTMLElement

      renderer.setAttribute(contextMenu,"element-type",elementType!)
      renderer.setAttribute(contextMenu,"element-id",id!)
      renderer.setStyle(contextMenu,"display","flex")
      setTimeout(()=>{
        const recalculatedPositions = this.recalculateContextMenusPosition(x,y,contextMenu,elementType)
        renderer.setStyle(contextMenu,"top",recalculatedPositions.y+"px")
        renderer.setStyle(contextMenu,"left",recalculatedPositions.x+"px")

      },0)
    },0)

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
