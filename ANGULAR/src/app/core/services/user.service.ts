import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    rootId!:string
    jwtToken!:string
    email!:string
  constructor() { }
}
