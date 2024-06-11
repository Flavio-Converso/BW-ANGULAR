import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iCharacter } from '../interfaces/icharacter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private baseUrl = 'http://localhost:3000/characters';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<iCharacter[]> {
    return this.http.get<iCharacter[]>(this.baseUrl);
  }

  getCharacterById(characterId: number): Observable<iCharacter> {
    return this.http.get<iCharacter>(`${this.baseUrl}/${characterId}`);
  }

  addCharacter(newCharacter: iCharacter): Observable<iCharacter> {
    return this.http.post<iCharacter>(this.baseUrl, newCharacter);
  }

  updateCharacter(
    characterId: number,
    updatedCharacter: iCharacter
  ): Observable<iCharacter> {
    return this.http.put<iCharacter>(
      `${this.baseUrl}/${characterId}`,
      updatedCharacter
    );
  }

  deleteCharacter(characterId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${characterId}`);
  }
}
