import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { iUsers } from '../interfaces/iusers';
import { iAuthResponse } from '../interfaces/iauthresponse';
import { iAuthdata } from '../interfaces/iauthdata';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {this.restoreUser()}

  authSubject = new BehaviorSubject<iUsers | null>(null);

  user$ = this.authSubject.asObservable();
  syncIsLoggedIn: boolean = false;
  isLoggedIn$ = this.user$.pipe(
    map((user) => !!user),
    tap((user) => (this.syncIsLoggedIn = user))
  );

  loginUrl: string = 'http://localhost:3000/login';
  registerUrl: string = 'http://localhost:3000/register';

  register(newUser: Partial<iUsers>): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(this.registerUrl, newUser);
  }

  login(authData: iAuthdata): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(this.loginUrl, authData).pipe(
      tap((data) => {
        this.authSubject.next(data.user);

        localStorage.setItem('datiUser', JSON.stringify(data));

        this.autoLogout();
      })
    );
  }

  logout(): void {
    this.authSubject.next(null);
    localStorage.removeItem('datiUser');
    this.router.navigate(['/auth/login'])
    //DA AGGIUNGERE ROTTA UNA VOLTA CHE SLOGGO this.router.navigate(['']);
  }

  autoLogout(): void {
    const accessData = this.getAccessData();
    if (!accessData) return;

    const expDate = this.jwtHelper.getTokenExpirationDate(
      accessData.accessToken
    ) as Date;

    const expMs = expDate.getTime() - new Date().getTime();

    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser(): void {
    const accessData = this.getAccessData();

    if (!accessData) return;

    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return;
    this.authSubject.next(accessData.user);
    this.autoLogout();
  }

  getAccessData(): iAuthResponse | null {
    const accessDataJson = localStorage.getItem('datiUser');

    if (!accessDataJson) return null;
    const accessData: iAuthResponse = JSON.parse(accessDataJson);

    return accessData;
  }

  //funzione per la creazione del personaggio dopo il login
  getCurrentUser(): iUsers | null {
    return this.authSubject.getValue();
  }
}
