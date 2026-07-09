import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="bg-tropical-white min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-body-sm text-body-sm text-on-surface">
  <!-- Blurred Background Image -->
  <div class="absolute inset-0 z-0 bg-cover bg-center" style="background-image: url('layout/images/NyxRecepcionImagen.webp')">
    <!-- Overlay to ensure readability while keeping it bright -->
    <div class="absolute inset-0 bg-tropical-white/70 backdrop-blur-[4px]"></div>
  </div>

  <!-- Login Container -->
  <main class="relative z-10 w-full max-w-[440px] px-margin-mobile md:px-0 flex flex-col gap-8">
    <!-- Card -->
    <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-gutter shadow-[0_20px_40px_-15px_rgba(0,40,85,0.12)] flex flex-col">
      <!-- Header/Logo -->
      <div class="flex flex-col items-center text-center mb-10">
        <img alt="Hotel NYX Cancun Logo" class="w-48 h-auto mb-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbhpsCIOhqRydZDrq-o7YAwybHuMm3Qr543UrZMpj7sbkpCSKwY20PZwhegIJ_7ymk-6SHk1HNRHqBw1ggylvGZRapdTe7JRGchwNQyg5QvFJDCzys_RGqVCWzhPENkNWHsWzAyt4VUrURB-XQq3cfTWBGegHPnewjytzU_3ElrcsEjp29bdXu-e67Ys5m-BIjJS1x3XnqzC1h1YsDeDmrT1M2yoQeGAxdrHwpXcQiq7grIYUo3ZuYBJ5mFk82bMFTbg"/>
        <h2 class="font-title-md text-title-md text-outline">
          {{ showForgotForm ? 'Recuperar Acceso' : 'Acceso al Sistema Interno' }}
        </h2>
      </div>

      <!-- VISTA DE LOGIN -->
      <ng-container *ngIf="!showForgotForm">
        <form class="flex flex-col gap-6" (ngSubmit)="login()">
          <!-- Alerta de error -->
          <div *ngIf="loginError" class="bg-error-container border border-error/20 text-on-error-container text-body-sm p-4 rounded flex items-center gap-2 mb-2 animate-fade-in">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Input: Usuario -->
          <div class="flex flex-col group">
            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 transition-colors group-focus-within:text-deep-ocean" for="usuario">Usuario</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-0 text-outline group-focus-within:text-deep-ocean transition-colors" style="font-size: 20px;">person</span>
              <input 
                [(ngModel)]="email" 
                name="email" 
                class="w-full bg-transparent border-0 border-b border-surface-variant pl-8 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border focus:border-deep-ocean focus:ring-0 focus:rounded transition-all focus:bg-surface-bright" 
                id="usuario" 
                placeholder="Ingrese su usuario" 
                type="text" 
                required/>
            </div>
          </div>

          <!-- Input: Contraseña -->
          <div class="flex flex-col group">
            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 transition-colors group-focus-within:text-deep-ocean" for="contrasena">Contraseña</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-0 text-outline group-focus-within:text-deep-ocean transition-colors" style="font-size: 20px;">lock</span>
              <input 
                [(ngModel)]="password" 
                name="password" 
                class="w-full bg-transparent border-0 border-b border-surface-variant pl-8 pr-10 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border focus:border-deep-ocean focus:ring-0 focus:rounded transition-all focus:bg-surface-bright" 
                id="contrasena" 
                placeholder="••••••••" 
                [type]="showPassword ? 'text' : 'password'" 
                required/>
              <button 
                class="absolute right-0 flex items-center text-outline hover:text-deep-ocean transition-colors cursor-pointer" 
                type="button" 
                tabindex="-1"
                (click)="togglePasswordVisibility()">
                <span class="material-symbols-outlined" style="font-size: 20px;">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-4 mt-4">
            <!-- Primary Button -->
            <button class="w-full bg-deep-ocean text-on-primary font-label-caps text-label-caps py-3 px-6 rounded uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed" type="submit" [disabled]="isLoading">
              <span *ngIf="!isLoading">Iniciar Sesión</span>
              <span *ngIf="isLoading">Iniciando sesión...</span>
              <span class="material-symbols-outlined animate-spin" style="font-size: 18px;" *ngIf="isLoading">sync</span>
              <span class="material-symbols-outlined" style="font-size: 18px;" *ngIf="!isLoading">arrow_forward</span>
            </button>
            <!-- Recovery Link -->
            <a (click)="toggleForgotForm(true)" class="text-center font-body-sm text-body-sm text-deep-ocean hover:text-sand-gold transition-colors cursor-pointer">
              ¿Olvidó su contraseña?
            </a>
          </div>
        </form>
      </ng-container>

      <!-- VISTA DE RECUPERAR CONTRASEÑA -->
      <ng-container *ngIf="showForgotForm">
        <form class="flex flex-col gap-6" (ngSubmit)="sendRecoveryEmail()">
          <!-- Alerta de éxito -->
          <div *ngIf="recoverySuccess" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-body-sm p-4 rounded flex items-center gap-2 mb-2 animate-fade-in">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            <span>Correo de recuperación enviado con éxito.</span>
          </div>

          <!-- Alerta de error -->
          <div *ngIf="loginError" class="bg-error-container border border-error/20 text-on-error-container text-body-sm p-4 rounded flex items-center gap-2 mb-2 animate-fade-in">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <p class="font-body-sm text-body-sm text-on-surface-variant mb-2">
            Le enviaremos un correo electrónico con instrucciones para restablecer su contraseña.
          </p>

          <!-- Input: Correo -->
          <div class="flex flex-col group">
            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 transition-colors group-focus-within:text-deep-ocean" for="recoveryEmail">Correo Electrónico</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-0 text-outline group-focus-within:text-deep-ocean transition-colors" style="font-size: 20px;">mail</span>
              <input 
                [(ngModel)]="recoveryEmail" 
                name="recoveryEmail" 
                class="w-full bg-transparent border-0 border-b border-surface-variant pl-8 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border focus:border-deep-ocean focus:ring-0 focus:rounded transition-all focus:bg-surface-bright" 
                id="recoveryEmail" 
                placeholder="Ingrese su correo" 
                type="email" 
                required/>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-4 mt-4">
            <!-- Primary Button -->
            <button class="w-full bg-deep-ocean text-on-primary font-label-caps text-label-caps py-3 px-6 rounded uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed" type="submit" [disabled]="isLoading || recoverySuccess">
              <span *ngIf="!isLoading">Enviar enlace</span>
              <span *ngIf="isLoading">Enviando...</span>
              <span class="material-symbols-outlined animate-spin" style="font-size: 18px;" *ngIf="isLoading">sync</span>
              <span class="material-symbols-outlined" style="font-size: 18px;" *ngIf="!isLoading">mail</span>
            </button>
            <!-- Back Link -->
            <a (click)="toggleForgotForm(false)" class="text-center font-body-sm text-body-sm text-deep-ocean hover:text-sand-gold transition-colors cursor-pointer">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </ng-container>
    </div>

    <!-- Minimalist Footer -->
    <footer class="text-center">
      <p class="font-body-sm text-body-sm text-on-surface-variant">
        © 2026 HOTEL NYX CANCUN Operations.<br/>
        <span class="text-outline text-xs">Sistema De Gestion Interno</span>
      </p>
    </footer>
  </main>
