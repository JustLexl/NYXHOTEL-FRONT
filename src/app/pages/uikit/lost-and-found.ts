import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LostAndFoundRecord, LostAndFoundService } from '../service/lost-and-found.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-lost-and-found',
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
                <i class="pi pi-briefcase text-teal-600 text-3xl"></i>
                Lost and Found
            </h1>
            <p class="text-slate-500 mt-1 text-sm font-medium">
                Registro y control de objetos olvidados, encontrados y entregados a huéspedes.
            </p>
        </div>
        <button
            (click)="openAddDrawer()"
            class="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Registrar Objeto Olvidado
        </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registrados</span>
            <span class="text-3xl font-black text-slate-800">{{ records.length }}</span>
        </div>
        <div class="bg-orange-50 rounded-xl border border-orange-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-orange-600 uppercase tracking-wider">De Valor</span>
            <span class="text-3xl font-black text-orange-700">{{ getDeValorCount() }}</span>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Entregados</span>
            <span class="text-3xl font-black text-emerald-700">{{ getEntregadosCount() }}</span>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-200 shadow-sm p-4 flex flex-col gap-1">
            <span class="text-xs font-bold text-red-500 uppercase tracking-wider">En Resguardo</span>
            <span class="text-3xl font-black text-red-700">{{ getPendientesCount() }}</span>
        </div>
    </div>

    <!-- Filters Panel -->
    <div class="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div class="relative w-full sm:w-80">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="applyFilters()"
                    placeholder="Buscar por objeto, persona o área..."
                    class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <select
                [(ngModel)]="filterValor"
                (change)="applyFilters()"
                class="border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="ALL">Todos los tipos</option>
                <option value="VALOR">De Valor</option>
                <option value="NOVALOR">Sin Valor Comercial</option>
            </select>
            <select
                [(ngModel)]="filterEstado"
                (change)="applyFilters()"
                class="border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="ALL">Todos los estados</option>
                <option value="RESGUARDO">En Resguardo</option>
                <option value="ENTREGADO">Entregados</option>
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

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th class="py-4 px-6">Fecha Hallazgo</th>
                        <th class="py-4 px-6">Descripción</th>
                        <th class="py-4 px-6">¿Dónde se encontró?</th>
                        <th class="py-4 px-6">Tipo</th>
                        <th class="py-4 px-6">Estado</th>
                        <th class="py-4 px-6">Quién Entrega</th>
                        <th class="py-4 px-6 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    <tr *ngFor="let item of filteredRecords" class="hover:bg-slate-50 transition-colors duration-150">
                        <td class="py-4 px-6 font-semibold">{{ item.fechaEncontrado }} {{ item.horaEncontrado }}</td>
                        <td class="py-4 px-6">
                            <span class="font-bold text-slate-900 block">{{ item.descripcionEncontrado }}</span>
                        </td>
                        <td class="py-4 px-6 font-medium text-slate-600">{{ item.seEncontroEn }}</td>
                        <td class="py-4 px-6">
                            <span [class]="item.esDeValor ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'"
                                  class="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase">
                                {{ item.esDeValor ? 'De Valor' : 'No Valor' }}
                            </span>
                        </td>
                        <td class="py-4 px-6">
                            <span [class]="item.entregado ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
                                  class="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase flex items-center gap-1 w-max">
                                <span class="w-1.5 h-1.5 rounded-full" [class]="item.entregado ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                {{ item.entregado ? 'Entregado' : 'En Resguardo' }}
                            </span>
                        </td>
                        <td class="py-4 px-6 text-xs">
                            <span class="font-bold text-slate-800">{{ item.nombreEntrega }}</span>
                            <span class="text-slate-400 block">{{ item.departamento }}</span>
                        </td>
                        <td class="py-4 px-6 text-right flex justify-end gap-2">
                            <button
                                (click)="openFormatView(item)"
                                title="Visualizar Formato"
                                class="bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600 p-2 rounded-lg transition-all duration-150 border border-slate-200 cursor-pointer">
                                <i class="pi pi-file-pdf text-base"></i>
                            </button>
                            <button
                                *ngIf="!item.entregado"
                                (click)="openDeliveryDrawer(item)"
                                title="Entregar a Huésped"
                                class="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1">
                                <i class="pi pi-check-circle"></i>
                                Entregar
                            </button>
                            <button
                                (click)="deleteRecord(item)"
                                title="Eliminar Registro"
                                class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all duration-150 border border-red-100 cursor-pointer">
                                <i class="pi pi-trash text-base"></i>
                            </button>
                        </td>
                    </tr>
                    <tr *ngIf="filteredRecords.length === 0">
                        <td colspan="7" class="py-8 px-6 text-center text-slate-400 font-medium">
                            No se encontraron objetos registrados.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- DRAWER: REGISTRAR OBJETO ENCONTRADO (PARTE 1) -->
