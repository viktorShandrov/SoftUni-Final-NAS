import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {HttpService} from "../../../../shared/services/http.service";



@Component({
  selector: 'app-plans-view',
  templateUrl: './plans-view.component.html',
  styleUrls: ['./plans-view.component.css']
})
export class PlansViewComponent implements OnInit {
  paymentHandler:any = null
constructor(
  private element:ElementRef,
  private Renderer2:Renderer2,
  private HttpService:HttpService,

) {
  this.Renderer2.setStyle(this.element.nativeElement,"display","flex")
  this.Renderer2.setStyle(this.element.nativeElement,"flex-direction","column")
  this.Renderer2.setStyle(this.element.nativeElement,"height","100% ")
}
ngOnInit() {
  // this.invokeStripe()
  // this.makePayment(10)
  this.HttpService.httpPOSTRequest("api/users/create-checkout-session",{}).subscribe(
    (res:any)=>{
      console.log(res)
      window.location.href = res.url;
    }
  )
}
// makePayment(amount:number) {
//   const paymentHandler = (<any>window).StripeCheckout.configure({
//     key: 'pk_test_51MVy7FHWjRJobyftqUOdDRoMwSs9sQvQkjQEDjDG0ctCnBhELCT4BrOWMAWfqgmQMyPcODRR45UpxmQ1WtdhX3ye00lrOHhy8i',
//     locale: 'auto',
//     token: function (stripeToken: any) {
//       console.log(stripeToken);
//     },
//   })
//   paymentHandler.open({
//     name:"Banica",
//     description:"kfdfgdfg",
//     amount:amount*100
//   })
// }
//
//   invokeStripe() {
//     if (!window.document.getElementById('stripe-script')) {
//       const script = window.document.createElement('script');
//       script.id = 'stripe-script';
//       script.type = 'text/javascript';
//       script.src = 'https://checkout.stripe.com/checkout.js';
//       script.onload = () => {
//         this.paymentHandler = (<any>window).StripeCheckout.configure({
//           key: 'pk_test_51MVy7FHWjRJobyftqUOdDRoMwSs9sQvQkjQEDjDG0ctCnBhELCT4BrOWMAWfqgmQMyPcODRR45UpxmQ1WtdhX3ye00lrOHhy8i',
//           locale: 'auto',
//           token: function (stripeToken: any) {
//             console.log(stripeToken);
//           },
//         })
//       }
//     window.document.body.appendChild(script);
//     }
//
//   }
}
