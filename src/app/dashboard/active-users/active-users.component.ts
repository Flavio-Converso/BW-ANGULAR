import { Component } from '@angular/core';
import { iUsers } from '../../interfaces/iusers';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users.service';
import { CharactersService } from '../../services/characters.service';
import { ClassesService } from '../../services/classes.service';




@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrl: './active-users.component.scss'

})
export class ActiveUsersComponent {

  user!: iUsers | null;
  users: iUsers[] = [];
  isCollapsed: boolean = true;
  openDropdown: string | null = null;
  constructor(private authSvc: AuthService, private userSvc: UsersService, private charaSvc:CharactersService, classSvc:ClassesService) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
    });
    this.userSvc.getAllUsers().subscribe((users) => {
      this.users = users
    });

    this.users.forEach(user => {
      this.charaSvc.getCharactersByUserId(user.id).subscribe((characters) => {
        if (characters) {
          user.characters = characters;
        }
      });
    });


  }

}
