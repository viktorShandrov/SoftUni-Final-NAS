import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {StorageService} from "../../../services/storage.service";
import {DashboardService} from "../../../services/dashboard.service";
import {topExtI,topFolders} from "../../../../../shared/types";
import {DarkModeService} from "../../../../../core/services/dark-mode.service";
import {HTMLElementsService} from "../../../../../shared/services/htmlelements.service";
import {HeaderService} from "../../../../../core/services/header.service";
import {constants} from "../../../../../shared/constants";




@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements AfterViewInit{
  @ViewChildren('extBar') extQ!: QueryList<ElementRef>;
  @ViewChildren('folderBar') foldersQ!: QueryList<ElementRef>;
  @ViewChild('dashboardStorageProgressBar') dashboardStorageProgressBar!: ElementRef;
  storageVolume: number = 0;
  constants = constants
  usedStorage: string = "0 MB";
  storageLeft: number = 0;
  isLoading:Boolean=true

  topExt: topExtI[] = [
    {
      name: 'unknown',
      count: 0,
    },
    {
      name: 'unknown',
      count: 0,
    },
    {
      name: 'unknown',
      count: 0,
    },
  ];
  topFolders: topFolders[] = [
    {
      name: 'unknown',
      count: 0,
    },
    {
      name: 'unknown',
      count: 0,
    },
    {
      name: 'unknown',
      count: 0,
    },
  ];
  constructor(
    private Renderer2: Renderer2,
    private element: ElementRef,
    public DashboardService: DashboardService,
    public HeaderService: HeaderService,
    private HTMLElementsService: HTMLElementsService,
    private DarkModeService: DarkModeService,
    private StorageService: StorageService,
  ) {}
  transform(value: number): string {
    let mesure = "GB"
    let volume = value/1000000000 //GB
    if(volume<1){
      mesure = "MB"
      volume =  volume*1000 //MB
      if(volume<1){
        return `<${volume.toFixed(0)}${mesure}`
      }
    }
    return `${volume.toFixed(2)}${mesure}`
  }
  ngAfterViewInit() {
    this.Renderer2.setStyle(this.element.nativeElement,"display","flex")
    this.Renderer2.setStyle(this.element.nativeElement,"flex-direction","column")
    this.Renderer2.setStyle(this.element.nativeElement,"height","100%")
    this.HTMLElementsService.dashboardStorageProgressBar = this.dashboardStorageProgressBar
        setTimeout(async ()=>{

          this.isLoading = true
          this.DarkModeService.setTheTheme()
          await this.DashboardService.getTopExtData(this.extQ, this.Renderer2);
          this.isLoading = false
          this.topExt = this.DashboardService.topExt;
          await this.DashboardService.getTopFoldersData(
            this.foldersQ,
            this.Renderer2
          );
          await this.DashboardService.getStorageVolumeInfo();
          this.storageVolume = this.DashboardService.storageVolume/1000000000;

          this.usedStorage = this.transform(this.DashboardService.usedStorage)
          this.storageLeft = Number((this.DashboardService.storageLeft/1000000000).toFixed(2));
        },0)
      }

}
