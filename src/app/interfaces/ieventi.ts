import { iUsers } from "./iusers";

export interface iEventi {
  id:number,
  master:string,
  campain: string,
  date: string,
  liveoronline:string,
  counter:number,
  guests: iUsers[],
  adress: string
}
