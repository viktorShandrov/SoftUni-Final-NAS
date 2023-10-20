import { Injectable } from '@angular/core';
import {HttpService} from "../../../shared/services/http.service";
import {switchMap} from "rxjs";
import {StripeService} from "ngx-stripe";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class StipeService {

  constructor(
    private HttpService:HttpService,
    private StripeService:StripeService,
    private ToastrService:ToastrService,

  ) {
  }

  checkout() {
    // Check the server.js tab to see an example implementation
    this.HttpService.httpPOSTRequest('api/stripe/create-checkout-session', {})
      .pipe(
        switchMap((session:any) => {
          return this.StripeService.redirectToCheckout({ sessionId: session.id })
        })
      )
      .subscribe(result => {

        if (result.error) {
          this.ToastrService.error(result.error.message,"Error")
        }
      },
        error=>{
          this.ToastrService.error(error.message,"Error")
        });
  }

}
