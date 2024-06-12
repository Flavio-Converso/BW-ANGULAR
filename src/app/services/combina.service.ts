import { Injectable } from '@angular/core';
import { iCharacter } from '../interfaces/icharacter';
import { iClassi } from '../interfaces/classe';

import { iCombinazione } from '../interfaces/icombinazione';
import { iSkills } from '../interfaces/skills';

@Injectable({
  providedIn: 'root'
})
export class CombinaService {

  constructor() { }

  // Funzione per combinare i personaggi, le classi e le skills in una singola combinazione
  combineData(characters: iCharacter[], classes: iClassi[], skills: iSkills[] ): iCombinazione[] {
    const combinazioni: iCombinazione[] = [];

    // Cicla su ogni personaggio
    characters.forEach((character) => {
      // Trova la classe corrispondente al personaggio
      const classe = classes.find((c) => c.classId === character.classId);
      if (classe) {
        // Crea una combinazione con il personaggio, la classe e le skills

        const selectedSkills = character.selectedSkills.map(skillId => {
          const skill = skills.find(skill => skill.skillId === skillId);
          return skill ? {...skill} : null; // Restituiamo una copia dell'oggetto skill
        }).filter(skill => !!skill);


        const combinazione: iCombinazione = {
          characters: character,
          classe: classe,
         skills: skills
        };
        // Aggiungi la combinazione al array di combinazioni
        combinazioni.push(combinazione);
      }
    });

    return combinazioni;
  }
}
