import { Component, OnInit } from '@angular/core';
import { iCharacter } from '../../interfaces/icharacter';
import { iSkills } from '../../interfaces/skills';
import { iClassi } from '../../interfaces/classe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { SkillsService } from '../../services/skills.service';
import { CharactersService } from '../../services/characters.service';
import { ClassesService } from '../../services/classes.service';

@Component({
  selector: 'app-creazione-pg',
  templateUrl: './creazione-pg.component.html',
  styleUrls: ['./creazione-pg.component.scss'],
})
export class CreazionePgComponent implements OnInit {
  characterForm!: FormGroup;
  classes: iClassi[] = [];
  skills: iSkills[] = [];
  selectedSkills: iSkills[] = [];
  availableExp: number = 50;
  selectedClassIndex: number = -1;
  selectedSkillsTotalExp: number = 0;
  constructor(
    private fb: FormBuilder,
    private classesSvc: ClassesService,
    private charactersSvc: CharactersService,
    private skillsSvc: SkillsService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      characterName: ['', Validators.required],
      classId: ['', Validators.required],
      selectedSkills: [[]],
      expTot: [50, Validators.required],
    });

    this.loadClasses();
  }

  loadClasses(): void {
    this.classesSvc.getClasses().subscribe((data: iClassi[]) => {
      this.classes = data;
    });
  }

  onClassChange(classId: number): void {
    const selectedClass = this.classes.find((c) => c.classId === classId);
    if (selectedClass) {
      this.skillsSvc.getSkills().subscribe((allSkills: iSkills[]) => {
        this.skills = allSkills.filter((skill) =>
          selectedClass.skills.includes(skill.skillId)
        );
        console.log('Filtered skills:', this.skills);
      });
      this.characterForm.patchValue({ classId });
      this.selectedSkills = [];
      this.availableExp = 50;
      this.updateFormValues();
      this.selectedClassIndex = this.classes.findIndex(
        (c) => c.classId === classId
      );
    }
  }

  onSkillSelect(event: any, skill: iSkills): void {
    const isChecked = event.target.checked;
    const expDifference = isChecked ? -skill.exp : skill.exp;

    if (
      isChecked &&
      this.availableExp >= skill.exp &&
      !this.selectedSkills.includes(skill)
    ) {
      this.selectedSkills.push(skill);
    } else {
      const index = this.selectedSkills.findIndex(
        (s) => s.skillId === skill.skillId
      );
      if (index !== -1) {
        this.selectedSkills.splice(index, 1);
      }
    }

    // Aggiorniamo l'esperienza disponibile
    this.availableExp += expDifference;

    this.updateFormValues();
    this.updateSelectedSkillsTotalExp();
  }

  updateFormValues(): void {
    this.characterForm.patchValue({
      selectedSkills: this.selectedSkills.map((s) => s.skillId),
      expTot: this.availableExp,
    });

    this.updateSelectedSkillsTotalExp(); // Aggiorna la somma dei punti esperienza delle abilità selezionate
  }

  createCharacter(): void {
    if (this.characterForm.valid) {
      const user = this.authSvc.getCurrentUser();
      if (user) {
        const userId = user.id;
        const characterData = { ...this.characterForm.value, userId };
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

  resetSkills(): void {
    // Deseleziona tutte le checkbox
    this.skills.forEach((skill) => {
      const checkbox = document.getElementById(
        `checkbox-${skill.skillId}`
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    // Resetta l'array delle abilità selezionate e l'exp disponibile
    this.selectedSkills = [];
    this.availableExp = 50;
    // Aggiorna i valori del form
    this.updateFormValues();
    this.updateSelectedSkillsTotalExp();
  }

  updateSelectedSkillsTotalExp(): void {
    this.selectedSkillsTotalExp = this.selectedSkills.reduce(
      (totalExp, skill) => totalExp + skill.exp,
      0
    );
  }
}
