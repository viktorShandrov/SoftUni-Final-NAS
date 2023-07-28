import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-user-login-register-view',
  templateUrl: './user-login-register-view.component.html',
  styleUrls: ['./user-login-register-view.component.css']
})
export class UserLoginRegisterViewComponent implements OnInit {
constructor(public Router:Router){}
ngOnInit(){
  localStorage.clear()
}
}
