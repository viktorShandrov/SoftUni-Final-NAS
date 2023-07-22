import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { topExtI, topFolders } from '../../shared/types';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent {
  @ViewChildren('extBar') extQ!: QueryList<ElementRef>;
  @ViewChildren('folderBar') foldersQ!: QueryList<ElementRef>;
  storageVolume: number = 0;
  usedStorage: number = 0;
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
    private DashboardService: DashboardService
  ) {}
  ngAfterViewInit() {
    setTimeout(async () => {
      await this.DashboardService.getTopExtData(this.extQ, this.Renderer2);
      this.topExt = this.DashboardService.topExt;
      await this.DashboardService.getTopFoldersData(
        this.foldersQ,
        this.Renderer2
      );
      this.topFolders = this.DashboardService.topFolders;
      await this.DashboardService.getStorageVolumeInfo();
      this.storageVolume = this.DashboardService.storageVolume/1000000000;
      this.usedStorage = Number((this.DashboardService.usedStorage/1000000000).toFixed(2));
      this.storageLeft = Number((this.DashboardService.storageLeft/1000000000).toFixed(2));
    }, 0);
  }
}
