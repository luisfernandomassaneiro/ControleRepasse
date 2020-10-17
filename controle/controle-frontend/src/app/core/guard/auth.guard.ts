import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { SecurityService } from '@shared/services/security.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private readonly router: Router, private readonly subjectProvider: SecurityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkRoute(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRoute(childRoute, state);
  }

  private checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.subjectProvider.subject;
    if (currentUser && currentUser.id) {
      return true;
    }
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
