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


  // logout() {
  //   this.authSvc.logout();
  // }
}
