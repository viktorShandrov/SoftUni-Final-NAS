import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const rootId = localStorage.getItem('rootId');
    if (token&&rootId) {
      return true;
    } else {
      this.router.navigate(['/users', { outlets: { 'users-outlet': 'login' } }]);
      return false;
    }
  }
}

