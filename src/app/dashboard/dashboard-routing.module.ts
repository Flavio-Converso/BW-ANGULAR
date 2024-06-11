import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ActiveUsersComponent } from './active-users/active-users.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'active_users', component:ActiveUsersComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
