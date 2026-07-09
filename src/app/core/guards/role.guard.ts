import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private injector: Injector) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const expectedRoles = route.data['roles'] as Array<string>;

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        if (!this.authService.isProfileLoaded()) {
            return toObservable(this.authService.isProfileLoaded, { injector: this.injector }).pipe(
                filter(loaded => loaded === true),
                take(1),
                map(() => this.checkAccess(expectedRoles))
            );
        }

        return this.checkAccess(expectedRoles);
    }

    private checkAccess(expectedRoles: Array<string>): boolean {
        if (this.authService.isAdministrador()) {
            return true;
        }

        const isDesarrollador = this.authService.isDesarrollador();
        const hasAccess = expectedRoles.some(role => {
            const lowR = role.toLowerCase().trim();
            return (lowR === 'desarrollador' && isDesarrollador) || (lowR === 'administrador' && this.authService.isAdministrador());
        });

        if (!hasAccess) {
            this.router.navigate(['/Inicio/ReporteGuardia']);
            return false;
        }

        return true;
    }
}

