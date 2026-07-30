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

interface LlaveItem {
    tipoLlave: TipoLlave;
    numeroLlave: string;
    numeroPiezas: number;
}

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
        <button
            (click)="openEntregadaDrawer()"
            class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Registrar Llaves Entregadas
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

        <div class="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2 text-slate-700 font-semibold text-sm shrink-0">
                <i class="pi pi-filter text-[#4a5d3e]"></i>
                Tipo de llave:
            </div>
            <div class="flex gap-2 flex-wrap">
                <button type="button" (click)="tipoLlaveFilter = 'TODAS'; applyFilter()"
                    [class]="tipoLlaveFilter === 'TODAS' ? 'bg-slate-700 text-white border-slate-700 shadow' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-list"></i> Todas las llaves
                </button>
                <button type="button" (click)="tipoLlaveFilter = 'MAGNETICA'; applyFilter()"
                    [class]="tipoLlaveFilter === 'MAGNETICA' ? 'bg-violet-600 text-white border-violet-600 shadow' : 'bg-white text-violet-700 border-violet-300 hover:bg-violet-50'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-wifi"></i> Magnética
                </button>
                <button type="button" (click)="tipoLlaveFilter = 'METALICA'; applyFilter()"
                    [class]="tipoLlaveFilter === 'METALICA' ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'"
                    class="border-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5">
                    <i class="pi pi-wrench"></i> Metálica
                </button>
            </div>
        </div>
    </div>

    <!-- Two Tables -->
    <div class="w-full overflow-x-auto pb-2">
        <div class="grid grid-cols-2 gap-4 min-w-[750px] lg:min-w-0">

        <!-- LEFT TABLE: Entregadas -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex items-center px-5 py-4 border-b border-slate-100 bg-amber-50">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white mr-2">
                    <i class="pi pi-arrow-right text-xs"></i>
                </span>
                <span class="font-extrabold text-amber-800 text-base tracking-tight">Llaves Entregadas</span>
                <span class="ml-2 bg-amber-400 text-white text-xs font-black px-2.5 py-0.5 rounded-full">{{ filteredEntregadas.length }}</span>
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
                        <tr *ngFor="let rec of filteredEntregadas"
                            class="hover:bg-amber-50/50 transition-colors duration-100 h-[52px] group">
                            <td class="py-2 px-2 text-center font-mono font-semibold text-slate-700 truncate">{{ rec.hora }}</td>
                            <td class="py-2 px-2 text-center font-semibold text-slate-600 truncate">{{ formatFecha(rec.fecha) }}</td>
                            <td class="py-2 px-3 font-bold text-slate-800 truncate" [title]="rec.colaborador">{{ rec.colaborador }}</td>
                            <td class="py-2 px-3 text-slate-600 truncate" [title]="rec.departamento">{{ rec.departamento }}</td>
                            <td class="py-2 px-3 text-slate-600 truncate" [title]="rec.puesto">{{ rec.puesto }}</td>
                            <td class="py-2 px-2 text-center">
                                <span class="inline-block bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-md border border-amber-200 truncate">{{ rec.numeroLlave }}</span>
                            </td>
                            <td class="py-2 px-2 text-center font-bold text-slate-700">{{ rec.numeroPiezas }}</td>
                            <td class="py-2 px-2 text-center">
                                <span [class]="rec.tipoLlave === 'MAGNETICA' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                                    class="inline-block font-bold px-1 py-0.5 rounded border text-[9px] uppercase tracking-wide">
                                    {{ rec.tipoLlave === 'MAGNETICA' ? 'Mag.' : 'Met.' }}
                                </span>
                            </td>
                            <td class="py-2 px-2 text-center">
                                <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button *ngIf="!getPairedDevuelta(rec.id)"
                                        (click)="openDevueltaFromEntregada(rec)"
                                        class="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all p-1.5 rounded-lg"
                                        title="Registrar devolución">
                                        <i class="pi pi-arrow-left text-xs"></i>
                                    </button>
                                    <button (click)="openEditEntregada(rec)"
                                        class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg"
                                        title="Editar">
                                        <i class="pi pi-pencil text-xs"></i>
                                    </button>
                                    <button (click)="confirmDelete(rec.id)"
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

        <!-- RIGHT TABLE: Devueltas -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex items-center px-5 py-4 border-b border-slate-100 bg-emerald-50">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white mr-2">
                    <i class="pi pi-arrow-left text-xs"></i>
                </span>
                <span class="font-extrabold text-emerald-800 text-base tracking-tight">Llaves Devueltas</span>
                <span class="ml-2 bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">{{ devueltasRecords.length }}</span>
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
                        <tr *ngFor="let entregada of filteredEntregadas"
                            class="hover:bg-emerald-50/30 transition-colors duration-100 h-[52px] group">
                            <ng-container *ngIf="getPairedDevuelta(entregada.id) as dev; else pendienteBlock">
                                <td class="py-2 px-2 text-center font-mono font-semibold text-slate-700 truncate">{{ dev.hora }}</td>
                                <td class="py-2 px-2 text-center font-semibold text-slate-600 truncate">{{ formatFecha(dev.fecha) }}</td>
                                <td class="py-2 px-3 font-bold text-slate-800 truncate" [title]="dev.colaborador">{{ dev.colaborador }}</td>
                                <td class="py-2 px-3 text-slate-600 truncate" [title]="dev.departamento">{{ dev.departamento }}</td>
                                <td class="py-2 px-3 text-slate-600 truncate" [title]="dev.puesto">{{ dev.puesto }}</td>
                                <td class="py-2 px-2 text-center">
                                    <span class="inline-block bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-md border border-emerald-200 truncate">{{ dev.numeroLlave }}</span>
                                </td>
                                <td class="py-2 px-2 text-center font-bold text-slate-700">{{ dev.numeroPiezas }}</td>
                                <td class="py-2 px-2 text-center">
                                    <span [class]="dev.tipoLlave === 'MAGNETICA' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                                        class="inline-block font-bold px-1 py-0.5 rounded border text-[9px] uppercase tracking-wide">
                                        {{ dev.tipoLlave === 'MAGNETICA' ? 'Mag.' : 'Met.' }}
                                    </span>
                                </td>
                                <td class="py-2 px-2 text-center">
                                    <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button (click)="openEditDevuelta(dev)"
                                            class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg" title="Editar">
                                            <i class="pi pi-pencil text-xs"></i>
                                        </button>
                                        <button (click)="confirmDelete(dev.id)"
                                            class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg" title="Eliminar">
                                            <i class="pi pi-trash text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                            </ng-container>

                            <ng-template #pendienteBlock>
                                <td class="py-2 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-3">
                                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-amber-50 text-amber-700 border border-amber-200 animate-pulse uppercase">
                                        Pendiente
                                    </span>
                                </td>
                                <td class="py-2 px-3 text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-3 text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-2 text-center text-slate-400 font-semibold">-</td>
                                <td class="py-2 px-2 text-center">
                                    <button (click)="openDevueltaFromEntregada(entregada)"
                                        class="text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-300 transition-all px-2.5 py-1 rounded-lg font-bold text-[10px]">
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
</div>

