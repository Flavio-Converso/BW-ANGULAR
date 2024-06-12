import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedaPgComponent } from './scheda-pg/scheda-pg.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MarketplaceComponent,
    CreazionePgComponent,
    ActiveUsersComponent,
    SchedaPgComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
