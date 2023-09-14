import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {constants} from "../../shared/constants";
import {HttpService} from "../../shared/services/http.service";
import {catchError, Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private ToastrService: ToastrService,
    private HttpService: HttpService,


  ) {}

  canActivate(): Observable<boolean> {

    return this.HttpService.httpGETRequest("api/users/isAdmin").pipe(
      switchMap((res:any) => {

        // Check the response and return true or false based on your logic
        if (res.isAdmin) {
          return of(true);
        } else {
          this.ToastrService.warning("you are not admin","Unable to proceed",constants.toastrOptions)
          return of(false);
        }
      }),
      catchError((error) => {
        console.error("Error:", error);
        return of(false);
      })
    );
  }
}
// In this example, we use Angular's HttpClient to make the HTTP request, which integrates well with Angular's routing system. We return an observable that emits true or false based on your logic or errors. This approach aligns with Angular's recommended practices for routing guards.







      // this.router.navigate(['/users', { outlets: { 'users-view': 'login' } }]);
