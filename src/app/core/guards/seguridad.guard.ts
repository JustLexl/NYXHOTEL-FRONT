import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SeguridadGuard implements CanActivate {

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
                map(() => this.checkAccess())
            );
        }

        return this.checkAccess();
    }

    private checkAccess(): boolean {
        const profile = this.authService.userProfile();
        const email = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();

        if (email === 'seguridad@nyxhotels.com') {
            return true;
        }

        this.router.navigate(['/Inicio/ReporteGuardia']);
        return false;
    }
}
