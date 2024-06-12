export interface iCharacter {
  userId: number;
  id: number;
  classId: number;
  characterName: string;
  expTot: number; //da dare fisso eventualmente
  selectedSkills: number[];
  raceId: number;
}
