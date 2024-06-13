import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users.service';
import { iUsers } from '../../interfaces/iusers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isCollapsed: boolean = true;
  openDropdown: string | null = null;
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  //test
  user!: iUsers | null;
  users: iUsers[] = [];
  //test

  constructor(private authSvc: AuthService, private userSvc: UsersService) {}

  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );

    //test
    this.authSvc.user$.subscribe((user: iUsers | null) => {
      this.user = user;
    });
  }

  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  closeDropdown(): void {
    this.openDropdown = '';
  }

  logout() {
    this.authSvc.logout();
  }
}
