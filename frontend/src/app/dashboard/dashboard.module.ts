import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [UserDashboardComponent, AdminDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    OwlDateTimeModule,
    NgbModalModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: 'admin', component: AdminDashboardComponent },
                            { path: 'user', component: UserDashboardComponent}])
  ]
})
export class DashboardModule { }
