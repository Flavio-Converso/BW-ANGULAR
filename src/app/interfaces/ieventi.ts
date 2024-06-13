import { iCharacter } from './icharacter';

export interface iEventi {
  id: number;
  master: string;
  descrizione: string;
  titolo: string;
  urlImmagine: string;
  data: string;
  tipo: string;
  numeroGiocatori: number;
  indirizzo: string;
  guests: iCharacter[];

}
