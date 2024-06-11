import { ProfileComponent } from './profile/profile.component';
import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'active_users', component:ActiveUsersComponent},
  {path:'profile', component: ProfileComponent},
{ path: 'newpg', component: CreazionePgComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
