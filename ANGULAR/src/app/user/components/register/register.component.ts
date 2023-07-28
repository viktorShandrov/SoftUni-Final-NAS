import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { passwordMatchValidator } from './password.validator';
import { RegisterService } from './register.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  formGroup: FormGroup; 

  constructor(
    private formBuilder: FormBuilder,
    private RegisterService:RegisterService
    ) {
    this.formGroup = this.formBuilder.group({
      email: ['viktor_shandrov@abv.bg', [Validators.required, Validators.email]],
      password: ['aaaaa', [Validators.required, Validators.minLength(5)]],
      rePass: ['aaaaa', Validators.required]
    }
    ,{validator:passwordMatchValidator()});
  }

  ngOnInit(): void {}

  onSubmit(): void {
    
    if (this.formGroup.valid) {
      const email = this.formGroup.get("email")!.value
      const password = this.formGroup.get("password")!.value
      const rePass = this.formGroup.get("rePass")!.value
      this.RegisterService.register(email,password,rePass)
    } 
  }
}
