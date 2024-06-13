import { ProfileComponent } from './profile/profile.component';
import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';
import { SchedaPgComponent } from './scheda-pg/scheda-pg.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'active_users', component:ActiveUsersComponent},
  {path:'profile', component: ProfileComponent},
{ path: 'newpg', component: CreazionePgComponent},
{ path: 'schedapg/:id', component: SchedaPgComponent},
{path: 'eventi',component: MarketplaceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
