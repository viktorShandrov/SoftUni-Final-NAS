import { Component } from '@angular/core';
import { StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  constructor(private StorageService:StorageService){}

get rootId():string{
  return this.StorageService.rootId
}
}
