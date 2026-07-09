import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, effect } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ListaProyectosService, Proyecto } from '../service/lista-proyectos.service';
import { ListaHorasService, Hora } from '../service/lista-horas.service';
import { UsuarioService, User } from '../service/usuarios.service';
import { ClientesService, clientes } from '../service/clientes.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-tableListaProyectos',
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
        DialogModule,
        DatePickerModule,
        MultiSelectModule,
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Lista de Proyectos</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="proyectos"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '75rem', 'width': '100%', 'table-layout': 'fixed'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['projectName', 'area', 'client', 'clientId', 'workStatus', 'generalStatus']"
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
                            placeholder="Buscar Proyecto"
                            class="w-[150px]" />
                    </p-iconfield>

                    @if (authService.isAdministrador()) {
                        <p-button
                            label="Crear Proyecto"
                            icon="pi pi-plus"
                            (click)="crearProyecto()" />
                    }
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[17%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Nombre del Proyecto</span>
                        <p-columnFilter type="text" field="projectName" display="menu" placeholder="Buscar Proyecto"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[13%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Área</span>
                        <p-columnFilter type="text" field="area" display="menu" placeholder="Buscar Área"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[13%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Cliente</span>
                        <p-columnFilter type="text" field="client" display="menu" placeholder="Buscar Cliente"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[19%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>Fechas (Inicio - Entrega)</span>
                        <p-columnFilter 
                            #cf
                            field="filtroFechas" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Inicio</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaInicioFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Entrega</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaEntregaFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearFilters(cf)"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyFilters(cf)"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[14%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Estatus Trabajo</span>
                        <p-columnFilter field="workStatus" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select
                                    [ngModel]="value"
                                    [options]="estatusTrabajoOptions"
                                    placeholder="Seleccionar Estatus"
                                    (onChange)="filter($event.value)"
                                    appendTo="body"
                                    optionLabel="name"
                                    optionValue="value"
                                    styleClass="w-full"
                                    class="w-full">
                                </p-select>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[14%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Desarrolladores</span>
                    </div>
                </th>
                <th class="w-[14%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Estatus General</span>
                        <p-columnFilter field="generalStatus" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select
                                    [ngModel]="value"
                                    [options]="estatusGeneralOptions"
                                    placeholder="Seleccionar Estatus"
                                    (onChange)="filter($event.value)"
                                    appendTo="body"
                                    optionLabel="name"
                                    optionValue="value"
                                    styleClass="w-full"
                                    class="w-full">
                                </p-select>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                @if (authService.isAdministrador()) {
                    <th class="w-[10%] pl-4 pr-0 py-3">
                        <div class="flex justify-center items-center font-semibold">Acciones</div>
                    </th>
                }
            </tr>
        </ng-template>

        <ng-template #body let-proyecto>
            <tr>
                <td class="text-left px-4 py-3 font-medium">{{ proyecto.projectName }}</td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getAreaClass(proyecto.area)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ proyecto.area }}
                    </span>
                </td>
                <td class="text-left px-4 py-3">{{ getClientFullName(proyecto.clientId || proyecto.client) }}</td>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    {{ (proyecto.startDate | date: 'dd/MM/yyyy') || 'N/A' }} <span class="text-gray-400 mx-1">al</span> {{ (proyecto.deliveryDate | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getEstatusTrabajoClass(proyecto.workStatus)"
                          class="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ getEstatusTrabajoLabel(proyecto.workStatus) }}
                    </span>
                </td>
                <td class="text-left px-4 py-3 font-medium">
                    <div class="flex flex-wrap gap-1">
                        @if (proyecto.developers && proyecto.developers.length > 0) {
                            @for (dev of proyecto.developers; track dev._id) {
                                <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs border border-gray-200">
                                    {{ dev.name }}
                                </span>
                            }
                        } @else {
                            <span class="text-gray-400 text-xs italic">{{ proyecto.developerInCharge || 'Sin asignar' }}</span>
                        }
                    </div>
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getEstatusGeneralClass(proyecto.generalStatus)"
                          class="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ proyecto.generalStatus }}
                    </span>
                </td>
                @if (authService.isAdministrador()) {
                    <td class="pl-4 pr-0 py-3">
                        <div class="flex gap-2 justify-center">
                            <button
                                type="button"
                                (click)="editarProyecto(proyecto)"
                                class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                                <i class="pi pi-pencil text-sm"></i>
                            </button>
                            <button
                                type="button"
                                (click)="eliminarProyecto(proyecto)"
                                class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                                <i class="pi pi-trash text-sm"></i>
                            </button>
                        </div>
                    </td>
                }
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="7" class="text-center p-4">No se encontraron registros.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="7" class="text-center p-4">Cargando datos. Por favor espere.</td></tr>
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
            <i class="pi pi-clipboard mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Proyecto' : 'Crear Proyecto' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #proyectoForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre del Proyecto*</label>
                    <input
                        pInputText
                        name="projectName"
                        required
                        [(ngModel)]="nuevoProyecto.projectName"
                        placeholder="Introduce Nombre Del Proyecto"
                        #nombreModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nombreModel.invalid && (nombreModel.touched || proyectoForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nombreModel.invalid && (nombreModel.touched || proyectoForm.submitted)">
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
                        [(ngModel)]="nuevoProyecto.clientId"
                        #clienteModel="ngModel"


                        required
                        appendTo="body"
                        placeholder="Selecciona Cliente"
                        class="w-full"
                        [filter]="true"
                        filterBy="fullName"
                        emptyFilterMessage="No se encontraron clientes"
                        [styleClass]="(clienteModel.invalid && (clienteModel.touched || proyectoForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="clienteModel.invalid && (clienteModel.touched || proyectoForm.submitted)">
                        Cliente Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Desarrolladores asignados*</label>
                    <p-multiSelect
                        [options]="usuariosOptions"
                        name="developers"
                        optionLabel="name"
                        dataKey="_id"
                        display="chip"
                        [(ngModel)]="nuevoProyecto.developers"
                        #devsModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Desarrolladores"
                        class="w-full"
                        [filter]="true"
                        filterBy="name"
                        emptyFilterMessage="No se encontraron usuarios"
                        [styleClass]="(devsModel.invalid && (devsModel.touched || proyectoForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    >
                    </p-multiSelect>
                    <small class="text-red-500 mt-1" *ngIf="devsModel.invalid && (devsModel.touched || proyectoForm.submitted)">
                        Al menos un desarrollador es obligatorio
                    </small>
                </div>

                <!-- Área (Oculto pero se mantiene para el modelo) -->
                <input type="hidden" name="area" [(ngModel)]="nuevoProyecto.area" />

                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Inicio*</label>
                        <p-datepicker 
                            name="startDate"
                            [(ngModel)]="nuevoProyecto.startDate"
                            #startDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (startDateModel.invalid && (startDateModel.touched || proyectoForm.submitted))}">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Entrega*</label>
                        <p-datepicker 
                            name="deliveryDate"
                            [(ngModel)]="nuevoProyecto.deliveryDate"
                            #deliveryDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (deliveryDateModel.invalid && (deliveryDateModel.touched || proyectoForm.submitted))}">
                        </p-datepicker>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Estatus de Trabajo*</label>
                    <p-select
                        [options]="estatusTrabajoOptions"
                        name="workStatus"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoProyecto.workStatus"
                        #workStatusModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Estatus de Trabajo"
                        class="w-full"
                        [styleClass]="(workStatusModel.invalid && (workStatusModel.touched || proyectoForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    >
                        <ng-template pTemplate="selectedItem" let-selectedOption>
                            <div class="flex align-items-center gap-2" *ngIf="selectedOption">
                                <div>{{ selectedOption.label || selectedOption.name }}</div>
                            </div>
                        </ng-template>
                    </p-select>
                    <small class="text-red-500 mt-1" *ngIf="workStatusModel.invalid && (workStatusModel.touched || proyectoForm.submitted)">
                        Estatus de Trabajo Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Estatus General*</label>
                    <p-select
                        [options]="estatusGeneralOptions"
                        name="generalStatus"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoProyecto.generalStatus"
                        #generalStatusModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Estatus General"
                        class="w-full"
                        [styleClass]="(generalStatusModel.invalid && (generalStatusModel.touched || proyectoForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="generalStatusModel.invalid && (generalStatusModel.touched || proyectoForm.submitted)">
                        Estatus General Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <div 
                        class="flex justify-between items-center cursor-pointer description-toggle p-2 rounded p-inputtext transition-colors"
                        (click)="descripcionExpandida = !descripcionExpandida">
                        <label class="font-medium cursor-pointer text-sm">Descripción</label>
                        <i class="pi pi-chevron-down transition-transform duration-300" 
                           [style.transform]="descripcionExpandida ? 'rotate(180deg)' : 'rotate(0deg)'"></i>
                    </div>
                    
                    <div class="overflow-hidden transition-all duration-300 ease-in-out" 
                         [style.max-height]="descripcionExpandida ? '200px' : '0px'"
                         [style.opacity]="descripcionExpandida ? '1' : '0'"
                         [style.margin-top]="descripcionExpandida ? '0.5rem' : '0'">
                        <textarea
                            pInputText
                            name="description"
                            [(ngModel)]="nuevoProyecto.description"
                            placeholder="Introduce una descripción detallada del proyecto"
                            rows="5"
                            class="w-full p-2 border rounded resize-none"
                        ></textarea>
                    </div>
                </div>


            </div>

            <div class="flex justify-end gap-3 mt-8">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(proyectoForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarProyecto(proyectoForm)">
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

    .cursor-pointer {
        cursor: pointer;
    }

    .description-toggle {
        background: transparent !important;
    }

    .description-toggle:hover {
        background-color: color-mix(in srgb, var(--p-text-color, #000), transparent 94%) !important;
    }
    `],
    providers: [ConfirmationService, MessageService]
})
export class TableListaProyectos implements OnInit {

    drawerVisible: boolean = false;
    descripcionExpandida: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    proyectos: Proyecto[] = [];

    nuevoProyecto: Proyecto = {
        projectName: '',
        area: '',
        client: '',
        startDate: '',
        deliveryDate: '',
        workStatus: '',
        generalStatus: '',
        description: ''
    };

    roles = [
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Desarrollador', value: 'Desarrollador' }
    ];

    usuariosOptions: User[] = [];
    clientesOptions: clientes[] = [];

    fechaInicioFilter: Date | null = null;
    fechaEntregaFilter: Date | null = null;

    estatusTrabajoOptions = [
        { name: 'Empezando', value: 'Empezando' },
        { name: 'Pendiente de kick off', label: 'Pendiente de kick off', value: 'Pendiente de kick off' },
        { name: 'En proceso', value: 'En proceso' },
        { name: 'Entregado', value: 'Entregado' },
        { name: 'Congelado', value: 'Congelado' },
        { name: 'Cancelado', value: 'Cancelado' }
    ];

    estatusGeneralOptions = [
        { name: 'Estable', value: 'Estable' },
        { name: 'Requiere atención', value: 'Importante' },
        { name: 'Urgente', value: 'Urgente' },
        { name: 'Terminado', value: 'Terminado' }
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

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;
    @ViewChild('newClientForm') newClientForm!: NgForm;

    constructor(
        private listaProyectosService: ListaProyectosService,
        private listaHorasService: ListaHorasService,
        public authService: AuthService,
        private usuarioService: UsuarioService,
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
    ) {
        effect(() => {
            if (this.authService.userProfile()) {
                this.recargarTabla();
            }
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.recargarTabla();
            this.cargarUsuarios();
            this.cargarClientes();
        });
    }

    cargarClientes() {
        this.clientesService.getClientes().subscribe({
            next: (data) => {
                this.clientesOptions = (data || []).map(c => {
                    const rawId = (c as any)._id;
                    return {
                        ...c,
                        _id: (typeof rawId === 'object' && rawId !== null) ? rawId.$oid || rawId.toString() : rawId,
                        fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                    };
                });
                this.clientesOptions.sort((a, b) =>
                    (a.fullName || '').localeCompare(b.fullName || '')
                );
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando Clientes para Selector', err)
        });
    }



    cargarUsuarios() {
        this.usuarioService.getUsers().subscribe({
            next: (data) => {
                this.usuariosOptions = data || [];
                this.usuariosOptions.sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '')
                );
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando Usuarios para Selector', err)
        });
    }

    recargarTabla() {
        this.loading = true;

        forkJoin({
            proyectos: this.listaProyectosService.getProyectos(),
            horas: this.listaHorasService.getHoras()
        }).subscribe({
            next: (result: { proyectos: Proyecto[], horas: Hora[] }) => {
                const profile = this.authService.userProfile();
                const isDesarrollador = this.authService.isDesarrollador();
                const isAdmin = this.authService.isAdministrador();
                const userName = profile?.name;

                const currentDateStr = new Date().toISOString().split('T')[0];
                let proyectosEvaluados = result.proyectos.map(p => {
                    if (p.deliveryDate && p.generalStatus !== 'Terminado') {
                        try {
                            const entregaDate = new Date(p.deliveryDate);
                            if (!isNaN(entregaDate.getTime())) {
                                const entregaDateStr = entregaDate.toISOString().split('T')[0];
                                if (currentDateStr > entregaDateStr) {
                                    p.generalStatus = 'Terminado';
                                    if (p._id) {
                                        this.listaProyectosService.updateProyecto(p._id, p).subscribe();
                                    }
                                }
                            }
                        } catch (e) { }
                    }
                    return p;
                });

                if (isAdmin) {
                    this.proyectos = proyectosEvaluados;
                } else if (isDesarrollador && userName) {
                    this.proyectos = proyectosEvaluados.filter(p => p.developerInCharge === userName);
                } else {
                    this.proyectos = proyectosEvaluados;
                }

                this.proyectos = this.proyectos.map(p => {
                    const clientIdRaw = (p as any).clientId || (p as any).client;
                    const clientId = (typeof clientIdRaw === 'object' && clientIdRaw !== null) 
                        ? (clientIdRaw as any).$oid || clientIdRaw.toString() 
                        : clientIdRaw;
                        
                    // Normalizar desarrolladores
                    let devs = p.developers || [];
                    if (!Array.isArray(devs)) devs = [];
                    
                    return {
                        ...p,
                        clientId: clientId,
                        developers: devs,
                        startDate: p.startDate ? new Date(p.startDate) : undefined,
                        deliveryDate: p.deliveryDate ? new Date(p.deliveryDate) : undefined
                    };
                });

                setTimeout(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err: any) => {
                console.error('Error cargando Proyectos y Horas', err);
                this.loading = false;
            }
        });
    }

    crearProyecto() {
        this.modoEdicion = false;
        this.descripcionExpandida = false;
        const profile = this.authService.userProfile();
        this.nuevoProyecto = {
            projectName: '',
            area: 'Desarrollo',
            client: '',
            clientId: '',
            startDate: '',
            deliveryDate: '',
            workStatus: '',
            generalStatus: '',
            developers: [],
            description: ''
        };
        this.drawerVisible = true;
    }

    editarProyecto(proyecto: Proyecto) {
        this.modoEdicion = true;
        this.descripcionExpandida = false;
        const parseDate = (dateVal: any) => {
            if (!dateVal) return undefined;
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? undefined : d;
        };

        this.nuevoProyecto = {
            ...proyecto,
            clientId: proyecto.clientId || (proyecto as any).client,
            developers: Array.isArray(proyecto.developers) ? [...proyecto.developers] : [],
            startDate: parseDate(proyecto.startDate) as any,
            deliveryDate: parseDate(proyecto.deliveryDate) as any,
            description: proyecto.description || ''
        };
        this.drawerVisible = true;
        this.cdr.detectChanges();
    }

    eliminarProyecto(proyecto: Proyecto) {
        if (!proyecto._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el registro del proyecto ${proyecto.projectName}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.listaProyectosService.deleteProyecto(proyecto._id!).subscribe({
                    next: () => {
                        this.proyectos = this.proyectos.filter(p => p._id !== proyecto._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Registro eliminado correctamente'
                        });
                        this.cdr.detectChanges();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el registro'
                        });
                    }
                });
            }
        });
    }

    getEstatusTrabajoLabel(estatus: string | undefined): string {
        if (!estatus) return '';
        if (estatus === 'Pendiente de kick off') return 'Kick off';
        return estatus;
    }

    getEstatusTrabajoClass(estatus: string | undefined): string {
        if (!estatus) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (estatus) {
            case 'Empezando':
                return 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]';
            case 'Pendiente de kick off':
                return 'bg-[#FEFCE8] text-[#A16207] border-[#FEF08A]';
            case 'En proceso':
                return 'bg-[#FDF4FF] text-[#86198F] border-[#F5D0FE]';
            case 'Entregado':
                return 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]';
            case 'Congelado':
                return 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]';
            case 'Cancelado':
                return 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getAreaClass(area: string | undefined): string {
        return 'bg-[#FFF0F3] text-[#6A5B8E] border-[#CBBEE5]';
    }

    getEstatusGeneralClass(estatus: string | undefined): string {
        if (!estatus) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (estatus) {
            case 'Estable':
                return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
            case 'Importante':
                return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
            case 'Urgente':
                return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
            case 'Terminado':
                return 'bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    guardarProyecto(form: any) {
        if (form.invalid) {
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const proyectoObj: Proyecto = { ...this.nuevoProyecto };

        const peticion = (this.modoEdicion && this.nuevoProyecto._id)
            ? this.listaProyectosService.updateProyecto(this.nuevoProyecto._id, proyectoObj)
            : this.listaProyectosService.createProyecto(proyectoObj);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.modoEdicion ? 'Proyecto actualizado' : 'Proyecto creado'
                });
                this.recargarTabla();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error en Proyecto:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de servidor',
                    detail: err.error?.message || err.message || 'No se pudo completar la operación'
                });
            }
        });
    }

    cerrarDrawer(form: any) {
        this.drawerVisible = false;
        form.resetForm();
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    clear(table: Table, inputGlobal: HTMLInputElement) {
        table.clear();
        table.filterGlobal('', 'contains');
        if (inputGlobal) {
            inputGlobal.value = '';
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

    getClientFullName(clientId: string | undefined): string {
        if (!clientId) return 'N/A';
        
        // Intentar encontrar por ID primero
        let client = this.clientesOptions.find(c => c._id === clientId);
        
        // Si no se encuentra por ID, intentar por nombre (para datos antiguos)
        if (!client) {
            client = this.clientesOptions.find(c => c.clientName === clientId || c.fullName === clientId);
        }

        if (client) {
            return client.fullName || ((client.clientName || '') + ' ' + (client.clientLastName || '')).trim() || 'N/A';
        }

        return clientId;
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
                        this.nuevoProyecto.clientId = nuevoCli._id;
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

    getFilterValue(field: string): any {
        if (!this.dt1 || !this.dt1.filters || !this.dt1.filters[field]) return null;
        const f = this.dt1.filters[field];
        return Array.isArray(f) ? f[0].value : f.value;
    }

    applyFilters(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.fechaInicioFilter, 'startDate', 'dateIs');
            this.dt1.filter(this.fechaEntregaFilter, 'deliveryDate', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    clearFilters(cf: any) {
        this.fechaInicioFilter = null;
        this.fechaEntregaFilter = null;
        if (this.dt1) {
            this.dt1.filter(null, 'startDate', 'dateIs');
            this.dt1.filter(null, 'deliveryDate', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }
}
