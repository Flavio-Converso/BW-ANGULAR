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

  getCharacterById(characterId: number): Observable<iCharacter> {
    return this.http.get<iCharacter>(`${this.apiUrl}/${characterId}`);
  }

  getCharactersByUserId(userId: number): Observable<iCharacter[]> {
    return this.http.get<iCharacter[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addCharacter(newCharacter: iCharacter): Observable<iCharacter> {
    return this.http.post<iCharacter>(this.apiUrl, newCharacter);
  }

  updateCharacter(
    characterId: number,
    updatedCharacter: iCharacter
  ): Observable<iCharacter> {
    return this.http.put<iCharacter>(
      `${this.apiUrl}/${characterId}`,
      updatedCharacter
    );
  }

  deleteCharacter(characterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${characterId}`);
  }
}
