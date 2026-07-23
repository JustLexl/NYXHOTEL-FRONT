import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DistintivoHRecord, DistintivoHService, HallazgoItem, SeccionDistintivoH } from '../service/distintivo-h.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-tareas-distintivo-h',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DrawerModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="p-6 min-h-screen bg-slate-50">

    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                <i class="pi pi-verified text-sky-600 text-3xl"></i>
                TAREAS DE DISTINTIVO "H"
            </h1>
            <p class="text-slate-500 mt-1 text-sm font-medium">
                Control, auditoría e inocuidad alimentaria por departamento independiente.
            </p>
        </div>
        <button
            (click)="openAddDrawer()"
            class="bg-sky-600 text-white hover:bg-sky-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Crear Observación ({{ activeSeccion }})
        </button>
    </div>

    <!-- SECCIONES / TABS DE NAVEGACIÓN (5 DEPARTAMENTOS) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
            type="button"
            (click)="setSeccion('AYB')"
            [class]="activeSeccion === 'AYB'
                ? 'bg-sky-600 text-white shadow-md font-extrabold'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 font-bold'"
            class="py-3 px-3 rounded-xl text-xs transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <div class="flex items-center gap-1.5">
                <i class="pi pi-glass-martini text-sm"></i>
                <span class="font-extrabold">AYB</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                [class]="activeSeccion === 'AYB' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
                Resp: Ignacio Saucedo
            </span>
        </button>

        <button
            type="button"
            (click)="setSeccion('COCINA')"
            [class]="activeSeccion === 'COCINA'
                ? 'bg-amber-600 text-white shadow-md font-extrabold'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 font-bold'"
            class="py-3 px-3 rounded-xl text-xs transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <div class="flex items-center gap-1.5">
                <i class="pi pi-shopping-bag text-sm"></i>
                <span class="font-extrabold">COCINA</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                [class]="activeSeccion === 'COCINA' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
                Resp: Gabriel de la Cruz
            </span>
        </button>

        <button
            type="button"
            (click)="setSeccion('MANTENIMIENTO')"
            [class]="activeSeccion === 'MANTENIMIENTO'
                ? 'bg-slate-800 text-white shadow-md font-extrabold'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 font-bold'"
            class="py-3 px-3 rounded-xl text-xs transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <div class="flex items-center gap-1.5">
                <i class="pi pi-wrench text-sm"></i>
                <span class="font-extrabold">MANTENIMIENTO</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                [class]="activeSeccion === 'MANTENIMIENTO' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
                Resp: Flavio Jimenez
            </span>
        </button>

        <button
            type="button"
            (click)="setSeccion('ALMACEN')"
            [class]="activeSeccion === 'ALMACEN'
                ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 font-bold'"
            class="py-3 px-3 rounded-xl text-xs transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <div class="flex items-center gap-1.5">
                <i class="pi pi-box text-sm"></i>
                <span class="font-extrabold">ALMACÉN</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                [class]="activeSeccion === 'ALMACEN' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
                Resp: Wilberth Canul
            </span>
        </button>

        <button
            type="button"
            (click)="setSeccion('AMA_DE_LLAVES')"
            [class]="activeSeccion === 'AMA_DE_LLAVES'
                ? 'bg-purple-700 text-white shadow-md font-extrabold'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 font-bold'"
            class="py-3 px-3 rounded-xl text-xs transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <div class="flex items-center gap-1.5">
                <i class="pi pi-home text-sm"></i>
                <span class="font-extrabold">AMA DE LLAVES</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                [class]="activeSeccion === 'AMA_DE_LLAVES' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
                Resp: Victoria Balam
            </span>
        </button>
    </div>

    <!-- Stats Cards Row (Filtrados por la sección activa) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Auditorías ({{ activeSeccion }})</span>
            <span class="text-3xl font-black text-slate-800">{{ getSeccionRecords().length }}</span>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-red-600 uppercase tracking-wider">No Realizados</span>
            <span class="text-3xl font-black text-red-700">{{ getNoRealizadosCount() }}</span>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">En Proceso</span>
            <span class="text-3xl font-black text-amber-700">{{ getEnProcesoCount() }}</span>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Realizados</span>
            <span class="text-3xl font-black text-emerald-700">{{ getRealizadosCount() }}</span>
        </div>
    </div>

    <!-- 2 Column Layout (Left: Observaciones Table | Right: Selected Evidences Panel) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- LEFT COLUMN: TABLA DE OBSERVACIONES -->
        <div [class]="selectedRecord ? 'lg:col-span-6' : 'lg:col-span-12'" class="transition-all duration-300">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <!-- Table Toolbar/Filter -->
                <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
                    <div class="relative w-full sm:w-72">
                        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            [(ngModel)]="searchQuery"
                            (ngModelChange)="applyFilters()"
                            placeholder="Buscar por fecha, auditor o área..."
                            class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" />
                    </div>
                    <span class="text-xs text-slate-500 font-semibold">
                        Mostrando {{ filteredRecords.length }} auditoría(s) de <strong class="text-slate-800">{{ activeSeccion }}</strong>
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                <th class="py-4 px-5">Fecha / Mes</th>
                                <th class="py-4 px-5">Auditor / Resp.</th>
                                <th class="py-4 px-5">Hallazgos</th>
                                <th class="py-4 px-5">Estatus General</th>
                                <th class="py-4 px-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                            <tr *ngFor="let item of filteredRecords"
                                [class.bg-sky-50]="selectedRecord?.id === item.id"
                                class="hover:bg-slate-50 transition-colors duration-150">
                                <td class="py-4 px-5 font-bold text-slate-900">
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-calendar text-sky-600"></i>
                                        <span>{{ item.fecha }}</span>
                                    </div>
                                    <span *ngIf="item.mesAuditoria" class="text-xs font-semibold text-sky-700 block mt-0.5 uppercase">
                                        Mes: {{ item.mesAuditoria }}
                                    </span>
                                </td>
                                <td class="py-4 px-5 text-xs">
                                    <span class="font-bold text-slate-800 block">Auditor: {{ item.auditor || '—' }}</span>
                                    <span class="text-slate-600 block">Resp: {{ item.responsableDepto || '—' }}</span>
                                </td>
                                <td class="py-4 px-5">
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700">
                                        <i class="pi pi-list"></i>
                                        {{ item.hallazgos.length || 0 }} hallazgo(s)
                                    </span>
                                </td>
                                <td class="py-4 px-5">
                                    <div class="flex items-center gap-1.5">
                                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800" title="Realizados">
                                            {{ countStatusInRecord(item, 'REALIZADO') }} ✓
                                        </span>
                                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800" title="En Proceso">
                                            {{ countStatusInRecord(item, 'EN_PROCESO') }} ~
                                        </span>
                                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800" title="No Realizados">
                                            {{ countStatusInRecord(item, 'NO_REALIZADO') }} ✗
                                        </span>
                                    </div>
                                </td>
                                <td class="py-4 px-5 text-right">
                                    <div class="flex justify-end items-center gap-2">
                                        <button
                                            (click)="selectRecordForEvidence(item)"
                                            title="Colocar Evidencias"
                                            class="bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-sm">
                                            <i class="pi pi-images"></i>
                                            <span>Colocar Evidencia</span>
                                        </button>
                                        <button
                                            (click)="openFormatView(item)"
                                            title="Visualizar Formato Oficial"
                                            class="bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 p-2 rounded-lg transition-all duration-150 cursor-pointer border border-slate-200">
                                            <i class="pi pi-file-pdf"></i>
                                        </button>
                                        <button
                                            (click)="openEditDrawer(item)"
                                            title="Editar Observación"
                                            class="bg-slate-100 text-slate-600 hover:bg-slate-200 p-2 rounded-lg transition-all duration-150 cursor-pointer border border-slate-200">
                                            <i class="pi pi-pencil"></i>
                                        </button>
                                        <button
                                            (click)="deleteRecord(item)"
                                            title="Eliminar Observación"
                                            class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all duration-150 cursor-pointer border border-red-100">
                                            <i class="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr *ngIf="filteredRecords.length === 0">
                                <td colspan="5" class="py-12 px-6 text-center text-slate-400 font-medium">
                                    <i class="pi pi-info-circle text-2xl block mb-2 text-slate-300"></i>
                                    No se encontraron observaciones para la sección <strong class="text-slate-600">{{ activeSeccion }}</strong>. Haz clic en "Crear Observación".
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN: SEGUIMIENTO / COLOCAR EVIDENCIA DETALLE (Si está seleccionado) -->
        <div *ngIf="selectedRecord" class="lg:col-span-6 transition-all duration-300">
            <div class="rounded-2xl overflow-hidden shadow-xl border border-slate-200 sticky top-6">

                <!-- Header Premium -->
                <div class="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 p-5 flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-extrabold text-sky-200 uppercase tracking-widest">{{ selectedRecord.seccion || activeSeccion }}</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
                            <span class="text-xs text-sky-200 font-semibold">{{ selectedRecord.mesAuditoria }}</span>
                        </div>
                        <h2 class="text-white font-black text-xl flex items-center gap-2">
                            <i class="pi pi-images text-white/80"></i>
                            Colocar Evidencias
                        </h2>
                        <p class="text-sky-200 text-xs mt-1 font-medium">
                            Auditoría del <span class="font-black text-white">{{ selectedRecord.fecha }}</span>
                            - {{ selectedRecord.hallazgos.length }} hallazgo(s)
                        </p>
                    </div>
                    <button (click)="closeEvidencePanel()" class="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all cursor-pointer">
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>

                <!-- Lista de Hallazgos -->
                <div class="bg-slate-50 flex flex-col gap-0 max-h-[68vh] overflow-y-auto divide-y divide-slate-200">
                    <div *ngFor="let h of selectedRecord.hallazgos; let idx = index"
                        class="bg-white hover:bg-slate-50/70 transition-colors duration-150 p-5 flex flex-col gap-4">

                        <!-- CONTEXTO DEL HALLAZGO -->
                        <div class="rounded-xl overflow-hidden border border-sky-200 shadow-sm">
                            <div class="bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-white/20 text-white text-[11px] font-black flex items-center justify-center">{{ idx + 1 }}</span>
                                    <span class="text-white text-[10px] font-extrabold uppercase tracking-widest">Hallazgo a resolver</span>
                                </div>
                                <span class="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Área: {{ h.area }}</span>
                            </div>
                            <div class="bg-sky-50 px-4 py-3 border-b border-sky-100">
                                <p class="text-slate-800 font-semibold text-xs leading-relaxed">{{ h.hallazgo }}</p>
                            </div>
                            <div class="bg-white px-4 py-2 flex items-center gap-2">
                                <i class="pi pi-user text-sky-500 text-xs"></i>
                                <span class="text-xs text-slate-500 font-medium">Responsable:</span>
                                <span class="text-xs font-bold text-slate-800">{{ h.responsable }}</span>
                            </div>
                        </div>

                        <!-- CAMPOS DE RESPUESTA -->
                        <div class="flex flex-col gap-4 pl-1">

                            <!-- Realizado SI / NO -->
                            <div>
                                <label class="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Realizado SI O NO</label>
                                <div class="flex gap-2">
                                    <button type="button" (click)="h.realizado = true"
                                        [class]="h.realizado ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'"
                                        class="border-2 flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 uppercase">
                                        <i class="pi pi-check-circle"></i> Sí
                                    </button>
                                    <button type="button" (click)="h.realizado = false"
                                        [class]="h.realizado === false ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-200' : 'bg-white text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-600'"
                                        class="border-2 flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 uppercase">
                                        <i class="pi pi-times-circle"></i> No
                                    </button>
                                </div>
                            </div>

                            <!-- ESTATUS DEL HALLAZGO -->
                            <div>
                                <label class="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Estatus del Hallazgo</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <button type="button" (click)="h.estatus = 'NO_REALIZADO'"
                                        [class]="h.estatus === 'NO_REALIZADO' ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-xs font-black scale-[1.03]' : 'bg-white text-rose-700 border-slate-200 hover:border-rose-300'"
                                        class="border-2 py-3 rounded-xl text-[10px] font-black transition-all duration-150 text-center cursor-pointer uppercase leading-tight">
                                        <i class="pi pi-ban block mb-1 text-sm"></i>No Realizado
                                    </button>
                                    <button type="button" (click)="h.estatus = 'EN_PROCESO'"
                                        [class]="h.estatus === 'EN_PROCESO' ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-xs font-black scale-[1.03]' : 'bg-white text-amber-700 border-slate-200 hover:border-amber-300'"
                                        class="border-2 py-3 rounded-xl text-[10px] font-black transition-all duration-150 text-center cursor-pointer uppercase leading-tight">
                                        <i class="pi pi-spin pi-spinner block mb-1 text-sm"></i>En Proceso
                                    </button>
                                    <button type="button" (click)="h.estatus = 'REALIZADO'"
                                        [class]="h.estatus === 'REALIZADO' ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-xs font-black scale-[1.03]' : 'bg-white text-emerald-700 border-slate-200 hover:border-emerald-300'"
                                        class="border-2 py-3 rounded-xl text-[10px] font-black transition-all duration-150 text-center cursor-pointer uppercase leading-tight">
                                        <i class="pi pi-verified block mb-1 text-sm"></i>Realizado
                                    </button>
                                </div>
                            </div>

                            <!-- Evidencia de mejora (Foto) -->
                            <div>
                                <label class="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Evidencia de Mejora</label>
                                <input type="file" accept="image/*" (change)="onEvidenciaSelected($event, h)" class="hidden" #fileInputEvidence />
                                <button *ngIf="!h.evidencia" type="button" (click)="fileInputEvidence.click()"
                                    class="w-full border-2 border-dashed border-slate-300 hover:border-sky-400 hover:bg-sky-50 rounded-xl py-5 text-slate-400 hover:text-sky-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                                    <i class="pi pi-camera text-2xl"></i>
                                    <span>Subir foto de evidencia</span>
                                    <span class="text-[10px] font-normal text-slate-300">JPG, PNG, WEBP</span>
                                </button>
                                <div *ngIf="h.evidencia" class="relative rounded-xl overflow-hidden border border-slate-200 shadow group">
                                    <img [src]="h.evidencia" class="w-full max-h-44 object-cover" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span class="text-white text-[11px] font-bold flex items-center gap-1">
                                            <i class="pi pi-check-circle text-emerald-400"></i> Evidencia cargada
                                        </span>
                                        <button type="button" (click)="h.evidencia = ''"
                                            class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                            <i class="pi pi-trash"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                                <button *ngIf="h.evidencia" type="button" (click)="fileInputEvidence.click()"
                                    class="mt-2 text-[10px] text-sky-600 hover:text-sky-800 font-bold cursor-pointer flex items-center gap-1">
                                    <i class="pi pi-refresh"></i> Cambiar foto
                                </button>
                            </div>

                            <!-- Plan de acción -->
                            <div>
                                <label class="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Plan de acción</label>
                                <textarea [(ngModel)]="h.planAccion" rows="2"
                                    placeholder="¿Qué se realizó o por qué no se realizó?"
                                    class="w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none bg-white text-slate-800 placeholder:text-slate-300 transition-colors resize-none"></textarea>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Footer: Guardar -->
                <div class="bg-white border-t border-slate-200 p-4 flex gap-3">
                    <button (click)="closeEvidencePanel()"
                        class="px-5 py-2.5 border-2 border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-600 cursor-pointer transition-all">
                        Cancelar
                    </button>
                    <button (click)="saveEvidenceChanges()"
                        class="flex-1 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-black text-xs shadow-lg shadow-sky-200 cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 active:scale-95">
                        <i class="pi pi-save"></i>
                        Guardar Evidencias y Cambios
                    </button>
                </div>

            </div>
        </div>

    </div>

