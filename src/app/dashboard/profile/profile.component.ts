import { CombinaService } from './../../services/combina.service';
import { iSkills } from './../../interfaces/skills';
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUsers } from '../../interfaces/iusers';
import { UsersService } from '../../services/users.service';
import { CharactersService } from '../../services/characters.service';
import { iCharacter } from '../../interfaces/icharacter';
import { ClassesService } from '../../services/classes.service';
import { iClassi } from '../../interfaces/classe';
import { iCombinazione } from '../../interfaces/icombinazione';

import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user!: iUsers | null;
  characters: iCharacter[] = [];
class: iClassi[]=[];
iSkills: iSkills[]=[];
combina: iCombinazione[] = [];





  constructor(private authSvc: AuthService, private userSvc: UsersService,  private characterSvc: CharactersService, private classSvc: ClassesService,
     private combinaSvc: CombinaService,private skillSvc: SkillsService ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
      if (this.user) {
        this.characterSvc.getCharactersByUserId(this.user.id).subscribe((chars: iCharacter[]) => {
          this.characters = chars;
          this.addToCombina();
        });

        this.classSvc.getClassByUserId(this.user.id).subscribe((caClass: iClassi[]) => {
          this.class = caClass;
          this.addToCombina();
        });


this.skillSvc.getSkillByUserId(this.user.id).subscribe((kSkills:iSkills[])=>{
  this.iSkills =kSkills;
  this.addToCombina();
})


      }
    });
  }

  addToCombina() {
    if (this.characters.length > 0 && this.class.length > 0) {
      // Chiamata al servizio per combinare i dati
      this.combina = this.combinaSvc.combineData(this.characters, this.class, this.iSkills);
    }
  }





  }





