import { Injectable } from '@angular/core';
import {Completions, Dirs, file, folder} from "../types";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  completions: Completions[] =[];
  allCompletions: Completions[] =[];
  dirs: Dirs[] = [];
  notifications!: [
    {
      notification:{
        message:string
        ,level:number
      },
      seen:boolean
    }
  ];


  files: file[] = [];
  elementInfo!: any
  cellCrossMarkLength!: number
  folders: folder[] = [];
}
