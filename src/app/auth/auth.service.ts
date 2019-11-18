import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData} from './auth-data.model';

  import { from, Subject } from 'rxjs';
import { tokenName } from '@angular/compiler';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user'

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  // Exposes the observable from the listener to other component: they can observe the status, but
  // only AuthService can emit the event.
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData : AuthData = { email: email, password: password};
    return this.http.post(BACKEND_URL + '/signup',authData).subscribe(() => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password : string) {
    const authData : AuthData = { email: email, password: password};
    console.log("authService ",authData);
    this.http.post<{token : string,userId: string, expiresIn : number}>(BACKEND_URL +"/login", authData)
    .subscribe(response => {
      this.token = response.token;
      if(this.token){
        const expiresInDuration = response.expiresIn
        console.log("expiresInDuration",expiresInDuration);
        this.setAuthTimer(expiresInDuration); // setTimeOut accept milisecond, so * 1000
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log("expirationDate",expirationDate);
        this.saveAuthData(this.token,this.userId, expirationDate);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser() {

    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    // compare the expiration date and the current date, return true if the expiration date is before now.
    const isInFuture = authInformation.expirationDate > now;
    // if the expirationDate is in the future, then the token is valid
    console.log("autoAuthUser", authInformation, isInFuture);
    if(isInFuture){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(expiresInDuration: number) {
    console.log('Setting timer: ' + expiresInDuration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expirationDate');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      userId: userId,
      expirationDate: new Date(expirationDate)
    }
  }


  private saveAuthData(token : string,userId: string, expirationDate : Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }

}
