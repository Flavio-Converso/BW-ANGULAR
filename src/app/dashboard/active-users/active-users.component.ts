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
  styleUrl: './active-users.component.scss'

})
export class ActiveUsersComponent {
  user!: iUsers | null;
  iSkills: iSkills[]=[];
  characters: iCharacter[] = [];
  class: iClassi[]=[];
  combina: iCombinazione[] = [];
  users: iUsers[] = [];
  isCollapsed: boolean = true;
  openDropdown: string | null = null;

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
        });
      }});


    this.userSvc.getAllUsers().subscribe((users) => {
      this.users = users
    });




  }

  addToCombina() {
    if (this.characters.length > 0 && this.class.length > 0 && this.iSkills.length > 0) {
      // Chiamata al servizio per combinare i dati
      this.combina = this.combinaSvc.combineData(this.characters, this.class, this.iSkills);
    }
  }

}