</div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
    }

    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Login {
  email = '';
  password = '';
  loginError = false;
  showPassword = false;
  isLoading = false;
  errorMessage = 'Usuario/Contraseña incorrectos.';

  showForgotForm = false;
  recoveryEmail = '';
  recoverySuccess = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  toggleForgotForm(show: boolean) {
    this.showForgotForm = show;
    this.loginError = false;
    this.errorMessage = '';
    this.recoverySuccess = false;
    this.recoveryEmail = this.email;
  }

  async sendRecoveryEmail() {
    if (this.isLoading) return;

    if (!this.recoveryEmail || !this.recoveryEmail.includes('@')) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido.';
      this.loginError = true;
      return;
    }

    this.isLoading = true;
    this.loginError = false;
    this.recoverySuccess = false;

    try {
      await sendPasswordResetEmail(auth, this.recoveryEmail);
      this.recoverySuccess = true;
    } catch (error: any) {
      console.error('Recovery error:', error);
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No existe un usuario registrado con este correo.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El formato del correo no es válido.';
      } else {
        this.errorMessage = 'Ocurrió un error al enviar el correo. Intente más tarde.';
      }
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async login() {
    if (this.isLoading) return;

    let loginEmail = this.email.trim();
    if (!loginEmail) {
      this.errorMessage = 'Por favor, ingrese su usuario.';
      this.loginError = true;
      return;
    }

    // Si el usuario no contiene '@', le agregamos un dominio por defecto para que funcione con Firebase Auth
    if (!loginEmail.includes('@')) {
      loginEmail = `${loginEmail}@nyxhotelcancun.com`;
    }

    if (!this.password) {
      this.errorMessage = 'Por favor, ingrese su contraseña.';
      this.loginError = true;
      return;
    }

    this.isLoading = true;
    this.loginError = false;
    this.errorMessage = 'Usuario o contraseña incorrectos.';

    try {
      const result = await this.authService.login(loginEmail, this.password);

      if (!result.success) {
        switch (result.errorCode) {
          case 'auth/invalid-email':
            this.errorMessage = 'El correo electrónico ingresado no es válido.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            this.errorMessage = 'Usuario o contraseña incorrectos.';
            break;
          case 'auth/too-many-requests':
            this.errorMessage = 'Demasiados intentos fallidos. Su cuenta ha sido bloqueada temporalmente.';
            break;
          case 'auth/network-request-failed':
            this.errorMessage = 'Error de conexión. Verifique su internet.';
            break;
          default:
            this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
            break;
        }
        this.loginError = true;
      }
    } catch (err) {
      console.error('Error inesperado en el componente Login:', err);
      this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo.';
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('Login finalizado. isLoading:', this.isLoading);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
