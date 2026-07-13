import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { ConfirmationService, MessageService } from 'primeng/api';

// Services & Interfaces
import { SeguridadService, AlcoholimetroRecord, AccidenteRecord, AccidenteColaboradorRecord, ExtravioRecord, ExtraviosCategoria, ExtraviosEstado } from '../service/seguridad.service';

@Component({
    selector: 'app-seguridad',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DrawerModule,
        SelectModule,
        ChartModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="p-6">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        <i class="pi pi-shield text-[#4a5d3e] text-3xl"></i>
                        Módulo de Seguridad
                    </h1>
                    <p class="text-slate-500 mt-1 text-sm font-medium">
                        Gestión y control de alcoholimetría de colaboradores y registro de accidentes de huéspedes.
                    </p>
                </div>
                <!-- Premium Tab Buttons (Switch Navigation) -->
                <div class="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                    <button
                        (click)="activeTab = 'alcoholimetro'"
                        [class.bg-[#4a5d3e]]="activeTab === 'alcoholimetro'"
                        [class.text-white]="activeTab === 'alcoholimetro'"
                        [class.shadow-md]="activeTab === 'alcoholimetro'"
                        [class.bg-transparent]="activeTab !== 'alcoholimetro'"
                        [class.text-slate-600]="activeTab !== 'alcoholimetro'"
                        class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 transform active:scale-95 cursor-pointer">
                        <i class="pi pi-percentage text-xs"></i>
                        Alcoholímetro
                    </button>
                    <button
                        (click)="activeTab = 'accidentes'"
                        [class.bg-[#4a5d3e]]="activeTab === 'accidentes'"
                        [class.text-white]="activeTab === 'accidentes'"
                        [class.shadow-md]="activeTab === 'accidentes'"
                        [class.bg-transparent]="activeTab !== 'accidentes'"
                        [class.text-slate-600]="activeTab !== 'accidentes'"
                        class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 transform active:scale-95 cursor-pointer">
                        <i class="pi pi-exclamation-triangle text-xs"></i>
                        Accidentes de Huéspedes
                    </button>
                    <button
                        (click)="activeTab = 'accidentesColaboradores'"
                        [class.bg-[#4a5d3e]]="activeTab === 'accidentesColaboradores'"
                        [class.text-white]="activeTab === 'accidentesColaboradores'"
                        [class.shadow-md]="activeTab === 'accidentesColaboradores'"
                        [class.bg-transparent]="activeTab !== 'accidentesColaboradores'"
                        [class.text-slate-600]="activeTab !== 'accidentesColaboradores'"
                        class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 transform active:scale-95 cursor-pointer">
                        <i class="pi pi-briefcase text-xs"></i>
                        Accidentes de Colaboradores
                    </button>
                    <button
                        (click)="activeTab = 'extravios'"
                        [class.bg-[#4a5d3e]]="activeTab === 'extravios'"
                        [class.text-white]="activeTab === 'extravios'"
                        [class.shadow-md]="activeTab === 'extravios'"
                        [class.bg-transparent]="activeTab !== 'extravios'"
                        [class.text-slate-600]="activeTab !== 'extravios'"
                        class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 transform active:scale-95 cursor-pointer">
                        <i class="pi pi-search text-xs"></i>
                        Extravios
                    </button>
                </div>
            </div>

            <div class="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                    <i class="pi pi-calendar text-[#4a5d3e]"></i>
                    Filtrar datos por mes
                </div>
                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <input
                        type="month"
                        [(ngModel)]="selectedMonth"
                        (ngModelChange)="onMonthFilterChange()"
                        class="border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent cursor-pointer" />
                    <button
                        type="button"
                        (click)="clearMonthFilter()"
                        class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer">
                        <i class="pi pi-filter-slash"></i>
                        Ver todos
                    </button>
                </div>
            </div>

            <!-- TAB 1: ALCOHOLIMETRO -->
            <div *ngIf="activeTab === 'alcoholimetro'" class="grid grid-cols-12 gap-6">
                <!-- Action bar and custom tables -->
                <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                    <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div class="font-semibold text-lg text-slate-800 flex items-center gap-2">
                            <i class="pi pi-list text-[#4a5d3e]"></i>
                            Listado de Pruebas de Alcoholímetro
                        </div>
                        <button
                            (click)="openAddDrawer('alcoholimetro')"
                            class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2 transform active:scale-95">
                            <i class="pi pi-plus"></i>
                            Agregar Registro
                        </button>
                    </div>

                    <!-- Department Tables -->
                    <div *ngFor="let dept of departments" class="dept-group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                        <!-- Custom Group Header matching image columns -->
                        <div class="grid grid-cols-12 bg-[#4a5d3e] text-white font-bold text-center uppercase text-xs tracking-wider border-b border-slate-200">
                            <div class="col-span-2 py-3 border-r border-[#5c734e]">Fecha</div>
                            <div class="col-span-4 py-3 border-r border-[#5c734e]">Nombre del Colaborador</div>
                            <div class="col-span-3 py-3 border-r border-[#5c734e]">Observaciones</div>
                            <div class="col-span-1 py-3 border-r border-[#5c734e] flex items-center justify-center">Acciones</div>
                            <div class="col-span-2 py-3">Departamento</div>
                        </div>

                        <!-- Table Body -->
                        <div class="grid grid-cols-12">
                            <!-- Left: Row List (10 cols out of 12) -->
                            <div class="col-span-10 divide-y divide-slate-200">
                                <div
                                    *ngFor="let rec of getRecordsForDept(dept)"
                                    [class.bg-amber-100]="rec.destacado"
                                    [class.hover:bg-amber-200]="rec.destacado"
                                    [class.border-l-4]="rec.destacado"
                                    [class.border-l-amber-500]="rec.destacado"
                                    [class.hover:bg-slate-50]="!rec.destacado"
                                    class="grid grid-cols-10 text-xs py-3 items-center transition-colors duration-150 relative group min-h-[3rem]">
                                    
                                    <div class="col-span-2 px-3 border-r border-slate-200 text-center font-semibold text-slate-700">
                                        {{ formatFecha(rec.fecha) }}
                                    </div>
                                    <div class="col-span-4 px-4 border-r border-slate-200 font-bold text-slate-800">
                                        {{ rec.nombre }}
                                    </div>
                                    <div class="col-span-3 px-4 border-r border-slate-200 text-slate-600 font-medium">
                                        {{ rec.observaciones }}
                                    </div>
                                    <div class="col-span-1 flex items-center justify-center gap-1.5 border-r border-slate-200">
                                        <button
                                            (click)="openEditDrawer(rec, 'alcoholimetro')"
                                            class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-blue-100"
                                            title="Editar">
                                            <i class="pi pi-pencil text-xs"></i>
                                        </button>
                                        <button
                                            (click)="confirmDelete(rec.id, 'alcoholimetro')"
                                            class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-red-100"
                                            title="Eliminar">
                                            <i class="pi pi-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Empty state row -->
                                <div
                                    *ngIf="getRecordsForDept(dept).length === 0"
                                    class="grid grid-cols-10 text-xs py-4 text-slate-400 italic text-center items-center min-h-[3rem]">
                                    <div class="col-span-2 px-3 border-r border-slate-200">-</div>
                                    <div class="col-span-4 px-4 border-r border-slate-200">Sin incidencias registradas</div>
                                    <div class="col-span-3 px-4 border-r border-slate-200">-</div>
                                    <div class="col-span-1 border-r border-slate-200">-</div>
                                </div>
                            </div>

                            <!-- Right: Department Info & Total Column (2 cols out of 12) -->
                            <div class="col-span-2 flex flex-col justify-between text-center bg-slate-50 border-l border-slate-200 select-none">
                                <div class="p-3 font-extrabold text-[#4a5d3e] text-[10px] tracking-wider uppercase flex-grow flex items-center justify-center">
                                    {{ dept }}
                                </div>
                                <div class="bg-[#4a5d3e] text-white py-1.5 text-[9px] font-extrabold uppercase tracking-widest border-y border-[#5c734e]">
                                    Total
                                </div>
                                <div class="py-3 text-lg font-black text-slate-800 flex-grow flex items-center justify-center">
                                    {{ getRecordsForDept(dept).length }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sticky Live Pie Chart (4 cols out of 12) -->
                <div class="col-span-12 lg:col-span-4 xl:col-span-3">
                    <div class="sticky top-24 self-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="font-bold text-base text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <i class="pi pi-chart-pie text-[#4a5d3e]"></i>
                            Distribución en Tiempo Real
                        </div>
                        <div class="relative w-full flex items-center justify-center" style="height: 280px;">
                            <p-chart
                                type="pie"
                                [data]="chartData"
                                [options]="chartOptions"
                                class="w-full">
                            </p-chart>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <div class="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                                <span>Total de incidencias:</span>
                                <span class="bg-[#4a5d3e] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {{ getFilteredAlcoholimetroRecords().length }}
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 font-medium">
                                * La gráfica se recalculará y actualizará automáticamente cuando agregues o modifiques un registro.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2: ACCIDENTES DE HUESPEDES -->
            <div *ngIf="activeTab === 'accidentes'" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div class="font-semibold text-lg text-slate-800 flex items-center gap-2">
                        <i class="pi pi-exclamation-circle text-red-600"></i>
                        Registro Histórico de Accidentes de Huéspedes
                    </div>
                    <button
                        (click)="openAddDrawer('accidente')"
                        class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2 transform active:scale-95">
                        <i class="pi pi-plus"></i>
                        Registrar Accidente
                    </button>
                </div>

                <!-- Accident logs list -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                    <th class="py-4 px-6 text-center w-[10%]">Fecha</th>
                                    <th class="py-4 px-6 w-[20%]">Huésped</th>
                                    <th class="py-4 px-4 text-center w-[8%]">Hab.</th>
                                    <th class="py-4 px-6 w-[15%]">Lugar</th>
                                    <th class="py-4 px-6 w-[22%]">Descripción del Accidente</th>
                                    <th class="py-4 px-6 w-[20%]">Acciones Tomadas</th>
                                    <th class="py-4 px-6 w-[15%]">Reportado por</th>
                                    <th class="py-4 px-6 text-center w-[10%]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-slate-700 text-xs">
                                <tr
                                    *ngFor="let acc of getFilteredAccidenteRecords()"
                                    class="hover:bg-slate-50 transition-colors duration-150">
                                    <td class="py-4 px-6 text-center font-semibold text-slate-600">
                                        {{ formatFecha(acc.fecha) }}
                                    </td>
                                    <td class="py-4 px-6 font-bold text-slate-800">
                                        {{ acc.nombreHuesped }}
                                    </td>
                                    <td class="py-4 px-4 text-center font-medium text-slate-600 bg-slate-50/50">
                                        {{ acc.habitacion }}
                                    </td>
                                    <td class="py-4 px-6 font-medium text-slate-700">
                                        {{ acc.lugar }}
                                    </td>
                                    <td class="py-4 px-6 text-slate-600 leading-relaxed">
                                        {{ acc.descripcion }}
                                    </td>
                                    <td class="py-4 px-6">
                                        <span class="inline-block bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-100 leading-relaxed">
                                            {{ acc.acciones }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6 font-semibold text-slate-600">
                                        {{ acc.reportadoPor }}
                                    </td>
                                    <td class="py-4 px-6 text-center">
                                        <div class="flex items-center justify-center gap-1.5">
                                            <button
                                                (click)="openEditDrawer(acc, 'accidente')"
                                                class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-blue-100"
                                                title="Editar">
                                                <i class="pi pi-pencil text-xs"></i>
                                            </button>
                                            <button
                                                (click)="confirmDelete(acc.id, 'accidente')"
                                                class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-red-100"
                                                title="Eliminar">
                                                <i class="pi pi-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr *ngIf="getFilteredAccidenteRecords().length === 0">
                                    <td colspan="8" class="py-8 text-center text-slate-400 italic">
                                        No hay registros de accidentes de huéspedes guardados.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

                <div class="col-span-12 lg:col-span-4 xl:col-span-3">
                    <div class="sticky top-24 self-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="font-bold text-base text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <i class="pi pi-chart-pie text-[#4a5d3e]"></i>
                            Distribucion por Atencion
                        </div>
                        <div class="relative w-full flex items-center justify-center" style="height: 280px;">
                            <p-chart
                                type="pie"
                                [data]="accidentChartData"
                                [options]="chartOptions"
                                class="w-full">
                            </p-chart>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <div class="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                                <span>Total de accidentes:</span>
                                <span class="bg-[#4a5d3e] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {{ getFilteredAccidenteRecords().length }}
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 font-medium">
                                * La grafica se actualiza al agregar, editar o eliminar accidentes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 3: ACCIDENTES DE COLABORADORES -->
            <div *ngIf="activeTab === 'accidentesColaboradores'" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                    <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div class="font-semibold text-lg text-slate-800 flex items-center gap-2">
                            <i class="pi pi-briefcase text-[#4a5d3e]"></i>
                            Registro Historico de Accidentes de Colaboradores
                        </div>
                        <button
                            (click)="openAddDrawer('accidenteColaborador')"
                            class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2 transform active:scale-95">
                            <i class="pi pi-plus"></i>
                            Registrar Accidente
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                        <th class="py-4 px-6 text-center w-[12%]">Fecha</th>
                                        <th class="py-4 px-6 w-[25%]">Nombre de colaborador</th>
                                        <th class="py-4 px-6 w-[22%]">Area de colaborador</th>
                                        <th class="py-4 px-6 w-[31%]">Observaciones</th>
                                        <th class="py-4 px-6 text-center w-[10%]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 text-slate-700 text-xs">
                                    <tr
                                        *ngFor="let acc of getFilteredAccidenteColaboradorRecords()"
                                        class="hover:bg-slate-50 transition-colors duration-150">
                                        <td class="py-4 px-6 text-center font-semibold text-slate-600">
                                            {{ formatFecha(acc.fecha) }}
                                        </td>
                                        <td class="py-4 px-6 font-bold text-slate-800">
                                            {{ acc.nombreColaborador }}
                                        </td>
                                        <td class="py-4 px-6 font-semibold text-[#4a5d3e]">
                                            {{ acc.areaColaborador }}
                                        </td>
                                        <td class="py-4 px-6 text-slate-600 leading-relaxed">
                                            {{ acc.observaciones }}
                                        </td>
                                        <td class="py-4 px-6 text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button
                                                    (click)="openEditDrawer(acc, 'accidenteColaborador')"
                                                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-blue-100"
                                                    title="Editar">
                                                    <i class="pi pi-pencil text-xs"></i>
                                                </button>
                                                <button
                                                    (click)="confirmDelete(acc.id, 'accidenteColaborador')"
                                                    class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-red-100"
                                                    title="Eliminar">
                                                    <i class="pi pi-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr *ngIf="getFilteredAccidenteColaboradorRecords().length === 0">
                                        <td colspan="5" class="py-8 text-center text-slate-400 italic">
                                            No hay registros de accidentes de colaboradores guardados.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 xl:col-span-3">
                    <div class="sticky top-24 self-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="font-bold text-base text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <i class="pi pi-chart-pie text-[#4a5d3e]"></i>
                            Distribucion por Area
                        </div>
                        <div class="relative w-full flex items-center justify-center" style="height: 280px;">
                            <p-chart
                                type="pie"
                                [data]="collaboratorAccidentChartData"
                                [options]="chartOptions"
                                class="w-full">
                            </p-chart>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <div class="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                                <span>Total de accidentes:</span>
                                <span class="bg-[#4a5d3e] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {{ getFilteredAccidenteColaboradorRecords().length }}
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 font-medium">
                                * La grafica usa las mismas areas asignadas en alcoholimetro.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 4: EXTRAVIOS -->
            <div *ngIf="activeTab === 'extravios'" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 xl:col-span-8 space-y-6">
                    <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div class="font-semibold text-lg text-slate-800 flex items-center gap-2">
                            <i class="pi pi-search text-[#4a5d3e]"></i>
                            Registro de Extravios
                        </div>
                        <button
                            (click)="openAddDrawer('extravio')"
                            class="bg-[#4a5d3e] text-white hover:bg-[#5c734e] px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2 transform active:scale-95">
                            <i class="pi pi-plus"></i>
                            Registrar Extravio
                        </button>
                    </div>

                    <div *ngFor="let categoria of extravioCategorias" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="bg-[#4a5d3e] text-white px-5 py-3 font-bold text-sm uppercase tracking-wider flex items-center justify-between">
                            <span>{{ categoria.label }}</span>
                            <span class="text-[11px] bg-white/15 px-2.5 py-1 rounded-full">
                                {{ getExtraviosForCategoria(categoria.key).length }} registros
                            </span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                        <th class="py-4 px-6 text-center w-[12%]">Fecha</th>
                                        <th class="py-4 px-6 text-center w-[12%]">Habitacion</th>
                                        <th class="py-4 px-6 w-[22%]">Nombre del huesped</th>
                                        <th class="py-4 px-6 w-[28%]">Observaciones</th>
                                        <th class="py-4 px-6 text-center w-[12%]">Estado</th>
                                        <th class="py-4 px-6 text-center w-[14%]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 text-slate-700 text-xs">
                                    <tr
                                        *ngFor="let item of getExtraviosForCategoria(categoria.key)"
                                        class="hover:bg-slate-50 transition-colors duration-150">
                                        <td class="py-4 px-6 text-center font-semibold text-slate-600">
                                            {{ formatFecha(item.fecha) }}
                                        </td>
                                        <td class="py-4 px-6 text-center font-bold text-[#4a5d3e]">
                                            {{ item.habitacion }}
                                        </td>
                                        <td class="py-4 px-6 font-bold text-slate-800">
                                            {{ item.nombreHuesped }}
                                        </td>
                                        <td class="py-4 px-6 text-slate-600 leading-relaxed">
                                            {{ item.observaciones }}
                                        </td>
                                        <td class="py-4 px-6 text-center">
                                            <span
                                                class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border"
                                                [class.bg-emerald-50]="item.estado === 'ENCONTRADO'"
                                                [class.text-emerald-700]="item.estado === 'ENCONTRADO'"
                                                [class.border-emerald-100]="item.estado === 'ENCONTRADO'"
                                                [class.bg-red-50]="item.estado === 'NO_ENCONTRADO'"
                                                [class.text-red-700]="item.estado === 'NO_ENCONTRADO'"
                                                [class.border-red-100]="item.estado === 'NO_ENCONTRADO'"
                                                [class.bg-amber-50]="item.estado === 'PENDIENTE'"
                                                [class.text-amber-700]="item.estado === 'PENDIENTE'"
                                                [class.border-amber-100]="item.estado === 'PENDIENTE'">
                                                {{ getExtravioEstadoLabel(item.estado) }}
                                            </span>
                                        </td>
                                        <td class="py-4 px-6 text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button
                                                    (click)="setExtravioEstado(item.id, 'ENCONTRADO')"
                                                    class="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-emerald-100"
                                                    title="Encontrado">
                                                    <i class="pi pi-check text-xs"></i>
                                                </button>
                                                <button
                                                    (click)="setExtravioEstado(item.id, 'NO_ENCONTRADO')"
                                                    class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-red-100"
                                                    title="No encontrado">
                                                    <i class="pi pi-times text-xs"></i>
                                                </button>
                                                <button
                                                    (click)="setExtravioEstado(item.id, 'PENDIENTE')"
                                                    class="text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-amber-100"
                                                    title="Pendiente">
                                                    <i class="pi pi-question text-xs"></i>
                                                </button>
                                                <button
                                                    (click)="openEditDrawer(item, 'extravio')"
                                                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-blue-100"
                                                    title="Editar">
                                                    <i class="pi pi-pencil text-xs"></i>
                                                </button>
                                                <button
                                                    (click)="confirmDelete(item.id, 'extravio')"
                                                    class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all p-1.5 rounded-lg flex items-center justify-center border border-transparent hover:border-red-100"
                                                    title="Eliminar">
                                                    <i class="pi pi-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr *ngIf="getExtraviosForCategoria(categoria.key).length === 0">
                                        <td colspan="6" class="py-8 text-center text-slate-400 italic">
                                            No hay extravios registrados en esta categoria.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 xl:col-span-4">
                    <div class="sticky top-24 self-start space-y-6">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="font-bold text-base text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <i class="pi pi-chart-pie text-[#4a5d3e]"></i>
                                Habitaciones
                            </div>
                            <div class="relative w-full flex items-center justify-center" style="height: 240px;">
                                <p-chart
                                    type="pie"
                                    [data]="extraviosHabitacionesChartData"
                                    [options]="chartOptions"
                                    class="w-full">
                                </p-chart>
                            </div>
                            <p class="text-[11px] text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100">
                                * Solo cuenta encontrados y no encontrados.
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="font-bold text-base text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <i class="pi pi-chart-pie text-[#4a5d3e]"></i>
                                Areas comunes
                            </div>
                            <div class="relative w-full flex items-center justify-center" style="height: 240px;">
                                <p-chart
                                    type="pie"
                                    [data]="extraviosAreasChartData"
                                    [options]="chartOptions"
                                    class="w-full">
                                </p-chart>
                            </div>
                            <p class="text-[11px] text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100">
                                * Los pendientes no aparecen en la grafica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LATERAL FORM DRAWER (p-drawer) -->
            <p-drawer
                [(visible)]="drawerVisible"
                [header]="drawerMode === 'add' ? 'Nuevo Registro' : 'Editar Registro'"
                position="right"
                styleClass="w-full md:w-[480px]"
                (onHide)="resetForm()">
                
                <div class="p-4 space-y-5">
                    <!-- ALCOHOLIMETRO FORM -->
                    <div *ngIf="drawerType === 'alcoholimetro'" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fecha de la Prueba</label>
                            <input
                                type="date"
                                [(ngModel)]="selectedAlcoRecord.fecha"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nombre del Colaborador</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedAlcoRecord.nombre"
                                placeholder="Ej. Walter Argenis Villanueva"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Departamento</label>
                            <p-select
                                [(ngModel)]="selectedAlcoRecord.departamento"
                                [options]="departments"
                                placeholder="Selecciona un departamento"
                                styleClass="w-full text-sm border-slate-300 rounded-lg focus:ring-[#4a5d3e]"
                                class="w-full block">
                            </p-select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Observaciones / Puesto</label>
                            <textarea
                                [(ngModel)]="selectedAlcoRecord.observaciones"
                                rows="3"
                                placeholder="Ej. cantinero, con aliento etílico..."
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm resize-none"
                                required></textarea>
                        </div>
                        
                        <!-- Row highlight switch -->
                        <div class="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <input
                                type="checkbox"
                                id="chkHighlight"
                                [(ngModel)]="selectedAlcoRecord.destacado"
                                class="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500" />
                            <label for="chkHighlight" class="text-xs font-semibold text-amber-800 cursor-pointer select-none">
                                Destacar fila en la tabla (Fondo amarillo)
                            </label>
                        </div>
                    </div>

                    <!-- ACCIDENTE FORM -->
                    <div *ngIf="drawerType === 'accidente'" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fecha del Incidente</label>
                            <input
                                type="date"
                                [(ngModel)]="selectedAccRecord.fecha"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nombre del Huésped</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedAccRecord.nombreHuesped"
                                placeholder="Ej. John Doe"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Habitación</label>
                                <input
                                    type="text"
                                    [(ngModel)]="selectedAccRecord.habitacion"
                                    placeholder="Ej. 305"
                                    class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                    required />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Lugar del Suceso</label>
                                <input
                                    type="text"
                                    [(ngModel)]="selectedAccRecord.lugar"
                                    placeholder="Ej. Alberca, Lobby"
                                    class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                    required />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tipo de Atencion</label>
                            <p-select
                                [(ngModel)]="selectedAccRecord.tipoAtencion"
                                [options]="accidentAttentionOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Selecciona el tipo de atencion"
                                styleClass="w-full text-sm border-slate-300 rounded-lg focus:ring-[#4a5d3e]"
                                class="w-full block">
                            </p-select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Descripción del Accidente</label>
                            <textarea
                                [(ngModel)]="selectedAccRecord.descripcion"
                                rows="3"
                                placeholder="Relato detallado del accidente..."
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm resize-none"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Acciones Tomadas</label>
                            <textarea
                                [(ngModel)]="selectedAccRecord.acciones"
                                rows="2"
                                placeholder="Ej. Se le brindó primeros auxilios..."
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm resize-none"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Reportado Por (Guardia/Cargo)</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedAccRecord.reportadoPor"
                                placeholder="Ej. Oficial Gomez"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                    </div>

                    <!-- ACCIDENTE COLABORADOR FORM -->
                    <div *ngIf="drawerType === 'accidenteColaborador'" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fecha del Incidente</label>
                            <input
                                type="date"
                                [(ngModel)]="selectedAccColRecord.fecha"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nombre de Colaborador</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedAccColRecord.nombreColaborador"
                                placeholder="Ej. Juan Perez"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Area de Colaborador</label>
                            <p-select
                                [(ngModel)]="selectedAccColRecord.areaColaborador"
                                [options]="departments"
                                placeholder="Selecciona un area"
                                styleClass="w-full text-sm border-slate-300 rounded-lg focus:ring-[#4a5d3e]"
                                class="w-full block">
                            </p-select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Observaciones</label>
                            <textarea
                                [(ngModel)]="selectedAccColRecord.observaciones"
                                rows="4"
                                placeholder="Describe el accidente del colaborador..."
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm resize-none"
                                required></textarea>
                        </div>
                    </div>

                    <!-- EXTRAVIO FORM -->
                    <div *ngIf="drawerType === 'extravio'" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Categoria</label>
                            <p-select
                                [(ngModel)]="selectedExtravioRecord.categoria"
                                [options]="extravioCategorias"
                                optionLabel="label"
                                optionValue="key"
                                placeholder="Selecciona una categoria"
                                styleClass="w-full text-sm border-slate-300 rounded-lg focus:ring-[#4a5d3e]"
                                class="w-full block">
                            </p-select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fecha</label>
                            <input
                                type="date"
                                [(ngModel)]="selectedExtravioRecord.fecha"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Habitacion</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedExtravioRecord.habitacion"
                                placeholder="Ej. 305 o N/A"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nombre del huesped</label>
                            <input
                                type="text"
                                [(ngModel)]="selectedExtravioRecord.nombreHuesped"
                                placeholder="Ej. John Doe"
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Estado</label>
                            <p-select
                                [(ngModel)]="selectedExtravioRecord.estado"
                                [options]="extravioEstadoOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Selecciona un estado"
                                styleClass="w-full text-sm border-slate-300 rounded-lg focus:ring-[#4a5d3e]"
                                class="w-full block">
                            </p-select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Observaciones</label>
                            <textarea
                                [(ngModel)]="selectedExtravioRecord.observaciones"
                                rows="4"
                                placeholder="Describe el objeto extraviado y detalles relevantes..."
                                class="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a5d3e] focus:border-transparent text-sm resize-none"
                                required></textarea>
                        </div>
                    </div>

                    <!-- Drawer Buttons -->
                    <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <button
                            (click)="saveRecord()"
                            class="flex-1 bg-[#4a5d3e] text-white hover:bg-[#5c734e] py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-150 text-sm transform active:scale-95">
                            {{ drawerMode === 'add' ? 'Crear Registro' : 'Guardar Cambios' }}
                        </button>
                        <button
                            (click)="drawerVisible = false"
                            class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl font-bold transition-all duration-150 text-sm transform active:scale-95">
                            Cancelar
                        </button>
                    </div>
                </div>
            </p-drawer>
        </div>
    `,
    styles: [`
        :host ::ng-deep .p-drawer {
            border-top-left-radius: 1.5rem;
            border-bottom-left-radius: 1.5rem;
        }
        :host ::ng-deep .p-confirmdialog {
            border-radius: 1.25rem;
            overflow: hidden;
        }
        .dept-group {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .dept-group:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
        }
    `]
})
export class SeguridadComponent implements OnInit, OnDestroy {
    activeTab: 'alcoholimetro' | 'accidentes' | 'accidentesColaboradores' | 'extravios' = 'alcoholimetro';
    selectedMonth: string = '';
    alcoholimetroRecords: (AlcoholimetroRecord & { destacado?: boolean })[] = [];
    accidenteRecords: AccidenteRecord[] = [];
    accidenteColaboradorRecords: AccidenteColaboradorRecord[] = [];
    extravioRecords: ExtravioRecord[] = [];
    departments: string[] = [
        'ALIMENTOS Y BEBIDAS',
        'MANTENIMIENTO',
        'AMA DE LLAVES',
        'LAVANDERIA',
        'STUART',
        'AREAS PUBLICAS',
        'ADMINISTRACION',
        'SEGURIDAD',
        'RECEPCION',
        'ANIMACION',
        'COCINA'
    ];
    accidentAttentionTypes = [
        { key: 'SEGURIDAD', label: 'Seguridad' },
        { key: 'DOCTOR EN GUARDIA', label: 'Doctor en guardia' },
        { key: 'AMBULANCIA', label: 'Ambulancia' }
    ];
    accidentAttentionOptions = this.accidentAttentionTypes.map(type => ({
        label: type.label,
        value: type.key
    }));
    extravioCategorias: { key: ExtraviosCategoria; label: string }[] = [
        { key: 'HABITACIONES', label: 'Sucesos en habitaciones' },
        { key: 'AREAS_COMUNES', label: 'Sucesos en areas comunes' }
    ];
    extravioEstadoOptions: { label: string; value: ExtraviosEstado }[] = [
        { label: 'Encontrado', value: 'ENCONTRADO' },
        { label: 'No encontrado', value: 'NO_ENCONTRADO' },
        { label: 'Pendiente', value: 'PENDIENTE' }
    ];

    // Drawer state
    drawerVisible: boolean = false;
    drawerMode: 'add' | 'edit' = 'add';
    drawerType: 'alcoholimetro' | 'accidente' | 'accidenteColaborador' | 'extravio' = 'alcoholimetro';

    // Selections
    selectedAlcoRecord: Partial<AlcoholimetroRecord & { destacado?: boolean }> = {};
    selectedAccRecord: Partial<AccidenteRecord> = {};
    selectedAccColRecord: Partial<AccidenteColaboradorRecord> = {};
    selectedExtravioRecord: Partial<ExtravioRecord> = {};

    // Chart properties
    chartData: any;
    accidentChartData: any;
    collaboratorAccidentChartData: any;
    extraviosHabitacionesChartData: any;
    extraviosAreasChartData: any;
    chartOptions: any;

    private subAlco?: Subscription;
    private subAcc?: Subscription;
    private subAccCol?: Subscription;
    private subExtravio?: Subscription;

    constructor(
        private seguridadService: SeguridadService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.subAlco = this.seguridadService.getAlcoholimetroRecords().subscribe(records => {
            this.alcoholimetroRecords = records;
            this.updateChart();
        });

        this.subAcc = this.seguridadService.getAccidenteRecords().subscribe(records => {
            this.accidenteRecords = records
                .map(record => ({
                    ...record,
                    tipoAtencion: this.normalizeAccidentAttention(record.tipoAtencion)
                }))
                .sort((a, b) => b.fecha.localeCompare(a.fecha));
            this.updateAccidentChart();
        });

        this.subAccCol = this.seguridadService.getAccidenteColaboradorRecords().subscribe(records => {
            this.accidenteColaboradorRecords = records.sort((a, b) => b.fecha.localeCompare(a.fecha));
            this.updateCollaboratorAccidentChart();
        });

        this.subExtravio = this.seguridadService.getExtravioRecords().subscribe(records => {
            this.extravioRecords = records.sort((a, b) => b.fecha.localeCompare(a.fecha));
            this.updateExtraviosCharts();
        });
    }

    ngOnDestroy() {
        this.subAlco?.unsubscribe();
        this.subAcc?.unsubscribe();
        this.subAccCol?.unsubscribe();
        this.subExtravio?.unsubscribe();
    }

    getRecordsForDept(dept: string): (AlcoholimetroRecord & { destacado?: boolean })[] {
        return this.getFilteredAlcoholimetroRecords().filter(r => r.departamento === dept);
    }

    getAccidentsForAttention(type: string): AccidenteRecord[] {
        return this.getFilteredAccidenteRecords().filter(r => this.normalizeAccidentAttention(r.tipoAtencion) === type);
    }

    getCollaboratorAccidentsForDept(dept: string): AccidenteColaboradorRecord[] {
        return this.getFilteredAccidenteColaboradorRecords().filter(r => r.areaColaborador === dept);
    }

    getExtraviosForCategoria(categoria: ExtraviosCategoria): ExtravioRecord[] {
        return this.getFilteredExtravioRecords().filter(r => r.categoria === categoria);
    }

    getExtravioEstadoLabel(estado?: ExtraviosEstado): string {
        return this.extravioEstadoOptions.find(option => option.value === estado)?.label || 'Pendiente';
    }

    normalizeAccidentAttention(type?: string): string {
        return this.accidentAttentionTypes.some(attention => attention.key === type) ? type! : 'SEGURIDAD';
    }

    getFilteredAlcoholimetroRecords(): (AlcoholimetroRecord & { destacado?: boolean })[] {
        return this.alcoholimetroRecords.filter(record => this.matchesSelectedMonth(record.fecha));
    }

    getFilteredAccidenteRecords(): AccidenteRecord[] {
        return this.accidenteRecords.filter(record => this.matchesSelectedMonth(record.fecha));
    }

    getFilteredAccidenteColaboradorRecords(): AccidenteColaboradorRecord[] {
        return this.accidenteColaboradorRecords.filter(record => this.matchesSelectedMonth(record.fecha));
    }

    getFilteredExtravioRecords(): ExtravioRecord[] {
        return this.extravioRecords.filter(record => this.matchesSelectedMonth(record.fecha));
    }

    matchesSelectedMonth(fecha?: string): boolean {
        return !this.selectedMonth || !!fecha?.startsWith(this.selectedMonth);
    }

    onMonthFilterChange() {
        this.refreshAllCharts();
    }

    clearMonthFilter() {
        this.selectedMonth = '';
        this.refreshAllCharts();
    }

    refreshAllCharts() {
        this.updateChart();
        this.updateAccidentChart();
        this.updateCollaboratorAccidentChart();
        this.updateExtraviosCharts();
    }

    formatFecha(fechaStr?: string): string {
        if (!fechaStr) return '';
        // YYYY-MM-DD to DD/MM/YYYY
        const parts = fechaStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return fechaStr;
    }

    updateChart() {
        const dataValues = this.departments.map(dept => this.getRecordsForDept(dept).length);
        
        this.chartData = {
            labels: this.departments.map(d => d.substring(0, 16) + (d.length > 16 ? '...' : '')),
            datasets: [
                {
                    data: dataValues,
                    backgroundColor: [
                        '#4a5d3e', // ALIMENTOS Y BEBIDAS - Verde Olivo
                        '#3b82f6', // MANTENIMIENTO - Azul
                        '#6366f1', // AMA DE LLAVES - Indigo
                        '#14b8a6', // LAVANDERIA - Teal
                        '#f59e0b',
                        '#0ea5e9',
                        '#8b5cf6',
                        '#ef4444',
                        '#22c55e',
                        '#ec4899',
                        '#64748b'
                    ],
                    hoverBackgroundColor: [
                        '#5c734e',
                        '#60a5fa',
                        '#818cf8',
                        '#2dd4bf',
                        '#fbbf24',
                        '#38bdf8',
                        '#a78bfa',
                        '#f87171',
                        '#4ade80',
                        '#f472b6',
                        '#94a3b8'
                    ],
                    borderWidth: 1
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        font: {
                            size: 10,
                            weight: 'bold'
                        },
                        padding: 12
                    }
                }
            },
            maintainAspectRatio: false
        };
    }

    updateAccidentChart() {
        const dataValues = this.accidentAttentionTypes.map(type => this.getAccidentsForAttention(type.key).length);

        this.accidentChartData = {
            labels: this.accidentAttentionTypes.map(type => type.label),
            datasets: [
                {
                    data: dataValues,
                    backgroundColor: ['#4a5d3e', '#3b82f6', '#ef4444'],
                    hoverBackgroundColor: ['#5c734e', '#60a5fa', '#f87171'],
                    borderWidth: 1
                }
            ]
        };
    }

    updateCollaboratorAccidentChart() {
        const dataValues = this.departments.map(dept => this.getCollaboratorAccidentsForDept(dept).length);

        this.collaboratorAccidentChartData = {
            labels: this.departments.map(d => d.substring(0, 16) + (d.length > 16 ? '...' : '')),
            datasets: [
                {
                    data: dataValues,
                    backgroundColor: ['#4a5d3e', '#3b82f6', '#6366f1', '#14b8a6', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ef4444', '#22c55e', '#ec4899', '#64748b'],
                    hoverBackgroundColor: ['#5c734e', '#60a5fa', '#818cf8', '#2dd4bf', '#fbbf24', '#38bdf8', '#a78bfa', '#f87171', '#4ade80', '#f472b6', '#94a3b8'],
                    borderWidth: 1
                }
            ]
        };
    }

    updateExtraviosCharts() {
        this.extraviosHabitacionesChartData = this.buildExtravioChartData('HABITACIONES');
        this.extraviosAreasChartData = this.buildExtravioChartData('AREAS_COMUNES');
    }

    buildExtravioChartData(categoria: ExtraviosCategoria) {
        const records = this.getExtraviosForCategoria(categoria);
        const encontrados = records.filter(record => record.estado === 'ENCONTRADO').length;
        const noEncontrados = records.filter(record => record.estado === 'NO_ENCONTRADO').length;

        return {
            labels: ['Encontrados', 'No encontrados'],
            datasets: [
                {
                    data: [encontrados, noEncontrados],
                    backgroundColor: ['#22c55e', '#ef4444'],
                    hoverBackgroundColor: ['#4ade80', '#f87171'],
                    borderWidth: 1
                }
            ]
        };
    }

    // Drawer management
    openAddDrawer(type: 'alcoholimetro' | 'accidente' | 'accidenteColaborador' | 'extravio') {
        this.drawerType = type;
        this.drawerMode = 'add';
        // Initial defaults (completely empty)
        if (type === 'alcoholimetro') {
            this.selectedAlcoRecord = {
                fecha: '',
                nombre: '',
                departamento: '',
                observaciones: '',
                destacado: false
            };
        } else if (type === 'accidente') {
            this.selectedAccRecord = {
                fecha: '',
                nombreHuesped: '',
                habitacion: '',
                lugar: '',
                descripcion: '',
                acciones: '',
                reportadoPor: '',
                tipoAtencion: 'SEGURIDAD'
            };
        } else if (type === 'accidenteColaborador') {
            this.selectedAccColRecord = {
                fecha: '',
                nombreColaborador: '',
                areaColaborador: '',
                observaciones: ''
            };
        } else {
            this.selectedExtravioRecord = {
                fecha: '',
                habitacion: '',
                nombreHuesped: '',
                observaciones: '',
                categoria: 'HABITACIONES',
                estado: 'PENDIENTE'
            };
        }
        this.drawerVisible = true;
    }

    openEditDrawer(record: any, type: 'alcoholimetro' | 'accidente' | 'accidenteColaborador' | 'extravio') {
        this.drawerType = type;
        this.drawerMode = 'edit';
        
        if (type === 'alcoholimetro') {
            this.selectedAlcoRecord = { ...record };
        } else if (type === 'accidente') {
            this.selectedAccRecord = { ...record };
        } else if (type === 'accidenteColaborador') {
            this.selectedAccColRecord = { ...record };
        } else {
            this.selectedExtravioRecord = { ...record };
        }
        this.drawerVisible = true;
    }

    resetForm() {
        this.selectedAlcoRecord = {};
        this.selectedAccRecord = {};
        this.selectedAccColRecord = {};
        this.selectedExtravioRecord = {};
    }

    saveRecord() {
        if (this.drawerType === 'alcoholimetro') {
            const r = this.selectedAlcoRecord;
            if (!r.fecha || !r.nombre || !r.departamento || !r.observaciones) {
                this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor complete todos los datos requeridos.' });
                return;
            }

            if (this.drawerMode === 'add') {
                this.seguridadService.addAlcoholimetroRecord({
                    fecha: r.fecha,
                    nombre: r.nombre,
                    observaciones: r.observaciones,
                    departamento: r.departamento,
                    destacado: !!r.destacado
                } as any);
                this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'El registro de alcoholímetro fue guardado.' });
            } else {
                this.seguridadService.updateAlcoholimetroRecord(r.id!, {
                    fecha: r.fecha,
                    nombre: r.nombre,
                    observaciones: r.observaciones,
                    departamento: r.departamento,
                    destacado: !!r.destacado
                });
                this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'El registro de alcoholímetro fue modificado.' });
            }
        } else if (this.drawerType === 'accidente') {
            const r = this.selectedAccRecord;
            if (!r.fecha || !r.nombreHuesped || !r.habitacion || !r.lugar || !r.descripcion || !r.acciones || !r.reportadoPor || !r.tipoAtencion) {
                this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor complete todos los datos requeridos.' });
                return;
            }

            if (this.drawerMode === 'add') {
                this.seguridadService.addAccidenteRecord({
                    fecha: r.fecha,
                    nombreHuesped: r.nombreHuesped,
                    habitacion: r.habitacion,
                    lugar: r.lugar,
                    descripcion: r.descripcion,
                    acciones: r.acciones,
                    reportadoPor: r.reportadoPor,
                    tipoAtencion: this.normalizeAccidentAttention(r.tipoAtencion)
                });
                this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'El incidente de accidente fue registrado.' });
            } else {
                this.seguridadService.updateAccidenteRecord(r.id!, {
                    fecha: r.fecha,
                    nombreHuesped: r.nombreHuesped,
                    habitacion: r.habitacion,
                    lugar: r.lugar,
                    descripcion: r.descripcion,
                    acciones: r.acciones,
                    reportadoPor: r.reportadoPor,
                    tipoAtencion: this.normalizeAccidentAttention(r.tipoAtencion)
                });
                this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'El incidente fue modificado.' });
            }
        } else if (this.drawerType === 'accidenteColaborador') {
            const r = this.selectedAccColRecord;
            if (!r.fecha || !r.nombreColaborador || !r.areaColaborador || !r.observaciones) {
                this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor complete todos los datos requeridos.' });
                return;
            }

            if (this.drawerMode === 'add') {
                this.seguridadService.addAccidenteColaboradorRecord({
                    fecha: r.fecha,
                    nombreColaborador: r.nombreColaborador,
                    areaColaborador: r.areaColaborador,
                    observaciones: r.observaciones
                });
                this.messageService.add({ severity: 'success', summary: 'Creado con exito', detail: 'El accidente de colaborador fue registrado.' });
            } else {
                this.seguridadService.updateAccidenteColaboradorRecord(r.id!, {
                    fecha: r.fecha,
                    nombreColaborador: r.nombreColaborador,
                    areaColaborador: r.areaColaborador,
                    observaciones: r.observaciones
                });
                this.messageService.add({ severity: 'success', summary: 'Actualizado con exito', detail: 'El accidente de colaborador fue modificado.' });
            }
        } else {
            const r = this.selectedExtravioRecord;
            if (!r.fecha || !r.habitacion || !r.nombreHuesped || !r.observaciones || !r.categoria || !r.estado) {
                this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor complete todos los datos requeridos.' });
                return;
            }

            if (this.drawerMode === 'add') {
                this.seguridadService.addExtravioRecord({
                    fecha: r.fecha,
                    habitacion: r.habitacion,
                    nombreHuesped: r.nombreHuesped,
                    observaciones: r.observaciones,
                    categoria: r.categoria,
                    estado: r.estado
                });
                this.messageService.add({ severity: 'success', summary: 'Creado con exito', detail: 'El extravio fue registrado.' });
            } else {
                this.seguridadService.updateExtravioRecord(r.id!, {
                    fecha: r.fecha,
                    habitacion: r.habitacion,
                    nombreHuesped: r.nombreHuesped,
                    observaciones: r.observaciones,
                    categoria: r.categoria,
                    estado: r.estado
                });
                this.messageService.add({ severity: 'success', summary: 'Actualizado con exito', detail: 'El extravio fue modificado.' });
            }
        }

        this.drawerVisible = false;
    }

    setExtravioEstado(id: string, estado: ExtraviosEstado) {
        this.seguridadService.updateExtravioRecord(id, { estado });
        this.messageService.add({ severity: 'success', summary: 'Estado actualizado', detail: `Extravio marcado como ${this.getExtravioEstadoLabel(estado).toLowerCase()}.` });
    }

    confirmDelete(id: string, type: 'alcoholimetro' | 'accidente' | 'accidenteColaborador' | 'extravio') {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar este registro permanentemente?',
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Cancelar',
            acceptLabel: 'Eliminar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar',
                severity: 'danger'
            },
            accept: () => {
                if (type === 'alcoholimetro') {
                    this.seguridadService.deleteAlcoholimetroRecord(id);
                    this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Registro de alcoholímetro eliminado.' });
                } else if (type === 'accidente') {
                    this.seguridadService.deleteAccidenteRecord(id);
                    this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Incidente de accidente eliminado.' });
                } else if (type === 'accidenteColaborador') {
                    this.seguridadService.deleteAccidenteColaboradorRecord(id);
                    this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Accidente de colaborador eliminado.' });
                } else {
                    this.seguridadService.deleteExtravioRecord(id);
                    this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Extravio eliminado.' });
                }
            }
        });
    }
}