<p-drawer
    [(visible)]="addDrawerVisible"
    position="right"
    [style]="{ width: '450px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }"
    [modal]="true">
    
    <ng-template pTemplate="header">
        <div class="flex items-center gap-3 py-1">
            <span class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <i class="pi pi-plus text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    Registrar Objeto Olvidado
                </div>
                <div class="text-xs text-slate-500 font-medium">Lost and Found - Recepción</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1">
        <!-- Es de Valor -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Clasificación del Objeto</label>
            <div class="grid grid-cols-2 gap-2">
                <button type="button" (click)="formAdd.esDeValor = true"
                    [class]="formAdd.esDeValor
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                        : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-star-fill"></i>
                    De Valor
                </button>
                <button type="button" (click)="formAdd.esDeValor = false"
                    [class]="!formAdd.esDeValor
                        ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'"
                    class="flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-bold transition-all duration-150 cursor-pointer">
                    <i class="pi pi-box"></i>
                    No Valor
                </button>
            </div>
        </div>

        <div class="border-t border-slate-200"></div>

        <!-- Fecha y Hora -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Fecha Encontrado
                </label>
                <input type="date" [(ngModel)]="formAdd.fechaEncontrado"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hora Encontrado
                </label>
                <input type="time" [(ngModel)]="formAdd.horaEncontrado"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
        </div>

        <!-- Se encontró en -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Lugar o Área del Hallazgo</label>
            <input type="text" [(ngModel)]="formAdd.seEncontroEn"
                placeholder="Ej. Habitación 302, Alberca, Lobby..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
        </div>

        <!-- Descripción del Objeto -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Descripción de objetos encontrados</label>
            <textarea [(ngModel)]="formAdd.descripcionEncontrado"
                placeholder="Describa el objeto detalladamente (color, marca, estado)..."
                rows="3"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"></textarea>
        </div>

        <!-- Quién Entrega y Departamento -->
        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col justify-end">
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 min-h-[32px] flex items-end">Nombre de quien entrega</label>
                <input type="text" [(ngModel)]="formAdd.nombreEntrega"
                    placeholder="Nombre completo"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <div class="flex flex-col justify-end">
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 min-h-[32px] flex items-end">Departamento de quien entrega</label>
                <input type="text" [(ngModel)]="formAdd.departamento"
                    placeholder="Ej. Ama de llaves, Mantenimiento..."
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
        </div>

        <!-- Seguridad -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Agente de Seguridad</label>
            <input type="text" [(ngModel)]="formAdd.agenteSeguridad"
                [placeholder]="loggedUserPlaceholder || 'Nombre del guardia que llena el registro'"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
        </div>

        <!-- Submit -->
        <div class="mt-4 flex gap-2">
            <button (click)="addDrawerVisible = false"
                class="w-1/3 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button (click)="submitAdd()"
                class="w-2/3 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer">
                Guardar Registro
            </button>
        </div>

    </div>
</p-drawer>

