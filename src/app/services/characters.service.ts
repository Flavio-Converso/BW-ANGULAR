import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iCharacter } from '../interfaces/icharacter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private apiUrl = 'http://localhost:3000/characters';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<iCharacter[]> {
    return this.http.get<iCharacter[]>(this.apiUrl);
  }

  getCharacterById(id: number): Observable<iCharacter> {
    return this.http.get<iCharacter>(`${this.apiUrl}/${id}`);
  }


  getCharactersByUserId(userId: number): Observable<iCharacter[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<iCharacter[]>(url);
  }




  addCharacter(newCharacter: iCharacter): Observable<iCharacter> {
    return this.http.post<iCharacter>(this.apiUrl, newCharacter);
  }

  updateCharacter(
    id: number,
    updatedCharacter: iCharacter
  ): Observable<iCharacter> {
    return this.http.put<iCharacter>(
      `${this.apiUrl}/${id}`,
      updatedCharacter
    );
  }

  deleteCharacter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
