import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {constants} from "../../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private ToastrService: ToastrService,

  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const rootId = localStorage.getItem('rootId');
    if (token&&rootId) {
      return true;
    } else {
      this.ToastrService.warning("you have to login","Unable to proceed",constants.toastrOptions)
      this.router.navigate(['/users', { outlets: { 'users-view': 'login' } }]);
      return false;
    }
  }
}

