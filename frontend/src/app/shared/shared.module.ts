import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CalenderComponent } from './calender/calender.component';
import { MeetingsComponent } from './meetings/meetings.component';

//modules
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import 'flatpickr/dist/flatpickr.css'; 
@NgModule({
  declarations: [HeaderComponent, CalenderComponent, MeetingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
   FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory


    }),


  ],

  exports: [

    HeaderComponent,
    CalenderComponent,
    MeetingsComponent

  ]
})
export class SharedModule { }
