import { Component, effect, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { UsuarioService, User } from '../service/usuarios.service';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <!-- Loading Overlay -->
        <div *ngIf="loadingData" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm">
            <div class="relative w-24 h-24 mb-6">
                <div class="absolute inset-0 border-4 border-[#1e3a8a]/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-[#1e3a8a] rounded-full animate-spin"></div>
                <div class="absolute inset-4 flex items-center justify-center">
                    <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="Logo" class="w-10 h-10 opacity-80 animate-pulse" />
                </div>
            </div>
            <h2 class="text-white text-xl font-bold tracking-widest mb-2 uppercase">Obteniendo Datos</h2>
            <div class="flex gap-1">
                <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
        </div>

        <div class="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 w-full" [class.opacity-0]="loadingData">
            <div class="w-full max-w-3xl">
                
                <div class="mb-8 text-center sm:text-left">
                    <h1 class="text-3xl font-bold text-color tracking-tight">Editar Perfil</h1>
                    <p class="text-color-secondary mt-2">Gestiona la información de tu cuenta y seguridad.</p>
                </div>
                
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm overflow-hidden">
                    
                    <div class="p-6 sm:p-8 border-b border-surface-200 dark:border-surface-700">
                        <div class="flex items-center gap-3 mb-6">
                            <i class="pi pi-user text-primary text-xl"></i>
                            <h3 class="text-lg font-semibold text-color">Información Personal</h3>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-color-secondary">Nombre</label>
                                <input 
                                    [(ngModel)]="profileData.name"
                                    class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-color focus:border-primary focus:ring-1 focus:ring-primary transition-all h-12 px-4 outline-none" 
                                    placeholder="Nombre completo" 
                                    type="text"/>
                            </div>
                            
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-color-secondary">Dirección de correo</label>
                                <input 
                                    [(ngModel)]="profileData.email"
                                    class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 text-color-secondary transition-all h-12 px-4 outline-none opacity-70 cursor-not-allowed" 
                                    readonly
                                    type="email"/>
                            </div>
                        
                            <div class="flex flex-col gap-2 sm:col-span-2">
                                <label class="text-sm font-medium text-color-secondary">Número de teléfono</label>
                                <div class="relative flex items-center">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-color-secondary">
                                        <i class="pi pi-phone"></i>
                                    </span>
                                    <input 
                                        [(ngModel)]="profileData.phone"
                                        class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-color focus:border-primary focus:ring-1 focus:ring-primary transition-all h-12 pl-10 pr-4 outline-none" 
                                        placeholder="Número de teléfono" 
                                        type="tel"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-6 sm:p-8 bg-surface-50 dark:bg-surface-800">
                        <div class="flex items-center gap-3 mb-6">
                            <i class="pi pi-lock text-primary text-xl"></i>
                            <h3 class="text-lg font-semibold text-color">Seguridad</h3>
                        </div>
                        <div class="space-y-6">
                            
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-color-secondary">Contraseña actual</label>
                                <input 
                                    [(ngModel)]="passwords.current"
                                    class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-color focus:border-primary focus:ring-1 focus:ring-primary transition-all h-12 px-4 outline-none" 
                                    placeholder="••••••••••••" 
                                    type="password"/>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-medium text-color-secondary">Nueva contraseña</label>
                                    <input 
                                        [(ngModel)]="passwords.new"
                                        class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-color focus:border-primary focus:ring-1 focus:ring-primary transition-all h-12 px-4 outline-none" 
                                        placeholder="Introduce nueva contraseña" 
                                        type="password"/>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-medium text-color-secondary">Confirmar contraseña</label>
                                    <input 
                                        [(ngModel)]="passwords.confirm"
                                        class="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-color focus:border-primary focus:ring-1 focus:ring-primary transition-all h-12 px-4 outline-none" 
                                        placeholder="Confirma la nueva contraseña" 
                                        type="password"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="px-6 py-6 sm:px-8 flex flex-col sm:flex-row-reverse gap-4 border-t border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
                        <button 
                            (click)="saveChanges()"
                            class="bg-primary hover:bg-primary-emphasis text-primary-contrast font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            [disabled]="loading">
                            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                        </button>
                        <button 
                            (click)="resetForm()"
                            class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-color font-semibold py-3 px-8 rounded-lg border border-surface-200 dark:border-surface-700 transition-colors cursor-pointer">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Perfil {
    authService = inject(AuthService);
    usuarioService = inject(UsuarioService);
    cdr = inject(ChangeDetectorRef);

    profileData: User = {
        name: '',
        email: '',
        phone: undefined
    };

    passwords = {
        current: '',
        new: '',
        confirm: ''
    };

    loading = false;
    loadingData = true;

    constructor() {
        effect(() => {
            const profile = this.authService.userProfile();
            if (profile) {
                this.profileData = { ...profile };
                this.cdr.detectChanges();
                
                if (this.loadingData) {
                    setTimeout(() => {
                        this.loadingData = false;
                        this.cdr.detectChanges();
                    }, 1200);
                } else {
                    this.loadingData = false;
                }
            }
        });
    }

    async saveChanges() {
        this.loading = true;
        try {
            if (this.profileData._id) {
                await this.usuarioService.updateUser(this.profileData._id, {
                    name: this.profileData.name,
                    phone: Number(this.profileData.phone)
                }).toPromise();

                this.authService.userProfile.set({ ...this.profileData });
                alert('Perfil actualizado correctamente');
            }
            if (this.passwords.new) {
                if (this.passwords.new !== this.passwords.confirm) {
                    throw new Error('Las contraseñas no coinciden');
                }
                if (!this.passwords.current) {
                    throw new Error('Debes ingresar la contraseña actual para cambiarla');
                }

                const user = this.authService.getCurrentUser();
                if (user && user.email) {
                    const credential = EmailAuthProvider.credential(user.email, this.passwords.current);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, this.passwords.new);
                    alert('Contraseña actualizada');
                    this.passwords = { current: '', new: '', confirm: '' };
                }
            }

        } catch (err: any) {
            console.error('Error saving profile:', err);

            let errorMessage = 'Ocurrió un error al guardar los cambios';
            
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = 'La contraseña actual es incorrecta';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'La nueva contraseña es muy débil (mínimo 6 caracteres)';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde';
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(errorMessage);
        } finally {
            this.loading = false;
        }
    }

    resetForm() {
        const profile = this.authService.userProfile();
        if (profile) {
            this.profileData = { ...profile };
        }
        this.passwords = { current: '', new: '', confirm: '' };
    }
}
