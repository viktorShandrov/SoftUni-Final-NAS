import {Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoginService} from "../../services/login.service";




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private LoginService:LoginService,
    public renderer:Renderer2
  ) {
    this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      }
    );
  }

  ngOnInit(): void {}
  onSubmit(formGroup:FormGroup,renderer:Renderer2){
    if (formGroup.valid) {
      const email = formGroup.get("email")!.value
      const password = formGroup.get("password")!.value
      this.LoginService.login(email,password,renderer)
    }
  }

}
