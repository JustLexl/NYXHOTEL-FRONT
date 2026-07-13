import { Routes } from '@angular/router';
import { RoleGuard } from '@/app/core/guards/role.guard';
import { SeguridadGuard } from '@/app/core/guards/seguridad.guard';

export default [
    {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () => import('./dashboard').then(c => c.Dashboard)
    },
    {
        path: 'usuarios',
        data: { breadcrumb: 'Usuarios', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableusuarios').then(c => c.TableUsuarios)
    },
    {
        path: 'clientes',
        data: { breadcrumb: 'Clientes', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableclientes').then(c => c.TableClientes)
    },
    {
        path: 'MKT',
        data: { breadcrumb: 'Lista de MKT', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableMKT').then(c => c.TableMKT)
    },
    {
        path: 'Ci/Cd',
        data: { breadcrumb: 'Lista de CI/CD', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableCiCd').then(c => c.TableCiCd)
    },
    {
        path: 'ListaProyectos',
        data: { breadcrumb: 'Lista de Proyectos' },
        loadComponent: () => import('./tableListaProyectos').then(c => c.TableListaProyectos)
    },
    {
        path: 'ListaHoras',
        data: { breadcrumb: 'Lista de Horas' },
        loadComponent: () => import('./tableListaHoras').then(c => c.TableListaHoras)
    },
    {
        path: 'ListaReportes',
        data: { breadcrumb: 'Lista de Reportes', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableListaReportes').then(c => c.TableListaReportes)
    },
    {
        path: 'ConcentradoReporte/:id',
        data: { breadcrumb: 'Concentrado de Reporte', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./concentradoReporte').then(c => c.ConcentradoReporte)
    },
    {
        path: 'ListaHosting',
        data: { breadcrumb: 'Lista de Hosting', roles: ['administrador'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./tableListaHostings').then(c => c.TableListaHostings)
    },
    {
        path: 'perfil',
        data: { breadcrumb: 'Perfil' },
        loadComponent: () => import('./perfil').then(c => c.Perfil)
    },
    {
        path: 'ReporteGuardia',
        data: { breadcrumb: 'Reporte de Guardia' },
        loadComponent: () => import('./reporte-guardia').then(c => c.ReporteGuardia)
    },
    {
        path: 'ReportesGuardia',
        data: { breadcrumb: 'Lista de Reportes de Guardia' },
        loadComponent: () => import('./tableReportesGuardia').then(c => c.TableReportesGuardia)
    },
    {
        path: 'VerReporteGuardia/:id',
        data: { breadcrumb: 'Ver Reporte de Guardia' },
        loadComponent: () => import('./verReporteGuardia').then(c => c.VerReporteGuardia)
    },
    {
        path: 'Seguridad',
        data: { breadcrumb: 'Seguridad' },
        canActivate: [SeguridadGuard],
        loadComponent: () => import('./seguridad').then(c => c.SeguridadComponent)
    },
    {
        path: 'ControlLlaves',
        data: { breadcrumb: 'Control de Llaves' },
        loadComponent: () => import('./control-llaves').then(c => c.ControlLlavesComponent)
    },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
