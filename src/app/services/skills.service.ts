import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iSkills } from '../interfaces/skills';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private apiUrl = 'http://localhost:3000/skills';

  constructor(private http: HttpClient) {}

  getSkills(): Observable<iSkills[]> {
    return this.http.get<iSkills[]>(this.apiUrl);
  }

  getSkillById(skillId: number): Observable<iSkills> {
    return this.http.get<iSkills>(`${this.apiUrl}/${skillId}`);
  }

  addSkill(newSkill: iSkills): Observable<iSkills> {
    return this.http.post<iSkills>(this.apiUrl, newSkill);
  }

  updateSkill(skillId: number, updatedSkill: iSkills): Observable<iSkills> {
    return this.http.put<iSkills>(`${this.apiUrl}/${skillId}`, updatedSkill);
  }

  deleteSkill(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${skillId}`);
  }

  getSkillByUserId(userId: number): Observable<iSkills[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<iSkills[]>(url);
  }
}
