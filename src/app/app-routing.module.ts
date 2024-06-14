import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './dashboard/page404/page404.component';
import { AuthGuard } from './auth/auth.guard';
import { GuestGuard } from './auth/guest.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
    title: 'Auth',
  },
  {
    path: '',
    title: 'Home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  { path: '404', component: Page404Component, title: 'Page404' },
  { path: '**', redirectTo: '404', title: 'Page404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
