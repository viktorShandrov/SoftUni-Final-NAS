import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {constants} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private HttpClient:HttpClient) {}

  httpGETRequest(URL:string,options?:object){
    return this.HttpClient.get(URL,options)
  }
  httpPOSTRequest(URL:string,payLoad:string|object,options?:any){
    if (options&&!options.hasOwnProperty("headers")){
    options.headers = {"Content-Type":constants.jsonHeaders}
    }else if(!options){
      options = {headers : {"Content-Type":constants.jsonHeaders}}
    }

    return this.HttpClient.post(URL,payLoad,options)
  }
}
