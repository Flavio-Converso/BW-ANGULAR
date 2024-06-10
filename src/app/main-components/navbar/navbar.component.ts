import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isCollapsed: boolean = true;
  openDropdown: string | null = null;

  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  // logout() {
  //   this.authSvc.logout();
  // }
}
