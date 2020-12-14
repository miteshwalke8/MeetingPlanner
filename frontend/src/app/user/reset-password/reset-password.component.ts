import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public userId: any;
  public email: any;
  public confirmPassword: any;
  public password: any;
  activatedRoute: any;

  constructor(
    public appService: AppService,
    public router: Router,
    public tostr: ToastrService,
    private route: ActivatedRoute
    
  ) { }

  ngOnInit(): void {
    // this.userId = this.route.snapshot.queryParamMap.get('userId')
    // this.route.queryParamMap.subscribe(queryParams => {
    //   this.userId = queryParams.get('userId')
    // } )
   
    this.route.paramMap.subscribe(
      params => {
        this.userId = params.get('userId');
      }
    )
    console.log(this.userId)
  
  }
 public resetPassword(): void {
   if(this.password === this.confirmPassword) {
     let data = {
       userId:this.userId,
       password:this.password,
       email:this.email
     }
     this.appService.resetPassword(data).subscribe((apiResponse) => {
       if(apiResponse.status ==200){

         this.tostr.success('Congrats, password has been changed succesfully');
         this.router.navigate(['']);
       } else {
        this.tostr.error(apiResponse.message);
        console.log('gsnj')
        console.log(apiResponse.message)
        console.log(data);
      }
     } , (err) =>{
       this.tostr.error(err.message)
       console.log('jcnszjn')
     })
   } else {
     this.tostr.warning('password is not matched with confirmed password, please write again')
   }
 }
}
