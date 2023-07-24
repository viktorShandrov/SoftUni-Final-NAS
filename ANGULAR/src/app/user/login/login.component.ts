import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register/register.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup; 

  constructor(
    private formBuilder: FormBuilder,
    private LoginService:LoginService
    ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['aaaaa', [Validators.required]],
    }
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    
    if (this.formGroup.valid) {
      const email = this.formGroup.get("email")!.value
      const password = this.formGroup.get("password")!.value
      this.LoginService.login(email,password)
    } 
  }
}
