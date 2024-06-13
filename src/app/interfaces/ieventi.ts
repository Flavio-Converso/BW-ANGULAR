import { iUsers } from './iusers';

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
  guests: iUsers[];
}
