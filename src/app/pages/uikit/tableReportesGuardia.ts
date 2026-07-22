import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ReporteGuardiaService, ReporteGuardia } from '../service/reporte-guardia.service';
import jsPDF from 'jspdf';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-tableReportesGuardia',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        MultiSelectModule,
        DatePickerModule,
    ],
    providers: [],
    template: `

<!-- ====================== VISTA: TABLA ====================== -->
<div *ngIf="!vistaDetalle" class="card main-content">
    <div class="font-semibold text-xl mb-4 text-slate-800 flex items-center gap-2">
        <span class="material-symbols-outlined text-teal-600">assignment</span>
        <span>Registro de Guardia Ejecutiva</span>
    </div>

    <p-table
        #dt1
        [value]="reportes"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '50rem'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['nombreEjecutivo', 'fecha']"
        responsiveLayout="scroll"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros encontrados">

        <ng-template #caption>
            <div class="flex justify-between items-center w-full">
                <div>
                    <p-button
                        label="Limpiar Filtros"
                        [outlined]="true"
                        icon="pi pi-filter-slash"
                        styleClass="p-button-sm border-slate-300 text-slate-600"
                        (click)="clear(dt1, filterGlobal)" />
                </div>

                <div class="flex items-center gap-4">
                    <p-iconfield iconPosition="left">
                        <p-inputicon>
                            <i class="pi pi-search text-slate-400"></i>
                        </p-inputicon>
                        <input
                            #filterGlobal
                            pInputText
                            type="text"
                            (input)="onGlobalFilter(dt1, $event)"
                            placeholder="Buscar reporte..."
                            class="w-[200px] text-sm border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                    </p-iconfield>
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[45%] px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">
                    <div class="flex justify-start items-center gap-2">
                        <span>Ejecutivo de Guardia</span>
                        <p-columnFilter 
                            field="nombreEjecutivo" 
                            matchMode="in" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter let-value let-filterCallback="filterCallback">
                                <div class="flex flex-col gap-2 p-1 min-w-[200px]" (click)="$event.stopPropagation()">
                                    <span class="text-xs font-bold uppercase text-muted-color">Filtrar por Ejecutivo</span>
                                    <p-multiSelect 
                                        [ngModel]="value" 
                                        [options]="ejecutivosNombres" 
                                        placeholder="Seleccionar Ejecutivos" 
                                        (onChange)="filterCallback($event.value)"
                                        [filter]="true"
                                        emptyFilterMessage="No se encontraron nombres"
                                        class="w-full"
                                        appendTo="body">
                                    </p-multiSelect>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[35%] px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">
                    <div class="flex justify-start items-center gap-2">
                        <span>Fecha y Hora de Creación</span>
                        <p-columnFilter 
                            #cfFecha
                            field="fechaDate" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Seleccionar Fecha</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaFiltro" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearFechaFilter(cfFecha)"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyFechaFilter(cfFecha)"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[20%] px-4 py-3 text-center font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">
                    <div class="flex justify-center items-center">
                        <span>Acciones</span>
                    </div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-reporte>
            <tr class="hover:bg-teal-50/10 transition-colors border-b border-slate-100">
                <td class="px-4 py-3 font-semibold text-slate-700 text-left align-middle uppercase">{{ reporte.nombreEjecutivo }}</td>
                <td class="px-4 py-3 text-left align-middle">
                    <span class="inline-flex items-center gap-2 flex-wrap">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold">
                            <i class="pi pi-calendar text-teal-500"></i>
                            {{ formatearFechaHora(reporte.createdAt || reporte.fecha).fecha }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                            <i class="pi pi-clock text-slate-400"></i>
                            {{ formatearFechaHora(reporte.createdAt || reporte.fecha).hora }}
                        </span>
                    </span>
                </td>
                <td class="px-4 py-3 text-center align-middle">
                    <div class="flex gap-2 justify-center items-center">
                        <button
                            type="button"
                            (click)="verReporte(reporte)"
                            class="flex items-center justify-center w-9 h-9 rounded-lg border bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100 hover:text-teal-700 cursor-pointer transition-all shadow-sm active:scale-95"
                            title="Ver reporte completo">
                            <i class="pi pi-eye" style="font-size: 1.05rem"></i>
                        </button>
                        <button
                            type="button"
                            (click)="generarPDF(reporte)"
                            class="flex items-center justify-center gap-1.5 px-3 h-9 rounded-lg border bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 cursor-pointer transition-all shadow-sm active:scale-95 text-xs font-semibold whitespace-nowrap"
                            title="Generar PDF">
                            <i class="pi pi-file-pdf" style="font-size: 1rem"></i>
                            PDF
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr>
                <td colspan="3" class="text-center p-6 text-slate-400">
                    No se encontraron reportes de guardia.
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>


<!-- ====================== VISTA: DETALLE COMPLETO ====================== -->
<div *ngIf="vistaDetalle && selectedReporte" class="min-h-screen pb-20" style="background:#f8fafc">

    <!-- Header fijo -->
    <div class="sticky top-[-2rem] z-[999] shadow-sm border-b border-slate-200 bg-white">
        <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="NYX" class="h-14" />
                <div>
                    <p class="text-slate-800 font-extrabold text-xl leading-tight">Registro de Guardia Ejecutiva</p>                    <p class="text-teal-600 text-sm font-semibold mt-0.5">{{ formatearFechaHora(selectedReporte.createdAt || selectedReporte.fecha).fecha }} &mdash; <span class="uppercase">{{ selectedReporte.nombreEjecutivo }}</span></p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200">
                    <span class="material-symbols-outlined" style="font-size:16px">visibility</span>
                    Solo lectura
                </span>
                <button (click)="cerrarDetalle()" class="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-base font-semibold cursor-pointer">
                    <span class="material-symbols-outlined" style="font-size:22px">arrow_back</span>
                    Volver
                </button>
            </div>
        </div>
        <!-- Barra decorativa -->
        <div class="h-1" style="background: linear-gradient(90deg, #0d9488, #1e40af, #7c3aed, #c2410c, #991b1b)"></div>
    </div>
 
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-4">
 
        <!-- Tarjeta info general -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
            <div class="flex-1 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 border border-teal-100">
                    <span class="material-symbols-outlined text-teal-600" style="font-size:26px">calendar_today</span>
                </div>
                <div>
                    <p class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Fecha del Turno</p>
                    <p class="text-xl font-bold text-slate-800">{{ formatearFechaHora(selectedReporte.createdAt || selectedReporte.fecha).fecha }}</p>
                </div>
            </div>
            <div class="flex-1 flex items-center gap-4 md:pl-6">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 border border-teal-100">
                    <span class="material-symbols-outlined text-teal-600" style="font-size:26px">person</span>
                </div>
                <div>
                    <p class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Ejecutivo de Guardia</p>
                    <p class="text-xl font-bold text-slate-800 uppercase">{{ selectedReporte.nombreEjecutivo }}</p>
                </div>
            </div>>
        </div>

        <!-- I. Áreas de Huéspedes -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #0f172a, #1e3a5f);">
                <span class="material-symbols-outlined text-teal-400" style="font-size:22px">hotel</span>
                <h2 class="text-white font-bold text-base flex-1">I. Áreas de Huéspedes</h2>
                <span class="text-white/60 text-xs">{{ contarBien(selectedReporte.areasHuespedes) }} bien / {{ contarMal(selectedReporte.areasHuespedes) }} mal</span>
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
                        <tr *ngFor="let item of selectedReporte.areasHuespedes; let i = index"
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
                <div *ngIf="selectedReporte.comentariosAreasHuespedes" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ selectedReporte.comentariosAreasHuespedes }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('ah').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('ah')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagenGrande(ev.preview, ev.label)">
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

        <!-- II. Equipos -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #1e3a5f, #1e40af);">
                <span class="material-symbols-outlined text-blue-300" style="font-size:22px">settings</span>
                <h2 class="text-white font-bold text-base flex-1">II. Equipos</h2>
                <span class="text-white/60 text-xs">{{ contarBien(selectedReporte.equipos) }} bien / {{ contarMal(selectedReporte.equipos) }} mal</span>
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
                        <tr *ngFor="let item of selectedReporte.equipos; let i = index"
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
                <div *ngIf="selectedReporte.comentariosEquipos" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ selectedReporte.comentariosEquipos }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('eq').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('eq')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagenGrande(ev.preview, ev.label)">
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

        <!-- III. Áreas de Colaboradores -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #3730a3, #6d28d9);">
                <span class="material-symbols-outlined text-purple-300" style="font-size:22px">badge</span>
                <h2 class="text-white font-bold text-base flex-1">III. Áreas de Colaboradores</h2>
                <span class="text-white/60 text-xs">{{ contarBien(selectedReporte.areasColaboradores) }} bien / {{ contarMal(selectedReporte.areasColaboradores) }} mal</span>
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
                        <tr *ngFor="let item of selectedReporte.areasColaboradores; let i = index"
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
                <div *ngIf="selectedReporte.comentariosColaboradores" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ selectedReporte.comentariosColaboradores }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('col').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('col')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagenGrande(ev.preview, ev.label)">
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

        <!-- IV. Centros de Consumo -->
        <div *ngFor="let rest of selectedReporte.restaurantes; let ri = index" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" [class.opacity-60]="rest.cerrado">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #7c2d12, #c2410c);">
                <span class="material-symbols-outlined text-orange-300" style="font-size:22px">restaurant</span>
                <h2 class="text-white font-bold text-base flex-1">
                    <span *ngIf="ri === 0">IV. </span>Centros de Consumo — {{ rest.nombre }}
                    <span *ngIf="rest.cerrado" class="ml-2 px-2 py-0.5 text-xs bg-red-800 text-white rounded font-bold uppercase tracking-wider">Cerrado</span>
                </h2>
                <span *ngIf="!rest.cerrado" class="text-white/60 text-xs">{{ contarBien(rest.items) }} bien / {{ contarMal(rest.items) }} mal</span>
            </div>
            
            <div *ngIf="!rest.cerrado" class="overflow-x-auto">
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
            <div *ngIf="!rest.cerrado" class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div *ngIf="rest.comentarios" class="bg-white border border-slate-200 rounded-xl p-4">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comentarios Adicionales del Servicio</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap">{{ rest.comentarios }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('rest_' + ri).length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('rest_' + ri)" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagenGrande(ev.preview, ev.label)">
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

        <!-- VI. Incidentes con Huéspedes -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 flex items-center gap-3" style="background: linear-gradient(135deg, #7f1d1d, #991b1b);">
                <span class="material-symbols-outlined text-red-300" style="font-size:22px">report</span>
                <h2 class="text-white font-bold text-base flex-1">VI. Incidentes con Huéspedes</h2>
            </div>
            <div class="px-6 py-6 space-y-4">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Descripción de Incidentes</p>
                    <p class="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{{ selectedReporte.incidentes || 'Sin incidentes reportados durante este turno.' }}</p>
                </div>
                <ng-container *ngIf="getEvidencias('inc').length > 0">
                    <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Evidencia Fotográfica</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div *ngFor="let ev of getEvidencias('inc')" class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" (click)="abrirImagenGrande(ev.preview, ev.label)">
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
            <button (click)="cerrarDetalle()" class="flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                <span class="material-symbols-outlined" style="font-size:20px">arrow_back</span>
                Volver a la lista de reportes
            </button>
        </div>
    </div>
</div>

<!-- ====================== MODAL DE IMAGEN GRANDE ====================== -->
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
export class TableReportesGuardia implements OnInit {
    @ViewChild('dt1') dt1!: Table;
    reporteService = inject(ReporteGuardiaService);
    cdr = inject(ChangeDetectorRef);

    reportes: any[] = [];
    ejecutivosNombres: string[] = [];
    fechaFiltro: Date | null = null;
    loading: boolean = true;

    // Vista: false = tabla, true = detalle completo
    vistaDetalle: boolean = false;
    selectedReporte: ReporteGuardia | null = null;

    // Lightbox de imagen
    imagenAmpliada: string | null = null;
    etiquetaAmpliada: string = '';

    ngOnInit() {
        this.cargarReportes();
    }

    cargarReportes() {
        this.loading = true;
        this.reporteService.getReportes().subscribe({
            next: (data) => {
                const mapped = (data || []).map((r: any) => ({
                    ...r,
                    fechaDate: r.createdAt ? new Date(r.createdAt) : (r.fecha ? new Date(r.fecha) : null)
                }));
                mapped.sort((a: any, b: any) => {
                    const tA = a.fechaDate ? a.fechaDate.getTime() : 0;
                    const tB = b.fechaDate ? b.fechaDate.getTime() : 0;
                    return tB - tA;
                });
                this.reportes = mapped;
                this.ejecutivosNombres = Array.from(new Set(mapped.map((r: any) => r.nombreEjecutivo).filter(Boolean)));
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando reportes de guardia:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
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
        } catch {
            return fechaStr;
        }
    }

    verReporte(reporte: ReporteGuardia) {
        this.selectedReporte = reporte;
        this.vistaDetalle = true;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        this.cdr.detectChanges();
    }

    cerrarDetalle() {
        this.vistaDetalle = false;
        this.selectedReporte = null;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        this.cdr.detectChanges();
    }

    /** Devuelve las evidencias del reporte activo para la sección indicada */
    getEvidencias(seccion: string): { preview: string; label: string }[] {
        if (!this.selectedReporte?.evidencias) return [];
        const items = this.selectedReporte.evidencias[seccion];
        if (!items) return [];
        return items
            .filter((ev) => ev.preview)
            .map((ev) => ({ preview: ev.preview, label: ev.label || '' }));
    }

    contarBien(items: any[]): number {
        return (items || []).filter(i => i.bien).length;
    }

    contarMal(items: any[]): number {
        return (items || []).filter(i => i.mal).length;
    }

    abrirImagenGrande(src: string, label: string) {
        this.imagenAmpliada = src;
        this.etiquetaAmpliada = label || '';
        this.cdr.detectChanges();
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    clear(table: Table, inputGlobal: HTMLInputElement) {
        table.clear();
        table.filterGlobal('', 'contains');
        this.fechaFiltro = null;
        if (inputGlobal) {
            inputGlobal.value = '';
        }
    }

    applyFechaFilter(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.fechaFiltro, 'fechaDate', 'dateIs');
            this.cdr.detectChanges();
            if (cf) cf.hide();
        }
    }

    clearFechaFilter(cf: any) {
        this.fechaFiltro = null;
        if (this.dt1) {
            this.dt1.filter(null, 'fechaDate', 'dateIs');
            this.cdr.detectChanges();
            if (cf) cf.hide();
        }
    }

    formatearFechaHora(value?: string): { fecha: string; hora: string } {
        if (!value) return { fecha: '—', hora: '—' };
        const d = new Date(value);
        if (isNaN(d.getTime())) return { fecha: value, hora: '—' };
        const fecha = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
        const hora = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
        return { fecha, hora };
    }

    async generarPDF(reporte: ReporteGuardia) {
        // Cargar reporte completo desde el API para garantizar todos los datos
        let r = reporte;
        if (r._id) {
            try { r = await firstValueFrom(this.reporteService.getReporte(r._id)); } catch { }
        }

        // ─── CARGAR LOGO COMO BASE64 ──────────────────────────────────
        let logoDataUrl: string | null = null;
        try {
            const resp = await fetch('layout/images/NyxHotelLogo-removebg-preview.png');
            const blob = await resp.blob();
            logoDataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch { logoDataUrl = null; }

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 14;
        let y = 0;

        const checkPage = (needed: number) => {
            if (y + needed > pageH - 15) { doc.addPage(); y = 14; }
        };

        // ─── ENCABEZADO ───────────────────────────────────────────────
        const headerH = 36;
        doc.setFillColor(13, 148, 136);
        doc.rect(0, 0, pageW, headerH, 'F');

        // Logo a la izquierda
        const logoW = 38;
        const logoH = 22;
        const logoX = margin;
        const logoY = (headerH - logoH) / 2;
        if (logoDataUrl) {
            doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoW, logoH);
        }

        // Texto a la derecha del logo
        const textX = logoX + logoW + 5;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('REGISTRO DE GUARDIA EJECUTIVA', textX, 13);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const { fecha, hora } = this.formatearFechaHora(r.createdAt || r.fecha);
        doc.text('Ejecutivo: ' + r.nombreEjecutivo, textX, 22);
        doc.text('Fecha: ' + fecha + '   Hora: ' + hora, textX, 29);
        y = headerH + 6;

        // ─── TITULO DE SECCION ────────────────────────────────────────
        const sectionTitle = (title: string, rgb: [number, number, number]) => {
            checkPage(14);
            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(margin, y, pageW - margin * 2, 8, 1.5, 1.5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(title.toUpperCase(), margin + 3, y + 5.5);
            y += 11;
        };

        // ─── TABLA DE ITEMS ───────────────────────────────────────────
        const renderItems = (items: any[]) => {
            if (!items || items.length === 0) return;
            // Anchos de columna: Descripcion | Bien | Mal | Observaciones
            const total = pageW - margin * 2;
            const wBien = 18;
            const wMal = 18;
            const wObs = 55;
            const wDesc = total - wBien - wMal - wObs;

            // Cabecera de tabla
            checkPage(8);
            doc.setFillColor(226, 232, 240);
            doc.rect(margin, y, total, 6, 'F');
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(71, 85, 105);
            let x = margin + 2;
            doc.text('Descripcion', x, y + 4); x += wDesc;
            doc.text('Bien', x, y + 4); x += wBien;
            doc.text('Mal', x, y + 4); x += wMal;
            doc.text('Observaciones', x, y + 4);
            y += 6;

            items.forEach((item, idx) => {
                const descLines = doc.splitTextToSize(item.descripcion || '', wDesc - 4);
                const obsLines = doc.splitTextToSize(item.observaciones || '', wObs - 2);
                const rowH = Math.max(descLines.length, obsLines.length, 1) * 4.5 + 3;
                checkPage(rowH + 2);

                // Fondo alterno
                if (idx % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, y, total, rowH, 'F');
                }

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);

                x = margin + 2;

                // Descripcion
                doc.setTextColor(30, 41, 59);
                doc.text(descLines, x, y + 4.5);
                x += wDesc;

                // Bien (SI / NO)
                if (item.bien === true) {
                    doc.setTextColor(22, 163, 74);
                    doc.setFont('helvetica', 'bold');
                    doc.text('SI', x + 3, y + 4.5);
                } else {
                    doc.setTextColor(180, 180, 180);
                    doc.setFont('helvetica', 'normal');
                    doc.text('NO', x + 2, y + 4.5);
                }
                x += wBien;

                // Mal (SI / NO)
                if (item.mal === true) {
                    doc.setTextColor(220, 38, 38);
                    doc.setFont('helvetica', 'bold');
                    doc.text('SI', x + 3, y + 4.5);
                } else {
                    doc.setTextColor(180, 180, 180);
                    doc.setFont('helvetica', 'normal');
                    doc.text('NO', x + 2, y + 4.5);
                }
                x += wMal;

                // Observaciones
                doc.setTextColor(71, 85, 105);
                doc.setFont('helvetica', 'normal');
                doc.text(obsLines, x, y + 4.5);

                y += rowH;

                // Linea separadora
                doc.setDrawColor(226, 232, 240);
                doc.line(margin, y, pageW - margin, y);
            });
            y += 4;
        };

        // ─── COMENTARIO ───────────────────────────────────────────────
        const comentario = (label: string, text: string) => {
            if (!text || !text.trim()) return;
            checkPage(10);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(71, 85, 105);
            doc.text(label + ':', margin, y + 4);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            const lines = doc.splitTextToSize(text, pageW - margin * 2 - 28);
            doc.text(lines, margin + 28, y + 4);
            y += Math.max(lines.length, 1) * 4.5 + 5;
        };

        // ─── SECCIONES ────────────────────────────────────────────────
        sectionTitle('Areas de Huespedes', [13, 148, 136]);
        renderItems(r.areasHuespedes);
        comentario('Comentarios', r.comentariosAreasHuespedes);

        sectionTitle('Equipos', [59, 130, 246]);
        renderItems(r.equipos);
        comentario('Comentarios', r.comentariosEquipos);

        sectionTitle('Areas de Colaboradores', [168, 85, 247]);
        renderItems(r.areasColaboradores);
        comentario('Comentarios', r.comentariosColaboradores);

        (r.restaurantes || []).forEach(rest => {
            const esBar = rest.nombre.toLowerCase().includes('bar');
            const prefix = esBar ? 'Bar: ' : 'Restaurante: ';
            const titulo = prefix + rest.nombre + (rest.cerrado ? ' - CERRADO' : '');
            sectionTitle(titulo, [194, 65, 12]);
            if (!rest.cerrado) {
                renderItems(rest.items);
                comentario('Comentarios', rest.comentarios);
            }
        });

        if (r.incidentes && r.incidentes.trim()) {
            sectionTitle('Incidentes', [234, 88, 12]);
            checkPage(10);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            const incLines = doc.splitTextToSize(r.incidentes, pageW - margin * 2);
            doc.text(incLines, margin, y);
            y += incLines.length * 4.5 + 4;
        }

        // ─── EVIDENCIAS ───────────────────────────────────────────────
        if (r.evidencias && Object.keys(r.evidencias).length > 0) {
            const seccionLabels: Record<string, string> = {
                'ah': 'Areas de Huespedes',
                'eq': 'Equipos',
                'col': 'Areas de Colaboradores',
                'inc': 'Incidentes'
            };

            // Construir label de restaurante por índice
            const getSecLabel = (sec: string): string => {
                if (seccionLabels[sec]) return seccionLabels[sec];
                if (sec.startsWith('rest_')) {
                    const idx = parseInt(sec.replace('rest_', ''), 10);
                    const rest = (r.restaurantes || [])[idx];
                    if (rest) {
                        const esBar = rest.nombre.toLowerCase().includes('bar');
                        const prefix = esBar ? 'Bar: ' : 'Restaurante: ';
                        return prefix + rest.nombre;
                    }
                    return 'Restaurante ' + (idx + 1);
                }
                return sec;
            };



            const imgW = 55;
            const imgH = 42;
            const imgGap = 6;
            const cols = 3;

            let hayEvidencias = false;
            if (r.evidencias) {
                for (const sec of Object.keys(r.evidencias)) {
                    const imgs = (r.evidencias[sec] || []).filter(e => e.preview);
                    if (imgs.length > 0) { hayEvidencias = true; break; }
                }
            }

            if (hayEvidencias && r.evidencias) {
                sectionTitle('Evidencias Fotograficas', [30, 41, 59]);

                for (const sec of Object.keys(r.evidencias)) {
                    const imgs = (r.evidencias[sec] || []).filter(e => e.preview);
                    if (imgs.length === 0) continue;

                    // Sub-encabezado de sección
                    checkPage(10);
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(71, 85, 105);
                    const secLabel = getSecLabel(sec);
                    doc.text(secLabel.toUpperCase(), margin, y);
                    y += 5;


                    // Grid de imágenes
                    let col = 0;
                    let rowStartY = y;

                    for (const ev of imgs) {
                        const xPos = margin + col * (imgW + imgGap);
                        checkPage(imgH + 10);

                        // Si es nueva fila, actualizar rowStartY
                        if (col === 0) rowStartY = y;

                        try {
                            // Detectar formato de imagen
                            let format: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG';
                            if (ev.preview.includes('data:image/png')) format = 'PNG';
                            else if (ev.preview.includes('data:image/webp')) format = 'WEBP';

                            doc.addImage(ev.preview, format, xPos, y, imgW, imgH);

                            // Marco alrededor de la imagen
                            doc.setDrawColor(200, 200, 200);
                            doc.rect(xPos, y, imgW, imgH);
                        } catch {
                            // Si la imagen falla, mostrar placeholder
                            doc.setFillColor(240, 240, 240);
                            doc.rect(xPos, y, imgW, imgH, 'F');
                            doc.setFontSize(7);
                            doc.setTextColor(150, 150, 150);
                            doc.text('Imagen no disponible', xPos + 2, y + imgH / 2);
                        }

                        // Etiqueta debajo de la imagen: Sección + descripción
                        {
                            const etiquetaSeccion = secLabel;
                            const etiquetaDesc = ev.label || '';
                            doc.setFontSize(6.5);
                            doc.setFont('helvetica', 'bold');
                            doc.setTextColor(71, 85, 105);
                            const secLines = doc.splitTextToSize(etiquetaSeccion, imgW);
                            doc.text(secLines, xPos, y + imgH + 3.5);
                            if (etiquetaDesc) {
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(120, 120, 120);
                                const descLines = doc.splitTextToSize(etiquetaDesc, imgW);
                                doc.text(descLines, xPos, y + imgH + 3.5 + secLines.length * 3.5);
                            }
                        }

                        col++;
                        if (col >= cols) {
                            col = 0;
                            y += imgH + 12;
                        }

                    }

                    // Si quedó fila incompleta, avanzar y
                    if (col > 0) {
                        y += imgH + 8;
                    }
                    y += 4;
                }
            }
        }

        if (r.firmaEjecutivo) {
            checkPage(42);
            sectionTitle('Firma del Ejecutivo', [30, 41, 59]);
            try { doc.addImage(r.firmaEjecutivo, 'PNG', margin, y, 60, 30); y += 34; } catch { }
        }


        // ─── PIE DE PAGINA ────────────────────────────────────────────
        const totalPages = (doc.internal as any).getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(
                'Pagina ' + i + ' de ' + totalPages + '  -  Generado: ' + new Date().toLocaleString('es-MX'),
                margin, pageH - 5
            );
        }

        const nombreArchivo = 'reporte-guardia_' + r.nombreEjecutivo.replace(/\s+/g, '_') + '_' + r.fecha + '.pdf';
        doc.save(nombreArchivo);
    }
}


