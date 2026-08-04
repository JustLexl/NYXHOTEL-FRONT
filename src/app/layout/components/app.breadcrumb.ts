import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: ` <ol>
        <li>
            <a [routerLink]="homeRoute">
                <i class="pi pi-home"></i>
            </a>
        </li>
        <li class="layout-breadcrumb-chevron">/</li>
        <ng-template ngFor let-item let-last="last" [ngForOf]="breadcrumbs$ | async">
            <li style="cursor: pointer;">{{ item.label }}</li>
            <li *ngIf="!last" class="layout-breadcrumb-chevron">/</li>
        </ng-template>
    </ol>`,
    host: {
        class: 'layout-breadcrumb'
    }
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    get homeRoute(): string[] {
        const profile = this.authService.userProfile();
        const email = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();

        const restrictedEmails = ['cocinasist@nyxhotels.com', 'manttaux@nyxhotels.com', 'almacen@nyxhotels.com'];
        if (restrictedEmails.includes(email)) {
            return ['/Inicio/TareasDistintivoH'];
        }
        return ['/Inicio/ReporteGuardia'];
    }

    constructor(private router: Router, private authService: AuthService) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            const root = this.router.routerState.snapshot.root;
            const breadcrumbs: Breadcrumb[] = [];
            this.addBreadcrumb(root, [], breadcrumbs);

            this._breadcrumbs$.next(breadcrumbs);
        });
    }

    private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            breadcrumbs.push({
                label: route.data['breadcrumb'],
                url: '/' + routeUrl.join('/')
            });
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }
}
