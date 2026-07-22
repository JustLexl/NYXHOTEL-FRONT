import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SoloControlLlavesGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private injector: Injector) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        if (!this.authService.isProfileLoaded()) {
            return toObservable(this.authService.isProfileLoaded, { injector: this.injector }).pipe(
                filter(loaded => loaded === true),
                take(1),
                map(() => this.checkAccess(route))
            );
        }

        return this.checkAccess(route);
    }

    private checkAccess(route: ActivatedRouteSnapshot): boolean {
        const profile = this.authService.userProfile();
        const email = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();

        // Si es el supervisor de seguridad, solo puede ver ControlLlaves, LostAndFound y RegistroProveedores
        if (email === 'supervisoresseguridad@nyxhotel.com' || email === 'supervisoresseguridad@nyxhotels.com') {
            const path = route.routeConfig?.path;
            if (path === 'ControlLlaves' || path === 'LostAndFound' || path === 'RegistroProveedores') {
                return true;
            }
            this.router.navigate(['/Inicio/ControlLlaves']);
            return false;
        }

        return true;
    }
}
