
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared/shared.module';

// const routes: Routes = [
//   {
//     path: '',
//       children: 
//       [
//         {path: 'resetPassword/:userId', component:ResetPasswordComponent},

//       ]
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
     { path: 'sign-up', component: SignupComponent },
     { path: 'login', component: LoginComponent },
     {path: 'resetPassword/:userId', component:ResetPasswordComponent},
     { path: '', component: UserComponent }
        ])
  ],
  exports: [
   ResetPasswordComponent,

   ],
  declarations: [SignupComponent, LoginComponent, ForgetPasswordComponent, ResetPasswordComponent, UserComponent]
})

export class UserModule { }
