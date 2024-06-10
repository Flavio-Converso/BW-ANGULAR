import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { CreazionePgComponent } from './creazione-pg/creazione-pg.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MarketplaceComponent,
    CreazionePgComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
