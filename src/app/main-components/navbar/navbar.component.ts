import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isCollapsed: boolean = true;
  openDropdown: string | null = null;
  isLoggedIn:boolean = false
  constructor(private authSvc:AuthService){}

  ngOnInit(){
this.authSvc.isLoggedIn$
.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)




  }


  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }




   logout() {
     this.authSvc.logout();
 }
}
