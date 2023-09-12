import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {constants} from "../../shared/constants";
import {HttpService} from "../../shared/services/http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private ToastrService: ToastrService,
    private HttpService: HttpService,


  ) {}

  canActivate(): boolean {
    this.HttpService.httpGETRequest("api/users/isAdmin").subscribe(
      (res)=>{
      return true;

      }
    )
    if (token&&rootId) {
    } else {
      this.ToastrService.warning("you are not admin","Unable to proceed",constants.toastrOptions)
      this.router.navigate(['/users', { outlets: { 'users-view': 'login' } }]);
      return false;
    }
  }
}

