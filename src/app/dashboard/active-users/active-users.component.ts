import { Component } from '@angular/core';
import { iUsers } from '../../interfaces/iusers';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users.service';


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
  constructor(private authSvc: AuthService, private userSvc: UsersService) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
    });
    this.userSvc.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

}
