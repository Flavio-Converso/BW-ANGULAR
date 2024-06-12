import { ClassesService } from './../../services/classes.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { iCharacter } from '../../interfaces/icharacter';
import { SkillsService } from '../../services/skills.service';
import { iSkills } from '../../interfaces/skills';

@Component({
  selector: 'app-scheda-pg',
  templateUrl: './scheda-pg.component.html',
  styleUrl: './scheda-pg.component.scss'
})
export class SchedaPgComponent {
  characterId!: number;
  character!: iCharacter;
  allSkills: iSkills[] = [];
  characterSkills: iSkills[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private charactersSvc: CharactersService,
    private skillSrc:SkillsService,
    private classSrc:ClassesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.characterId = params['id'];
      this.loadCharacterDetails();
    });
  }

  loadCharacterDetails(): void {
    this.charactersSvc.getCharacterById(this.characterId).subscribe((character: iCharacter) => {
      this.character = character;
      console.log('Character details:', this.character);
      this.loadCharacterSkills();
    });
  }

  loadCharacterSkills(): void {
    this.skillSrc.getSkills().subscribe((skills: iSkills[]) => {
      this.allSkills = skills;
      if (this.character && this.character.selectedSkills) {
        this.characterSkills = this.allSkills.filter(skill =>
          this.character.selectedSkills!.includes(skill.skillId)
        );
        console.log('Character skills:', this.characterSkills);
      }
    });
  }




  deleteCharacter(): void {
    if (confirm('Sei sicuro di voler eliminare questo personaggio?')) {
      this.charactersSvc.deleteCharacter(this.characterId).subscribe(() => {
        console.log('Character deleted');
        // Reindirizza alla home dopo aver eliminato il personaggio
        this.router.navigate(['/']);
      }, error => {
        console.error('Errore durante l\'eliminazione del personaggio:', error);
      });
    }
  }

  goToHome(): void {
    // Reindirizza alla home
    this.router.navigate(['/']);
  }
}
