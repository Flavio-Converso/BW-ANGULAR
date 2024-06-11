import { iSkills } from "./skills";

export interface iClassi {
  classId: number;
  className: string;
  bio: string;
  skills: iSkills[];
}
