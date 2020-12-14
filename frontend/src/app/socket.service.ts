import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private userId: string;
  public socket;
  public url = 'http://localhost:3000';

  constructor(
    public http: HttpClient,
    private router: Router) {
    this.socket = io(this.url);
    this.userId = Cookie.get('activeUserId');
    this.socket.on(this.userId, (data) => {
      alert(data.message);
    });
  }
// emit meetinf create/update/delete notifications
  public notifyUpdates(data) {
    this.socket.emit('meeeting-notifications', data);
  }
}