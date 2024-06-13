import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassesService } from '../services/classes.service';
import { CharactersService } from '../services/characters.service';
import { SkillsService } from '../services/skills.service';
import { AuthService } from '../auth/auth.service';
import { iClassi } from '../interfaces/classe';
import { iSkills } from '../interfaces/skills';
import { iCharacter } from '../interfaces/icharacter';

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
  availableExp: number = 50;

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
      classs: ['', Validators.required],
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

  onClassChange(event: any): void {
    const classs = +event.target.value;
    const selectedClass = this.classes.find((c) => c.classs === classs);
    if (selectedClass) {
      this.skillsSvc.getSkills().subscribe((allSkills: iSkills[]) => {
        this.skills = allSkills.filter((skill) =>
          selectedClass.skills.includes(skill.skillId)
        );
        console.log('Filtered skills:', this.skills);
      });
      this.selectedSkills = [];
      this.availableExp = 50;
      this.updateFormValues();
    }
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
          });
      } else {
        console.log('User not logged in');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
