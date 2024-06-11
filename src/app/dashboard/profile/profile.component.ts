import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUsers } from '../../interfaces/iusers';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user!: iUsers | null;
  users: iUsers[] = [];
  constructor(private authSvc: AuthService, private userSvc: UsersService) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
    });
    this.userSvc.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
