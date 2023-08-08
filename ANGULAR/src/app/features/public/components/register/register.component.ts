import {Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import {passwordMatchValidator} from "../../validators/password.validator";
import {RegisterService} from "../../services/register.service";



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private RegisterService: RegisterService,

    private renderer:Renderer2
  ) {
    this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        rePass: ['', Validators.required]
      }
      ,{validator:passwordMatchValidator()});
  }

  ngOnInit(): void {}

  onSubmit(): void {

    if (this.formGroup.valid) {
      const email = this.formGroup.get("email")!.value
      const password = this.formGroup.get("password")!.value
      const rePass = this.formGroup.get("rePass")!.value
      this.RegisterService.register(email,password,rePass,this.renderer)
    }
  }
}

