import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild('meetingTemplate') meetingTemplate: TemplateRef<any>;
  @ViewChild('reminderTemplate') reminderTemplate: TemplateRef<any>;


  //declaratsions 
  public meetingModalRef: BsModalRef;
  public reminderModalRef: BsModalRef;
  public inviter: any;
  public authToken: any
  public meetings: any = [];
  public meetingListForReminder: any[];
  public userList: any[];
  public userSortedList: any[];
  public showUserList: boolean = true;
  public showCalender: boolean = false;
  public isEditMeeting: boolean = false;
  public selectedMeeting: any;
  public selectedDate: any;
  public selectedUser: any;
  public calendarAction: string;
  public events: CalendarEvent[] = [];
  public isReminderSnooze: boolean = true;
  public meetingEvent: any;
  public isAdmin: boolean;


  constructor(
    private router: Router,
    public socketService: SocketService,
    private modalService: BsModalService,
    public appService: AppService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void 
  {
    this.inviter = Cookie.get('activeUserId');
    this.authToken = Cookie.get('authToken');
    this.isAdmin = Cookie.get('activeUserType') === 'admin';

    // check authToken, if not then redirect to login page
    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || Cookie.get('authToken') == undefined) {
      if (this.meetingModalRef) {
        this.meetingModalRef.hide();
      }
      if (this.reminderModalRef) {
        this.reminderModalRef.hide();
      }
      this.router.navigate(['']);
    }
    if (this.isAdmin) {
      this.getAllUsers();
      this.getMeetingsByInviter();
    } else {
      this.router.navigate(['']);
    }
    // meeting reminder
    setInterval(() => {
      if (this.meetingListForReminder) {
        this.meetingReminder();
      }
    }, 5000)
  }
