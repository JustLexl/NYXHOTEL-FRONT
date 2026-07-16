import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RegistroProveedorRecord, RegistroProveedoresService } from '../service/registro-proveedores.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-registro-proveedores',
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
                <i class="pi pi-truck text-indigo-600 text-3xl"></i>
                Registro de Proveedores
            </h1>
            <p class="text-slate-500 mt-1 text-sm font-medium">
                Control de entrada y salida de proveedores en las instalaciones del hotel.
            </p>
        </div>
        <button
            (click)="openAddDrawer()"
            class="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Registrar Proveedor
        </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <i class="pi pi-users text-indigo-600 text-xl"></i>
            </span>
            <div>
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Registrados</span>
                <span class="text-3xl font-black text-slate-800">{{ records.length }}</span>
            </div>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-4 flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <i class="pi pi-building text-amber-600 text-xl"></i>
            </span>
            <div>
                <span class="text-xs font-bold text-amber-600 uppercase tracking-wider block">En Instalaciones</span>
                <span class="text-3xl font-black text-amber-700">{{ getEnInstalacionesCount() }}</span>
            </div>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm p-4 flex items-center gap-4">
            <span class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <i class="pi pi-check-circle text-emerald-600 text-xl"></i>
            </span>
            <div>
                <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Con Salida Registrada</span>
                <span class="text-3xl font-black text-emerald-700">{{ getConSalidaCount() }}</span>
            </div>
        </div>
    </div>

    <!-- Filters Panel -->
    <div class="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-3 flex-wrap items-center justify-between">
            <div class="flex flex-col sm:flex-row gap-3 flex-wrap w-full sm:w-auto">
                <!-- Date filter -->
                <div class="relative w-full sm:w-auto">
                    <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"></i>
                    <input
                        type="date"
                        [(ngModel)]="filterFecha"
                        (ngModelChange)="applyFilters()"
                        class="w-full sm:w-44 pl-9 pr-3 py-2 border-2 border-indigo-300 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-50" />
                </div>
                <!-- Global Search -->
                <div class="relative w-full sm:w-72">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        [(ngModel)]="filterNombre"
                        (ngModelChange)="applyFilters()"
                        placeholder="Buscar por nombre de proveedor..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <!-- Compañía filter -->
                <div class="relative w-full sm:w-52">
                    <i class="pi pi-building absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        [(ngModel)]="filterCompania"
                        (ngModelChange)="applyFilters()"
                        placeholder="Filtrar por compañía..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <!-- Agente filter -->
                <div class="relative w-full sm:w-52">
                    <i class="pi pi-shield absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        [(ngModel)]="filterAgente"
                        (ngModelChange)="applyFilters()"
                        placeholder="Filtrar por agente..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <!-- Estado filter -->
                <select
                    [(ngModel)]="filterEstado"
                    (change)="applyFilters()"
                    class="border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option value="ALL">Todos los estados</option>
                    <option value="INSIDE">En instalaciones</option>
                    <option value="OUT">Con salida registrada</option>
                </select>
            </div>
            <button
                type="button"
                (click)="resetFilters()"
                class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center">
                <i class="pi pi-filter-slash"></i>
                Limpiar Filtros
            </button>
        </div>
        <div *ngIf="filteredRecords.length !== records.length" class="mt-2 text-xs text-indigo-600 font-semibold">
            Mostrando {{ filteredRecords.length }} de {{ records.length }} registros
        </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th class="py-4 px-4">Fecha y Hora Entrada</th>
                        <th class="py-4 px-4">Nombre del Proveedor</th>
                        <th class="py-4 px-4">Compañía</th>
                        <th class="py-4 px-4">N° Gafete</th>
                        <th class="py-4 px-4">Agente de Seguridad</th>
                        <th class="py-4 px-4">Destino</th>
                        <th class="py-4 px-4">Hora de Salida</th>
                        <th class="py-4 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    <tr *ngFor="let item of filteredRecords" class="hover:bg-slate-50 transition-colors duration-150">

                        <!-- Fecha y Hora Entrada -->
                        <td class="py-3 px-4">
                            <span class="font-semibold text-slate-800 block text-xs">{{ item.fechaEntrada }}</span>
                            <span class="text-slate-500 text-xs">{{ item.horaEntrada }}</span>
                        </td>

                        <!-- Nombre Proveedor -->
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-2">
                                <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black uppercase flex-shrink-0">
                                    {{ item.nombreProveedor?.charAt(0) || '?' }}
                                </span>
                                <span class="font-bold text-slate-900">{{ item.nombreProveedor }}</span>
                            </div>
                        </td>

                        <!-- Compañía -->
                        <td class="py-3 px-4 font-medium text-slate-600 text-xs">{{ item.compania }}</td>

                        <!-- N° Gafete -->
                        <td class="py-3 px-4">
                            <span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wider">
                                #{{ item.numeroGafete }}
                            </span>
                        </td>

                        <!-- Agente de Seguridad -->
                        <td class="py-3 px-4 text-xs font-medium text-slate-600">
                            <div class="flex items-center gap-1.5">
                                <i class="pi pi-shield text-indigo-400 text-[10px]"></i>
                                {{ item.agenteSeguridad }}
                            </div>
                        </td>

                        <!-- Destino -->
                        <td class="py-3 px-4 text-xs font-medium text-slate-600">
                            <div class="flex items-center gap-1.5">
                                <i class="pi pi-map-marker text-slate-400 text-[10px]"></i>
                                {{ item.destino }}
                            </div>
                        </td>

                        <!-- Hora de Salida -->
                        <td class="py-3 px-4">
                            <ng-container *ngIf="item.horaSalida; else sinSalida">
                                <span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 w-max">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {{ item.horaSalida }}
                                </span>
                                <span class="text-[10px] text-slate-400 block mt-0.5">{{ item.fechaSalida }}</span>
                            </ng-container>
                            <ng-template #sinSalida>
                                <span class="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 w-max">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                    En instalaciones
                                </span>
                            </ng-template>
                        </td>

                        <!-- Acciones -->
                        <td class="py-3 px-4">
                            <div class="flex items-center justify-center gap-2">
                                <button
                                    (click)="openEditDrawer(item)"
                                    title="Editar Registro"
                                    class="bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 p-2 rounded-lg transition-all duration-150 border border-slate-200 cursor-pointer">
                                    <i class="pi pi-pencil text-xs"></i>
                                </button>
                                <button
                                    *ngIf="!item.horaSalida"
                                    (click)="confirmarSalida(item)"
                                    [disabled]="registrandoSalida[item.id || item._id || '']"
                                    title="Registrar Salida"
                                    class="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95">
                                    <i class="pi pi-sign-out text-xs"></i>
                                    Registrar Salida
                                </button>
                                <span *ngIf="item.horaSalida"
                                    class="text-slate-400 text-xs font-semibold flex items-center gap-1">
                                    <i class="pi pi-check text-emerald-500 text-[10px]"></i>
                                    Salida
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- DRAWER: REGISTRAR PROVEEDOR -->
<p-drawer
    [(visible)]="addDrawerVisible"
    position="right"
    [style]="{ width: '460px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }"
    [modal]="true">

    <ng-template pTemplate="header">
        <div class="flex items-center gap-3 py-1">
            <span class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <i class="pi pi-plus text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    Registrar Proveedor
                </div>
                <div class="text-xs text-slate-500 font-medium">Control de Acceso — Seguridad</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">

        <!-- Fecha y Hora Entrada -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                <i class="pi pi-calendar text-indigo-500 mr-1"></i> Fecha y Hora de Entrada
            </label>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Fecha</label>
                    <input type="date" [(ngModel)]="formAdd.fechaEntrada"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Hora</label>
                    <input type="time" [(ngModel)]="formAdd.horaEntrada"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Nombre del Proveedor -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-user text-indigo-500 mr-1"></i> Nombre del Proveedor
            </label>
            <input type="text" [(ngModel)]="formAdd.nombreProveedor"
                placeholder="Nombre completo del proveedor"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Compañía -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-building text-indigo-500 mr-1"></i> Compañía / Empresa
            </label>
            <input type="text" [(ngModel)]="formAdd.compania"
                placeholder="Nombre de la empresa o compañía"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Número de Gafete -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-id-card text-indigo-500 mr-1"></i> Número de Gafete
            </label>
            <input type="text" [(ngModel)]="formAdd.numeroGafete"
                placeholder="Ej. G-001, 4523..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Destino -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-map-marker text-indigo-500 mr-1"></i> Destino dentro del Hotel
            </label>
            <input type="text" [(ngModel)]="formAdd.destino"
                placeholder="Ej. Mantenimiento, Cocina, Gerencia..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Agente de Seguridad -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-shield text-indigo-500 mr-1"></i> Agente de Seguridad
            </label>
            <input type="text" [(ngModel)]="formAdd.agenteSeguridad"
                [placeholder]="loggedUserPlaceholder || 'Nombre del agente que registra'"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Buttons -->
        <div class="mt-2 flex gap-2">
            <button (click)="addDrawerVisible = false"
                class="w-1/3 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button (click)="submitAdd()"
                [disabled]="submitting"
                class="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                <i class="pi pi-save"></i>
                Guardar Registro
            </button>
        </div>

    </div>
