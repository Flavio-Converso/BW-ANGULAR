import { iClassi } from "./classe";
import { iCharacter } from "./icharacter";
import { iSkills } from "./skills";

export interface iCombinazione {
characters: iCharacter,
classe: iClassi,
skills: iSkills[];
}
