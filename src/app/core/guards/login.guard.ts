import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            const profile = this.authService.userProfile();
            const userEmail = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();
            const restrictedEmails = ['cocinasist@nyxhotels.com', 'manttaux@nyxhotels.com', 'almacen@nyxhotels.com'];
            if (restrictedEmails.includes(userEmail)) {
                this.router.navigate(['/Inicio/TareasDistintivoH']);
            } else {
                this.router.navigate(['/Inicio/ReporteGuardia']);
            }
            return false;
        } else {
            return true;
        }
    }
}