</p-drawer>

<!-- DRAWER: EDITAR PROVEEDOR -->
<p-drawer
    [(visible)]="editDrawerVisible"
    position="right"
    [style]="{ width: '460px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }"
    [modal]="true">

    <ng-template pTemplate="header">
        <div class="flex items-center gap-3 py-1">
            <span class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <i class="pi pi-pencil text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    Editar Proveedor
                </div>
                <div class="text-xs text-slate-500 font-medium">Modificar Registro — Seguridad</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">

        <!-- Fecha y Hora Entrada -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                <i class="pi pi-calendar text-indigo-500 mr-1"></i> Fecha y Hora de Entrada
            </label>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Fecha</label>
                    <input type="date" [(ngModel)]="formEdit.fechaEntrada"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Hora</label>
                    <input type="time" [(ngModel)]="formEdit.horaEntrada"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Nombre del Proveedor -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-user text-indigo-500 mr-1"></i> Nombre del Proveedor
            </label>
            <input type="text" [(ngModel)]="formEdit.nombreProveedor"
                placeholder="Nombre completo del proveedor"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Compañía -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-building text-indigo-500 mr-1"></i> Compañía / Empresa
            </label>
            <input type="text" [(ngModel)]="formEdit.compania"
                placeholder="Nombre de la empresa o compañía"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Número de Gafete -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-id-card text-indigo-500 mr-1"></i> Número de Gafete
            </label>
            <input type="text" [(ngModel)]="formEdit.numeroGafete"
                placeholder="Ej. G-001, 4523..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Destino -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-map-marker text-indigo-500 mr-1"></i> Destino dentro del Hotel
            </label>
            <input type="text" [(ngModel)]="formEdit.destino"
                placeholder="Ej. Mantenimiento, Cocina, Gerencia..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Agente de Seguridad -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                <i class="pi pi-shield text-indigo-500 mr-1"></i> Agente de Seguridad
            </label>
            <input type="text" [(ngModel)]="formEdit.agenteSeguridad"
                placeholder="Nombre del agente de seguridad"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        <!-- Hora y Fecha de Salida (Solo si ya tiene salida) -->
        <div *ngIf="formEdit.horaSalida">
            <div class="border-t border-slate-200 my-2"></div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                <i class="pi pi-sign-out text-indigo-500 mr-1"></i> Fecha y Hora de Salida
            </label>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Fecha de Salida</label>
                    <input type="date" [(ngModel)]="formEdit.fechaSalida"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
                <div>
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Hora de Salida</label>
                    <input type="time" [(ngModel)]="formEdit.horaSalida"
                        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-700" />
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="mt-2 flex gap-2">
            <button (click)="editDrawerVisible = false"
                class="w-1/3 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button (click)="submitEdit()"
                [disabled]="submitting"
                class="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                <i class="pi pi-check"></i>
                Guardar Cambios
            </button>
        </div>

    </div>
