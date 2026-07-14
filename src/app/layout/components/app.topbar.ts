import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/services/auth.service';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, FormsModule, Ripple, ButtonModule, IconField],
    template: `
        <div class="layout-topbar">
        <a class="app-logo" [routerLink]="['/Inicio/ReporteGuardia']">
                <img alt="app logo" [src]="logo()" />
                <span class="app-name">Dapper</span>
            </a>

            <button #menubutton class="topbar-menubutton p-link cursor-pointer" type="button" (click)="onMenuButtonClick()">
                <span></span>
            </button>
            <ul class="topbar-menu">
                @for (item of tabs(); track item.routerLink; let i = $index) {
                    <li>
                        <a
                            [routerLink]="item.routerLink"
                            routerLinkActive="active-route"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment!"
                            [skipLocationChange]="item.skipLocationChange!"
                            [replaceUrl]="item.replaceUrl!"
                            [state]="item.state"
                            [queryParams]="item.queryParams"
                        >
                            <span>{{ item.label }}</span>
                        </a>
                        <i class="pi pi-times" (click)="removeTab($event, i)"></i>
                    </li>
                }
            </ul>

            <div class="topbar-actions">
                <p-button icon="pi pi-palette" rounded severity="contrast" (onClick)="onConfigButtonClick()"></p-button>

                <div class="topbar-profile">
                    <button class="topbar-profile-button" type="button" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                        <span class="profile-details">
                            <span class="profile-name">{{ authService.userProfile()?.name || 'Usuario' }}</span>
                            <span class="profile-job">{{ authService.userProfile()?.jobPosition || 'Invitado' }}</span>
                        </span>
                        <i class="pi pi-angle-down"></i>
                    </button>
                    <ul class="list-none hidden p-2 sm:p-4 m-0 rounded-border shadow absolute bg-surface-0 dark:bg-surface-900 origin-top w-48 mt-2 right-0 top-auto">
                        <li class="flex items-start flex-col">
                            <a pRipple target="_blank" [routerLink]="['/Inicio/perfil']" class="flex p-2 rounded-border w-full items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer">
                                <i class="pi pi-user mr-4"></i>
                                <span>Editar Perfil</span>
                            </a>
                            <a pRipple (click)="signOut()" class="flex p-2 rounded-border w-full items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer">
                                <i class="pi pi-power-off mr-4"></i>
                                <span>Cerrar Sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
    `,
    host: {
        class: 'layout-topbar'
    }
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    menuButton = viewChild<ElementRef>('menubutton');

    tabs = computed(() => this.layoutService.tabs());

    logo = computed(() => {
        return '/layout/images/NyxHotelLogo-removebg-preview.png';
    });

    onMenuButtonClick() {
        this.layoutService.toggleMenu();
    }

    onConfigButtonClick() {
        this.layoutService.toggleConfigSidebar();
    }

    removeTab(event: Event, index: number) {
        event.preventDefault();
        event.stopPropagation();
        this.layoutService.closeTab(index);
    }

    signOut() {
        this.authService.logout();
    }
}
