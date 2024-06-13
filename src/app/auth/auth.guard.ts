import { ActivatedRouteSnapshot,  GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authSvc:AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
      return this.authSvc.syncIsLoggedIn
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
      return this.canActivate(childRoute, state)
  }

}
