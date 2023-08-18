import { Component } from '@angular/core';
import {RouterService} from "./core/router/router.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'getting-things-understand';

  constructor(
    private RouterService:RouterService
  ) {
   this.RouterService.detectInitialNavigation()
  }
    handleGoogleSignIn(user:any) {
      console.log('User signed in:');
    }

}
