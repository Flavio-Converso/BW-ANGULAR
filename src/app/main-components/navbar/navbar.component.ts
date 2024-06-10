import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']  // Corretto qui
})
export class NavbarComponent {
  isCollapsed: boolean = true;

  iscoll2: boolean = false;

  iscoll: boolean = false;
  logscoll: boolean = false;

  openDropdown: string | null = null;

  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  // logout() {
  //   this.authSvc.logout();
  // }
}
