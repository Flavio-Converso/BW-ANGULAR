import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  getClassById(classs: number): Observable<iClassi> {
    return this.http.get<iClassi[]>(`${this.apiUrl}/?classs=${classs}`).pipe(
      map((classes) => {
        if (classes.length > 0) {
          return classes[0];
        } else {
          throw new Error('Classe non trovata');
        }
      })
    );
  }

  getClassByUserId(userId: number): Observable<iClassi[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<iClassi[]>(url);
  }

  addClass(newClass: iClassi): Observable<iClassi> {
    return this.http.post<iClassi>(this.apiUrl, newClass);
  }

  updateClass(classs: number, updatedClass: iClassi): Observable<iClassi> {
    return this.http.put<iClassi>(
      `${this.apiUrl}/?classs=${classs}`,
      updatedClass
    );
  }

  deleteClass(classs: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/?classs=${classs}`);
  }
}
