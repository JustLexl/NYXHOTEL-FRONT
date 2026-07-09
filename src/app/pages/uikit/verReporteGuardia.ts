import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteGuardiaService, ReporteGuardia, EvidenciaImagen } from '../service/reporte-guardia.service';

@Component({
    selector: 'app-ver-reporte-guardia',
    standalone: true,
    imports: [CommonModule],
    template: `
<!-- ESTADO: Cargando -->
<div *ngIf="loading" class="min-h-screen flex items-center justify-center" style="background:#f8fafc">
    <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-teal-500 animate-spin" style="font-size:48px">progress_activity</span>
        <p class="text-slate-500 font-medium">Cargando reporte...</p>
    </div>
</div>

<!-- ESTADO: Error -->
<div *ngIf="!loading && !reporte" class="min-h-screen flex items-center justify-center" style="background:#f8fafc">
    <div class="flex flex-col items-center gap-4 text-center p-8">
        <span class="material-symbols-outlined text-red-400" style="font-size:56px">error</span>
        <h2 class="text-2xl font-bold text-slate-700">Reporte no encontrado</h2>
        <p class="text-slate-500">El reporte solicitado no existe o fue eliminado.</p>
        <button (click)="volver()" class="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors cursor-pointer">
            Volver a la lista
        </button>
    </div>
</div>

<!-- VISTA PRINCIPAL: Reporte -->
<div *ngIf="!loading && reporte" class="min-h-screen pb-20" style="background:#f8fafc">

    <!-- Header fijo -->
    <div class="sticky top-[-2rem] z-[999] shadow-sm border-b border-slate-200 bg-white">
        <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="NYX" class="h-14" />
                <div>
                    <p class="text-slate-800 font-extrabold text-xl leading-tight">Reporte de Guardia Ejecutiva</p>
                    <p class="text-teal-600 text-sm font-semibold mt-0.5">{{ formatearFecha(reporte.fecha) }} &mdash; {{ reporte.nombreEjecutivo }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200">
                    <span class="material-symbols-outlined" style="font-size:16px">visibility</span>
                    Solo lectura
                </span>
                <button (click)="volver()" class="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-base font-semibold cursor-pointer">
                    <span class="material-symbols-outlined" style="font-size:22px">arrow_back</span>
                    Volver
                </button>
            </div>
        </div>
        <!-- Barra decorativa -->
        <div class="h-1" style="background: linear-gradient(90deg, #0d9488, #1e40af, #7c3aed, #c2410c, #991b1b)"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8 space-y-4">

        <!-- Tarjeta de info general -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
            <div class="flex-1 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 border border-teal-100">
                    <span class="material-symbols-outlined text-teal-600" style="font-size:26px">calendar_today</span>
                </div>
                <div>
                    <p class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Fecha del Turno</p>
                    <p class="text-xl font-bold text-slate-800">{{ formatearFecha(reporte.fecha) }}</p>
                </div>
            </div>
            <div class="flex-1 flex items-center gap-4 md:pl-6">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 border border-teal-100">
                    <span class="material-symbols-outlined text-teal-600" style="font-size:26px">person</span>
                </div>
                <div>
                    <p class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Ejecutivo de Guardia</p>
                    <p class="text-xl font-bold text-slate-800">{{ reporte.nombreEjecutivo }}</p>
                </div>
            </div>
        </div>

        <!-- ===== SECCIÓN I: ÁREAS DE HUÉSPEDES ===== -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #0f172a, #1e3a5f);">
                <span class="material-symbols-outlined text-teal-400" style="font-size:22px">hotel</span>
                <h2 class="text-white font-bold text-base flex-1">I. Áreas de Huéspedes</h2>
                <span class="text-white/60 text-xs">{{ contarBien(reporte.areasHuespedes) }} bien / {{ contarMal(reporte.areasHuespedes) }} mal</span>
            </div>
            <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique la limpieza, iluminación y estado general en:</p>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                            <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                            <th class="px-3 py-2 font-semibold text-center w-16">Estado</th>
                            <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of reporte.areasHuespedes; let i = index"
                            [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                            class="border-b border-slate-100">
                            <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                            <td class="px-3 py-3 text-center">
                                <span *ngIf="item.bien" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">check_circle</span> BIEN
                                </span>
                                <span *ngIf="item.mal" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs border border-red-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">cancel</span> MAL
                                </span>
                                <span *ngIf="!item.bien && !item.mal" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200">N/R</span>
                            </td>
                            <td class="px-4 py-3 text-slate-600 text-xs italic">{{ item.observaciones || '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div *ngIf="reporte.comentariosAreasHuespedes" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ reporte.comentariosAreasHuespedes }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('ah').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('ah')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagen(ev.preview, ev.label)">
                            <div class="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                                <img [src]="ev.preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" alt="Evidencia"/>
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity" style="font-size:28px">zoom_in</span>
                                </div>
                            </div>
                            <div *ngIf="ev.label" class="p-2 bg-white border-t border-slate-100">
                                <p class="text-xs text-slate-600 font-medium leading-tight">{{ ev.label }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>

        <!-- ===== SECCIÓN II: EQUIPOS ===== -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #1e3a5f, #1e40af);">
                <span class="material-symbols-outlined text-blue-300" style="font-size:22px">settings</span>
                <h2 class="text-white font-bold text-base flex-1">II. Equipos</h2>
                <span class="text-white/60 text-xs">{{ contarBien(reporte.equipos) }} bien / {{ contarMal(reporte.equipos) }} mal</span>
            </div>
            <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique que estén dentro de los parámetros aceptables:</p>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                            <th class="text-left px-6 py-2 font-semibold w-3/5">Equipo</th>
                            <th class="px-3 py-2 font-semibold text-center w-16">Estado</th>
                            <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of reporte.equipos; let i = index"
                            [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                            class="border-b border-slate-100">
                            <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                            <td class="px-3 py-3 text-center">
                                <span *ngIf="item.bien" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">check_circle</span> BIEN
                                </span>
                                <span *ngIf="item.mal" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs border border-red-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">cancel</span> MAL
                                </span>
                                <span *ngIf="!item.bien && !item.mal" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200">N/R</span>
                            </td>
                            <td class="px-4 py-3 text-slate-600 text-xs italic">{{ item.observaciones || '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div *ngIf="reporte.comentariosEquipos" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ reporte.comentariosEquipos }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('eq').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('eq')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagen(ev.preview, ev.label)">
                            <div class="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                                <img [src]="ev.preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" alt="Evidencia"/>
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity" style="font-size:28px">zoom_in</span>
                                </div>
                            </div>
                            <div *ngIf="ev.label" class="p-2 bg-white border-t border-slate-100">
                                <p class="text-xs text-slate-600 font-medium leading-tight">{{ ev.label }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>

        <!-- ===== SECCIÓN III: ÁREAS DE COLABORADORES ===== -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #3730a3, #6d28d9);">
                <span class="material-symbols-outlined text-purple-300" style="font-size:22px">badge</span>
                <h2 class="text-white font-bold text-base flex-1">III. Áreas de Colaboradores</h2>
                <span class="text-white/60 text-xs">{{ contarBien(reporte.areasColaboradores) }} bien / {{ contarMal(reporte.areasColaboradores) }} mal</span>
            </div>
            <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique la limpieza, iluminación y estado general en:</p>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                            <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                            <th class="px-3 py-2 font-semibold text-center w-16">Estado</th>
                            <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of reporte.areasColaboradores; let i = index"
                            [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                            class="border-b border-slate-100">
                            <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                            <td class="px-3 py-3 text-center">
                                <span *ngIf="item.bien" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">check_circle</span> BIEN
                                </span>
                                <span *ngIf="item.mal" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs border border-red-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">cancel</span> MAL
                                </span>
                                <span *ngIf="!item.bien && !item.mal" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200">N/R</span>
                            </td>
                            <td class="px-4 py-3 text-slate-600 text-xs italic">{{ item.observaciones || '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div *ngIf="reporte.comentariosColaboradores" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ reporte.comentariosColaboradores }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('col').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('col')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagen(ev.preview, ev.label)">
                            <div class="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                                <img [src]="ev.preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" alt="Evidencia"/>
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity" style="font-size:28px">zoom_in</span>
                                </div>
                            </div>
                            <div *ngIf="ev.label" class="p-2 bg-white border-t border-slate-100">
                                <p class="text-xs text-slate-600 font-medium leading-tight">{{ ev.label }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>

        <!-- ===== SECCIÓN IV: CENTROS DE CONSUMO ===== -->
        <div *ngFor="let rest of reporte.restaurantes; let ri = index" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #7c2d12, #c2410c);">
                <span class="material-symbols-outlined text-orange-300" style="font-size:22px">restaurant</span>
                <h2 class="text-white font-bold text-base flex-1">
                    <span *ngIf="ri === 0">IV. </span>Centros de Consumo — {{ rest.nombre }}
                </h2>
                <span class="text-white/60 text-xs">{{ contarBien(rest.items) }} bien / {{ contarMal(rest.items) }} mal</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                            <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                            <th class="px-3 py-2 font-semibold text-center w-16">Estado</th>
                            <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of rest.items; let i = index"
                            [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                            class="border-b border-slate-100">
                            <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                            <td class="px-3 py-3 text-center">
                                <span *ngIf="item.bien" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">check_circle</span> BIEN
                                </span>
                                <span *ngIf="item.mal" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs border border-red-200">
                                    <span class="material-symbols-outlined" style="font-size:13px">cancel</span> MAL
                                </span>
                                <span *ngIf="!item.bien && !item.mal" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200">N/R</span>
                            </td>
                            <td class="px-4 py-3 text-slate-600 text-xs italic">{{ item.observaciones || '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div *ngIf="rest.comentarios" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales del Servicio</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ rest.comentarios }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('rest_' + ri).length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('rest_' + ri)" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagen(ev.preview, ev.label)">
                            <div class="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                                <img [src]="ev.preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" alt="Evidencia"/>
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity" style="font-size:28px">zoom_in</span>
                                </div>
                            </div>
                            <div *ngIf="ev.label" class="p-2 bg-white border-t border-slate-100">
                                <p class="text-xs text-slate-600 font-medium leading-tight">{{ ev.label }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>

        <!-- ===== SECCIÓN VI: INCIDENTES ===== -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #7f1d1d, #991b1b);">
                <span class="material-symbols-outlined text-red-300" style="font-size:22px">report</span>
                <h2 class="text-white font-bold text-base flex-1">VI. Incidentes con Huéspedes</h2>
            </div>
            <div class="px-6 py-6 space-y-4">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Descripción de Incidentes</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{{ reporte.incidentes || 'Sin incidentes reportados durante este turno.' }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('inc').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('inc')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagen(ev.preview, ev.label)">
                            <div class="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                                <img [src]="ev.preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" alt="Evidencia"/>
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity" style="font-size:28px">zoom_in</span>
                                </div>
                            </div>
                            <div *ngIf="ev.label" class="p-2 bg-white border-t border-slate-100">
                                <p class="text-xs text-slate-600 font-medium leading-tight">{{ ev.label }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>

        <!-- Botón inferior volver -->
        <div class="flex justify-center pt-4">
            <button (click)="volver()" class="flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                <span class="material-symbols-outlined" style="font-size:20px">arrow_back</span>
                Volver a la lista de reportes
            </button>
        </div>
    </div>
</div>

<!-- MODAL imagen ampliada -->
<div *ngIf="imagenAmpliada" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm animate-fade-in" (click)="imagenAmpliada = null">
    <div class="relative max-w-5xl max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center animate-scale-in" (click)="$event.stopPropagation()">
        <div class="w-full flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
            <p class="text-slate-700 font-semibold text-sm">{{ etiquetaAmpliada || 'Sin etiqueta' }}</p>
            <button class="bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full p-1.5 cursor-pointer flex items-center justify-center transition-colors" (click)="imagenAmpliada = null">
                <span class="material-symbols-outlined" style="font-size:20px">close</span>
            </button>
        </div>
        <div class="overflow-auto max-h-[80vh] p-2">
            <img [src]="imagenAmpliada" class="max-w-full max-h-[75vh] object-contain rounded-lg" />
        </div>
    </div>
</div>
    `,
    styles: [`
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `]
})
export class VerReporteGuardia implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private reporteService = inject(ReporteGuardiaService);
    private cdr = inject(ChangeDetectorRef);

    reporte: ReporteGuardia | null = null;
    loading = true;

    imagenAmpliada: string | null = null;
    etiquetaAmpliada = '';

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.reporteService.getReporte(id).subscribe({
                next: (data) => {
                    this.reporte = data;
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.reporte = null;
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.loading = false;
        }
    }

    volver() {
        this.router.navigate(['/Inicio/ReportesGuardia']);
    }

    formatearFecha(fechaStr: string): string {
        if (!fechaStr) return '';
        try {
            const partes = fechaStr.split('-');
            if (partes.length === 3) {
                const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
                return fecha.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
            return fechaStr;
        } catch { return fechaStr; }
    }

    getEvidencias(key: string): EvidenciaImagen[] {
        return this.reporte?.evidencias?.[key] || [];
    }

    contarBien(items: any[]): number {
        return (items || []).filter(i => i.bien).length;
    }

    contarMal(items: any[]): number {
        return (items || []).filter(i => i.mal).length;
    }

    abrirImagen(url: string, label: string) {
        this.imagenAmpliada = url;
        this.etiquetaAmpliada = label;
        this.cdr.detectChanges();
    }
}
