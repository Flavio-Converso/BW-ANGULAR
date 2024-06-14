import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';
import { SchedaPgComponent } from './scheda-pg/scheda-pg.component';
import { CreaEventiComponent } from './crea-eventi/crea-eventi.component';
import { EventiDisponibiliComponent } from './eventi-disponibili/eventi-disponibili.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Home' },
  {
    path: 'active_users',
    component: ActiveUsersComponent,
    title: 'Utenti Attivi',
  },
  { path: 'profile', component: ProfileComponent, title: 'Profilo' },
  { path: 'newpg', component: CreazionePgComponent, title: 'Creazione PG' },
  { path: 'schedapg/:id', component: SchedaPgComponent, title: 'Scheda PG' },
  { path: 'eventi', component: CreaEventiComponent, title: 'Crea Eventi' },
  {
    path: 'eventi-disponibili',
    component: EventiDisponibiliComponent,
    title: 'Eventi Disponibili',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
