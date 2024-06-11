import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';
import { ActiveUsersComponent } from './active-users/active-users.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MarketplaceComponent,
    CreazionePgComponent,
    ActiveUsersComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
