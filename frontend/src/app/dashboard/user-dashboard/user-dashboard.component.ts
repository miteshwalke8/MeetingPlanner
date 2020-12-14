import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {


  public title: string;
  public inviter: any;
  public invitee: any;
  public start: any;
  public end: any;
  public authToken: any
  public allUsers: any[];
  public meetings: any = []
  public allUsersData: any[]
  public isAdmin: any
  public userSortedList: any;
  public events: CalendarEvent[] = [];
  public selectedMeetingForView: any;
  public showMeetingDetails: boolean = false;
  public meetingModalRef: BsModalRef;
  public reminderModalRef: BsModalRef;

  @ViewChild('meetingTemplate') meetingTemplate: TemplateRef<any>;
  @ViewChild('reminderTemplate') reminderTemplate: TemplateRef<any>;
  public isReminderSnooze: boolean = true;
  meetingEvent: any;

  
  ngOnInit(): void {
    //checking for the authToken if not then redirect the page to login
    this.authToken = Cookie.get('authToken');
    this.isAdmin = Cookie.get('activeUserType') === 'admin';

    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || Cookie.get('authToken') == undefined) {
      if (this.meetingModalRef) {
        this.meetingModalRef.hide();
      }
      if (this.reminderModalRef) {
        this.reminderModalRef.hide();
      }
      this.router.navigate(['']);
    }
    if (this.isAdmin === false) {
      console.log('266')
      this.getMeetings();
    } else {
      this.router.navigate(['']);
    }

    // reminder 
    setInterval(() => {
      this.meetingReminder()
    }, 5000)
  }

  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  constructor(
    private router: Router,
    public appService: AppService,
    public toastr: ToastrService,
    public socketService: SocketService,
    private modalService: BsModalService
  ) { }

  public getMeetings(): void {
    //to get meetings to display in calender view.
    this.appService.getMeetingsByInvitee()
      .subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.meetings = apiResponse.data;
          console.log(apiResponse.data);
          console.log(this.meetings);
          for (let event of this.meetings) {
            event.title = event.title;
            event.start = this.getDateObject(event.start);
            event.end = this.getDateObject(event.end);
            event.color = event.color;
            event.actions = null;
            event.remindMe = true;
          }
          this.events = this.meetings
          this.toastr.success('meetings found for you');
        } else {
          this.toastr.error(apiResponse.message);
          console.log('No meetings found')
          this.meetings = [];
        }
      }, (error) => {
        this.toastr.error('something went wrong' + error);
        this.meetings = [];
      })
  }

  public onCalendarEvent(calendarEvent): void {
    //  when user click to view meeting details
    if (calendarEvent.action == 'view') {
      this.showMeetingDetails = true;
      this.selectedMeetingForView = calendarEvent.event;
      this.appService.getUserById(calendarEvent.event.inviter)
        .subscribe((apiResponse) => {
          if (apiResponse.status == 200) {
            this.selectedMeetingForView['inviterFullName'] = `${apiResponse.data.firstName} ${apiResponse.data.lastName} (${apiResponse.data.userName})`
            this.meetingModalRef = this.modalService.show(this.meetingTemplate);
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (error) => {
          this.toastr.error('something went wrong' + error);
        })
    }
  }

  public closeModal(): void {
    // function to close the meeting modal
    this.getMeetings();
    this.meetingModalRef.hide();
  }

  public meetingReminder(): void {
    // function called for meeting reminder
    let currentTime = new Date().getTime();
    for (let meeting of this.meetings) {
      let timeDifference = (meeting.start).getTime() - currentTime;
      if (timeDifference <= 60000 && timeDifference > 0) {
        if ((this.isReminderSnooze || this.meetingEvent != meeting) && Cookie.get('authToken') != null) {
          this.isReminderSnooze = false;
          this.meetingEvent = meeting;
          this.reminderModalRef = this.modalService.show(this.reminderTemplate);
          break;
        }
      } else if ((meeting.start).getTime() == currentTime && Cookie.get('authToken') != null) {
        this.toastr.info('Meeting started');
      }
    }
  }
  public snoozeReminderModal(): void {
    // funtion called when meeting reminder snoozed
    this.isReminderSnooze = true;
    this.reminderModalRef.hide();
  }
  public dismissReminderModal(): void {
    // funtion called when meeting reminder dismissed
    this.reminderModalRef.hide();
  }

  private getDateObject(date): Date {
    //fused to convert the date into UTC format
    return new Date(
      new Date(date).getUTCFullYear(),
      new Date(date).getUTCMonth(),
      new Date(date).getUTCDate(),
      new Date(date).getUTCHours(),
      new Date(date).getUTCMinutes()
      );
  }

}