</div>

<!-- DRAWER / MODAL: CREAR / EDITAR OBSERVACIÓN (PARTE 1) -->
<p-drawer
    [(visible)]="addDrawerVisible"
    position="right"
    [style]="{ width: '620px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }"
    [modal]="true">
    
    <ng-template pTemplate="header">
        <div class="flex items-center gap-3 py-1">
            <span class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <i class="pi pi-plus text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    {{ isEditing ? 'Editar Auditoría Distintivo H' : 'Crear Auditoría Distintivo H' }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Formato Oficial por Departamento</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">
        
        <!-- Selección de Sección / Departamento (5 opciones, con badge por sección) -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Sección / Departamento
            </label>
            <!-- Info tip multi-sección -->
            <div *ngIf="!isEditing" class="flex items-start gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 mb-2 text-[11px] text-sky-700 font-medium">
                <i class="pi pi-info-circle mt-0.5"></i>
                <span>Puedes agregar hallazgos en varias secciones. Al guardar, se creará un registro independiente por cada sección con hallazgos.</span>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                <!-- AYB -->
                <button
                    type="button"
                    (click)="onSeccionFormChange('AYB')"
                    [class]="formObservation.seccion === 'AYB'
                        ? 'bg-sky-600 text-white font-black border-sky-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold'"
                    class="relative border py-2 px-1 rounded-xl text-[11px] transition-all text-center cursor-pointer">
                    AYB
                    <span *ngIf="!isEditing && getSeccionDraftCount('AYB') > 0"
                        class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sky-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                        {{ getSeccionDraftCount('AYB') }}
                    </span>
                </button>
                <!-- COCINA -->
                <button
                    type="button"
                    (click)="onSeccionFormChange('COCINA')"
                    [class]="formObservation.seccion === 'COCINA'
                        ? 'bg-amber-600 text-white font-black border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold'"
                    class="relative border py-2 px-1 rounded-xl text-[11px] transition-all text-center cursor-pointer">
                    COCINA
                    <span *ngIf="!isEditing && getSeccionDraftCount('COCINA') > 0"
                        class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                        {{ getSeccionDraftCount('COCINA') }}
                    </span>
                </button>
                <!-- MANTENIMIENTO -->
                <button
                    type="button"
                    (click)="onSeccionFormChange('MANTENIMIENTO')"
                    [class]="formObservation.seccion === 'MANTENIMIENTO'
                        ? 'bg-slate-800 text-white font-black border-slate-800 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold'"
                    class="relative border py-2 px-1 rounded-xl text-[11px] transition-all text-center cursor-pointer">
                    MANT.
                    <span *ngIf="!isEditing && getSeccionDraftCount('MANTENIMIENTO') > 0"
                        class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                        {{ getSeccionDraftCount('MANTENIMIENTO') }}
                    </span>
                </button>
                <!-- ALMACEN -->
                <button
                    type="button"
                    (click)="onSeccionFormChange('ALMACEN')"
                    [class]="formObservation.seccion === 'ALMACEN'
                        ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold'"
                    class="relative border py-2 px-1 rounded-xl text-[11px] transition-all text-center cursor-pointer">
                    ALMACÉN
                    <span *ngIf="!isEditing && getSeccionDraftCount('ALMACEN') > 0"
                        class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                        {{ getSeccionDraftCount('ALMACEN') }}
                    </span>
                </button>
                <!-- AMA DE LLAVES -->
                <button
                    type="button"
                    (click)="onSeccionFormChange('AMA_DE_LLAVES')"
                    [class]="formObservation.seccion === 'AMA_DE_LLAVES'
                        ? 'bg-purple-700 text-white font-black border-purple-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold'"
                    class="relative border py-2 px-1 rounded-xl text-[11px] transition-all text-center cursor-pointer">
                    AMA LLAVES
                    <span *ngIf="!isEditing && getSeccionDraftCount('AMA_DE_LLAVES') > 0"
                        class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                        {{ getSeccionDraftCount('AMA_DE_LLAVES') }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Header Grid Datos Auditoría -->
        <div class="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
                <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Fecha de auditoría:</label>
                <input
                    type="date"
                    [(ngModel)]="formObservation.fecha"
                    (change)="updateMesAuditoria()"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 bg-white" />
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Auditoría del mes de:</label>
                <input
                    type="text"
                    [(ngModel)]="formObservation.mesAuditoria"
                    placeholder="Ej. MAYO"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 bg-white uppercase" />
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Responsable del departamento:
                </label>
                <input
                    type="text"
                    [(ngModel)]="formObservation.responsableDepto"
                    placeholder="Nombre del responsable"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50/50" />
                <span class="text-[10px] text-slate-400 block mt-1">
                    Asignado según sección activa (Editable).
                </span>
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Auditor:</label>
                <input
                    type="text"
                    [(ngModel)]="formObservation.auditor"
                    readonly
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-sky-900 bg-sky-50/50 cursor-not-allowed" />
                <span class="text-[10px] text-slate-400 block mt-1">Fijo: Onelia Villasis.</span>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- TABLA DINÁMICA DE HALLAZGOS (de la sección activa en el form) -->
        <div>
            <div class="flex justify-between items-center mb-3">
                <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Hallazgos de <span class="text-sky-600">{{ formObservation.seccion }}</span>
                    ({{ getCurrentSeccionHallazgos().length }})
                </label>
                <button
                    type="button"
                    (click)="addHallazgoRow()"
                    class="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                    <i class="pi pi-plus"></i> Agregar hallazgo
                </button>
            </div>

            <!-- Listado de filas de hallazgos -->
            <div class="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-1">
                <div *ngFor="let h of getCurrentSeccionHallazgos(); let idx = index"
                    class="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-3 relative shadow-xs">
                    
                    <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span class="text-xs font-black text-slate-400">No. {{ idx + 1 }}</span>
                        <button
                            type="button"
                            *ngIf="getCurrentSeccionHallazgos().length > 1"
                            (click)="removeHallazgoRow(idx)"
                            class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <i class="pi pi-trash"></i> Eliminar
                        </button>
                    </div>

                    <!-- Input Hallazgo -->
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hallazgo</label>
                        <textarea
                            [(ngModel)]="h.hallazgo"
                            rows="2"
                            placeholder="Describa la observación / hallazgo..."
                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
                    </div>

                    <!-- Input Area & Responsable del Hallazgo -->
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Área</label>
                            <input
                                type="text"
                                [(ngModel)]="h.area"
                                placeholder="Ej. Cocina fría, Bar, Cuarto frío..."
                                class="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Responsable</label>
                            <input
                                type="text"
                                [(ngModel)]="h.responsable"
                                placeholder="Nombre de responsable"
                                class="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-4 flex gap-2 pt-2 border-t border-slate-200">
            <button
                (click)="addDrawerVisible = false"
                class="w-1/3 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-600 uppercase cursor-pointer">
                Cancelar
            </button>
            <button
                (click)="submitObservation()"
                class="w-2/3 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase shadow transition-all cursor-pointer">
                Guardar Observación
            </button>
        </div>

    </div>
</p-drawer>

<!-- MODAL: VISUALIZAR FORMATO OFICIAL (IGUAL AL SCREENSHOT / IMPRIMIBLE) -->
<div *ngIf="formatViewVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 shadow-2xl flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl no-print">
            <div class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-sky-600 text-xl"></i>
                <span class="font-extrabold text-slate-800 text-base">
                    Vista Previa - Formato Oficial Tareas de Distintivo "H" ({{ formatRecord?.seccion || activeSeccion }})
                </span>
            </div>
            <div class="flex gap-2">
                <button
                    (click)="printFormat()"
                    class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer">
                    <i class="pi pi-print"></i> Imprimir / Exportar PDF
                </button>
                <button
                    (click)="formatViewVisible = false"
                    class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer">
                    Cerrar
                </button>
            </div>
        </div>

        <!-- Excel / Formato exacto del screenshot -->
        <div class="p-6 bg-white flex flex-col print-section overflow-x-auto" id="print-area">
            
            <div class="w-full border-2 border-slate-900 font-sans text-xs">
                <!-- Banner Titulo -->
                <div class="bg-gradient-to-r from-slate-800 via-sky-900 to-slate-800 text-sky-100 font-extrabold text-center py-3 text-base border-b-2 border-slate-800 uppercase tracking-widest shadow-sm">
                    TAREAS DE DISTINTIVO "H" - {{ formatRecord?.seccion || activeSeccion }}
                </div>

                <!-- Metadata Grid Header -->
                <div class="grid grid-cols-2 bg-slate-100/90 border-b-2 border-slate-800 text-slate-800 font-medium text-xs">
                    <div class="border-r border-slate-900 p-2 flex flex-col gap-1">
                        <div class="grid grid-cols-3">
                            <span class="font-normal text-slate-700">Fecha de auditoria:</span>
                            <span class="font-bold text-slate-900 col-span-2">{{ formatRecord?.fecha }}</span>
                        </div>
                        <div class="grid grid-cols-3 border-t border-slate-300 pt-1">
                            <span class="font-normal text-slate-700">Auditoría del mes de:</span>
                            <span class="font-black text-slate-900 uppercase col-span-2">{{ formatRecord?.mesAuditoria || '—' }}</span>
                        </div>
                    </div>
                    <div class="p-2 flex flex-col gap-1">
                        <div class="grid grid-cols-3">
                            <span class="font-normal text-slate-700">Responsable del departamento:</span>
                            <span class="font-bold text-slate-900 col-span-2">
                                {{ formatRecord?.responsableDepto || getDefaultResponsable(formatRecord?.seccion || activeSeccion) }}
                            </span>
                        </div>
                        <div class="grid grid-cols-3 border-t border-slate-300 pt-1">
                            <span class="font-normal text-slate-700">Auditor:</span>
                            <span class="font-bold text-slate-900 col-span-2">Onelia Villasis</span>
                        </div>
                    </div>
                </div>

                <!-- Tabla Oficial -->
                <table class="w-full border-collapse text-slate-900">
                    <thead>
                        <tr class="bg-slate-200/80 border-b-2 border-slate-800 text-center font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                            <th class="border-r border-slate-900 py-3 px-2 w-12">No.</th>
                            <th class="border-r border-slate-900 py-3 px-3 w-1/4">Hallazgo</th>
                            <th class="border-r border-slate-900 py-3 px-2 w-28">Área</th>
                            <th class="border-r border-slate-900 py-3 px-2 w-32">Responsable</th>
                            <th class="border-r border-slate-900 py-3 px-2 w-36">Evidencia de mejora</th>
                            <th class="border-r border-slate-900 py-3 px-2 w-24">Realizado SI O NO</th>
                            <th class="border-r border-slate-900 py-3 px-3 w-44 font-black text-center">
                                ESTATUS DEL HALLAZGO
                            </th>
                            <th class="py-3 px-3">Plan de acción (que se realizó o porque no se realizó)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-900">
                        <tr *ngFor="let item of formatRecord?.hallazgos; let idx = index" class="align-top">
                            <!-- No. -->
                            <td class="border-r border-slate-900 p-3 text-center font-bold">
                                {{ idx + 1 }}
                            </td>
                            <!-- Hallazgo -->
                            <td class="border-r border-slate-900 p-3 font-medium whitespace-pre-line">
                                {{ item.hallazgo }}
                            </td>
                            <!-- Área -->
                            <td class="border-r border-slate-900 p-3 font-semibold text-center">
                                {{ item.area }}
                            </td>
                            <!-- Responsable -->
                            <td class="border-r border-slate-900 p-3 font-semibold">
                                {{ item.responsable }}
                            </td>
                            <!-- Evidencia de mejora -->
                            <td class="border-r border-slate-900 p-2 text-center">
                                <img *ngIf="item.evidencia" [src]="item.evidencia" class="max-h-24 max-w-full object-contain mx-auto rounded border border-slate-300" />
                                <span *ngIf="!item.evidencia" class="text-slate-400 italic text-[10px]">Sin evidencia</span>
                            </td>
                            <!-- Realizado SI O NO -->
                            <td class="border-r border-slate-900 p-3 text-center font-black">
                                {{ item.realizado ? 'SÍ' : (item.realizado === false ? 'NO' : '—') }}
                            </td>
                            <!-- ESTATUS DEL HALLAZGO (Pastel colors) -->
                            <td class="border-r border-slate-900 p-2 text-center font-black">
                                <span *ngIf="item.estatus === 'NO_REALIZADO'"
                                    class="inline-block w-full py-2 px-3 rounded-lg font-black text-rose-900 text-xs uppercase bg-rose-100 border border-rose-200 shadow-xs">
                                    NO REALIZADO
                                </span>
                                <span *ngIf="item.estatus === 'EN_PROCESO'"
                                    class="inline-block w-full py-2 px-3 rounded-lg font-black text-amber-950 text-xs uppercase bg-amber-100 border border-amber-200 shadow-xs">
                                    EN PROCESO
                                </span>
                                <span *ngIf="item.estatus === 'REALIZADO'"
                                    class="inline-block w-full py-2 px-3 rounded-lg font-black text-emerald-950 text-xs uppercase bg-emerald-100 border border-emerald-200 shadow-xs">
                                    REALIZADO
                                </span>
                                <span *ngIf="!item.estatus"
                                    class="text-slate-400 italic text-[10px]">—</span>
                            </td>
                            <!-- Plan de Acción -->
                            <td class="p-3 font-medium text-slate-800 whitespace-pre-line">
                                {{ item.planAccion || '—' }}
                            </td>
                        </tr>

                        <!-- Filas vacías si hay menos de 4 hallazgos para simular el formato Excel -->
                        <tr *ngFor="let empty of getEmptyRowsCount(formatRecord?.hallazgos?.length || 0)" class="h-16 align-top">
                            <td class="border-r border-slate-900 p-3 text-center font-bold text-slate-300">
                                {{ (formatRecord?.hallazgos?.length || 0) + empty }}
                            </td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="border-r border-slate-900 p-3"></td>
                            <td class="p-3"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</div>
`,
    styles: [`
        :host { display: block; }
        @media print {
            body, body * {
                visibility: hidden !important;
            }
            .layout-sidebar, .layout-topbar, app-topbar, app-sidebar, p-toast, p-confirmdialog, .no-print {
                display: none !important;
            }
            #print-area, #print-area * {
                visibility: visible !important;
            }
            #print-area {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: auto !important;
                margin: 0 !important;
                padding: 20px !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                z-index: 999999 !important;
            }
        }
    `]
})
export class TareasDistintivoHComponent implements OnInit {
    records: DistintivoHRecord[] = [];
    filteredRecords: DistintivoHRecord[] = [];

    // Sección activa actualmente
    activeSeccion: SeccionDistintivoH = 'AYB';

    searchQuery = '';

    // Drawers and Selected State
    addDrawerVisible = false;
    formatViewVisible = false;
    isEditing = false;
    editingId: string | null = null;

    selectedRecord: DistintivoHRecord | null = null;
    formatRecord: DistintivoHRecord | null = null;

    // Form Observation - common header
    formObservation: {
        seccion: SeccionDistintivoH;
        fecha: string;
        mesAuditoria: string;
        responsableDepto: string;
        auditor: string;
        titulo: string;
        hallazgos: HallazgoItem[]; // used only in edit mode
    } = {
        seccion: 'AYB',
        fecha: new Date().toISOString().split('T')[0],
        mesAuditoria: '',
        responsableDepto: 'Ignacio Saucedo',
        auditor: 'Onelia Villasis',
        titulo: '',
        hallazgos: []
    };

    // Multi-section draft: independent hallazgos per section (used in create mode)
    hallazgosPorSeccion: Record<SeccionDistintivoH, HallazgoItem[]> = {
        AYB: [],
        COCINA: [],
        MANTENIMIENTO: [],
        ALMACEN: [],
        AMA_DE_LLAVES: []
    };

    constructor(
        private dhService: DistintivoHService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.dhService.getRecords().subscribe({
            next: (data) => {
                this.records = data;
                this.applyFilters();
            }
        });
        this.resetForm();
    }

    setSeccion(sec: SeccionDistintivoH) {
        this.activeSeccion = sec;
        this.selectedRecord = null; // Cierra el panel de evidencias si cambia de pestaña
        this.applyFilters();
    }

    getDefaultResponsable(sec: SeccionDistintivoH): string {
        switch (sec) {
            case 'AYB': return 'Ignacio Saucedo';
            case 'COCINA': return 'Gabriel de la Cruz';
            case 'MANTENIMIENTO': return 'Flavio Jimenez';
            case 'ALMACEN': return 'Wilberth Canul';
            case 'AMA_DE_LLAVES': return 'Victoria Balam';
            default: return 'Ignacio Saucedo';
        }
    }

    onSeccionFormChange(sec: SeccionDistintivoH) {
        // In create mode: just switch the active section, each section keeps its own hallazgos
        // In edit mode: change the single record section
        this.formObservation.seccion = sec;
        this.formObservation.responsableDepto = this.getDefaultResponsable(sec);
    }

    /** Returns the hallazgos list for the currently active form section (create mode) */
    getCurrentSeccionHallazgos(): HallazgoItem[] {
        return this.hallazgosPorSeccion[this.formObservation.seccion];
    }

    /** How many non-empty hallazgos does a section's draft have? */
    getSeccionDraftCount(sec: SeccionDistintivoH): number {
        return this.hallazgosPorSeccion[sec].filter(h => h.hallazgo.trim() !== '').length;
    }

    getSeccionRecords(): DistintivoHRecord[] {
        return this.records.filter(r => (r.seccion || 'AYB') === this.activeSeccion);
    }

    resetForm() {
        const today = new Date();
        const monthName = today.toLocaleString('es-ES', { month: 'long' }).toUpperCase();

        this.formObservation = {
            seccion: this.activeSeccion,
            fecha: today.toISOString().split('T')[0],
            mesAuditoria: monthName,
            responsableDepto: this.getDefaultResponsable(this.activeSeccion),
            auditor: 'Onelia Villasis',
            titulo: '',
            hallazgos: []
        };

        // Reset per-section drafts: each section starts with one empty hallazgo row
        const secciones: SeccionDistintivoH[] = ['AYB', 'COCINA', 'MANTENIMIENTO', 'ALMACEN', 'AMA_DE_LLAVES'];
        secciones.forEach(sec => {
            this.hallazgosPorSeccion[sec] = [
                { hallazgo: '', area: '', responsable: this.getDefaultResponsable(sec), realizado: false, estatus: 'NO_REALIZADO', planAccion: '', evidencia: '' }
            ];
        });

        this.isEditing = false;
        this.editingId = null;
    }

    updateMesAuditoria() {
        if (this.formObservation.fecha) {
            const dateObj = new Date(this.formObservation.fecha + 'T00:00:00');
            if (!isNaN(dateObj.getTime())) {
                this.formObservation.mesAuditoria = dateObj.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
            }
        }
    }

    applyFilters() {
        // Filtrar primero por la sección activa
        const seccionRecords = this.getSeccionRecords();

        const query = this.searchQuery.toLowerCase().trim();
        if (!query) {
            this.filteredRecords = [...seccionRecords];
            return;
        }

        this.filteredRecords = seccionRecords.filter(r => {
            const matchesFecha = r.fecha.toLowerCase().includes(query);
            const matchesMes = (r.mesAuditoria || '').toLowerCase().includes(query);
            const matchesAuditor = (r.auditor || '').toLowerCase().includes(query);
            const matchesResp = (r.responsableDepto || '').toLowerCase().includes(query);
            const matchesHallazgo = r.hallazgos.some(h =>
                h.hallazgo.toLowerCase().includes(query) ||
                h.area.toLowerCase().includes(query) ||
                h.responsable.toLowerCase().includes(query)
            );
            return matchesFecha || matchesMes || matchesAuditor || matchesResp || matchesHallazgo;
        });
    }

    // Dynamic row addition for hallazgos
    addHallazgoRow() {
        const currentSec = this.formObservation.seccion;
        const defaultResp = this.formObservation.responsableDepto || this.getDefaultResponsable(currentSec);

        if (this.isEditing) {
            // Edit mode: push to the single record's hallazgos
            this.formObservation.hallazgos.push({
                hallazgo: '', area: '', responsable: defaultResp,
                realizado: false, estatus: 'NO_REALIZADO', planAccion: '', evidencia: ''
            });
        } else {
            // Create mode: push to the current section's draft
            this.hallazgosPorSeccion[currentSec].push({
                hallazgo: '', area: '', responsable: defaultResp,
                realizado: false, estatus: 'NO_REALIZADO', planAccion: '', evidencia: ''
            });
        }
    }

    removeHallazgoRow(index: number) {
        if (this.isEditing) {
            if (this.formObservation.hallazgos.length > 1) {
                this.formObservation.hallazgos.splice(index, 1);
            }
        } else {
            const sec = this.formObservation.seccion;
            if (this.hallazgosPorSeccion[sec].length > 1) {
                this.hallazgosPorSeccion[sec].splice(index, 1);
            }
        }
    }

    openAddDrawer() {
        this.resetForm();
        this.addDrawerVisible = true;
    }

    openEditDrawer(item: DistintivoHRecord) {
        this.isEditing = true;
        this.editingId = item.id || item._id || null;
        this.formObservation = {
            seccion: item.seccion || this.activeSeccion,
            fecha: item.fecha,
            mesAuditoria: item.mesAuditoria || '',
            responsableDepto: item.responsableDepto || this.getDefaultResponsable(item.seccion || this.activeSeccion),
            auditor: 'Onelia Villasis',
            titulo: item.titulo || '',
            hallazgos: item.hallazgos ? item.hallazgos.map(h => ({ ...h })) : [
                { hallazgo: '', area: '', responsable: item.responsableDepto || '', realizado: false, estatus: 'NO_REALIZADO', planAccion: '', evidencia: '' }
            ]
        };
        this.addDrawerVisible = true;
    }

    openFormatView(item: DistintivoHRecord) {
        this.formatRecord = item;
        this.formatViewVisible = true;
    }

    printFormat() {
        window.print();
    }

    submitObservation() {
        if (!this.formObservation.fecha) {
            this.messageService.add({ severity: 'warn', summary: 'Campo requerido', detail: 'Por favor ingrese la fecha.' });
            return;
        }

        // ── EDIT MODE: update the single record ──
        if (this.isEditing && this.editingId) {
            const validHallazgos = this.formObservation.hallazgos.filter(h => h.hallazgo.trim() !== '');
            if (validHallazgos.length === 0) {
                this.messageService.add({ severity: 'warn', summary: 'Hallazgo requerido', detail: 'Por favor ingrese al menos un hallazgo.' });
                return;
            }
            const payload = {
                seccion: this.formObservation.seccion,
                fecha: this.formObservation.fecha,
                mesAuditoria: this.formObservation.mesAuditoria,
                responsableDepto: this.formObservation.responsableDepto,
                auditor: 'Onelia Villasis',
                titulo: this.formObservation.titulo,
                hallazgos: validHallazgos
            };
            this.dhService.update(this.editingId, payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Observación actualizada correctamente.' });
                    this.addDrawerVisible = false;
                    this.resetForm();
                    this.dhService.refresh();
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la observación.' });
                }
            });
            return;
        }

        // ── CREATE MODE: create one record per section that has hallazgos ──
        const secciones: SeccionDistintivoH[] = ['AYB', 'COCINA', 'MANTENIMIENTO', 'ALMACEN', 'AMA_DE_LLAVES'];
        const sectionsToSave = secciones.filter(sec =>
            this.hallazgosPorSeccion[sec].some(h => h.hallazgo.trim() !== '')
        );

        if (sectionsToSave.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Hallazgo requerido', detail: 'Por favor ingrese al menos un hallazgo en cualquier sección.' });
            return;
        }

        let saved = 0;
        let errors = 0;
        const total = sectionsToSave.length;

        sectionsToSave.forEach(sec => {
            const validHallazgos = this.hallazgosPorSeccion[sec].filter(h => h.hallazgo.trim() !== '');
            const payload = {
                seccion: sec,
                fecha: this.formObservation.fecha,
                mesAuditoria: this.formObservation.mesAuditoria,
                responsableDepto: this.getDefaultResponsable(sec),
                auditor: 'Onelia Villasis',
                titulo: this.formObservation.titulo,
                hallazgos: validHallazgos
            };
            this.dhService.create(payload).subscribe({
                next: () => {
                    saved++;
                    if (saved + errors === total) {
                        if (errors === 0) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Registros guardados',
                                detail: `Se crearon ${saved} registro(s) correctamente (${sectionsToSave.join(', ')}).`
                            });
                        } else {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Guardado parcial',
                                detail: `${saved} guardados, ${errors} fallidos.`
                            });
                        }
                        this.addDrawerVisible = false;
                        this.resetForm();
                        this.dhService.refresh();
                    }
                },
                error: () => {
                    errors++;
                    if (saved + errors === total) {
                        this.messageService.add({
                            severity: errors === total ? 'error' : 'warn',
                            summary: errors === total ? 'Error' : 'Guardado parcial',
                            detail: errors === total ? 'No se pudo guardar ninguna observación.' : `${saved} guardados, ${errors} fallidos.`
                        });
                        this.addDrawerVisible = false;
                        this.resetForm();
                        this.dhService.refresh();
                    }
                }
            });
        });
    }

    selectRecordForEvidence(item: DistintivoHRecord) {
        // Deep clone so user modifications in the right panel are staged until saved
        this.selectedRecord = JSON.parse(JSON.stringify(item));
    }

    closeEvidencePanel() {
        this.selectedRecord = null;
    }

    onEvidenciaSelected(event: Event, item: HallazgoItem) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                item.evidencia = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    saveEvidenceChanges() {
        if (!this.selectedRecord || !this.selectedRecord.id) return;

        this.dhService.update(this.selectedRecord.id, {
            hallazgos: this.selectedRecord.hallazgos
        }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Evidencias Guardadas', detail: 'Se actualizaron las evidencias y el seguimiento.' });
                this.closeEvidencePanel();
                this.dhService.refresh();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar las evidencias.' });
            }
        });
    }

    deleteRecord(item: DistintivoHRecord) {
        const id = item.id || item._id;
        if (!id) return;

        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar la observación del día ${item.fecha}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.dhService.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado correctamente.' });
                        if (this.selectedRecord?.id === id) {
                            this.closeEvidencePanel();
                        }
                        this.dhService.refresh();
                    }
                });
            }
        });
    }

    getEmptyRowsCount(currentLength: number): number[] {
        const minRows = 4;
        if (currentLength >= minRows) return [];
        const needed = minRows - currentLength;
        return Array.from({ length: needed }, (_, i) => i + 1);
    }

    // Counters helpers filtrados por la sección activa
    getNoRealizadosCount(): number {
        let total = 0;
        this.getSeccionRecords().forEach(r => {
            total += r.hallazgos.filter(h => h.estatus === 'NO_REALIZADO' || !h.estatus).length;
        });
        return total;
    }

    getEnProcesoCount(): number {
        let total = 0;
        this.getSeccionRecords().forEach(r => {
            total += r.hallazgos.filter(h => h.estatus === 'EN_PROCESO').length;
        });
        return total;
    }

    getRealizadosCount(): number {
        let total = 0;
        this.getSeccionRecords().forEach(r => {
            total += r.hallazgos.filter(h => h.estatus === 'REALIZADO').length;
        });
        return total;
    }

    countStatusInRecord(record: DistintivoHRecord, status: 'REALIZADO' | 'EN_PROCESO' | 'NO_REALIZADO'): number {
        if (!record.hallazgos) return 0;
        if (status === 'NO_REALIZADO') {
            return record.hallazgos.filter(h => h.estatus === 'NO_REALIZADO' || !h.estatus).length;
        }
        return record.hallazgos.filter(h => h.estatus === status).length;
    }
}