import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoginService} from "../../services/login.service";


declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '341272107557-fp6lu6llorj0912vt59nj8j4mrstekst.apps.googleusercontent.com',
      callback: this.LoginService.loginViaGoogle
    });
    // this.toggleGoogleSignMenu()
  }

  toggleGoogleSignMenu(){
    google.accounts.id.prompt();
  }
  onSubmit(formGroup:FormGroup){
    if (formGroup.valid) {
      const email = formGroup.get("email")!.value
      const password = formGroup.get("password")!.value
      this.LoginService.login(email,password,this.renderer)
    }
  }

}
