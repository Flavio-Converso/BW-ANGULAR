import { CombinaService } from './../../services/combina.service';
import { iSkills } from './../../interfaces/skills';
import { Component} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUsers } from '../../interfaces/iusers';
import { UsersService } from '../../services/users.service';
import { CharactersService } from '../../services/characters.service';
import { iCharacter } from '../../interfaces/icharacter';
import { ClassesService } from '../../services/classes.service';
import { iClassi } from '../../interfaces/classe';
import { iCombinazione } from '../../interfaces/icombinazione';
import { SkillsService } from '../../services/skills.service';
import { RacesService } from '../../services/races.service';
import { iRaces } from '../../interfaces/iraces';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {


  user!: iUsers | null;
  characters: iCharacter[] = [];
  class: iClassi[] = [];
  iSkills: iSkills[] = [];
  combina: iCombinazione[] = [];
  race: { [id: number]: iRaces } = {};

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
        this.fetchData();
      }
    });
  }

  fetchData() {
    const characterObs = this.characterSvc.getCharactersByUserId(this.user!.id);
    const classObs = this.classSvc.getClassByUserId(this.user!.id);
    const skillObs = this.skillSvc.getSkillByUserId(this.user!.id);

    characterObs.subscribe((chars: iCharacter[]) => {
      this.characters = chars;
      chars.forEach((character) => {
        this.raceSvc.getRaceById(character.race).subscribe((race: iRaces) => {
          this.race[character.id] = race;
          this.addToCombina();
        });
      });
    });

    classObs.subscribe((caClass: iClassi[]) => {
      this.class = caClass;
      this.addToCombina();
    });

    skillObs.subscribe((kSkills: iSkills[]) => {
      this.iSkills = kSkills;
      this.addToCombina();
    });
  }

  addToCombina() {
    if (
      this.characters.length > 0 &&
      this.class.length > 0 &&
      this.iSkills.length > 0 &&
      Object.keys(this.race).length === this.characters.length
    ) {
      // Chiamata al servizio per combinare i dati
      const combinedData = this.characters.map((character) => {
        return {
          characters: character,
          classe: this.class.find((c) => c.classs === character.classs)!,
          race: this.race[character.id],
          skills: this.iSkills.filter((skill) => character.selectedSkills.includes(skill.skill)),
        };
      });
      this.combina = this.combinaSvc.combineData(
        this.characters,
        this.class,
        this.iSkills,
        Object.values(this.race)
      );
    }
  }

  deleteCharacter(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo personaggio?')) {
      this.characterSvc.deleteCharacter(id).pipe(
        catchError((error) => {
          console.error("Errore durante l'eliminazione del personaggio:", error);
          return of(null);
        })
      ).subscribe(
        (result) => {
          if (result !== null) {
            // Rimuove l'elemento solo se esiste
            this.combina = this.combina.filter(pg => pg.characters.id !== id);
            console.log('Character deleted');
          }
        }
      );
    }
  }
}
