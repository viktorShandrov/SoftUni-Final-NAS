import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { topExtI, topFolders } from '../../../shared/types';

import { StorageService } from 'src/app/storage/storage.service';
import {DashboardService} from "../../services/dashboard.service";
import { StorageNavigationComponent } from 'src/app/storage/components/storage-navigation/storage-navigation.component';
import { CommunicationService } from 'src/app/shared/communication-module/communication.service';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent {
  @ViewChildren('extBar') extQ!: QueryList<ElementRef>;
  @ViewChildren('folderBar') foldersQ!: QueryList<ElementRef>;
  storageVolume: number = 0;
  usedStorage: string = "0 MB";
  storageLeft: number = 0;

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
    private DashboardService: DashboardService,
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
      this.StorageService.sharingCurrentSection$.subscribe(async (section)=>{

        console.log('section: ', section);
        if(section==="dashboard"){
          console.log(10);

          await this.DashboardService.getTopExtData(this.extQ, this.Renderer2);
          this.topExt = this.DashboardService.topExt;
          await this.DashboardService.getTopFoldersData(
            this.foldersQ,
            this.Renderer2
          );
          this.topFolders = this.DashboardService.topFolders;
          await this.DashboardService.getStorageVolumeInfo();
          this.storageVolume = this.DashboardService.storageVolume/1000000000;

          this.usedStorage = this.transform(this.DashboardService.usedStorage)
          this.storageLeft = Number((this.DashboardService.storageLeft/1000000000).toFixed(2));

        }

      })
    setTimeout( () => {
    }, 0);
  }
}
