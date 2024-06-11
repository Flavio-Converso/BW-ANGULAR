import { ProfileComponent } from './profile/profile.component';
import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
  {path:'profile', component: ProfileComponent},
{ path: 'newpg', component: CreazionePgComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
