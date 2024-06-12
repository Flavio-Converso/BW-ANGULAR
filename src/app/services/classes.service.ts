import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iClassi } from '../interfaces/classe';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private apiUrl = 'http://localhost:3000/classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<iClassi[]> {
    return this.http.get<iClassi[]>(this.apiUrl);
  }

  getClassById(classId: number): Observable<iClassi> {
    return this.http.get<iClassi>(`${this.apiUrl}/${classId}`);
  }

  getClassByUserId(userId: number): Observable<iClassi[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<iClassi[]>(url);
  }


  addClass(newClass: iClassi): Observable<iClassi> {
    return this.http.post<iClassi>(this.apiUrl, newClass);
  }

  updateClass(classId: number, updatedClass: iClassi): Observable<iClassi> {
    return this.http.put<iClassi>(`${this.apiUrl}/${classId}`, updatedClass);
  }

  deleteClass(classId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${classId}`);
  }
}
