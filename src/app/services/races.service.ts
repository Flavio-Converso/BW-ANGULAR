import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iRaces } from '../interfaces/iraces';

@Injectable({
  providedIn: 'root',
})
export class RacesService {
  private apiUrl = 'http://localhost:3000/races';

  constructor(private http: HttpClient) {}

  getRaces(): Observable<iRaces[]> {
    return this.http.get<iRaces[]>(this.apiUrl);
  }

  getRaceById(raceId: number): Observable<iRaces> {
    return this.http.get<iRaces>(`${this.apiUrl}/${raceId}`);
  }

  addRace(newRace: iRaces): Observable<iRaces> {
    return this.http.post<iRaces>(this.apiUrl, newRace);
  }

  updateRace(raceId: number, updatedRace: iRaces): Observable<iRaces> {
    return this.http.put<iRaces>(`${this.apiUrl}/${raceId}`, updatedRace);
  }

  deleteRace(raceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${raceId}`);
  }
}
