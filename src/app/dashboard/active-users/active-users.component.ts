import { Component } from '@angular/core';
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

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss']
})
export class ActiveUsersComponent {
  user!: iUsers | null;
  iSkills: iSkills[] = [];
  characters: iCharacter[] = [];
  class: iClassi[] = [];
  combina: iCombinazione[] = [];
  users: iUsers[] = [];
  isCollapsed: boolean = true;
  openDropdown: string | null = null;

  constructor(
    private authSvc: AuthService,
    private userSvc: UsersService,
    private characterSvc: CharactersService,
    private classSvc: ClassesService,
    private combinaSvc: CombinaService,
    private skillSvc: SkillsService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
      if (this.user) {
        this.fetchAllData();
      }
    });

    console.log("Fetching all users...");
    this.userSvc.getAllUsers().subscribe((users) => {
      console.log("All users received:", users);
      this.users = users;
    });
  }

  fetchAllData() {
    console.log("Fetching all data for user:", this.user);
    this.characterSvc.getCharacters().subscribe((chars: iCharacter[]) => {
      console.log("All characters received:", chars);
      this.characters = chars;
      this.fetchClassAndSkills();
    });
  }

  fetchClassAndSkills() {
    console.log("Fetching class and skills for user:", this.user);
    if (this.user !== null && this.user !== undefined) {
      this.classSvc.getClassByUserId(this.user.id).subscribe((caClass: iClassi[]) => {
        console.log("Classes received:", caClass);
        this.class = caClass;
        this.skillSvc.getSkillByUserId(this.user!.id).subscribe((kSkills: iSkills[]) => {
          console.log("Skills received:", kSkills);
          this.iSkills = kSkills;
          this.addToCombina();
        });
      });
    } else {
      console.error("User is null or undefined");
    }
  }

  addToCombina() {
    console.log("Adding to combina...");
    if (this.characters.length > 0 && this.class.length > 0 && this.iSkills.length > 0) {
      console.log("Combining data...");
      this.combina = this.combinaSvc.combineData(this.characters, this.class, this.iSkills);
    }
  }
}
