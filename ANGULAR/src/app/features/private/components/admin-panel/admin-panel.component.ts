import {Component, Input} from '@angular/core';
import {UserService} from "../../../../core/services/user.service";
import {Form} from "@angular/forms";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  formData:any   ={}
  constructor(
    public UserService: UserService
  ) {
  }
  onSubmit(checkBox:HTMLInputElement,levelInput:HTMLSelectElement){
    console.log(this.formData)
    console.log(levelInput.value)
  }
}
