import {Component, Input} from '@angular/core';
import {UserService} from "../../../../core/services/user.service";
import {Form} from "@angular/forms";
import {HttpService} from "../../../../shared/services/http.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  formData:any   ={}
  constructor(
    public UserService: UserService,
    public HttpService: HttpService,
  ) {
  }
  onSubmit(checkBox:HTMLInputElement,levelInput:HTMLSelectElement){
    this.HttpService.httpPOSTRequest("api/users/createNotification",{
      userId: checkBox.checked?undefined:this.formData.userId,
      level:levelInput.value,
      message:this.formData.message
    }).subscribe(
      (res)=>{
        console.log(res)
      },
      (error)=>{
        console.log(error)
      }
    )
  }
}