<!-- ===== DRAWER: Registrar / Editar Entrega ===== -->
<p-drawer [(visible)]="drawerEntregadaVisible" position="right" [style]="{ width: '480px' }" [modal]="true" [closeOnEscape]="true">
    <ng-template #header>
        <div class="flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-white shadow">
                <i class="pi pi-arrow-right text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    {{ drawerMode === 'add' ? 'Nueva Entrega de Llaves' : 'Editar Llave Entregada' }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Control de Llaves</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">

        <!-- Fecha y Hora -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Fecha <span class="text-[#4a5d3e]">(automático)</span>
                </label>
                <input type="date" [(ngModel)]="formHeader.fecha" readonly tabindex="-1"
                    class="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed select-none" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hora <span class="text-[#4a5d3e]">(automático)</span>
                </label>
                <input type="time" [(ngModel)]="formHeader.hora" readonly tabindex="-1"
                    class="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed select-none" />
            </div>
        </div>

        <!-- Colaborador -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Colaborador</label>
            <input type="text" [(ngModel)]="formHeader.colaborador"
                placeholder="Ej. Juan García López"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e]" />
        </div>

        <!-- Departamento -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Departamento</label>
            <input type="text" [(ngModel)]="formHeader.departamento"
                placeholder="Escribe o selecciona..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] mb-2" />
            <div class="flex flex-wrap gap-1.5">
                <button *ngFor="let dept of departmentOptions" type="button"
                    (click)="formHeader.departamento = dept"
                    [class]="formHeader.departamento === dept
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
            <input type="text" [(ngModel)]="formHeader.puesto"
                placeholder="Ej. Recepcionista, Camarero..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a5d3e]" />
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Llaves -->
        <div class="flex justify-between items-center">
            <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Llaves a entregar ({{ llavesList.length }})
            </label>
            <button *ngIf="drawerMode === 'add'" type="button" (click)="addLlaveItem()"
                class="text-xs font-bold text-[#4a5d3e] hover:text-[#5c734e] flex items-center gap-1 cursor-pointer">
                <i class="pi pi-plus-circle"></i>
                Añadir otra llave
            </button>
        </div>

        <div class="flex flex-col gap-3">
            <div *ngFor="let item of llavesList; let idx = index"
                class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2 relative">

                <button *ngIf="llavesList.length > 1 && drawerMode === 'add'" type="button"
                    (click)="removeLlaveItem(idx)"
                    class="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"
                    title="Quitar esta llave">
                    <i class="pi pi-times text-xs"></i>
                </button>

                <div class="flex gap-3">
                    <button type="button" (click)="item.tipoLlave = 'MAGNETICA'"
                        [class]="item.tipoLlave === 'MAGNETICA' ? 'bg-violet-600 text-white shadow-md scale-[1.02]' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50'"
                        class="flex-1 py-3 px-4 border-2 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150">
                        <i class="pi pi-wifi text-base"></i> Magnética
                    </button>
                    <button type="button" (click)="item.tipoLlave = 'METALICA'"
                        [class]="item.tipoLlave === 'METALICA' ? 'bg-orange-500 text-white shadow-md scale-[1.02]' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'"
                        class="flex-1 py-3 px-4 border-2 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150">
                        <i class="pi pi-wrench text-base"></i> Metálica
                    </button>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-2">
                        <input type="text" [(ngModel)]="item.numeroLlave"
                            placeholder="No. Llave (Ej: 101)"
                            class="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d3e]" />
                    </div>
                    <div>
                        <input type="number" [(ngModel)]="item.numeroPiezas" min="1"
                            placeholder="Piezas"
                            class="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#4a5d3e]" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ng-template #footer>
        <div class="flex gap-3 p-1">
            <button type="button" (click)="drawerEntregadaVisible = false"
                class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button type="button" (click)="saveEntregas()"
                [disabled]="!isEntregadaFormValid()"
                [class]="isEntregadaFormValid() ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer' : 'bg-slate-300 text-slate-400 cursor-not-allowed'"
                class="flex-1 py-3 rounded-xl text-sm font-bold shadow transition-all duration-150 flex items-center justify-center gap-2">
                <i class="pi pi-save"></i>
                {{ drawerMode === 'add' ? 'Guardar Registro(s)' : 'Actualizar' }}
            </button>
        </div>
    </ng-template>
