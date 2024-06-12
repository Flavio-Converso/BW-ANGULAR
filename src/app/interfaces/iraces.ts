export interface iRaces {
  raceId: number;
  raceName: string;
  raceBio: string;
  traits: {
    Forza: number;
    Agilita: number;
    Intelligenza: number;
    Resistenza: number;
    Carisma: number;
  };
  img: string;
}