</p-drawer>

<!-- MODAL: CONFIRMAR SALIDA -->
<div *ngIf="salidaModalVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-emerald-50 flex items-center gap-3">
            <span class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <i class="pi pi-sign-out text-emerald-600 text-xl"></i>
            </span>
            <div>
                <h3 class="font-extrabold text-slate-800 text-base">Confirmar Registro de Salida</h3>
                <p class="text-slate-500 text-xs">Esta acción no se puede deshacer ni modificar.</p>
            </div>
        </div>
        <div class="p-6" *ngIf="selectedRecord">
            <div class="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Proveedor:</span>
                    <span class="font-bold text-slate-800">{{ selectedRecord.nombreProveedor }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Compañía:</span>
                    <span class="font-semibold text-slate-700">{{ selectedRecord.compania }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Gafete:</span>
                    <span class="font-semibold text-slate-700">#{{ selectedRecord.numeroGafete }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Hora de entrada:</span>
                    <span class="font-semibold text-slate-700">{{ selectedRecord.horaEntrada }}</span>
                </div>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center mb-5">
                <p class="text-xs text-emerald-700 font-semibold">Se registrará la hora de salida automáticamente como:</p>
                <p class="text-2xl font-black text-emerald-800 mt-1">{{ currentTime }}</p>
                <p class="text-xs text-emerald-600">{{ currentDate }}</p>
            </div>
            <div class="flex gap-3">
                <button (click)="salidaModalVisible = false; selectedRecord = null"
                    class="w-1/2 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                    Cancelar
                </button>
                <button (click)="ejecutarSalida()"
                    [disabled]="submitting"
                    class="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                    <i class="pi pi-check"></i>
                    Confirmar Salida
                </button>
            </div>
        </div>
    </div>
</div>
`,
    styles: [`:host { display: block; }`]
})
export class RegistroProveedoresComponent implements OnInit {
    records: RegistroProveedorRecord[] = [];
    filteredRecords: RegistroProveedorRecord[] = [];

    // Filters
    filterNombre = '';
    filterCompania = '';
    filterAgente = '';
    filterEstado = 'ALL';
    filterFecha = '';  // YYYY-MM-DD, defaults to today on ngOnInit

    // UI state
    addDrawerVisible = false;
    editDrawerVisible = false;
    salidaModalVisible = false;
    submitting = false;
    registrandoSalida: { [key: string]: boolean } = {};

    // Selected for salida/edit
    selectedRecord: RegistroProveedorRecord | null = null;
    editingRecordId = '';
    currentTime = '';
    currentDate = '';

    loggedUserPlaceholder = '';

    formAdd = {
        fechaEntrada: '',
        horaEntrada: '',
        nombreProveedor: '',
        compania: '',
        numeroGafete: '',
        agenteSeguridad: '',
        destino: ''
    };

    formEdit = {
        fechaEntrada: '',
        horaEntrada: '',
        nombreProveedor: '',
        compania: '',
        numeroGafete: '',
        agenteSeguridad: '',
        destino: '',
        horaSalida: '',
        fechaSalida: ''
    };

    constructor(
        private rpService: RegistroProveedoresService,
        private authService: AuthService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const profile = this.authService.userProfile();
        this.loggedUserPlaceholder = profile
            ? profile.name || profile.email?.split('@')?.[0] || ''
            : '';

        this.rpService.getRecords().subscribe({
            next: (data) => {
                this.records = data;
                this.applyFilters();
            }
        });

        // Default date filter = today
        this.filterFecha = new Date().toISOString().split('T')[0];

        this.resetForm();
    }

    // ── Stats ──────────────────────────────────────
    getEnInstalacionesCount(): number {
        return this.records.filter(r => !r.horaSalida).length;
    }

    getConSalidaCount(): number {
        return this.records.filter(r => !!r.horaSalida).length;
    }

    // ── Filters ────────────────────────────────────
    applyFilters() {
        const nombre = this.filterNombre.toLowerCase().trim();
        const compania = this.filterCompania.toLowerCase().trim();
        const agente = this.filterAgente.toLowerCase().trim();

        this.filteredRecords = this.records.filter(r => {
            const matchNombre = !nombre || r.nombreProveedor.toLowerCase().includes(nombre);
            const matchCompania = !compania || r.compania.toLowerCase().includes(compania);
            const matchAgente = !agente || r.agenteSeguridad.toLowerCase().includes(agente);
            const matchEstado =
                this.filterEstado === 'ALL' ||
                (this.filterEstado === 'INSIDE' && !r.horaSalida) ||
                (this.filterEstado === 'OUT' && !!r.horaSalida);
            const matchFecha = !this.filterFecha || r.fechaEntrada === this.filterFecha;

            return matchNombre && matchCompania && matchAgente && matchEstado && matchFecha;
        });
        this.cdr.detectChanges();
    }

    resetFilters() {
        this.filterNombre = '';
        this.filterCompania = '';
        this.filterAgente = '';
        this.filterEstado = 'ALL';
        this.filterFecha = new Date().toISOString().split('T')[0]; // Reset to today
        this.applyFilters();
    }

    // ── Drawer ─────────────────────────────────────
    openAddDrawer() {
        this.resetForm();
        this.addDrawerVisible = true;
    }

    resetForm() {
        const now = new Date();
        const localDate = now.toISOString().split('T')[0];
        const localTime = now.toTimeString().split(' ')[0].substring(0, 5);

        this.formAdd = {
            fechaEntrada: localDate,
            horaEntrada: localTime,
            nombreProveedor: '',
            compania: '',
            numeroGafete: '',
            agenteSeguridad: '', // Dejamos vacío para que se use el placeholder
            destino: ''
        };
    }

    submitAdd() {
        const { nombreProveedor, compania, numeroGafete, destino } = this.formAdd;
        let agenteSeguridad = this.formAdd.agenteSeguridad.trim();

        // Si el input está vacío, tomamos el placeholder del usuario logueado
        if (!agenteSeguridad) {
            agenteSeguridad = this.loggedUserPlaceholder;
        }

        if (!nombreProveedor || !compania || !numeroGafete || !agenteSeguridad || !destino) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Por favor completa todos los campos antes de guardar.'
            });
            return;
        }

        this.submitting = true;
        this.rpService.create({ 
            ...this.formAdd, 
            agenteSeguridad,
            entradaRegistrada: true 
        } as any).subscribe({
            next: () => {
                this.submitting = false;
                this.addDrawerVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Proveedor Registrado',
                    detail: `${nombreProveedor} fue registrado correctamente.`
                });
            },
            error: () => {
                this.submitting = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo guardar el registro. Intenta de nuevo.'
                });
            }
        });
    }

    // ── Edit Drawer ────────────────────────────────
    openEditDrawer(record: RegistroProveedorRecord) {
        this.editingRecordId = record.id || record._id || '';
        this.formEdit = {
            fechaEntrada: record.fechaEntrada || '',
            horaEntrada: record.horaEntrada || '',
            nombreProveedor: record.nombreProveedor || '',
            compania: record.compania || '',
            numeroGafete: record.numeroGafete || '',
            agenteSeguridad: record.agenteSeguridad || '',
            destino: record.destino || '',
            horaSalida: record.horaSalida || '',
            fechaSalida: record.fechaSalida || ''
        };
        this.editDrawerVisible = true;
    }

    submitEdit() {
        const { nombreProveedor, compania, numeroGafete, agenteSeguridad, destino } = this.formEdit;

        if (!nombreProveedor || !compania || !numeroGafete || !agenteSeguridad || !destino) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Por favor completa todos los campos requeridos.'
            });
            return;
        }

        this.submitting = true;
        this.rpService.update(this.editingRecordId, this.formEdit).subscribe({
            next: () => {
                this.submitting = false;
                this.editDrawerVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registro Actualizado',
                    detail: 'El registro se actualizó correctamente.'
                });
            },
            error: () => {
                this.submitting = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el registro.'
                });
            }
        });
    }

    // ── Salida ─────────────────────────────────────
    confirmarSalida(record: RegistroProveedorRecord) {
        const now = new Date();
        this.currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        this.currentDate = now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        this.selectedRecord = record;
        this.salidaModalVisible = true;
    }

    ejecutarSalida() {
        if (!this.selectedRecord) return;
        const id = this.selectedRecord.id || this.selectedRecord._id || '';
        if (!id) return;

        this.submitting = true;
        this.registrandoSalida[id] = true;

        this.rpService.registrarSalida(id).subscribe({
            next: () => {
                this.submitting = false;
                this.registrandoSalida[id] = false;
                this.salidaModalVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Salida Registrada',
                    detail: `Salida de ${this.selectedRecord?.nombreProveedor} registrada a las ${this.currentTime}.`
                });
                this.selectedRecord = null;
            },
            error: () => {
                this.submitting = false;
                this.registrandoSalida[id] = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo registrar la salida. Intenta de nuevo.'
                });
            }
        });
    }
}
