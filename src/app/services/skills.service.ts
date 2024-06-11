import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iSkills } from '../interfaces/skills';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private baseUrl = 'http://localhost:3000/skills';

  constructor(private http: HttpClient) {}

  getSkills(): Observable<iSkills[]> {
    return this.http.get<iSkills[]>(this.baseUrl);
  }

  getSkillById(skillId: number): Observable<iSkills> {
    return this.http.get<iSkills>(`${this.baseUrl}/${skillId}`);
  }

  addSkill(newSkill: iSkills): Observable<iSkills> {
    return this.http.post<iSkills>(this.baseUrl, newSkill);
  }

  updateSkill(skillId: number, updatedSkill: iSkills): Observable<iSkills> {
    return this.http.put<iSkills>(`${this.baseUrl}/${skillId}`, updatedSkill);
  }

  deleteSkill(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${skillId}`);
  }
}
