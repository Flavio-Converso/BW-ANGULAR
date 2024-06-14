import { ClassesService } from './../../services/classes.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { iCharacter } from '../../interfaces/icharacter';
import { SkillsService } from '../../services/skills.service';
import { iSkills } from '../../interfaces/skills';
import { iClassi } from '../../interfaces/classe';
import { RacesService } from '../../services/races.service';
import { iRaces } from '../../interfaces/iraces';

@Component({
  selector: 'app-scheda-pg',
  templateUrl: './scheda-pg.component.html',
  styleUrl: './scheda-pg.component.scss',
})
export class SchedaPgComponent {
  id!: number;
  character!: iCharacter;
  allSkills: iSkills[] = [];
  characterSkills: iSkills[] = [];
  class!: iClassi;
  race!: iRaces;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private charactersSvc: CharactersService,
    private skillSrc: SkillsService,
    private classSrc: ClassesService,
    private raceSrc: RacesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.loadCharacterDetails();
    });
  }

  loadCharacterDetails(): void {
    this.charactersSvc
      .getCharacterById(this.id)
      .subscribe((character: iCharacter) => {
        if (character) {
          this.character = character;
          console.log('Character details:', this.character);
          this.loadCharacterSkills();
          this.loadCharacterClass();
          this.loadCharacterRace();
        } else {
          console.error('Character is undefined');
        }
      });
  }

  loadCharacterSkills(): void {
    this.skillSrc.getSkills().subscribe((skills: iSkills[]) => {
      this.allSkills = skills;
      if (this.character?.selectedSkills) {
        this.characterSkills = this.allSkills.filter((skill) =>
          this.character.selectedSkills!.includes(skill.skill)
        );
        console.log('Character skills:', this.characterSkills);
      }
    });
  }

  loadCharacterClass(): void {
    if (this.character && this.character.classs) {
      this.classSrc.getClassById(this.character.classs).subscribe(
        (classChar: iClassi) => {
          console.log('Classe:', classChar);
          this.class = classChar; // Assegna l'intero oggetto della classe
          console.log('Character class:', this.class);
        },
        (error) => {
          console.error('Errore durante il caricamento della classe:', error);
        }
      );
    } else {
      console.warn("ID della classe mancante nell'oggetto del personaggio");
    }
  }

  loadCharacterRace(): void {
    if (this.character && this.character.race) {
      // Assumi che race sia una proprietà del personaggio
      this.raceSrc.getRaceById(this.character.race).subscribe(
        (raceChar: iRaces) => {
          console.log('Razza:', raceChar);
          this.race = raceChar; // Assegna l'intero oggetto della razza
          console.log('Character race:', this.race);
        },
        (error) => {
          console.error('Errore durante il caricamento della razza:', error);
        }
      );
    } else {
      console.warn("ID della razza mancante nell'oggetto del personaggio");
    }
  }

  deleteCharacter(): void {
    if (confirm('Sei sicuro di voler eliminare questo personaggio?')) {
      this.charactersSvc.deleteCharacter(this.id).subscribe(
        () => {
          console.log('Character deleted');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(
            "Errore durante l'eliminazione del personaggio:",
            error
          );
        }
      );
    }
  }

  goToHome(): void {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }
}
