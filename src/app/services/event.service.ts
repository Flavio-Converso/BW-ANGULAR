import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { iEventi } from '../interfaces/ieventi';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/eventi';

  constructor(private http: HttpClient) {}

  getEventi(): Observable<iEventi[]> {
    return this.http.get<iEventi[]>(this.apiUrl);
  }

  getEventiById(id: number): Observable<iEventi> {
    return this.http.get<iEventi>(`${this.apiUrl}/${id}`);
  }

  getEventiByUserId(userId: number): Observable<iEventi[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<iEventi[]>(url);
  }

  addEventi(newEventi: iEventi): Observable<iEventi> {
    return this.http.post<iEventi>(this.apiUrl, newEventi);
  }

  updateEventi(id: number, updatedEventi: iEventi): Observable<iEventi> {
    return this.http.put<iEventi>(`${this.apiUrl}/${id}`, updatedEventi);
  }

  deleteEventi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeGuest(eventId: number, guestId: number): Observable<iEventi> {
    return this.http.get<iEventi>(`${this.apiUrl}/${eventId}`).pipe(
      mergeMap((event) => {
        event.guests = event.guests.filter((guest) => guest.id !== guestId);
        return this.updateEventi(eventId, event);
      })
    );
  }
}
