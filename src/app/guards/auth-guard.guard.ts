import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private appService: AppService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user.pipe(first(), map(auth => {
        const uid = auth ? auth.uid : null;
        route.data = { ...route.parent.data, ...route.data, uid};
        if (Boolean(uid)) {
          console.error('Valid uid. Routing to Dashboard');
          this.router.navigate(['/dashboard']);
          this.appService.openSnackBar('Already logged in. Routing to Dashboard');
        }
        return !Boolean(uid);
      }));
  }

}