<!-- DRAWER: REGISTRAR ENTREGA/RECLAMO (PARTE 2) -->
<p-drawer
    [(visible)]="deliveryDrawerVisible"
    position="right"
    [style]="{ width: '450px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }"
    [modal]="true">
    
    <ng-template pTemplate="header">
        <div class="flex items-center gap-3 py-1">
            <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i class="pi pi-check-circle text-base"></i>
            </span>
            <div>
                <div class="font-extrabold text-slate-800 text-base leading-tight">
                    Entrega de Objeto Olvidado
                </div>
                <div class="text-xs text-slate-500 font-medium">Reclamación de Objeto</div>
            </div>
        </div>
    </ng-template>

    <div class="flex flex-col gap-5 p-1" *ngIf="selectedRecord">
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <span class="font-bold block mb-1">Objeto a Entregar:</span>
            {{ selectedRecord.descripcionEncontrado }}
        </div>

        <!-- Nombre del Huésped -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nombre / Name (Huésped)</label>
            <input type="text" [(ngModel)]="formDelivery.nombreReclama"
                placeholder="Nombre del huésped que reclama"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>

        <!-- Habitación, Fecha y Hora -->
        <div class="grid grid-cols-3 gap-2">
            <div class="col-span-1">
                <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Habitación / Room</label>
                <input type="text" [(ngModel)]="formDelivery.habitacionReclama"
                    placeholder="Ej. 204"
                    class="w-full border border-slate-300 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <div class="col-span-1">
                <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Fecha / Date</label>
                <input type="date" [(ngModel)]="formDelivery.fechaReclama"
                    class="w-full border border-slate-300 rounded-lg px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
            <div class="col-span-1">
                <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Hora / Time</label>
                <input type="time" [(ngModel)]="formDelivery.horaReclama"
                    class="w-full border border-slate-300 rounded-lg px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold text-slate-700" />
            </div>
        </div>

        <!-- Descripción Reclama -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Descripción de objetos entregados / Reclaimed</label>
            <textarea [(ngModel)]="formDelivery.descripcionReclama"
                placeholder="Confirmación de lo que se le entrega..."
                rows="2"
                class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
        </div>

        <!-- Firma del Huésped -->
        <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Firma del huésped / Guest Signature</label>
            <div class="border border-slate-300 rounded-lg overflow-hidden bg-white" style="touch-action: none;">
                <canvas #sigCanvasDelivery
                    class="w-full block"
                    style="height: 130px; cursor: crosshair;"
                    (mousedown)="onMouseDown($event)"
                    (mousemove)="onMouseMove($event)"
                    (mouseup)="onMouseUp()"
                    (mouseleave)="onMouseUp()"
                    (touchstart)="onTouchStart($event)"
                    (touchmove)="onTouchMove($event)"
                    (touchend)="onMouseUp()">
                </canvas>
            </div>
            <button type="button" (click)="clearSignature()"
                class="mt-1 text-xs text-slate-500 hover:text-red-500 underline cursor-pointer transition-colors">
                Limpiar firma
            </button>
        </div>

        <!-- Submit -->
        <div class="mt-4 flex gap-2">
            <button (click)="deliveryDrawerVisible = false"
                class="w-1/3 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                Cancelar
            </button>
            <button (click)="submitDelivery()"
                class="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer">
                Registrar Entrega
            </button>
        </div>
    </div>
</p-drawer>

