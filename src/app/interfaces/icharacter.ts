export interface iCharacter {
  userId: number;
  characterId: number;
  classId: number;
  characterName: string;
  expTot: number; //da dare fisso eventualmente
  selectedSkills: number[];
  racesId: number;
}
