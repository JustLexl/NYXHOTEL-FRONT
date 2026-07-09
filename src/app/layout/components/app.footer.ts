import { Component, inject, computed } from '@angular/core';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    standalone: true,
    selector: '[app-footer]',
    template: `
        <div class="footer-start">
            <img [src]="logoUrl()" alt="logo" style="height: 2rem" />
            <span class="app-name">Hotel NYX Cancun</span>
        </div>
        <div class="footer-right">
            <span>© Hotel NYX Cancun</span>
        </div>`,
    host: {
        class: 'layout-footer'
    }
})
export class AppFooter {
    layoutService = inject(LayoutService);

    // Definimos la lógica igual a la de tu Header
    logoUrl = computed(() => {
        return '/layout/images/NyxHotelLogo-removebg-preview.png';
    });
}
