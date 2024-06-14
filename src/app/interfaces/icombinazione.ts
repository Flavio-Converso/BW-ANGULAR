import { iClassi } from "./classe";
import { iCharacter } from "./icharacter";
import { iRaces } from "./iraces";
import { iSkills } from "./skills";

export interface iCombinazione {
characters: iCharacter,
classe: iClassi,
race: iRaces
skills: iSkills[];

}
