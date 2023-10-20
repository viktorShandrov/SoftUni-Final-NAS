import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RegisterService} from "../../services/register.service";

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.css']
})
export class RegistrationConfirmationComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private RegisterService: RegisterService,
    private Renderer2: Renderer2,
    ) { }
  ngOnInit(): void {
    console.log(1111111111111)
    // Use the ActivatedRoute service to get the parameter
    this.route.params.subscribe(params => {
      const {email,password} = params
      console.log(params)
      this.RegisterService.register(email,password,password,this.Renderer2)
    });
  }
}
