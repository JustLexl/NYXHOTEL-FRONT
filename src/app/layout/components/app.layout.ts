import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppFooter } from './app.footer';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppConfigurator } from './app.configurator';
import { AppBreadcrumb } from './app.breadcrumb';
import { AppSidebar } from './app.sidebar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, AppConfigurator, AppBreadcrumb],
    template: `
        <div class="layout-wrapper" [ngClass]="containerClass()">
            <div app-topbar></div>
            <div app-sidebar></div>
            <div class="layout-content-wrapper">
                <div class="layout-content">
                    <div class="layout-content-inner">
                        <nav app-breadcrumb></nav>
                        <router-outlet></router-outlet>
                        <div app-footer></div>
                    </div>
                </div>
            </div>
            <div class="layout-mask"></div>
        </div>
        <app-configurator />
    `
})
export class AppLayout {
    layoutService = inject(LayoutService);

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive || state.overlayMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    containerClass = computed(() => {
        const layoutConfig = this.layoutService.layoutConfig();
        const layoutState = this.layoutService.layoutState();

        return {
            'layout-slim': layoutConfig.menuMode === 'slim',
            'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
            'layout-static': layoutConfig.menuMode === 'static',
            'layout-overlay': layoutConfig.menuMode === 'overlay',
            'layout-overlay-active': layoutState.overlayMenuActive,
            'layout-mobile-active': layoutState.mobileMenuActive,
            'layout-static-inactive': layoutState.staticMenuInactive && layoutConfig.menuMode === 'static',
            'layout-light': layoutConfig.layoutTheme === 'colorScheme' && !layoutConfig.darkTheme,
            'layout-dark': layoutConfig.layoutTheme === 'colorScheme' && layoutConfig.darkTheme,
            'layout-primary': !layoutConfig.darkTheme && layoutConfig.layoutTheme === 'primaryColor'
        };
    });
}
