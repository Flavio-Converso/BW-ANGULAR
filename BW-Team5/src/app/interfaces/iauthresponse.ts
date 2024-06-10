import { iUsers } from './iusers';

export interface iAuthResponse {
  accessToken: string;
  user: iUsers;
}
