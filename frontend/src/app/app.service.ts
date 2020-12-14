import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { map, catchError, tap } from 'rxjs/operators';


// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable()
export class AppService {
  getnotify: any;
  private url = 'http://localhost:3000';

  constructor(
    public http: HttpClient,
  ) {



  } // end constructor  


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public getToken = () => {
    return localStorage.getItem('authToken')
  }

  /* signup function api call */
  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('countryName', data.countryName)
      .set('isAdmin', data.isAdmin)
      .set('countryCode', data.countryCode);
    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  /* login function api call */
  public loginFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  /* forget password function api call */
  public forgotPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email);
    return this.http.post(`${this.url}/api/v1/users/forgotPassword`, params);
  }

  /* reset password function api call */
  public resetPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/resetPassword`, params);
  }

  /* logout function api call */
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  /* get all users function api call */
  public getUsers(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users?authToken=${Cookie.get('authToken')}`)
      .pipe(map((res: any[]) => res));
  }

  /* get user function api call */
  public getUserById(userId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${userId}?authToken=${Cookie.get('authToken')}`)
      .pipe(map((res: any[]) => res));
  }

  /* get country code internal call */
  public getCountryCodes(): any {
    return this.http.get('assets/countryCodes.json');
  }

  /* get country Names internal call */
  public getCountries(): any {
    return this.http.get('assets/countries.json');
  }


  /*------- MEETING Functions  -----------*/
  /* create meeting function api call */
  public createMeeting(data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('inviter', data.inviter)
      .set('invitee', data.invitee)
      .set('purpose',data.purpose)
      .set('start', data.start)
      .set('end', data.end)
      .set('location',data.location)
      .set('inviterEmail',data.inviterEmail)
      .set('inviteeEmail',data.inviteeEmail)
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/meeting/create`, params);
  }
 
  /* get selected user meeting function api call */
  public getSelectedUserMeetings(inviter, invitee, authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/meeting/getByInviterAndInvitee?inviter=${inviter}&invitee=${invitee}&authToken=${Cookie.get('authToken')}`);
  }
 
  /* update meeting function api call */
  public updateMeeting(data, meetingId): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('start', data.start)
      .set('end', data.end)
      .set('location',data.location)
      .set('purpose',data.purpose)
      .set('inviterEmail',data.inviterEmail)
      .set('inviteeEmail',data.inviteeEmail)
      .set('authToken', Cookie.get('authToken'))
    return this.http.put(`${this.url}/api/v1/meeting/update/${meetingId}`, params);
  }

  /* delete meeting function api call */
  public deleteMeeting(meetingId): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/meeting/delete/${meetingId}`, params)
  }

  /* get meetings by invitte function api call */
  public getMeetingsByInvitee(): Observable<any>{
    return this.http.get(`${this.url}/api/v1/meeting/getByInvitee/${Cookie.get('activeUserId')}?authToken=${Cookie.get('authToken')}`);
  }

  /* get meetings by inviter function api call */
  public getMeetingsByInviter(): Observable<any>{
    return this.http.get(`${this.url}/api/v1/meeting/getByInviter/${Cookie.get('activeUserId')}?authToken=${Cookie.get('authToken')}`);
  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
