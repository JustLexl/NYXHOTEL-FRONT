import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '@/app/firebase-config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { UsuarioService, User as DBUser } from '@/app/pages/service/usuarios.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = signal<User | null>(null);
    public userProfile = signal<DBUser | null>(null);
    public isProfileLoaded = signal<boolean>(false);
    public needsHeavyLoader = signal<boolean>(true);


    constructor(
        private router: Router,
        private usuarioService: UsuarioService
    ) {
        onAuthStateChanged(auth, (user) => {
            this.currentUser.set(user);
            if (user) {
                localStorage.setItem('dapper_session', 'true');
                this.fetchUserProfile(user.uid, user.email!);
            } else {
                localStorage.removeItem('dapper_session');
                this.userProfile.set(null);
                this.isProfileLoaded.set(true);
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'dapper_session' && !event.newValue) {
                console.log('Sesión terminada en otra pestaña, cerrando sesión aquí...');
                this.logout();
            }
        });
    }

    private fetchUserProfile(uid: string, email: string) {
        this.usuarioService.getUserByFirebaseUid(uid).subscribe({
            next: (profile: DBUser) => {
                if (profile) {
                    this.userProfile.set(profile);
                } else {
                    const fallbackProfile: DBUser = {
                        name: email.split('@')[0],
                        email: email,
                        role: 'Administrador',
                        jobPosition: 'Administrador',
                        jobArea: 'Administración',
                        phone: 0
                    };
                    this.userProfile.set(fallbackProfile);
                }
                this.isProfileLoaded.set(true);
            },
            error: (err: any) => {
                console.error('Error fetching user profile by UID:', err);
                this.isProfileLoaded.set(true);
            }
        });
    }



    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async login(email: string, password: string): Promise<{ success: boolean; errorCode?: string }> {
        try {
            this.isProfileLoaded.set(false);
            this.needsHeavyLoader.set(true);

            await signInWithEmailAndPassword(auth, email, password);


            let attempts = 0;
            while (!this.isProfileLoaded() && attempts < 40) {
                await this.delay(100);
                attempts++;
            }

            await this.delay(1000);

            this.router.navigate(['/Inicio/ReporteGuardia']);
            return { success: true };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, errorCode: error.code };
        }
    }

    async logout() {
        try {
            await signOut(auth);
            localStorage.removeItem('dapper_session');
            this.router.navigate(['/auth/login']);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null || localStorage.getItem('dapper_session') === 'true';
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    isDesarrollador(): boolean {
        const profile = this.userProfile();
        if (!profile) return false;

        const role = (profile.role || '').toLowerCase().trim();
        const puesto = (profile.jobPosition || '').toLowerCase().trim();

        return role === 'desarrollador' || role === 'desarrollo' || puesto === 'desarrollador';
    }

    isAdministrador(): boolean {
        const profile = this.userProfile();
        if (!profile) return false;

        const role = (profile.role || '').toLowerCase().trim();
        const puesto = (profile.jobPosition || '').toLowerCase().trim();

        const isAdmin =
            role === 'administrador' ||
            role === 'administración' ||
            role === 'administracion' ||
            puesto === 'administrador' ||
            puesto === 'administración' ||
            puesto === 'administracion';

        if (isAdmin) console.log('✅ User is recognized as Administrador');
        return isAdmin;
    }
}
