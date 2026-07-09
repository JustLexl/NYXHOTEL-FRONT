import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { NgForm } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';

import { ListaHosting, ListaHostingService } from '../service/lista-hosting.service';
import { clientes, ClientesService } from '../service/clientes.service';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-tableListaHostings',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TableModule,
        SelectModule,
        InputIconModule,
        InputTextModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        IconFieldModule,
        DrawerModule,
        ConfirmDialogModule,
        CheckboxModule,
        DialogModule,
        DatePickerModule,
        TooltipModule,
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Lista de Hosting</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="hostings"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '50rem'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['name', 'clientId', 'domain', 'provider', 'account', 'status']"
        responsiveLayout="scroll"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros encontrados">

        <ng-template #caption>
            <div class="flex justify-between items-center w-full">
                <div>
                    <p-button
                        label="Limpiar"
                        [outlined]="true"
                        icon="pi pi-filter-slash"
                        (click)="clear(dt1, filterGlobal)" />
                </div>

                <div class="flex items-center gap-4">
                    <p-iconfield iconPosition="left">
                        <p-inputicon>
                            <i class="pi pi-search"></i>
                        </p-inputicon>
                        <input
                            #filterGlobal
                            pInputText
                            type="text"
                            (input)="onGlobalFilter(dt1, $event)"
                            placeholder="Buscar Hosting"
                            class="w-[150px]" />
                    </p-iconfield>

                    <p-button
                        label="Crear Hosting"
                        icon="pi pi-plus"
                        (click)="crearHosting()" />
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Nombre</span>
                        <p-columnFilter type="text" field="name" display="menu" placeholder="Buscar Nombre"></p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Cliente</span>
                        <p-columnFilter type="text" field="clientId" display="menu" placeholder="Buscar Cliente"></p-columnFilter>

                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Dominio</span>
                        <p-columnFilter type="text" field="domain" display="menu" placeholder="Buscar Dominio"></p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Proveedor</span>
                        <p-columnFilter type="text" field="provider" display="menu" placeholder="Buscar Proveedor"></p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Cuenta</span>
                        <p-columnFilter type="text" field="account" display="menu" placeholder="Buscar Cuenta"></p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>F. Inicio</span>
                        <p-columnFilter 
                            #cfInicio
                            field="startDate" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Filtrar por Inicio</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaInicioFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearFechaFilter(cfInicio, 'inicio')"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyFechaFilter(cfInicio, 'inicio')"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>F. Finalización</span>
                        <p-columnFilter 
                            #cfFinal
                            field="expiryDate" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Filtrar por Finalización</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaFinalFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearFechaFilter(cfFinal, 'final')"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyFechaFilter(cfFinal, 'final')"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Estatus</span>
                        <p-columnFilter field="status" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select
                                    [ngModel]="value"
                                    [options]="estatusOptions"
                                    placeholder="Seleccionar"
                                    (onChange)="filter($event.value)"
                                    optionLabel="name"
                                    optionValue="value"
                                    styleClass="w-full"
                                    class="w-full">
                                </p-select>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th>
                    <div class="flex justify-center items-center font-semibold">Acciones</div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-hosting>
            <tr>
                <td class="text-left">{{ hosting.name }}</td>
                <td class="text-left font-medium">{{ getClientName(hosting.clientId) }}</td>
                <td class="text-left">{{ hosting.domain }}</td>
                <td class="text-left">{{ hosting.provider }}</td>
                <td class="text-left">{{ hosting.account }}</td>
                <td class="text-left whitespace-nowrap">
                    {{ (hosting.startDate | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td class="text-left whitespace-nowrap">
                    {{ (hosting.expiryDate | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td class="text-left">
                    <span [ngClass]="getEstatusClass(hosting.status)"
                          [pTooltip]="hosting.status === 'Renovación' ? getRenovacionTooltip(hosting) : undefined"
                          tooltipPosition="top"
                          [escape]="false"
                          class="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap cursor-help">
                        {{ hosting.status }}
                    </span>
                </td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarHosting(hosting)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil text-sm"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarHosting(hosting)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-trash text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="9" class="text-center p-4 text-[var(--p-text-muted-color)]">No se encontraron registros.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="9" class="text-center p-4 text-[var(--p-text-muted-color)]">Cargando datos. Por favor espere.</td></tr>
        </ng-template>
    </p-table>
</div>

<p-drawer
    [(visible)]="drawerVisible"
    position="right"
    [modal]="false"
    styleClass="!w-[400px] !pt-[5.5rem] !px-[1.5rem] !pb-[1.5rem]">

    <ng-template pTemplate="header">
        <h3 class="font-bold text-lg text-[var(--p-text-color)]">
            <i class="pi pi-server mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Hosting' : 'Crear Hosting' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #hostingForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre*</label>
                    <input
                        pInputText
                        name="name"
                        required
                        [(ngModel)]="nuevoHosting.name"
                        placeholder="Introduce Nombre Del Hosting"
                        #nombreModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nombreModel.invalid && (nombreModel.touched || hostingForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nombreModel.invalid && (nombreModel.touched || hostingForm.submitted)">
                        Nombre Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <label class="font-medium text-base">Cliente*</label>
                        <p-button 
                            label="Nuevo Cliente" 
                            icon="pi pi-plus" 
                            [text]="true" 
                            size="small" 
                            (click)="dialogNuevoCliente = true"
                        ></p-button>
                    </div>
                    <p-select
                        [options]="clientesOptions"
                        name="client"
                        optionLabel="fullName"
                        optionValue="_id"
                        [(ngModel)]="nuevoHosting.clientId"
                        #clienteModel="ngModel"


                        required
                        appendTo="body"
                        placeholder="Selecciona Cliente"
                        class="w-full"
                        [filter]="true"
                        filterBy="clientName"
                        emptyFilterMessage="No se encontraron clientes"
                        [styleClass]="(clienteModel.invalid && (clienteModel.touched || hostingForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="clienteModel.invalid && (clienteModel.touched || hostingForm.submitted)">
                        Cliente Obligatorio
                    </small>
                </div>


                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Proveedor*</label>
                        <input
                            pInputText
                            name="provider"
                            required
                            [(ngModel)]="nuevoHosting.provider"
                            placeholder="Introduce Proveedor"
                            #proveedorModel="ngModel"
                            class="w-full p-2 border rounded"
                            [ngClass]="{'ng-invalid ng-dirty': (proveedorModel.invalid && (proveedorModel.touched || hostingForm.submitted))}"
                        />
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Cuenta*</label>
                        <input
                            pInputText
                            name="account"
                            required
                            [(ngModel)]="nuevoHosting.account"
                            placeholder="Introduce  Cuenta"
                            #cuentaModel="ngModel"
                            class="w-full p-2 border rounded"
                            [ngClass]="{'ng-invalid ng-dirty': (cuentaModel.invalid && (cuentaModel.touched || hostingForm.submitted))}"
                        />
                    </div>
                </div>

                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Inicio*</label>
                        <p-datepicker 
                            name="startDate"
                            [(ngModel)]="nuevoHosting.startDate"
                            #startDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (startDateModel.invalid && (startDateModel.touched || hostingForm.submitted))}">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">F. Finalización</label>
                        <p-datepicker 
                            name="expiryDate"
                            [(ngModel)]="nuevoHosting.expiryDate"
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full">
                        </p-datepicker>
                    </div>
                </div>

                <div class="flex gap-4 items-end">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Estatus*</label>
                        <p-select
                            [options]="estatusOptions"
                            name="status"
                            optionLabel="name"
                            optionValue="value"
                            [(ngModel)]="nuevoHosting.status"
                            #statusModel="ngModel"
                            required
                            appendTo="body"
                            placeholder="Selecciona Estatus"
                            class="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (statusModel.invalid && (statusModel.touched || hostingForm.submitted))}"
                        ></p-select>
                        <small class="text-red-500 mt-1" *ngIf="statusModel.invalid && (statusModel.touched || hostingForm.submitted)">
                            Estatus Obligatorio
                        </small>
                    </div>

                    <div class="flex items-center gap-2 mb-2 w-1/2">
                        <p-checkbox 
                            [(ngModel)]="paginaActiva" 
                            [binary]="true" 
                            inputId="paginaActiva" 
                            name="paginaActiva"
                            (onChange)="onPaginaActivaChange($event)">
                        </p-checkbox>
                        <label for="paginaActiva" class="font-medium text-base cursor-pointer mb-0">Página activa con nosotros</label>
                    </div>
                </div>
            
                <div class="flex flex-col" *ngIf="paginaActiva">
                    <label class="mb-2 font-medium text-base">Dominio*</label>
                    <input
                        pInputText
                        name="domain"
                        required
                        [(ngModel)]="nuevoHosting.domain"
                        #domainModel="ngModel"
                        placeholder="ej. miproyecto.com"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (domainModel.invalid && (domainModel.touched || hostingForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="domainModel.invalid && (domainModel.touched || hostingForm.submitted)">
                        Dominio Obligatorio
                    </small>
                </div>

                <div class="mt-4 pt-4 border-t" *ngIf="modoEdicion">
                    <p-button 
                        label="Proceso de Renovación" 
                        icon="pi pi-refresh" 
                        [outlined]="true" 
                        styleClass="w-full btn-renewal-process"
                        [disabled]="nuevoHosting.status === 'Activo'"
                        (click)="abrirRenovacion()">
                    </p-button>
                </div>

            </div>


            <div class="flex justify-end gap-3 mt-6">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(hostingForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarHosting(hostingForm)">
                </p-button>
            </div>
        </form>
    </ng-template>
</p-drawer>

<p-dialog 
    [(visible)]="dialogNuevoCliente" 
    [modal]="true" 
    header="Crear Nuevo Cliente" 
    [style]="{ width: '450px' }" 
    styleClass="p-fluid">
    
    <ng-template pTemplate="content">
        <form #newClientForm="ngForm" class="flex flex-col gap-4 pt-2">
            <div class="flex flex-col">
                <label for="clientName" class="mb-1 font-medium">Nombre*</label>
                <input 
                    pInputText 
                    id="clientName" 
                    name="clientName"
                    [(ngModel)]="datosNuevoCliente.clientName" 
                    required 
                    #newClientName="ngModel"
                    placeholder="Nombre del cliente"
                    [ngClass]="{'ng-invalid ng-dirty': (newClientName.invalid && (newClientName.touched || newClientForm.submitted))}"
                />
                <small class="text-red-500 mt-1" *ngIf="newClientName.invalid && (newClientName.touched || newClientForm.submitted)">
                    Nombre es obligatorio
                </small>
            </div>
            
            <div class="flex flex-col">
                <label for="email" class="mb-1 font-medium">Correo</label>
                <input 
                    pInputText 
                    id="email" 
                    name="email"
                    [(ngModel)]="datosNuevoCliente.email" 
                    placeholder="ejemplo@correo.com"
                />
            </div>
            
            <div class="flex flex-col">
                <label for="phone" class="mb-1 font-medium">Teléfono</label>
                <input 
                    pInputText 
                    id="phone" 
                    name="phone"
                    [(ngModel)]="datosNuevoCliente.phone" 
                    (keypress)="soloNumeros($event)"
                    maxlength="10"
                    placeholder="10 dígitos"
                />
            </div>

            <div class="flex flex-col">
                <label class="mb-1 font-medium">Estatus*</label>
                <p-select
                    [options]="opcionesEstatusClientes"
                    name="status"
                    optionLabel="name"
                    optionValue="value"
                    [(ngModel)]="datosNuevoCliente.status"
                    required
                    appendTo="body"
                    placeholder="Seleccion Estatus"
                    class="w-full"
                ></p-select>
            </div>
        </form>
    </ng-template>

    <ng-template pTemplate="footer">
        <p-button 
            label="Cancelar" 
            icon="pi pi-times" 
            [text]="true" 
            (click)="dialogNuevoCliente = false"
        ></p-button>
        <p-button 
            label="Guardar Cliente" 
            icon="pi pi-check" 
            (click)="guardarNuevoCliente()"
        ></p-button>
    </ng-template>
</p-dialog>

<p-dialog 
    [(visible)]="dialogRenovacion" 
    [modal]="true" 
    header="Proceso de Renovación" 
    [style]="{ width: '400px' }" 
    styleClass="p-fluid">
    
    <ng-template pTemplate="content">
        <div class="flex flex-col gap-6 pt-4">
            <div class="flex items-center gap-3 p-3 renewal-step-card rounded-lg border">
                <p-checkbox 
                    [(ngModel)]="renovacionTemp.providerContacted" 
                    [binary]="true" 
                    inputId="contProv">
                </p-checkbox>
                <label for="contProv" class="font-medium cursor-pointer mb-0">Proceso contacto con el proveedor</label>
            </div>

            <div class="flex items-center gap-3 p-3 renewal-step-card rounded-lg border">
                <p-checkbox 
                    [(ngModel)]="renovacionTemp.renewalConfirmed" 
                    [binary]="true" 
                    inputId="renConf">
                </p-checkbox>
                <label for="renConf" class="font-medium cursor-pointer mb-0">Renovación</label>
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-medium text-base">Fecha de finalización nueva</label>
                <p-datepicker 
                    [(ngModel)]="renovacionTemp.expiryDate" 
                    appendTo="body" 
                    [showIcon]="true" 
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/yy"
                    class="w-full">
                </p-datepicker>
                <small class="text-gray-500 italic">Al ingresar una fecha, esta reemplazará la fecha de finalización actual.</small>
            </div>
        </div>
    </ng-template>

    <ng-template pTemplate="footer">
        <p-button 
            label="Cancelar" 
            icon="pi pi-times" 
            [text]="true" 
            (click)="dialogRenovacion = false"
        ></p-button>
        <p-button 
            label="Guardar Proceso" 
            icon="pi pi-check" 
            (click)="guardarProcesoRenovacion()"
        ></p-button>
    </ng-template>
</p-dialog>
    `,
    styles: [`
    .main-content { transition: margin-right 0.3s ease; }
    .main-content.drawer-open { margin-right: 400px; }
    @media (max-width: 768px) {
        .main-content.drawer-open { margin-right: 0; }
    }

    :host ::ng-deep .custom-modern-table .p-datatable-tbody > tr > td,
    :host ::ng-deep .custom-modern-table .p-datatable-thead > tr > th {
        background-color: var(--p-content-background) !important;
        border-bottom: 1px solid var(--p-datatable-border-color) !important;
        border-bottom-color: color-mix(in srgb, var(--p-datatable-border-color), transparent 50%) !important;
    }

    :host ::ng-deep .p-datatable .p-paginator-bottom {
        justify-content: center !important;
        position: relative !important;
        background-color: var(--p-content-background) !important;
        border: none !important;
        padding: 1.5rem 0 !important;
    }

    :host ::ng-deep .p-datatable .p-paginator-current {
        position: absolute !important;
        left: 0 !important;
        margin: 0 !important;
        font-size: 0.85rem;
        color: var(--p-text-muted-color);
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
        background: #dcfce7 !important;
        color: #15803d !important;
        border-radius: 8px;
    }
    :host ::ng-deep .ng-invalid.ng-dirty {
        border-color: #ef4444 !important;
    }
    :host ::ng-deep .p-select.ng-invalid.ng-dirty {
        border: 1px solid #ef4444 !important;
    }

    .renewal-step-card {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        color: #374151;
    }
    ::ng-deep .app-dark .renewal-step-card {
        background-color: rgba(255, 255, 255, 0.05) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
        color: #f1f5f9 !important;
    }


    .btn-renewal-process {
        border-style: dashed !important;
        border-color: #60a5fa !important;
        background-color: rgba(239, 246, 255, 0.5) !important;
    }
    ::ng-deep .app-dark .btn-renewal-process {
        background-color: rgba(30, 58, 138, 0.2) !important;
        border-color: #3b82f6 !important;
        color: #93c5fd !important;
    }
    ::ng-deep .app-dark .btn-renewal-process:hover {
        background-color: rgba(30, 58, 138, 0.3) !important;
    }
    `],
    providers: [ConfirmationService, MessageService]
})
export class TableListaHostings implements OnInit {

    drawerVisible: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    hostings: ListaHosting[] = [];
    clientesOptions: clientes[] = [];

    nuevoHosting: ListaHosting = {
        name: '',
        clientId: '',
        domain: '',

        provider: '',
        account: '',
        startDate: '',
        status: 'Activo',
        providerContacted: false,
        renewalConfirmed: false,
        renewalHistory: []
    };

    dialogRenovacion: boolean = false;
    renovacionTemp: any = {
        providerContacted: false,
        renewalConfirmed: false,
        expiryDate: null
    };

    fechaInicioFilter: Date | null = null;
    fechaFinalFilter: Date | null = null;

    paginaActiva: boolean = false;

    estatusOptions = [
        { name: 'Activo', value: 'Activo' },
        { name: 'Inactivo', value: 'Inactivo' },
        { name: 'Renovación', value: 'Renovación' }
    ];

    dialogNuevoCliente: boolean = false;
    datosNuevoCliente: clientes = {
        clientName: '',
        email: '',
        phone: '',
        status: 'Activo'
    };

    opcionesEstatusClientes = [
        { name: 'Activo', value: 'Activo' },
        { name: 'No Activo', value: 'No Activo' }
    ];

    @ViewChild('filterGlobal') filterGlobal!: ElementRef;
    @ViewChild('newClientForm') newClientForm!: NgForm;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private hostingService: ListaHostingService,
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public layoutService: LayoutService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.cargarHostings();
        this.cargarClientes();
    }

    cargarHostings() {
        this.loading = true;
        this.hostingService.getHostings().subscribe({
            next: (data) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                const getValidDate = (d: any) => {
                    if (!d) return null;
                    if (d instanceof Date && !isNaN(d.getTime())) return d;

                    let date = new Date(d);
                    if (!isNaN(date.getTime())) return date;

                    if (typeof d === 'string' && d.includes('/')) {
                        const parts = d.split('/');
                        if (parts.length === 3) {
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1;
                            let year = parseInt(parts[2], 10);
                            if (year < 100) year += 2000;
                            const customDate = new Date(year, month, day);
                            if (!isNaN(customDate.getTime())) return customDate;
                        }
                    }
                    return null;
                };

                this.hostings = data.map(h => {
                    const fInicio = getValidDate(h.startDate);
                    const fFinal = getValidDate(h.expiryDate);
                    let status = h.status;

                    if (fFinal && status !== 'Inactivo') {
                        const quinceDias = 15 * 24 * 60 * 60 * 1000;
                        const diff = fFinal.getTime() - hoy.getTime();

                        if (diff <= quinceDias) {
                            status = 'Renovación';
                        } else {
                            status = 'Activo';
                        }

                        if (status !== h.status) {
                            const { _id, ...updatePayload } = h;
                            this.hostingService.updateHosting(_id!, { ...updatePayload, status }).subscribe();
                        }
                    }

                    return {
                        ...h,
                        startDate: fInicio,
                        expiryDate: fFinal,
                        status
                    };
                });
                setTimeout(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err) => {
                console.error('Error al cargar hostings', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los registros de hosting', life: 3000 });
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    cargarClientes() {
        this.clientesService.getClientes().subscribe({
            next: (data) => {
                this.clientesOptions = (data || []).map(c => ({
                    ...c,
                    fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                }));
                this.clientesOptions.sort((a, b) =>
                    (a.fullName || '').localeCompare(b.fullName || '')
                );
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar clientes para selector', err);
            }
        });
    }

    getClientName(id: string | undefined): string {
        if (!id) return 'Sin cliente';

        let client = this.clientesOptions.find(c => c._id === id);

        if (!client) {
            client = this.clientesOptions.find(c => c.clientName === id || c.fullName === id);
        }

        if (client) {
            return client.fullName || ((client.clientName || '') + ' ' + (client.clientLastName || '')).trim() || 'Sin nombre';
        }

        return id;
    }



    getEstatusClass(status: string | undefined): string {
        if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (status) {
            case 'Activo':
                return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
            case 'Inactivo':
                return 'bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]';
            case 'Renovación':
                return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getRenovacionTooltip(h: ListaHosting): string {
        const steps = [];
        if (h.providerContacted) steps.push('<i class="pi pi-check-circle text-green-500"></i> Contacto proveedor');
        else steps.push('<i class="pi pi-circle text-gray-400"></i> Contacto proveedor');

        if (h.renewalConfirmed) steps.push('<i class="pi pi-check-circle text-green-500"></i> Renovación confirmada');
        else steps.push('<i class="pi pi-circle text-gray-400"></i> Renovación confirmada');

        return `<div class="p-2 flex flex-col gap-1 text-xs font-medium">${steps.join('')}</div>`;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table, filterGlobal: HTMLInputElement) {
        table.clear();
        filterGlobal.value = '';
        this.fechaInicioFilter = null;
        this.fechaFinalFilter = null;
    }

    getFilterValue(field: string): any {
        if (!this.dt1 || !this.dt1.filters || !this.dt1.filters[field]) return null;
        const f = this.dt1.filters[field];
        return Array.isArray(f) ? f[0].value : f.value;
    }

    applyFechaFilter(cf: any, type: 'inicio' | 'final') {
        const filterVal = type === 'inicio' ? this.fechaInicioFilter : this.fechaFinalFilter;
        const fieldName = type === 'inicio' ? 'startDate' : 'expiryDate';

        if (this.dt1) {
            this.dt1.filter(filterVal, fieldName, 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    clearFechaFilter(cf: any, type: 'inicio' | 'final') {
        if (type === 'inicio') this.fechaInicioFilter = null;
        else this.fechaFinalFilter = null;

        const fieldName = type === 'inicio' ? 'startDate' : 'expiryDate';

        if (this.dt1) {
            this.dt1.filter(null, fieldName, 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    crearHosting() {
        this.modoEdicion = false;
        this.paginaActiva = false;
        this.nuevoHosting = {
            name: '',
            clientId: '',
            domain: '',

            provider: '',
            account: '',
            startDate: '',
            status: 'Activo',
            providerContacted: false,
            renewalConfirmed: false,
            renewalHistory: []
        };
        this.drawerVisible = true;
    }

    editarHosting(hosting: ListaHosting) {
        this.modoEdicion = true;
        this.paginaActiva = (!!hosting.domain && hosting.domain !== '');

        const parseDate = (d: any) => {
            if (!d) return null;
            const date = new Date(d);
            return isNaN(date.getTime()) ? null : date;
        };

        this.nuevoHosting = {
            ...hosting,
            startDate: parseDate(hosting.startDate) as any,
            expiryDate: parseDate(hosting.expiryDate) as any
        };
        this.drawerVisible = true;
        this.cdr.detectChanges();
    }

    abrirRenovacion() {
        this.renovacionTemp = {
            providerContacted: this.nuevoHosting.providerContacted || false,
            renewalConfirmed: this.nuevoHosting.renewalConfirmed || false,
            expiryDate: this.nuevoHosting.expiryDate ? new Date(this.nuevoHosting.expiryDate) : null
        };
        this.dialogRenovacion = true;
    }

    guardarProcesoRenovacion() {
        this.nuevoHosting.providerContacted = this.renovacionTemp.providerContacted;
        this.nuevoHosting.renewalConfirmed = this.renovacionTemp.renewalConfirmed;

        if (this.renovacionTemp.expiryDate) {
            this.nuevoHosting.expiryDate = this.renovacionTemp.expiryDate;
            this.nuevoHosting.status = 'Activo';

            if (!this.nuevoHosting.renewalHistory) this.nuevoHosting.renewalHistory = [];
            this.nuevoHosting.renewalHistory.push({
                date: new Date(),
                newExpiry: this.renovacionTemp.expiryDate,
                type: 'renewal'
            });
        }

        this.dialogRenovacion = false;
        this.messageService.add({ severity: 'info', summary: 'Proceso Guardado', detail: 'Los cambios se aplicarán al guardar el Hosting' });
    }

    eliminarHosting(hosting: ListaHosting) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el registro de hosting ${hosting.name}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                if (hosting._id) {
                    this.hostingService.deleteHosting(hosting._id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente', life: 3000 });
                            this.cargarHostings();
                        },
                        error: (err) => {
                            console.error('Error al eliminar', err);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro', life: 3000 });
                        }
                    });
                }
            }
        });
    }

    guardarHosting(form: any) {
        if (form.invalid) {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsTouched();
            });
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa todos los campos obligatorios', life: 3000 });
            return;
        }

        const hostingData = { ...this.nuevoHosting };
        const id = hostingData._id;

        if (id && this.modoEdicion) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            let possibleFin;
            if (hostingData.expiryDate) {
                possibleFin = new Date(hostingData.expiryDate);
                possibleFin.setHours(0, 0, 0, 0);

                const diffTime = possibleFin.getTime() - hoy.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                const statusNormalizado = hostingData.status ? hostingData.status.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
                if (diffDays > 15 || statusNormalizado === 'activo') {
                    if (hostingData.providerContacted || hostingData.renewalConfirmed) {
                        hostingData.renewalHistory = hostingData.renewalHistory || [];
                        hostingData.renewalHistory.push({
                            providerContacted: hostingData.providerContacted,
                            renewalConfirmed: hostingData.renewalConfirmed,
                            expiryDateAnterior: this.nuevoHosting.expiryDate,
                            fechaRegistro: new Date()
                        });

                        hostingData.providerContacted = false;
                        hostingData.renewalConfirmed = false;
                        hostingData.status = 'Activo';
                    }
                }
            }
        }

        if (this.modoEdicion && id) {
            delete hostingData._id;
            this.hostingService.updateHosting(id, hostingData).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hosting actualizado correctamente', life: 3000 });
                    this.cerrarDrawer(form);
                    this.cargarHostings();
                },
                error: (err) => {
                    console.error('Error al actualizar:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error?.message || err.message || 'No se pudo actualizar el registro',
                        life: 3000
                    });
                }
            });
        } else {
            this.hostingService.createHosting(hostingData).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hosting creado correctamente', life: 3000 });
                    this.cerrarDrawer(form);
                    this.cargarHostings();
                },
                error: (err) => {
                    console.error('Error al crear:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error?.message || err.message || 'No se pudo crear el registro',
                        life: 3000
                    });
                }
            });
        }
    }

    cerrarDrawer(form?: any) {
        this.drawerVisible = false;
        if (form) {
            form.resetForm();
        }
        this.paginaActiva = false;
    }

    onPaginaActivaChange(event: any) {
        if (!event.checked) {
            this.nuevoHosting.domain = 'No registrado';
        } else if (this.nuevoHosting.domain === 'No registrado') {
            this.nuevoHosting.domain = '';
        }
    }

    soloNumeros(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    guardarNuevoCliente() {
        const nameParts = (this.datosNuevoCliente.clientName || '').trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const clienteParaGuardar: clientes = {
            ...this.datosNuevoCliente,
            clientName: firstName,
            clientLastName: lastName,
            email: this.datosNuevoCliente.email?.trim() || 'No registrado',
            phone: this.datosNuevoCliente.phone?.trim() || 'No registrado',
            registrationDate: new Date()
        };

        this.clientesService.createCliente(clienteParaGuardar).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado correctamente' });
                this.dialogNuevoCliente = false;

                this.clientesService.getClientes().subscribe(data => {
                    this.clientesOptions = (data || []).map(c => {
                        const rawId = (c as any)._id;
                        return {
                            ...c,
                            _id: (typeof rawId === 'object' && rawId !== null) ? rawId.$oid || rawId.toString() : rawId,
                            fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                        };
                    });

                    // Intentar asociar el cliente recién creado
                    const nuevoCli = this.clientesOptions.find(c =>
                        c.clientName === firstName && c.clientLastName === lastName
                    );
                    if (nuevoCli) {
                        this.nuevoHosting.clientId = nuevoCli._id || '';
                    }

                    this.datosNuevoCliente = {
                        clientName: '',
                        email: '',
                        phone: '',
                        status: 'Activo'
                    };
                    this.cdr.detectChanges();
                });

            },
            error: (err: any) => {
                console.error('Error al crear cliente', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente' });
            }
        });
    }
}
