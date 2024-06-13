import { Component, OnInit } from '@angular/core';
import { iUsers } from '../../interfaces/iusers';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users.service';
import { CharactersService } from '../../services/characters.service';
import { ClassesService } from '../../services/classes.service';
import { CombinaService } from '../../services/combina.service';
import { iCombinazione } from '../../interfaces/icombinazione';
import { iCharacter } from '../../interfaces/icharacter';
import { iClassi } from '../../interfaces/classe';
import { iSkills } from '../../interfaces/skills';
import { SkillsService } from '../../services/skills.service';
import { RacesService } from '../../services/races.service';
import { iRaces } from '../../interfaces/iraces';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss'],
})
export class ActiveUsersComponent implements OnInit {
  user!: iUsers | null;
  iSkills: { [userId: number]: iSkills[] } = {};
  characters: { [userId: number]: iCharacter[] } = {};
  class: { [userId: number]: iClassi[] } = {};
  races: { [userId: number]: { [id: number]: iRaces } } = {};
  combina: { [userId: number]: iCombinazione[] } = {};
  users: iUsers[] = [];
  isCollapsed: boolean = true;
  openDropdown: string | null = null;

  constructor(
    private authSvc: AuthService,
    private userSvc: UsersService,
    private characterSvc: CharactersService,
    private classSvc: ClassesService,
    private combinaSvc: CombinaService,
    private skillSvc: SkillsService,
    private raceSvc: RacesService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
      if (this.user) {
        this.fetchAllData();
      }
    });

    console.log('Fetching all users...');
    this.userSvc.getAllUsers().subscribe((users) => {
      console.log('All users received:', users);
      this.users = users;
      this.users.forEach((user) => this.fetchClassAndSkills(user));
    });
  }

  fetchAllData() {
    console.log('Fetching all data for user:', this.user);
    this.characterSvc.getCharacters().subscribe((chars: iCharacter[]) => {
      console.log('All characters received:', chars);
      chars.forEach((char) => {
        if (!this.characters[char.userId]) {
          this.characters[char.userId] = [];
        }
        this.characters[char.userId].push(char);

        // Fetch race for each character
        this.raceSvc.getRaceById(char.race).subscribe((race: iRaces) => {
          if (!this.races[char.userId]) {
            this.races[char.userId] = {};
          }
          this.races[char.userId][char.id] = race;
          this.addToCombina(char.userId);
        });
      });
    });
  }

  fetchClassAndSkills(user: iUsers) {
    console.log('Fetching class and skills for user:', user);
    this.classSvc.getClassByUserId(user.id).subscribe((caClass: iClassi[]) => {
      console.log('Classes received:', caClass);
      this.class[user.id] = caClass;
      this.skillSvc
        .getSkillByUserId(user.id)
        .subscribe((kSkills: iSkills[]) => {
          console.log('Skills received:', kSkills);
          this.iSkills[user.id] = kSkills;
          this.addToCombina(user.id);
        });
    });
  }

  addToCombina(userId: number) {
    console.log('Adding to combina for user:', userId);
    if (
      this.characters[userId] &&
      this.class[userId] &&
      this.iSkills[userId] &&
      this.races[userId] &&
      Object.keys(this.races[userId]).length === this.characters[userId].length
    ) {
      console.log('Combining data for user:', userId);
      const combinedData = this.characters[userId].map((character) => {
        return {
          characters: character,
          classe: this.class[userId].find(
            (c) => c.classs === character.classs
          )!,
          race: this.races[userId][character.id],
          skills: this.iSkills[userId].filter((skill) =>
            character.selectedSkills.includes(skill.skill)
          ),
        };
      });
      this.combina[userId] = this.combinaSvc.combineData(
        this.characters[userId],
        this.class[userId],
        this.iSkills[userId],
        Object.values(this.races[userId])
      );
    }
  }
}