// user:any =  [];
// responseData:any =[];
// a:any =[];
  private getAllUsers(): void {
    //get all users 
    if (this.authToken) {
      this.appService.getUsers().subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          //fetching data from database and then storing it into the variable
          // this.responseData =(apiResponse.data);
          let responseData = apiResponse.data;
          console.log(responseData);
          //  this.a =JSON.parse(this.responseData);
          //  console.log(this.a);
          this.userList = [];
          console.log(this.userList);
          for (let i = 0; i < responseData.length; i++) {
            let user = {
              fullName: `${responseData[i].firstName} ${responseData[i].lastName}`,
              userName: responseData[i].userName,
              email: responseData[i].email,
              mobile: `+${responseData[i].countryCode} ${responseData[i].mobileNumber}`,
              userId: responseData[i].userId,
              isAdmin: responseData[i].isAdmin
            }
            this.userList.push(user)
            this.userSortedList = this.userList.sort((user1, user2) => {
              if (user1.fullName > user2.fullName) { return 1; }
              if (user1.fullName < user2.fullName) { return -1; }
              return 0;
            });
          }
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (error) => {
        this.toastr.error('something went wrong');
        console.log('something went wrong')
      })
    } else {
      this.toastr.info('Something went wrong, login again.');
      console.log('load again')
      if (this.meetingModalRef) {
        this.meetingModalRef.hide();
      }
      if (this.reminderModalRef) {
        this.reminderModalRef.hide();
      }
      this.router.navigate(['login']);
    }
  }

  private getMeetingsByInviter() {
    //get all meetings scheduled by admin for reminder
    this.appService.getMeetingsByInviter().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.meetingListForReminder = apiResponse.data;
        console.log(apiResponse.data)
      } else {
        this.toastr.error(apiResponse.message);
        console.log(apiResponse.message);
        console.log('No meetings found')
      }
    }, (error) => {
      this.toastr.error('something went wrong')
    })
  }

  public displaySelectedUserMeetings(selectedUser, isFirstCall) {
    // to get meeting of selected user by admin 
    this.selectedUser = selectedUser;
    console.log('qewe');
    Cookie.delete('selectedUserId');
    Cookie.delete('selectedUserFullName');
    Cookie.delete('selectedUserEmail');
    Cookie.set('selectedUserId', selectedUser.userId);
    Cookie.set('selectedUserFullName', `${selectedUser.fullName} (${selectedUser.userName})`);
    Cookie.set('selectedUserEmail', selectedUser.email);
    console.log(this.authToken);
    this.appService.getSelectedUserMeetings(this.inviter, selectedUser.userId, this.authToken)
     .subscribe((data) => {
        if (data.status === 200) {
          this.meetings = data.data
          for (let event of this.meetings) {
            event.title = event.title;
            event.start = this.getDateObject(event.start);
            event.end = this.getDateObject(event.end);
            event.color = event.color;
            event.actions = null;
            event.remindMe = true;
          }
          this.events = this.meetings
          if (isFirstCall) {
            this.toastr.success('meetings found for selected user');
          }
          this.showCalender = true;
          this.showUserList = false;
        } else {
          this.toastr.error(data.message)
          console.log(data.message);
          console.log('error')
          this.showCalender = true;
          this.showUserList = false;
          this.meetings = []
          console.log('23333');
          console.log(this.authToken);
        }
      }, (error) => {
        this.toastr.error('something went wrong' + error);
        console.log('something went wrong')
        this.showCalender = false;
        this.showUserList = true;
        this.meetings = []
      })
  }
  
 
  
  public onCalendarEvent(calendarEvent): any {
    this.calendarAction = calendarEvent.action;
    if (calendarEvent.action == 'create') {
      this.isEditMeeting = false;
      this.selectedDate = { start: calendarEvent.event.selectedDate, end: calendarEvent.event.selectedDate };
    } else if (calendarEvent.action == 'edit') {
      this.isEditMeeting = true;
      this.selectedMeeting = calendarEvent.event;
    } else if (calendarEvent.action == 'delete') {
      this.appService.deleteMeeting(calendarEvent.event.meetingId)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Meeting deleted');
            let meetingNotification = {
              message: `Meeting Canceled. Your meeting with title: "${calendarEvent.event.title}" on ${calendarEvent.event.start} has been cancled.`,
              userId: calendarEvent.event.invitee
            }
            this.socketService.notifyUpdates(meetingNotification);
            console.log(meetingNotification);
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (error) => {
          this.toastr.error('Error: something went wrong')
        });
    }
    if (calendarEvent.action == 'create' || calendarEvent.action == 'edit') {
      this.meetingModalRef = this.modalService.show(this.meetingTemplate, { class: 'modal-md' });
    }
  }


  private getDateObject(date): Date {
    //  function takes date as argument and returns date in UTC format
    return new Date(
      new Date(date).getUTCFullYear(),
      new Date(date).getUTCMonth(),
      new Date(date).getUTCDate(),
      new Date(date).getUTCHours(),
      new Date(date).getUTCMinutes());
  }

  public onCreateMeetingClicked(): void {
    // function called when create new meeting button clicked to disply modal from meeting
    this.calendarAction = "create";
    this.selectedDate = { start: new Date(), end: new Date() };
    this.meetingModalRef = this.modalService.show(this.meetingTemplate, { class: 'modal-md' });
  }

  public closeMeetingModal(): void {
    // close the meeting form modal on click of close
    this.displaySelectedUserMeetings(this.selectedUser, false);
    this.meetingModalRef.hide();
  }

  public meetingReminder(): void {
    // function called for meeting reminder
    let currentTime = new Date().getTime();
    for (let meeting of this.meetingListForReminder) {
      let meetingTime = (this.getDateObject(meeting.start)).getTime();
      let timeDifference = meetingTime - currentTime;
      if (timeDifference <= 60000 && timeDifference > 0) {
        if ((this.isReminderSnooze || this.meetingEvent != meeting) && Cookie.get('authToken')) {
          this.isReminderSnooze = false;
          this.meetingEvent = meeting;
          this.reminderModalRef = this.modalService.show(this.reminderTemplate);
          break;
        }
      } else if (meetingTime == currentTime && Cookie.get('authToken')) {
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

  public onClickBack(): void {
    // function called on click of back to user list button,  meetings for reminder by calling getMeetingsByInviter
    this.getMeetingsByInviter();
  }
}