</p-drawer>

<!-- ===== DRAWER: Registrar Devolución ===== -->
<p-drawer [(visible)]="drawerDevueltaVisible" position="right" [style]="{ width: '450px' }" [modal]="true" [closeOnEscape]="true">
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

    <div class="flex flex-col gap-5 p-1" *ngIf="devueltaTarget">

        <div class="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div class="font-bold text-sm text-amber-900">{{ devueltaTarget.colaborador }}</div>
            <div class="text-xs text-amber-700 font-medium">{{ devueltaTarget.departamento }} - {{ devueltaTarget.puesto }}</div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Fecha Devolución
                </label>
                <input type="date" [(ngModel)]="devueltaForm.fecha" readonly tabindex="-1"
                    class="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed select-none" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hora Devolución
                </label>
                <input type="time" [(ngModel)]="devueltaForm.hora" readonly tabindex="-1"
                    class="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed select-none" />
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Modo añadir: selección de llaves -->
        <div *ngIf="drawerMode === 'add'">
            <div class="flex justify-between items-center mb-3">
                <label class="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Seleccionar llaves a devolver:
                </label>
                <button type="button" (click)="toggleSelectAllDevueltas()"
                    class="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer">
                    {{ isAllDevueltasSelected() ? 'Desmarcar todas' : 'Marcar todas' }}
                </button>
            </div>

            <div class="flex flex-col gap-2">
                <div *ngFor="let item of pendingLlavesList"
                    (click)="item.selected = !item.selected"
                    [class]="item.selected ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'"
                    class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" [checked]="item.selected"
                            (click)="$event.stopPropagation()"
                            (change)="item.selected = !item.selected"
                            class="w-4 h-4 cursor-pointer rounded text-emerald-600" />
                        <div>
                            <div class="font-mono font-bold text-slate-800 text-sm">Llave: {{ item.numeroLlave }}</div>
                            <div class="text-[11px] text-slate-500 font-medium">
                                {{ item.tipoLlave }} · {{ item.numeroPiezas }} {{ item.numeroPiezas === 1 ? 'pieza' : 'piezas' }}
                            </div>
                        </div>
                    </div>
                    <span [class]="item.selected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'"
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {{ item.selected ? 'Devolver' : 'Pendiente' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Modo editar -->
        <div *ngIf="drawerMode === 'edit'" class="flex flex-col gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">No. Llave</label>
                <input type="text" [(ngModel)]="devueltaForm.numeroLlave"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Piezas</label>
                <input type="number" [(ngModel)]="devueltaForm.numeroPiezas" min="1"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
        </div>
    </div>

    <ng-template #footer>
        <div class="flex gap-3 p-1">
            <button type="button" (click)="drawerDevueltaVisible = false"
                class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button type="button" (click)="saveDevoluciones()"
                [disabled]="!hasSelectedDevueltas()"
                [class]="hasSelectedDevueltas() ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer' : 'bg-slate-300 text-slate-400 cursor-not-allowed'"
                class="flex-1 py-3 rounded-xl text-sm font-bold shadow transition-all duration-150 flex items-center justify-center gap-2">
                <i class="pi pi-save"></i>
                {{ drawerMode === 'add' ? 'Confirmar Devolución' : 'Actualizar' }}
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

    selectedMonth = '';
    tipoLlaveFilter: FilterTipoLlave = 'TODAS';

    drawerEntregadaVisible = false;
    drawerDevueltaVisible = false;
    drawerMode: 'add' | 'edit' = 'add';
    editingId: string | null = null;

    departmentOptions = DEPARTMENTS;

    // Drawer entrega
    formHeader = { fecha: '', hora: '', colaborador: '', departamento: '', puesto: '' };
    llavesList: LlaveItem[] = [];

    // Drawer devolución
    devueltaTarget: ControlLlavesRecord | null = null;
    pendingLlavesList: (ControlLlavesRecord & { selected: boolean })[] = [];
    devueltaForm = { fecha: '', hora: '', numeroLlave: '', numeroPiezas: 1 };

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

    ngOnDestroy() { this.sub?.unsubscribe(); }

    private now() {
        const d = new Date();
        const p = (n: number) => n.toString().padStart(2, '0');
        return {
            fecha: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
            hora: `${p(d.getHours())}:${p(d.getMinutes())}`
        };
    }

    // ---- Drawer Entrega ----

    openEntregadaDrawer() {
        this.drawerMode = 'add';
        this.editingId = null;
        const t = this.now();
        this.formHeader = { fecha: t.fecha, hora: t.hora, colaborador: '', departamento: '', puesto: '' };
        this.llavesList = [{ tipoLlave: 'MAGNETICA', numeroLlave: '', numeroPiezas: 1 }];
        this.drawerEntregadaVisible = true;
    }

    openEditEntregada(rec: ControlLlavesRecord) {
        this.drawerMode = 'edit';
        this.editingId = rec.id;
        this.formHeader = { fecha: rec.fecha, hora: rec.hora, colaborador: rec.colaborador, departamento: rec.departamento, puesto: rec.puesto };
        this.llavesList = [{ tipoLlave: rec.tipoLlave || 'MAGNETICA', numeroLlave: rec.numeroLlave, numeroPiezas: rec.numeroPiezas }];
        this.drawerEntregadaVisible = true;
    }

    addLlaveItem() { this.llavesList.push({ tipoLlave: 'MAGNETICA', numeroLlave: '', numeroPiezas: 1 }); }

    removeLlaveItem(i: number) { if (this.llavesList.length > 1) this.llavesList.splice(i, 1); }

    isEntregadaFormValid(): boolean {
        const h = this.formHeader;
        return !!(h.fecha && h.hora && h.colaborador.trim() && h.departamento.trim() && h.puesto.trim())
            && this.llavesList.length > 0
            && this.llavesList.every(l => l.numeroLlave.trim() && l.numeroPiezas > 0);
    }

    saveEntregas() {
        if (!this.isEntregadaFormValid()) return;
        if (this.drawerMode === 'add') {
            this.llavesList.forEach(item => {
                this.controlLlavesService.create({
                    tipo: 'ENTREGADA',
                    tipoLlave: item.tipoLlave,
                    fecha: this.formHeader.fecha,
                    hora: this.formHeader.hora,
                    colaborador: this.formHeader.colaborador,
                    departamento: this.formHeader.departamento,
                    puesto: this.formHeader.puesto,
                    numeroLlave: item.numeroLlave,
                    numeroPiezas: item.numeroPiezas
                });
            });
            this.messageService.add({ severity: 'success', summary: 'Entregas registradas', detail: `${this.llavesList.length} llave(s) registrada(s).`, life: 3500 });
        } else if (this.editingId && this.llavesList[0]) {
            const item = this.llavesList[0];
            this.controlLlavesService.update(this.editingId, {
                tipoLlave: item.tipoLlave, fecha: this.formHeader.fecha, hora: this.formHeader.hora,
                colaborador: this.formHeader.colaborador, departamento: this.formHeader.departamento,
                puesto: this.formHeader.puesto, numeroLlave: item.numeroLlave, numeroPiezas: item.numeroPiezas
            });
            this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: 'Registro actualizado correctamente.', life: 3500 });
        }
        this.drawerEntregadaVisible = false;
    }

    // ---- Drawer Devolución ----

    openDevueltaFromEntregada(rec: ControlLlavesRecord) {
        this.drawerMode = 'add';
        this.editingId = null;
        this.devueltaTarget = rec;
        const t = this.now();
        this.devueltaForm = { fecha: t.fecha, hora: t.hora, numeroLlave: rec.numeroLlave, numeroPiezas: rec.numeroPiezas };

        // Busca todas las llaves pendientes del mismo colaborador en la misma fecha
        const pendientes = this.filteredEntregadas.filter(e =>
            e.colaborador.toLowerCase() === rec.colaborador.toLowerCase() &&
            e.fecha === rec.fecha &&
            !this.getPairedDevuelta(e.id)
        );
        this.pendingLlavesList = pendientes.map(e => ({ ...e, selected: e.id === rec.id }));
        this.drawerDevueltaVisible = true;
    }

    openEditDevuelta(rec: ControlLlavesRecord) {
        this.drawerMode = 'edit';
        this.editingId = rec.id;
        this.devueltaTarget = rec;
        this.devueltaForm = { fecha: rec.fecha, hora: rec.hora, numeroLlave: rec.numeroLlave, numeroPiezas: rec.numeroPiezas };
        this.pendingLlavesList = [];
        this.drawerDevueltaVisible = true;
    }

    toggleSelectAllDevueltas() {
        const all = this.isAllDevueltasSelected();
        this.pendingLlavesList.forEach(i => i.selected = !all);
    }

    isAllDevueltasSelected() { return this.pendingLlavesList.length > 0 && this.pendingLlavesList.every(i => i.selected); }

    hasSelectedDevueltas() {
        if (this.drawerMode === 'edit') return true;
        return this.pendingLlavesList.some(i => i.selected);
    }

    saveDevoluciones() {
        if (this.drawerMode === 'add') {
            const sel = this.pendingLlavesList.filter(i => i.selected);
            sel.forEach(item => {
                this.controlLlavesService.create({
                    tipo: 'DEVUELTA',
                    tipoLlave: item.tipoLlave,
                    entregadaId: item.id,
                    fecha: this.devueltaForm.fecha,
                    hora: this.devueltaForm.hora,
                    colaborador: item.colaborador,
                    departamento: item.departamento,
                    puesto: item.puesto,
                    numeroLlave: item.numeroLlave,
                    numeroPiezas: item.numeroPiezas
                });
            });
            this.messageService.add({ severity: 'success', summary: 'Devolución registrada', detail: `${sel.length} llave(s) devuelta(s).`, life: 3500 });
        } else if (this.editingId) {
            this.controlLlavesService.update(this.editingId, {
                fecha: this.devueltaForm.fecha, hora: this.devueltaForm.hora,
                numeroLlave: this.devueltaForm.numeroLlave, numeroPiezas: this.devueltaForm.numeroPiezas
            });
            this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: 'Devolución actualizada.', life: 3500 });
        }
        this.drawerDevueltaVisible = false;
    }

    // ---- Utils ----

    getPairedDevuelta(entregadaId: string): ControlLlavesRecord | undefined {
        return this.devueltasRecords.find(r => r.entregadaId === entregadaId);
    }

    getDevueltasCount() { return this.filteredEntregadas.filter(e => !!this.getPairedDevuelta(e.id)).length; }
    getPendientesCount() { return this.filteredEntregadas.filter(e => !this.getPairedDevuelta(e.id)).length; }
    getRetornoPercentage() {
        if (!this.filteredEntregadas.length) return 0;
        return Math.round((this.getDevueltasCount() / this.filteredEntregadas.length) * 100);
    }

    confirmDelete(id: string) {
        this.confirmationService.confirm({
            message: '¿Eliminar este registro? No se puede deshacer.',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.controlLlavesService.delete(id);
                this.messageService.add({ severity: 'warn', summary: 'Eliminado', detail: 'Registro eliminado.', life: 3500 });
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
