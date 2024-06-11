import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iUsers } from '../interfaces/iusers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<iUsers[]> {
    return this.http.get<iUsers[]>(this.apiUrl);
  }
}
