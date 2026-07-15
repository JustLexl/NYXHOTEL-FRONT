import { Routes } from '@angular/router';
import { RoleGuard } from '@/app/core/guards/role.guard';
import { SeguridadGuard } from '@/app/core/guards/seguridad.guard';
import { ControlLlavesGuard } from '@/app/core/guards/control-llaves.guard';
import { SoloControlLlavesGuard } from '@/app/core/guards/solo-control-llaves.guard';

export default [
    {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./dashboard').then(c => c.Dashboard)
    },
    {
        path: 'usuarios',
        data: { breadcrumb: 'Usuarios', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableusuarios').then(c => c.TableUsuarios)
    },
    {
        path: 'clientes',
        data: { breadcrumb: 'Clientes', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableclientes').then(c => c.TableClientes)
    },
    {
        path: 'MKT',
        data: { breadcrumb: 'Lista de MKT', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableMKT').then(c => c.TableMKT)
    },
    {
        path: 'Ci/Cd',
        data: { breadcrumb: 'Lista de CI/CD', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableCiCd').then(c => c.TableCiCd)
    },
    {
        path: 'ListaProyectos',
        data: { breadcrumb: 'Lista de Proyectos' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./tableListaProyectos').then(c => c.TableListaProyectos)
    },
    {
        path: 'ListaHoras',
        data: { breadcrumb: 'Lista de Horas' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./tableListaHoras').then(c => c.TableListaHoras)
    },
    {
        path: 'ListaReportes',
        data: { breadcrumb: 'Lista de Reportes', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableListaReportes').then(c => c.TableListaReportes)
    },
    {
        path: 'ConcentradoReporte/:id',
        data: { breadcrumb: 'Concentrado de Reporte', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./concentradoReporte').then(c => c.ConcentradoReporte)
    },
    {
        path: 'ListaHosting',
        data: { breadcrumb: 'Lista de Hosting', roles: ['administrador'] },
        canActivate: [SoloControlLlavesGuard, RoleGuard],
        loadComponent: () => import('./tableListaHostings').then(c => c.TableListaHostings)
    },
    {
        path: 'perfil',
        data: { breadcrumb: 'Perfil' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./perfil').then(c => c.Perfil)
    },
    {
        path: 'ReporteGuardia',
        data: { breadcrumb: 'Reporte de Guardia' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./reporte-guardia').then(c => c.ReporteGuardia)
    },
    {
        path: 'ReportesGuardia',
        data: { breadcrumb: 'Lista de Reportes de Guardia' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./tableReportesGuardia').then(c => c.TableReportesGuardia)
    },
    {
        path: 'VerReporteGuardia/:id',
        data: { breadcrumb: 'Ver Reporte de Guardia' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./verReporteGuardia').then(c => c.VerReporteGuardia)
    },
    {
        path: 'Seguridad',
        data: { breadcrumb: 'Seguridad' },
        canActivate: [SoloControlLlavesGuard, SeguridadGuard],
        loadComponent: () => import('./seguridad').then(c => c.SeguridadComponent)
    },
    {
        path: 'ControlLlaves',
        data: { breadcrumb: 'Control de Llaves' },
        canActivate: [ControlLlavesGuard],
        loadComponent: () => import('./control-llaves').then(c => c.ControlLlavesComponent)
    },
    {
        path: 'LostAndFound',
        data: { breadcrumb: 'Lost and Found' },
        canActivate: [SoloControlLlavesGuard],
        loadComponent: () => import('./lost-and-found').then(c => c.LostAndFoundComponent)
    },
    { path: '**', redirectTo: '/notfound' },
] as Routes;

