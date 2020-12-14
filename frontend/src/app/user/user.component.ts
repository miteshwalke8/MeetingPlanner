import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public isResetPassWord = false;
  public isForgatePassword = false;
  public currentUrl: string;
  public userId: string;

  constructor(    private router: Router
    ) 
    { }

  ngOnInit(): void {
    // if route path is reset password then redirect to reset password page
    let paramsArray = this.router.url.split('/resetPassword/');
    if (paramsArray.length == 2) {
      this.userId = paramsArray[1];
      this.isResetPassWord = true;
    } else {
      this.router.navigate(['']);
    }
  }

}
