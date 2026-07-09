import { Routes } from '@angular/router';
import { AppLayout } from '@/app/layout/components/app.layout';
import { AuthGuard } from '@/app/core/guards/auth.guard';
import { LoginGuard } from '@/app/core/guards/login.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth/login',
        canActivate: [LoginGuard],
        loadComponent: () => import('@/app/pages/auth/login/login').then((m) => m.Login)
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'Inicio',
                loadChildren: () =>
                    import('@/app/pages/uikit/uikit.routes')
                        .then(m => m.default)
            }
        ]
    },
    { path: 'notfound', loadComponent: () => import('@/app/pages/notfound/notfound').then((c) => c.Notfound) },
    { path: '**', redirectTo: '/notfound' }
];