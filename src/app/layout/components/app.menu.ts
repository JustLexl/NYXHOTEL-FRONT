import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of filteredModel(); track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul>`
})
export class AppMenu {
    model: any[] = [
        {
            label: 'Reporte de Guardia',
            icon: 'pi pi-clipboard',
            routerLink: ['/Inicio/ReporteGuardia']
        },
        {
            label: 'Registros de Guardia',
            icon: 'pi pi-list',
            routerLink: ['/Inicio/ReportesGuardia']
        },
        {
            label: 'Seguridad',
            icon: 'pi pi-shield',
            routerLink: ['/Inicio/Seguridad']
        },
        {
            label: 'Control de Llaves',
            icon: 'pi pi-key',
            routerLink: ['/Inicio/ControlLlaves']
        },
        {
            label: 'Lost and Found',
            icon: 'pi pi-briefcase',
            routerLink: ['/Inicio/LostAndFound']
        },
        {
            label: 'Registro de Proveedores',
            icon: 'pi pi-truck',
            routerLink: ['/Inicio/RegistroProveedores']
        },
        {
            label: 'Calidad Reportes',
            icon: 'pi pi-check-square',
            routerLink: ['/Inicio/CalidadReportes']
        },
    ];

    filteredModel = computed(() => {
        const profile = this.authService.userProfile();
        const email = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();

        // supervisoresseguridad solo puede ver Control de Llaves, Lost and Found y Registro de Proveedores
        if (email === 'supervisoresseguridad@nyxhotel.com' || email === 'supervisoresseguridad@nyxhotels.com') {
            return this.model.filter(item => 
                item.label === 'Control de Llaves' || 
                item.label === 'Lost and Found' || 
                item.label === 'Registro de Proveedores'
            );
        }

        // Filter out specific options if the logged-in email is not seguridad@nyxhotels.com
        const currentModel = this.model.filter(item => {
            if (item.label === 'Seguridad') {
                return email === 'seguridad@nyxhotels.com';
            }
            if (item.label === 'Control de Llaves') {
                return email === 'seguridad@nyxhotels.com';
            }
            if (item.label === 'Lost and Found') {
                return email === 'seguridad@nyxhotels.com';
            }
            if (item.label === 'Registro de Proveedores') {
                return email === 'seguridad@nyxhotels.com';
            }
            if (item.label === 'Calidad Reportes') {
                return email === 'calidad@nyxhotels.com';
            }
            return true;
        });

        if (this.authService.isAdministrador()) {
            return currentModel;
        } else {
            const role = (profile?.role || '').toLowerCase().trim();
            const puesto = (profile?.jobPosition || '').toLowerCase().trim();

            return currentModel.filter(item => {
                if (!item.roles) return true;
                // Check if any of the item's allowed roles match the user's role or puesto
                return item.roles.some((r: string) => {
                    const lowR = r.toLowerCase().trim();
                    const isMatched = lowR === role ||
                        lowR === puesto ||
                        (lowR === 'administrador' && (role === 'administración' || role === 'administracion' || puesto === 'administración' || puesto === 'administracion')) ||
                        (lowR === 'desarrollador' && role === 'desarrollo');
                    return isMatched;
                });
            });
        }
    });

    constructor(private authService: AuthService) { }
}