<!-- MODAL: VISUALIZAR FORMATO COMPLETO (ESTILO PAPEL IMPRESO) -->
<div *ngIf="formatViewVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 shadow-2xl flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl no-print">
            <div class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-teal-600 text-xl"></i>
                <span class="font-extrabold text-slate-800 text-base">Formato de Objeto Olvidado / Reclamado</span>
            </div>
            <div class="flex gap-2">
                <button
                    (click)="printFormat()"
                    class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition-all duration-150 flex items-center gap-1.5 cursor-pointer">
                    <i class="pi pi-print"></i> Imprimir / PDF
                </button>
                <button
                    (click)="formatViewVisible = false"
                    class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer">
                    Cerrar
                </button>
            </div>
        </div>

        <!-- Paper Body (La sección imprimible) -->
        <div class="p-8 bg-white flex flex-col print-section" id="print-area">
            
            <!-- PARTE 1: RECEPCIÓN -->
            <div class="border-2 border-slate-900 p-4 relative mb-4">
                <!-- Header del formato -->
                <div class="grid grid-cols-3 border-b-2 border-slate-900 pb-2 mb-3 items-center">
                    <div class="col-span-2">
                        <h2 class="text-lg font-black text-slate-900 uppercase tracking-wide">SEGURIDAD</h2>
                        <h3 class="text-sm font-extrabold text-slate-700 uppercase">RECEPCIÓN DE OBJETOS OLVIDADOS</h3>
                    </div>
                    <div class="col-span-1 text-right flex justify-end">
                        <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="NYX Hotel Logo" class="h-10 object-contain" />
                    </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 border border-slate-950 text-xs">
                    <div class="border-r border-b border-slate-950 p-2">
                        <span class="font-bold text-slate-500 uppercase block text-[9px]">Nombre de quien entrega:</span>
                        <span class="font-bold text-slate-800">{{ viewRecord?.nombreEntrega }}</span>
                    </div>
                    <div class="border-b border-slate-950 p-2">
                        <span class="font-bold text-slate-500 uppercase block text-[9px]">Departamento de quien entrega:</span>
                        <span class="font-bold text-slate-800">{{ viewRecord?.departamento }}</span>
                    </div>
                    <div class="border-r border-slate-950 p-2">
                        <div class="grid grid-cols-3 gap-2">
                            <div class="col-span-1">
                                <span class="font-bold text-slate-500 uppercase block text-[9px]">Se encontró en:</span>
                                <span class="font-bold text-slate-800">{{ viewRecord?.seEncontroEn }}</span>
                            </div>
                            <div class="col-span-1">
                                <span class="font-bold text-slate-500 uppercase block text-[9px]">Fecha:</span>
                                <span class="font-bold text-slate-800">{{ viewRecord?.fechaEncontrado }}</span>
                            </div>
                            <div class="col-span-1">
                                <span class="font-bold text-slate-500 uppercase block text-[9px]">Hora:</span>
                                <span class="font-bold text-slate-800">{{ viewRecord?.horaEncontrado }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-2">
                        <span class="font-bold text-slate-500 uppercase block text-[9px]">Clasificación:</span>
                        <span class="font-bold text-slate-800 uppercase">{{ viewRecord?.esDeValor ? 'De Valor' : 'No de Valor' }}</span>
                    </div>
                </div>

                <!-- Descripción de objetos -->
                <div class="border border-slate-950 mt-3 text-xs">
                    <div class="bg-slate-100 border-b border-slate-950 px-2 py-1 font-extrabold uppercase text-[10px] text-center tracking-wider text-slate-700">
                        Descripción de objetos encontrados
                    </div>
                    <div class="p-3 min-h-[60px] font-medium text-slate-800 whitespace-pre-line">
                        {{ viewRecord?.descripcionEncontrado }}
                    </div>
                </div>

                <!-- Nombres de Parte 1 -->
                <div class="grid grid-cols-1 border border-slate-950 mt-4 text-xs">
                    <div class="p-2 text-center flex flex-col justify-between min-h-[50px] items-center">
                        <div class="font-bold text-slate-800 text-sm">
                            {{ viewRecord?.agenteSeguridad }}
                        </div>
                        <span class="border-t border-slate-400 pt-1 uppercase text-[9px] font-bold block w-64">
                            Nombre / agente de seguridad
                        </span>
                    </div>
                </div>
            </div>

            <!-- LÍNEA PUNTEADA DE SEPARACIÓN -->
            <div class="border-t-2 border-dashed border-slate-500 my-6 relative flex justify-center">
                <span class="absolute -top-3 bg-white px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Corte Aquí / Cut Here
                </span>
            </div>

            <!-- PARTE 2: ENTREGA / RECLAMO -->
            <div class="border-2 border-slate-900 p-4 relative">
                <!-- Header del formato de entrega -->
                <div class="grid grid-cols-3 border-b-2 border-slate-900 pb-2 mb-3 items-center">
                    <div class="col-span-2">
                        <h2 class="text-lg font-black text-slate-900 uppercase tracking-wide">SEGURIDAD</h2>
                        <h3 class="text-xs font-extrabold text-slate-700 uppercase">
                            ENTREGA DE OBJETOS OLVIDADOS / LOST AND FOUND RECLAIMED
                        </h3>
                    </div>
                    <div class="col-span-1 text-right flex justify-end">
                        <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="NYX Hotel Logo" class="h-10 object-contain" />
                    </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 border border-slate-950 text-xs">
                    <div class="border-r border-b border-slate-950 p-2 col-span-2">
                        <span class="font-bold text-slate-500 uppercase block text-[9px]">Nombre / Name:</span>
                        <span class="font-bold text-slate-800">{{ viewRecord?.nombreReclama || '—' }}</span>
                    </div>
                    <div class="p-2 border-r border-slate-950 col-span-1">
                        <span class="font-bold text-slate-500 uppercase block text-[9px]">Habitación / Room:</span>
                        <span class="font-bold text-slate-800">{{ viewRecord?.habitacionReclama || '—' }}</span>
                    </div>
                    <div class="p-2 col-span-1">
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="font-bold text-slate-500 uppercase block text-[9px]">Fecha / Date:</span>
                                <span class="font-bold text-slate-800">{{ viewRecord?.fechaReclama || '—' }}</span>
                            </div>
                            <div>
                                <span class="font-bold text-slate-500 uppercase block text-[9px]">Hora / Time:</span>
                                <span class="font-bold text-slate-800">{{ viewRecord?.horaReclama || '—' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Descripción de objetos entregados -->
                <div class="border border-slate-950 mt-3 text-xs">
                    <div class="bg-slate-100 border-b border-slate-950 px-2 py-1 font-extrabold uppercase text-[10px] text-center tracking-wider text-slate-700">
                        Descripción de objetos entregados / Lost & Found Reclaimed
                    </div>
                    <div class="p-3 min-h-[60px] font-medium text-slate-800 whitespace-pre-line">
                        {{ viewRecord?.descripcionReclama || '—' }}
                    </div>
                </div>

                <!-- Firma y Nombre de Parte 2 -->
                <div class="border border-slate-950 mt-4 text-xs">
                    <div class="p-4 text-center flex flex-col justify-end min-h-[140px] items-center">
                        <!-- Signature Image (arriba del nombre) -->
                        <div class="flex items-end justify-center h-20 w-full mb-1">
                            <img *ngIf="viewRecord?.firmaReclama" [src]="viewRecord?.firmaReclama" alt="Firma" class="max-h-20 max-w-xs object-contain" />
                            <span *ngIf="!viewRecord?.firmaReclama" class="text-slate-400 italic self-center">No entregado / No firmado</span>
                        </div>
                        <!-- Line, Name, and Label -->
                        <div class="border-t border-slate-950 pt-1 w-72">
                            <div class="font-extrabold text-slate-900 text-sm">
                                {{ viewRecord?.nombreReclama || '—' }}
                            </div>
                            <span class="uppercase text-[8px] font-black block text-slate-500 mt-0.5">
                                Nombre y Firma del Huésped / Guest Name & Signature
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`,
    styles: [`
        :host { display: block; }
        @media print {
            body * {
                visibility: hidden;
            }
            #print-area, #print-area * {
                visibility: visible;
            }
            #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 10px;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
            }
            .no-print {
                display: none !important;
            }
            .fixed.inset-0 {
                position: absolute !important;
                background: transparent !important;
                backdrop-filter: none !important;
                padding: 0 !important;
                overflow: visible !important;
                display: block !important;
            }
            .fixed.inset-0 > div {
                border: none !important;
                box-shadow: none !important;
                max-height: none !important;
                overflow: visible !important;
                background: transparent !important;
            }
        }
    `]
})
export class LostAndFoundComponent implements OnInit {
    records: LostAndFoundRecord[] = [];
    filteredRecords: LostAndFoundRecord[] = [];

    // Filters
    searchQuery = '';
    filterValor = 'ALL';
    filterEstado = 'ALL';

    // Modals & Drawers Visibility
    addDrawerVisible = false;
    deliveryDrawerVisible = false;
    formatViewVisible = false;

    // Selected record for details or delivery
    selectedRecord: LostAndFoundRecord | null = null;
    viewRecord: LostAndFoundRecord | null = null;

    // Forms objects
    formAdd = {
        nombreEntrega: '',
        departamento: '',
        seEncontroEn: '',
        fechaEncontrado: '',
        horaEncontrado: '',
        descripcionEncontrado: '',
        esDeValor: false,
        agenteSeguridad: ''
    };

    formDelivery = {
        nombreReclama: '',
        habitacionReclama: '',
        fechaReclama: '',
        horaReclama: '',
        descripcionReclama: '',
        firmaReclama: ''
    };

    // Logged user name for placeholder
    loggedUserPlaceholder = '';

    // Canvas Signature State (delivery only)
    private canvasEl!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D | null;
    private drawing = false;

    @ViewChild('sigCanvasDelivery') set sigCanvasDelivery(ref: ElementRef<HTMLCanvasElement>) {
        if (ref) {
            this.canvasEl = ref.nativeElement;
            this.ctx = this.canvasEl.getContext('2d');
            this.canvasEl.width = this.canvasEl.clientWidth || 400;
            this.canvasEl.height = this.canvasEl.clientHeight || 130;
            if (this.ctx) {
                this.ctx.strokeStyle = '#0f172a';
                this.ctx.lineWidth = 2.5;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
            }
        }
    }

    constructor(
        private lfService: LostAndFoundService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // Load logged user name as placeholder
        const profile = this.authService.userProfile();
        this.loggedUserPlaceholder = profile ? (profile.name || profile.email?.split('@')?.[0] || '') : '';

        this.lfService.getRecords().subscribe({
            next: (data) => {
                this.records = data;
                this.applyFilters();
            }
        });
        this.resetAddForm();
    }

    // Stats calculations
    getDeValorCount(): number {
        return this.records.filter(r => r.esDeValor).length;
    }

    getEntregadosCount(): number {
        return this.records.filter(r => r.entregado).length;
    }

    getPendientesCount(): number {
        return this.records.filter(r => !r.entregado).length;
    }

    // Filters application
    applyFilters() {
        const query = this.searchQuery.toLowerCase().trim();
        this.filteredRecords = this.records.filter(r => {
            // Search text filter
            const matchesText = !query || 
                r.descripcionEncontrado.toLowerCase().includes(query) ||
                r.seEncontroEn.toLowerCase().includes(query) ||
                r.nombreEntrega.toLowerCase().includes(query) ||
                (r.nombreReclama && r.nombreReclama.toLowerCase().includes(query));
            
            // Value type filter
            const matchesValor = this.filterValor === 'ALL' ||
                (this.filterValor === 'VALOR' && r.esDeValor) ||
                (this.filterValor === 'NOVALOR' && !r.esDeValor);

            // Estado filter
            const matchesEstado = this.filterEstado === 'ALL' ||
                (this.filterEstado === 'RESGUARDO' && !r.entregado) ||
                (this.filterEstado === 'ENTREGADO' && r.entregado);

            return matchesText && matchesValor && matchesEstado;
        });
        this.cdr.detectChanges();
    }

    resetFilters() {
        this.searchQuery = '';
        this.filterValor = 'ALL';
        this.filterEstado = 'ALL';
        this.applyFilters();
    }

    // Drawer management
    openAddDrawer() {
        this.resetAddForm();
        this.addDrawerVisible = true;
    }

    openDeliveryDrawer(record: LostAndFoundRecord) {
        this.selectedRecord = record;
        this.resetDeliveryForm();
        this.deliveryDrawerVisible = true;
    }

    openFormatView(record: LostAndFoundRecord) {
        this.viewRecord = record;
        this.formatViewVisible = true;
    }

    printFormat() {
        window.print();
    }

    // Form resets
    resetAddForm() {
        const now = new Date();
        const localDate = now.toISOString().split('T')[0];
        const localTime = now.toTimeString().split(' ')[0].substring(0, 5);

        this.formAdd = {
            nombreEntrega: '',
            departamento: '',
            seEncontroEn: '',
            fechaEncontrado: localDate,
            horaEncontrado: localTime,
            descripcionEncontrado: '',
            esDeValor: false,
            agenteSeguridad: ''  // vacío — el usuario verá el placeholder con su nombre
        };
    }

    resetDeliveryForm() {
        const now = new Date();
        const localDate = now.toISOString().split('T')[0];
        const localTime = now.toTimeString().split(' ')[0].substring(0, 5);

        this.formDelivery = {
            nombreReclama: '',
            habitacionReclama: '',
            fechaReclama: localDate,
            horaReclama: localTime,
            descripcionReclama: 'SE HACE ENTREGA DEL OBJETO REGISTRADO EN EXCELENTES CONDICIONES A SU PROPIETARIO.',
            firmaReclama: ''
        };

        // Clear canvas if already rendered
        if (this.canvasEl && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        }
    }

    // ── Signature Drawing ──
    onMouseDown(event: MouseEvent) {
        if (!this.ctx) return;
        this.drawing = true;
        const rect = this.canvasEl.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    }

    onMouseMove(event: MouseEvent) {
        if (!this.drawing || !this.ctx) return;
        const rect = this.canvasEl.getBoundingClientRect();
        this.ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        this.ctx.stroke();
    }

    onMouseUp() { this.drawing = false; }

    onTouchStart(event: TouchEvent) {
        if (!this.ctx || event.touches.length === 0) return;
        this.drawing = true;
        const rect = this.canvasEl.getBoundingClientRect();
        const t = event.touches[0];
        this.ctx.beginPath();
        this.ctx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
        event.preventDefault();
    }

    onTouchMove(event: TouchEvent) {
        if (!this.drawing || !this.ctx || event.touches.length === 0) return;
        const rect = this.canvasEl.getBoundingClientRect();
        const t = event.touches[0];
        this.ctx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
        this.ctx.stroke();
        event.preventDefault();
    }

    clearSignature() {
        if (this.canvasEl && this.ctx)
            this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    getSignatureDataUrl(): string {
        if (!this.canvasEl) return '';
        const blank = document.createElement('canvas');
        blank.width = this.canvasEl.width;
        blank.height = this.canvasEl.height;
        return this.canvasEl.toDataURL() === blank.toDataURL() ? '' : this.canvasEl.toDataURL('image/png');
    }

    // Database Actions
    submitAdd() {
        if (!this.formAdd.nombreEntrega || !this.formAdd.seEncontroEn || !this.formAdd.descripcionEncontrado || !this.formAdd.agenteSeguridad) {
            this.messageService.add({ severity: 'error', summary: 'Campos requeridos', detail: 'Por favor llene el nombre de quien entrega, ubicación, descripción y agente de seguridad.' });
            return;
        }

        const recordToSubmit = {
            ...this.formAdd,
            entregado: false
        };

        this.lfService.create(recordToSubmit).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Objeto olvidado registrado correctamente.' });
                this.addDrawerVisible = false;
                this.lfService.refresh();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro.' });
            }
        });
    }

    submitDelivery() {
        if (!this.formDelivery.nombreReclama || !this.formDelivery.habitacionReclama) {
            this.messageService.add({ severity: 'error', summary: 'Campos requeridos', detail: 'Debe ingresar el nombre del huésped y su número de habitación.' });
            return;
        }

        const sig = this.getSignatureDataUrl();
        if (!sig) {
            this.messageService.add({ severity: 'error', summary: 'Firma requerida', detail: 'El huésped debe firmar antes de registrar la entrega.' });
            return;
        }
        this.formDelivery.firmaReclama = sig;

        const id = this.selectedRecord?.id || this.selectedRecord?._id;
        if (!id) return;

        const updateData = {
            ...this.formDelivery,
            entregado: true
        };

        this.lfService.update(id, updateData).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Entregado', detail: 'El objeto ha sido marcado como entregado.' });
                this.deliveryDrawerVisible = false;
                this.lfService.refresh();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro.' });
            }
        });
    }

    deleteRecord(record: LostAndFoundRecord) {
        const id = record.id || record._id;
        if (!id) return;

        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar este registro de Lost and Found?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.lfService.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'El registro fue eliminado correctamente.' });
                        this.lfService.refresh();
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro.' });
                    }
                });
            }
        });
    }
}
