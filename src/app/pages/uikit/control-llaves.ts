import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ControlLlavesRecord, ControlLlavesService } from '../service/control-llaves.service';

const DEPARTMENTS = [
    'ALIMENTOS Y BEBIDAS',
    'MANTENIMIENTO',
    'AMA DE LLAVES',
    'LAVANDERIA',
    'STEWARD',
    'AREAS PUBLICAS',
    'ADMINISTRACION',
    'SEGURIDAD',
    'RECEPCION',
    'ANIMACION',
    'COCINA'
];

type TipoLlave = 'MAGNETICA' | 'METALICA';
type TipoRegistro = 'ENTREGADA' | 'DEVUELTA';
type FilterTipoLlave = 'TODAS' | 'MAGNETICA' | 'METALICA';

@Component({
    selector: 'app-control-llaves',
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

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                <i class="pi pi-key text-[#4a5d3e] text-3xl"></i>
                Control de Llaves
            </h1>
            <p class="text-slate-500 mt-1 text-sm font-medium">
                Registro y control de entrega y devolución de llaves del hotel.
            </p>
        </div>
        <!-- Solo abre drawer de ENTREGADAS -->
        <button
            (click)="openEntregadaDrawer()"
            class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Registrar Llave Entregada
        </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Entregadas</span>
            <span class="text-3xl font-black text-slate-800">{{ filteredEntregadas.length }}</span>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Devueltas</span>
            <span class="text-3xl font-black text-emerald-700">{{ getDevueltasCount() }}</span>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-red-500 uppercase tracking-wider">Pendientes</span>
            <span class="text-3xl font-black text-red-700">{{ getPendientesCount() }}</span>
        </div>
        <div class="bg-violet-50 rounded-xl border border-violet-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-violet-600 uppercase tracking-wider">Porcentaje Retorno</span>
            <span class="text-3xl font-black text-violet-700">{{ getRetornoPercentage() }}%</span>
        </div>
    </div>

    <!-- Filters Panel -->
    <div class="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <!-- Month Filter Row -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <i class="pi pi-calendar text-[#4a5d3e]"></i>
                Filtrar por mes
            </div>
            <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                    type="month"
                    [(ngModel)]="selectedMonth"
                    (ngModelChange)="applyFilter()"
                    class="border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent cursor-pointer" />
                <button
                    type="button"
                    (click)="selectedMonth = ''; applyFilter()"
                    class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer">
                    <i class="pi pi-filter-slash"></i>
                    Ver todos
                </button>
            </div>
        </div>

        <!-- Tipo Llave Filter Row -->
        <div class="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2 text-slate-700 font-semibold text-sm shrink-0">
                <i class="pi pi-filter text-[#4a5d3e]"></i>
                Tipo de llave:
            </div>
            <div class="flex gap-2 flex-wrap">
                <button
                    type="button"
                    (click)="tipoLlaveFilter = 'TODAS'; applyFilter()"
                    [class]="tipoLlaveFilter === 'TODAS'
                        ? 'bg-slate-700 text-white border-slate-700 shadow'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-list"></i>
                    Todas las llaves
                </button>
                <button
                    type="button"
                    (click)="tipoLlaveFilter = 'MAGNETICA'; applyFilter()"
                    [class]="tipoLlaveFilter === 'MAGNETICA'
                        ? 'bg-violet-600 text-white border-violet-600 shadow'
                        : 'bg-white text-violet-700 border-violet-300 hover:bg-violet-50'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-wifi"></i>
                    Magnética
                </button>
                <button
                    type="button"
                    (click)="tipoLlaveFilter = 'METALICA'; applyFilter()"
                    [class]="tipoLlaveFilter === 'METALICA'
                        ? 'bg-orange-500 text-white border-orange-500 shadow'
                        : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-wrench"></i>
                    Metálica
                </button>
            </div>
        </div>
    </div>

    <!-- Two Tables Side by Side with Aligned Rows -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <!-- LEFT TABLE: Entregadas -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-amber-50">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white">
                        <i class="pi pi-arrow-right text-xs"></i>
                    </span>
                    <span class="font-extrabold text-amber-800 text-base tracking-tight">Llaves Entregadas</span>
                    <span class="ml-2 bg-amber-400 text-white text-xs font-black px-2.5 py-0.5 rounded-full">{{ filteredEntregadas.length }}</span>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs table-fixed">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                            <th class="py-3 px-2 text-center w-[60px]">Hora</th>
                            <th class="py-3 px-2 text-center w-[85px]">Fecha</th>
                            <th class="py-3 px-3 w-[120px]">Colaborador</th>
                            <th class="py-3 px-3 w-[100px]">Depto.</th>
                            <th class="py-3 px-3 w-[100px]">Puesto</th>
                            <th class="py-3 px-2 text-center w-[80px]">No. Llave</th>
                            <th class="py-3 px-2 text-center w-[50px]">Piezas</th>
                            <th class="py-3 px-2 text-center w-[65px]">Tipo</th>
                            <th class="py-3 px-2 text-center w-[90px]">Acc.</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr *ngIf="filteredEntregadas.length === 0">
                            <td colspan="9" class="py-10 text-center text-slate-400 italic font-medium">
                                <i class="pi pi-inbox text-2xl block mb-2"></i>
                                Sin registros de entrega
                            </td>
                        </tr>
                        <tr
                            *ngFor="let rec of filteredEntregadas"
                            class="hover:bg-amber-50/50 transition-colors duration-100 min-h-[44px] group">
                            <td class="py-3 px-2 text-center font-mono font-semibold text-slate-700 truncate">{{ rec.hora }}</td>
                            <td class="py-3 px-2 text-center font-semibold text-slate-600 truncate">{{ formatFecha(rec.fecha) }}</td>
                            <td class="py-3 px-3 font-bold text-slate-800 truncate" [title]="rec.colaborador">{{ rec.colaborador }}</td>
                            <td class="py-3 px-3 text-slate-600 truncate" [title]="rec.departamento">{{ rec.departamento }}</td>
                            <td class="py-3 px-3 text-slate-600 truncate" [title]="rec.puesto">{{ rec.puesto }}</td>
                            <td class="py-3 px-2 text-center">
                                <span class="inline-block bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-md border border-amber-200 truncate">{{ rec.numeroLlave }}</span>
                            </td>
                            <td class="py-3 px-2 text-center font-bold text-slate-700 truncate">{{ rec.numeroPiezas }}</td>
                            <td class="py-3 px-2 text-center">
                                <span
                                    [class]="rec.tipoLlave === 'MAGNETICA'
                                        ? 'bg-violet-100 text-violet-700 border-violet-200'
                                        : 'bg-orange-100 text-orange-700 border-orange-200'"
                                    class="inline-block font-bold px-1 py-0.5 rounded border text-[9px] uppercase tracking-wide">
                                    {{ rec.tipoLlave === 'MAGNETICA' ? 'Mag.' : 'Met.' }}
                                </span>
                            </td>
                            <td class="py-3 px-2 text-center">
                                <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <!-- Marcar como devuelta si no ha sido devuelta -->
                                    <button
                                        *ngIf="!getPairedDevuelta(rec.id)"
                                        (click)="openDevueltaFromEntregada(rec)"
                                        class="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all p-1.5 rounded-lg"
                                        title="Registrar devolución">
                                        <i class="pi pi-arrow-left text-xs font-bold"></i>
                                    </button>
                                    <button
                                        (click)="openEditDrawer(rec)"
                                        class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg"
                                        title="Editar">
                                        <i class="pi pi-pencil text-xs"></i>
                                    </button>
                                    <button
                                        (click)="confirmDelete(rec.id)"
                                        class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg"
                                        title="Eliminar">
                                        <i class="pi pi-trash text-xs"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- RIGHT TABLE: Devueltas (ALINEADO FILA POR FILA CON ENTREGADAS) -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-emerald-50">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white">
                        <i class="pi pi-arrow-left text-xs"></i>
                    </span>
                    <span class="font-extrabold text-emerald-800 text-base tracking-tight">Llaves Devueltas</span>
                    <span class="ml-2 bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">{{ devueltasRecords.length }}</span>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs table-fixed">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                            <th class="py-3 px-2 text-center w-[85px]">Hora Dev.</th>
                            <th class="py-3 px-2 text-center w-[85px]">Fecha</th>
                            <th class="py-3 px-3 w-[120px]">Colaborador</th>
                            <th class="py-3 px-3 w-[100px]">Depto.</th>
                            <th class="py-3 px-3 w-[100px]">Puesto</th>
                            <th class="py-3 px-2 text-center w-[80px]">No. Llave</th>
                            <th class="py-3 px-2 text-center w-[50px]">Piezas</th>
                            <th class="py-3 px-2 text-center w-[65px]">Tipo</th>
                            <th class="py-3 px-2 text-center w-[90px]">Acc.</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr *ngIf="filteredEntregadas.length === 0">
                            <td colspan="9" class="py-10 text-center text-slate-400 italic font-medium">
                                <i class="pi pi-inbox text-2xl block mb-2"></i>
                                Sin registros de devolución
                            </td>
                        </tr>
                        <tr
                            *ngFor="let entregada of filteredEntregadas"
                            class="hover:bg-emerald-50/30 transition-colors duration-100 min-h-[44px] group">
                            
                            <!-- Check paired record -->
                            <ng-container *ngIf="getPairedDevuelta(entregada.id) as dev; else pendienteBlock">
                                <td class="py-3 px-2 text-center font-mono font-semibold text-slate-700 truncate">{{ dev.hora }}</td>
                                <td class="py-3 px-2 text-center font-semibold text-slate-600 truncate">{{ formatFecha(dev.fecha) }}</td>
                                <td class="py-3 px-3 font-bold text-slate-800 truncate" [title]="dev.colaborador">{{ dev.colaborador }}</td>
                                <td class="py-3 px-3 text-slate-600 truncate" [title]="dev.departamento">{{ dev.departamento }}</td>
                                <td class="py-3 px-3 text-slate-600 truncate" [title]="dev.puesto">{{ dev.puesto }}</td>
                                <td class="py-3 px-2 text-center">
                                    <span class="inline-block bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-md border border-emerald-200 truncate">{{ dev.numeroLlave }}</span>
                                </td>
                                <td class="py-3 px-2 text-center font-bold text-slate-700 truncate">{{ dev.numeroPiezas }}</td>
                                <td class="py-3 px-2 text-center">
                                    <span
                                        [class]="dev.tipoLlave === 'MAGNETICA'
                                            ? 'bg-violet-100 text-violet-700 border-violet-200'
                                            : 'bg-orange-100 text-orange-700 border-orange-200'"
                                        class="inline-block font-bold px-1 py-0.5 rounded border text-[9px] uppercase tracking-wide">
                                        {{ dev.tipoLlave === 'MAGNETICA' ? 'Mag.' : 'Met.' }}
                                    </span>
                                </td>
                                <td class="py-3 px-2 text-center">
                                    <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            (click)="openEditDrawer(dev)"
                                            class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg"
                                            title="Editar">
                                            <i class="pi pi-pencil text-xs"></i>
                                        </button>
                                        <button
                                            (click)="confirmDelete(dev.id)"
                                            class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg"
                                            title="Eliminar">
                                            <i class="pi pi-trash text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                            </ng-container>

                            <ng-template #pendienteBlock>
                                <td class="py-3 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-3">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-amber-50 text-amber-700 border border-amber-200 animate-pulse uppercase">
                                        Pendiente
                                    </span>
                                </td>
                                <td class="py-3 px-3 text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-3 text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-3 px-2 text-center">
                                    <!-- Botón rápido de devolución -->
                                    <button
                                        (click)="openDevueltaFromEntregada(entregada)"
                                        class="text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-300 transition-all px-2.5 py-1 rounded-lg font-bold text-[10px]"
                                        title="Registrar devolución de esta llave">
                                        Devolver
                                    </button>
                                </td>
                            </ng-template>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- ===== DRAWER ENTREGADAS ===== -->
<p-drawer
    [(visible)]="drawerEntregadaVisible"
    position="right"
    [style]="{ width: '430px' }"
    [modal]="true"
    [closeOnEscape]="true">

    <ng-template #header>
        <div class="flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-white shadow">
                <i class="pi pi-arrow-right text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    {{ drawerMode === 'add' ? 'Nueva Llave Entregada' : 'Editar Llave Entregada' }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Control de Llaves</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">

        <!-- Tipo de Llave (Magnética / Metálica) -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tipo de Llave</label>
            <div class="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    (click)="form.tipoLlave = 'MAGNETICA'"
                    [class]="form.tipoLlave === 'MAGNETICA'
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                        : 'bg-white text-violet-700 border-violet-300 hover:bg-violet-50'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-wifi"></i>
                    Magnética
                </button>
                <button
                    type="button"
                    (click)="form.tipoLlave = 'METALICA'"
                    [class]="form.tipoLlave === 'METALICA'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-wrench"></i>
                    Metálica
                </button>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Fecha y Hora -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Fecha <span class="text-[#4a5d3e]">(auto)</span>
                </label>
                <input type="date" [(ngModel)]="form.fecha"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent font-semibold text-slate-700" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hora <span class="text-[#4a5d3e]">(auto)</span>
                </label>
                <input type="time" [(ngModel)]="form.hora"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent font-semibold text-slate-700" />
            </div>
        </div>

        <!-- Colaborador -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Colaborador</label>
            <input type="text" [(ngModel)]="form.colaborador"
                placeholder="Ej. Juan García López"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent" />
        </div>

        <!-- Departamento + Quick-Select -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Departamento</label>
            <input type="text" [(ngModel)]="form.departamento"
                placeholder="Escribe o selecciona un departamento..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent mb-2" />
            <div class="flex flex-wrap gap-1.5">
                <button
                    *ngFor="let dept of departmentOptions"
                    type="button"
                    (click)="form.departamento = dept"
                    [class]="form.departamento === dept
                        ? 'bg-[#4a5d3e] text-white border-[#4a5d3e]'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#4a5d3e] hover:text-white hover:border-[#4a5d3e]'"
                    class="border text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-100 cursor-pointer leading-none">
                    {{ dept }}
                </button>
            </div>
        </div>

        <!-- Puesto -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Puesto</label>
            <input type="text" [(ngModel)]="form.puesto"
                placeholder="Ej. Recepcionista, Camarero..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent" />
        </div>

        <!-- No. Llave -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Número de Llave</label>
            <input type="text" [(ngModel)]="form.numeroLlave"
                placeholder="Ej. 101, Master-A, Bodega-2..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent font-mono font-bold" />
        </div>

        <!-- No. Piezas -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Número de Piezas</label>
            <input type="number" [(ngModel)]="form.numeroPiezas" min="1" placeholder="1"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent font-bold text-slate-700" />
        </div>
    </div>

    <ng-template #footer>
        <div class="flex gap-3 p-1">
            <button type="button" (click)="drawerEntregadaVisible = false"
                class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button type="button" (click)="saveRecord('ENTREGADA')"
                [disabled]="!isFormValid()"
                [class]="isFormValid() ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer' : 'bg-slate-300 text-slate-400 cursor-not-allowed'"
                class="flex-1 py-3 rounded-xl text-sm font-bold shadow transition-all duration-150 flex items-center justify-center gap-2">
                <i class="pi pi-save"></i>
                {{ drawerMode === 'add' ? 'Guardar Registro' : 'Actualizar' }}
            </button>
        </div>
    </ng-template>
</p-drawer>

<!-- ===== DRAWER DEVUELTAS ===== -->
<p-drawer
    [(visible)]="drawerDevueltaVisible"
    position="right"
    [style]="{ width: '430px' }"
    [modal]="true"
    [closeOnEscape]="true">

    <ng-template #header>
        <div class="flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-white shadow">
                <i class="pi pi-arrow-left text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    {{ drawerMode === 'add' ? 'Registrar Devolución' : 'Editar Llave Devuelta' }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Control de Llaves</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">

        <!-- Tipo de Llave -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tipo de Llave</label>
            <div class="grid grid-cols-2 gap-2">
                <button type="button" (click)="form.tipoLlave = 'MAGNETICA'"
                    [class]="form.tipoLlave === 'MAGNETICA'
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                        : 'bg-white text-violet-700 border-violet-300 hover:bg-violet-50'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-wifi"></i>
                    Magnética
                </button>
                <button type="button" (click)="form.tipoLlave = 'METALICA'"
                    [class]="form.tipoLlave === 'METALICA'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-wrench"></i>
                    Metálica
                </button>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Fecha y Hora -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Fecha <span class="text-emerald-600">(auto)</span>
                </label>
                <input type="date" [(ngModel)]="form.fecha"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hora <span class="text-emerald-600">(auto)</span>
                </label>
                <input type="time" [(ngModel)]="form.hora"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
        </div>

        <!-- Colaborador -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Colaborador que Entrega</label>
            <input type="text" [(ngModel)]="form.colaborador"
                placeholder="Ej. Juan García López"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>

        <!-- Departamento + Quick-Select -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Departamento</label>
            <input type="text" [(ngModel)]="form.departamento"
                placeholder="Escribe o selecciona un departamento..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-2" />
            <div class="flex flex-wrap gap-1.5">
                <button size="small" *ngFor="let dept of departmentOptions" type="button"
                    (click)="form.departamento = dept"
                    [class]="form.departamento === dept
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'"
                    class="border text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-100 cursor-pointer leading-none">
                    {{ dept }}
                </button>
            </div>
        </div>

        <!-- Puesto -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Puesto</label>
            <input type="text" [(ngModel)]="form.puesto"
                placeholder="Ej. Recepcionista, Camarero..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>

        <!-- No. Llave -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Número de Llave</label>
            <input type="text" [(ngModel)]="form.numeroLlave"
                placeholder="Ej. 101, Master-A, Bodega-2..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono font-bold" />
        </div>

        <!-- No. Piezas -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Número de Piezas</label>
            <input type="number" [(ngModel)]="form.numeroPiezas" min="1" placeholder="1"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bold text-slate-700" />
        </div>
    </div>

    <ng-template #footer>
        <div class="flex gap-3 p-1">
            <button type="button" (click)="drawerDevueltaVisible = false"
                class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button type="button" (click)="saveRecord('DEVUELTA')"
                [disabled]="!isFormValid()"
                [class]="isFormValid() ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer' : 'bg-slate-300 text-slate-400 cursor-not-allowed'"
                class="flex-1 py-3 rounded-xl text-sm font-bold shadow transition-all duration-150 flex items-center justify-center gap-2">
                <i class="pi pi-save"></i>
                {{ drawerMode === 'add' ? 'Guardar Devolución' : 'Actualizar' }}
            </button>
        </div>
    </ng-template>
</p-drawer>
    `
})
export class ControlLlavesComponent implements OnInit, OnDestroy {
    allRecords: ControlLlavesRecord[] = [];
    entregadasRecords: ControlLlavesRecord[] = [];
    devueltasRecords: ControlLlavesRecord[] = [];
    filteredEntregadas: ControlLlavesRecord[] = [];
    filteredDevueltas: ControlLlavesRecord[] = [];

    selectedMonth: string = '';
    tipoLlaveFilter: FilterTipoLlave = 'TODAS';

    drawerEntregadaVisible = false;
    drawerDevueltaVisible = false;

    drawerMode: 'add' | 'edit' = 'add';
    editingId: string | null = null;

    departmentOptions = DEPARTMENTS;

    form: {
        tipo: TipoRegistro;
        tipoLlave: TipoLlave;
        entregadaId?: string;
        fecha: string;
        hora: string;
        colaborador: string;
        departamento: string;
        puesto: string;
        numeroLlave: string;
        numeroPiezas: number;
    } = this.emptyForm('ENTREGADA');

    private sub?: Subscription;

    constructor(
        private controlLlavesService: ControlLlavesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.sub = this.controlLlavesService.getRecords().subscribe(records => {
            this.allRecords = records;
            this.entregadasRecords = records.filter(r => r.tipo === 'ENTREGADA');
            this.devueltasRecords = records.filter(r => r.tipo === 'DEVUELTA');
            this.applyFilter();
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    private emptyForm(tipo: TipoRegistro, entregadaId?: string) {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        return {
            tipo,
            tipoLlave: 'MAGNETICA' as TipoLlave,
            entregadaId,
            fecha: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
            hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
            colaborador: '',
            departamento: '',
            puesto: '',
            numeroLlave: '',
            numeroPiezas: 1
        };
    }

    openEntregadaDrawer() {
        this.drawerMode = 'add';
        this.editingId = null;
        this.form = this.emptyForm('ENTREGADA');
        this.drawerEntregadaVisible = true;
    }

    openDevueltaFromEntregada(rec: ControlLlavesRecord) {
        this.drawerMode = 'add';
        this.editingId = null;
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        this.form = {
            tipo: 'DEVUELTA',
            tipoLlave: rec.tipoLlave || 'MAGNETICA',
            entregadaId: rec.id,
            fecha: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
            hora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
            colaborador: rec.colaborador,
            departamento: rec.departamento,
            puesto: rec.puesto,
            numeroLlave: rec.numeroLlave,
            numeroPiezas: rec.numeroPiezas
        };
        this.drawerDevueltaVisible = true;
    }

    openEditDrawer(rec: ControlLlavesRecord) {
        this.drawerMode = 'edit';
        this.editingId = rec.id;
        this.form = {
            tipo: rec.tipo,
            tipoLlave: rec.tipoLlave || 'MAGNETICA',
            entregadaId: rec.entregadaId,
            fecha: rec.fecha,
            hora: rec.hora,
            colaborador: rec.colaborador,
            departamento: rec.departamento,
            puesto: rec.puesto,
            numeroLlave: rec.numeroLlave,
            numeroPiezas: rec.numeroPiezas
        };
        if (rec.tipo === 'ENTREGADA') {
            this.drawerEntregadaVisible = true;
        } else {
            this.drawerDevueltaVisible = true;
        }
    }

    getPairedDevuelta(entregadaId: string): ControlLlavesRecord | undefined {
        return this.devueltasRecords.find(r => r.entregadaId === entregadaId);
    }

    getDevueltasCount(): number {
        return this.filteredEntregadas.filter(e => !!this.getPairedDevuelta(e.id)).length;
    }

    getPendientesCount(): number {
        return this.filteredEntregadas.filter(e => !this.getPairedDevuelta(e.id)).length;
    }

    getRetornoPercentage(): number {
        if (this.filteredEntregadas.length === 0) return 0;
        const devueltas = this.getDevueltasCount();
        return Math.round((devueltas / this.filteredEntregadas.length) * 100);
    }

    isFormValid(): boolean {
        return !!(this.form.tipoLlave && this.form.fecha && this.form.hora &&
            this.form.colaborador.trim() && this.form.departamento.trim() &&
            this.form.puesto.trim() && this.form.numeroLlave.trim() &&
            this.form.numeroPiezas > 0);
    }

    saveRecord(tipo: TipoRegistro) {
        if (!this.isFormValid()) return;
        const payload = { ...this.form, tipo };
        if (this.drawerMode === 'add') {
            this.controlLlavesService.create(payload);
            this.messageService.add({
                severity: 'success',
                summary: tipo === 'ENTREGADA' ? 'Llave entregada' : 'Devolución registrada',
                detail: `Registro ${tipo === 'ENTREGADA' ? 'de entrega' : 'de devolución'} guardado correctamente.`,
                life: 3500
            });
        } else if (this.editingId) {
            this.controlLlavesService.update(this.editingId, payload);
            this.messageService.add({
                severity: 'info',
                summary: 'Registro actualizado',
                detail: 'El registro fue actualizado correctamente.',
                life: 3500
            });
        }
        this.drawerEntregadaVisible = false;
        this.drawerDevueltaVisible = false;
    }

    confirmDelete(id: string) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.controlLlavesService.delete(id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Eliminado',
                    detail: 'El registro fue eliminado correctamente.',
                    life: 3500
                });
            }
        });
    }

    applyFilter() {
        const m = this.selectedMonth;
        const t = this.tipoLlaveFilter;
        const matchMes = (r: ControlLlavesRecord) => !m || r.fecha?.startsWith(m);
        const matchTipo = (r: ControlLlavesRecord) => t === 'TODAS' || r.tipoLlave === t;
        this.filteredEntregadas = this.entregadasRecords.filter(r => matchMes(r) && matchTipo(r));
        this.filteredDevueltas = this.devueltasRecords.filter(r => matchMes(r) && matchTipo(r));
    }

    formatFecha(fecha: string): string {
        if (!fecha) return '-';
        const [y, mo, d] = fecha.split('-');
        return `${d}/${mo}/${y}`;
    }
}
