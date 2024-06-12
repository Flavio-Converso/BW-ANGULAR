import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iCharacter } from '../../interfaces/icharacter';
import { iSkills } from '../../interfaces/skills';
import { iClassi } from '../../interfaces/classe';
import { iRaces } from '../../interfaces/iraces';
import { AuthService } from '../../auth/auth.service';
import { SkillsService } from '../../services/skills.service';
import { CharactersService } from '../../services/characters.service';
import { ClassesService } from '../../services/classes.service';
import { RacesService } from '../../services/races.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creazione-pg',
  templateUrl: './creazione-pg.component.html',
  styleUrls: ['./creazione-pg.component.scss'],
})
export class CreazionePgComponent {
  characterForm!: FormGroup;
  classes: iClassi[] = [];
  races: iRaces[] = [];
  skills: iSkills[] = [];
  selectedSkills: iSkills[] = [];
  availableExp: number = 50;
  selectedClassIndex: number = -1;
  selectedRaceIndex: number = -1;
  selectedRaceId: number = -1;
  classSelected: boolean = false;
  raceSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private classesSvc: ClassesService,
    private charactersSvc: CharactersService,
    private skillsSvc: SkillsService,
    private authSvc: AuthService,
    private racesSvc: RacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      characterName: ['', Validators.required],
      classId: ['', Validators.required],
      raceId: ['', Validators.required],
      selectedSkills: [[]],
      expTot: [50, Validators.required],
    });

    this.loadClasses();
    this.loadRaces();
  }

  loadClasses(): void {
    this.classesSvc.getClasses().subscribe((data: iClassi[]) => {
      this.classes = data;
    });
  }

  loadRaces(): void {
    this.racesSvc.getRaces().subscribe((data: iRaces[]) => {
      this.races = data;
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

  onRaceChange(raceId: number): void {
    this.characterForm.patchValue({ raceId });
    this.selectedRaceId = raceId; // Assicurati di impostare selectedRaceId
    this.selectedRaceIndex = this.races.findIndex((r) => r.raceId === raceId);
  }

  onSkillSelect(event: any, skill: iSkills): void {
    if (event.target.checked) {
      if (
        this.availableExp >= skill.exp &&
        !this.selectedSkills.includes(skill)
      ) {
        this.selectedSkills.push(skill);
        this.availableExp -= skill.exp;
      }
    } else {
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
            this.router.navigate(['dashboard/schedapg', character.id]);
          });
      } else {
        console.log('User not logged in');
      }
    } else {
      console.log('Form is invalid');
    }
  }
  isSelected(skill: iSkills): boolean {
    return this.selectedSkills.some(
      (selectedSkill) => selectedSkill.skillId === skill.skillId
    );
  }
  resetSkills(): void {
    // Deselect all checkboxes
    this.skills.forEach((skill) => {
      const checkbox = document.getElementById(
        `checkbox-${skill.skillId}`
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    // Reset the selected skills array
    this.selectedSkills = [];
    // Reset available experience points to 50
    this.availableExp = 50;
    // Update form values
    this.updateFormValues();
  }
}
