import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import {passwordMatchValidator} from "../../validators/password.validator";
import {RegisterService} from "../../services/register.service";
import {HttpService} from "../../../../shared/services/http.service";
import {ToastrService} from "ngx-toastr";
import {constants} from "../../../../shared/constants";


declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements AfterViewInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private RegisterService: RegisterService,
    private ToastrService: ToastrService,
    private HttpService: HttpService,
    private renderer:Renderer2
  ) {
    this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        rePass: ['', Validators.required]
      }
      ,{validator:passwordMatchValidator()});
  }


  ngAfterViewInit(): void {
      google.accounts.id.initialize({
        client_id: '341272107557-fp6lu6llorj0912vt59nj8j4mrstekst.apps.googleusercontent.com',
        callback: this.RegisterService.registerViaGoogle
      });
    this.toggleGoogleSignMenu()
  }
  toggleGoogleSignMenu(){
    google.accounts.id.prompt();
  }


  // handleGoogleBtn(){
  //   const auth2 = gapi.auth2.getAuthInstance();
  //
  //   auth2.signIn().then((googleUser:any) => {
  //     const profile = googleUser.getBasicProfile();
  //     console.log('User signed in:', profile.getName(), profile.getEmail());
  //     // Perform further actions or logic here
  //   });
  // }
  onSubmit(): void {

    if (this.formGroup.valid) {
      const email = this.formGroup.get("email")!.value
      const password = this.formGroup.get("password")!.value
      const rePass = this.formGroup.get("rePass")!.value
      this.RegisterService.register(email,password,rePass,this.renderer)
    }
  }
}

