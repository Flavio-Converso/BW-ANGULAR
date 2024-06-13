import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CreaEventiComponent  } from './crea-eventi/crea-eventi.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedaPgComponent } from './scheda-pg/scheda-pg.component';
import { EventiDisponibiliComponent } from './eventi-disponibili/eventi-disponibili.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    CreaEventiComponent ,
    CreazionePgComponent,
    ActiveUsersComponent,
    SchedaPgComponent,
    EventiDisponibiliComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
