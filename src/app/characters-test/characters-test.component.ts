import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassesService } from '../services/classes.service';
import { CharactersService } from '../services/characters.service';
import { SkillsService } from '../services/skills.service';

import { AuthService } from '../auth/auth.service';
import { iClassi } from '../interfaces/classe';
import { iSkills } from '../interfaces/skills';
import { iCharacter } from '../interfaces/icharacter';
// Supponiamo di avere un servizio di autenticazione per ottenere l'utente loggato

@Component({
  selector: 'app-characters-test',
  templateUrl: './characters-test.component.html',
  styleUrls: ['./characters-test.component.scss'],
})
export class CharactersTestComponent implements OnInit {
  characterForm!: FormGroup;
  classes: iClassi[] = [];
  skills: iSkills[] = [];
  selectedSkills: iSkills[] = [];
  availableExp: number = 100; // expTot iniziale

  constructor(
    private fb: FormBuilder,
    private classesSvc: ClassesService,
    private charactersSvc: CharactersService,
    private skillsSvc: SkillsService,
    private authSvc: AuthService // Servizio di autenticazione
  ) {}

  ngOnInit(): void {
    // Inizializzazione del form con i campi richiesti
    this.characterForm = this.fb.group({
      characterName: ['', Validators.required], // Campo per il nome del personaggio
      classId: ['', Validators.required], // Campo per l'ID della classe del personaggio
      selectedSkills: [[]], // Campo per le abilità selezionate (inizialmente vuoto)
      expTot: [100, Validators.required], // Punti esperienza totali iniziali
    });

    // Carica le classi disponibili dal server
    this.loadClasses();
    this.loadSkills();
  }

  // Metodo per caricare le classi disponibili dal server
  loadClasses(): void {
    this.classesSvc.getClasses().subscribe((data: iClassi[]) => {
      this.classes = data; // Assegna le classi ottenute alla variabile `classes`
    });
  }

  loadSkills(): void {
    this.skillsSvc.getSkills().subscribe((data: iSkills[]) => {
      this.skills = data; // Assegna le abilità ottenute alla variabile `skills`
    });
  }
  // Metodo chiamato quando l'utente seleziona una classe
  onClassChange(event: any): void {
    const classId = event.target.value;
    const selectedClass = this.classes.find((c) => c.classId === classId);
    if (selectedClass) {
      this.skillsSvc.getSkills().subscribe((allSkills: iSkills[]) => {
        this.skills = allSkills.filter((skill) =>
          selectedClass.skills.map((s) => s.skillId).includes(skill.skillId)
        );
      });
    }
  }

  // Metodo chiamato quando l'utente seleziona un'abilità
  onSkillSelect(event: any, skill: iSkills): void {
    if (event.target.checked) {
      // The checkbox is checked, add the skill to selectedSkills
      if (
        this.availableExp >= skill.exp &&
        !this.selectedSkills.includes(skill)
      ) {
        this.selectedSkills.push(skill);
        this.availableExp -= skill.exp;
      }
    } else {
      // The checkbox is unchecked, remove the skill from selectedSkills
      const index = this.selectedSkills.findIndex(
        (s) => s.skillId === skill.skillId
      );
      if (index !== -1) {
        this.selectedSkills.splice(index, 1);
        this.availableExp += skill.exp;
      }
    }
    this.updateFormValues();
  }

  updateFormValues(): void {
    this.characterForm.patchValue({
      selectedSkills: this.selectedSkills.map((s) => s.skillId),
      expTot: this.availableExp,
    });
  }

  // Metodo per creare il personaggio quando il form viene inviato
  createCharacter(): void {
    if (this.characterForm.valid) {
      const user = this.authSvc.getCurrentUser(); // Ottieni l'oggetto utente corrente
      if (user) {
        const userId = user.id; // Ottieni l'userId dall'oggetto utente
        const characterData = { ...this.characterForm.value, userId }; // Aggiungi userId ai dati del personaggio
        this.charactersSvc
          .addCharacter(characterData)
          .subscribe((character: iCharacter) => {
            console.log('Character created:', character);
          });
      } else {
        console.log('User not logged in');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
