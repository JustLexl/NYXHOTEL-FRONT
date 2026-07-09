import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DrawerModule } from 'primeng/drawer';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Mkt, MktService } from '../service/mkt.service';
import { ClientesService, clientes } from '../service/clientes.service';

@Component({
    selector: 'app-tableMKT',
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
        InputNumberModule,
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Lista de MKT</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="mkts"
        dataKey="_idmkt"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '75rem', 'width': '100%', 'table-layout': 'fixed'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['name', 'area', 'clientId', 'status', 'services']"
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
                            placeholder="Buscar MKT"
                            class="w-[150px]" />
                    </p-iconfield>

                    <p-button
                        label="Crear MKT"
                        icon="pi pi-plus"
                        (click)="crearMkt()" />
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[14%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Nombre</span>
                        <p-columnFilter type="text" field="name" display="menu" placeholder="Buscar Nombre"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[10%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Área</span>
                        <p-columnFilter type="text" field="area" display="menu" placeholder="Buscar Área"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[13%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Cliente</span>
                        <p-columnFilter type="text" field="clientId" display="menu" placeholder="Buscar Cliente"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span class="font-semibold">Fechas (Inicio - Entrega)</span>
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
                <th class="w-[11%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span class="font-semibold">Horas MKT</span>
                        <p-columnFilter type="text" field="mktHours" display="menu" placeholder="Buscar Horas"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[12%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Servicio</span>
                        <p-columnFilter field="services" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select
                                    [ngModel]="value"
                                    [options]="serviciosOptions"
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
                <th class="w-[12%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Estatus</span>
                        <p-columnFilter field="status" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select
                                    [ngModel]="value"
                                    [options]="estatusOptions"
                                    placeholder="Seleccionar Estatus"
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
                <th class="w-[10%] px-4 py-3">
                    <div class="flex justify-center items-center font-semibold text-center">Acciones</div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-mkt>
            <tr>
                <td class="text-left px-4 py-3 font-medium">{{ mkt.name }}</td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getAreaClass(mkt.area)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ mkt.area }}
                    </span>
                </td>
                <td class="text-left px-4 py-3 font-medium">{{ getClientName(mkt.clientId) }}</td>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    {{ (mkt.startDate | date: 'dd/MM/yyyy') || 'N/A' }} <span class="text-gray-400 mx-1">al</span> {{ (mkt.deliveryDate | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td class="text-left px-4 py-3 font-medium text-[#10b981]">
                    {{ mkt.mktHours }} <span class="text-xs text-gray-500 font-normal ml-1">hrs</span>
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getServicioClass(mkt.services)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ mkt.services || 'N/A' }}
                    </span>
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getEstatusClass(mkt.status)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ mkt.status }}
                    </span>
                </td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarMkt(mkt)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil text-sm"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarMkt(mkt)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-trash text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="8" class="text-center p-4">No se encontraron registros.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="8" class="text-center p-4">Cargando datos. Por favor espere.</td></tr>
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
            <i class="pi pi-briefcase mr-2 text-primary"></i> {{ modoEdicion ? 'Editar MKT' : 'Crear MKT' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #mktForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre*</label>
                    <input
                        pInputText
                        name="name"
                        required
                        [(ngModel)]="nuevoMkt.name"                        
                        placeholder="Introduce Nombre"
                        #nombreModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nombreModel.invalid && (nombreModel.touched || mktForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nombreModel.invalid && (nombreModel.touched || mktForm.submitted)">
                        Nombre Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <label class="font-medium text-base">Cliente*</label>
                        <p-button 
                            label="Nuevo" 
                            icon="pi pi-plus" 
                            [text]="true" 
                            size="small" 
                            (click)="abrirDialogCliente()"
                            styleClass="p-0 h-7"
                        ></p-button>
                    </div>
                    <p-select
                        [options]="clientesLista"
                        name="clientId"
                        optionLabel="fullName"
                        optionValue="_id"
                        [(ngModel)]="nuevoMkt.clientId"
                        placeholder="Selecciona Cliente"
                        #clientModel="ngModel"
                        required
                        appendTo="body"
                        class="w-full"
                        [filter]="true"
                        filterBy="fullName"
                        emptyFilterMessage="No se encontraron clientes"
                        [styleClass]="(clientModel.invalid && (clientModel.touched || mktForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="clientModel.invalid && (clientModel.touched || mktForm.submitted)">
                        Cliente Obligatorio
                    </small>
                </div>

                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Inicio*</label>
                        <p-datepicker 
                            name="startDate"
                            [(ngModel)]="nuevoMkt.startDate"
                            #startDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (startDateModel.invalid && (startDateModel.touched || mktForm.submitted))}">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Entrega*</label>
                        <p-datepicker 
                            name="deliveryDate"
                            [(ngModel)]="nuevoMkt.deliveryDate"
                            #deliveryDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (deliveryDateModel.invalid && (deliveryDateModel.touched || mktForm.submitted))}">
                        </p-datepicker>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Estatus*</label>
                    <p-select
                        [options]="estatusOptions"
                        name="status"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoMkt.status"
                        #statusModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Estatus"
                        class="w-full"
                        [styleClass]="(statusModel.invalid && (statusModel.touched || mktForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="statusModel.invalid && (statusModel.touched || mktForm.submitted)">
                        Estatus Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Servicios*</label>
                    <p-select
                        [options]="serviciosOptions"
                        name="services"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoMkt.services"
                        #servicesModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Servicio"
                        class="w-full"
                        [styleClass]="(servicesModel.invalid && (servicesModel.touched || mktForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="servicesModel.invalid && (servicesModel.touched || mktForm.submitted)">
                        Servicio Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Horas MKT*</label>
                    <p-inputNumber 
                        name="mktHours"
                        [(ngModel)]="nuevoMkt.mktHours"
                        [min]="0.1"
                        [max]="1000"
                        [minFractionDigits]="1"
                        [maxFractionDigits]="2"
                        placeholder="Ej: 3.5"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                        [showButtons]="true"
                        buttonLayout="horizontal"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                        incrementButtonClass="p-button-secondary"
                        decrementButtonClass="p-button-secondary"
                    ></p-inputNumber>
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
                            [(ngModel)]="nuevoMkt.description"
                            placeholder="Introduce una descripción detallada"
                            rows="5"
                            class="w-full p-2 border rounded resize-none"
                        ></textarea>
                    </div>
                </div>

            </div>

            <div class="flex justify-end gap-3 mt-6">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(mktForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarMkt(mktForm)">
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
                <label for="nameClient" class="mb-1 font-medium">Nombre*</label>
                <input 
                    pInputText 
                    id="nameClient" 
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
                <label for="correoCliente" class="mb-1 font-medium">Correo</label>
                <input 
                    pInputText 
                    id="correoCliente" 
                    name="email"
                    [(ngModel)]="datosNuevoCliente.email" 
                    placeholder="ejemplo@correo.com"
                />
            </div>
            
            <div class="flex flex-col">
                <label for="numeroCliente" class="mb-1 font-medium">Teléfono</label>
                <input 
                    pInputText 
                    id="numeroCliente" 
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

    /* Metallic Status Tags */
    :host ::ng-deep .tag-diamond {
        background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 45%, #7dd3fc 55%, #0ea5e9 100%) !important;
        color: #0c4a6e !important;
        border: 1px solid #0ea5e9 !important;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255,255,255,1) !important;
        font-weight: 800 !important;
        text-shadow: 0 0.5px 0 rgba(255,255,255,0.5);
    }
    :host ::ng-deep .tag-gold {
        background: linear-gradient(135deg, #d4af37 0%, #fef3c7 45%, #ffcc33 55%, #b45309 100%) !important;
        color: #422006 !important;
        border: 1px solid #b45309 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4) !important;
        font-weight: 800 !important;
        text-shadow: 0 0.5px 0 rgba(255,255,255,0.25);
    }
    :host ::ng-deep .tag-silver {
        background: linear-gradient(135deg, #94a3b8 0%, #f8fafc 45%, #e2e8f0 55%, #64748b 100%) !important;
        color: #1e293b !important;
        border: 1px solid #475569 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        font-weight: 800 !important;
    }

    /* Modern Service Tags (Pastel Theme) */
    :host ::ng-deep .tag-diseno {
        background-color: #fdf4ff !important;
        color: #701a75 !important;
        border: 1px solid #f5d0fe !important;
    }
    :host ::ng-deep .tag-redes {
        background-color: #eff6ff !important;
        color: #1e3a8a !important;
        border: 1px solid #bfdbfe !important;
    }
    :host ::ng-deep .tag-lo {
        background-color: #fff7ed !important;
        color: #7c2d12 !important;
        border: 1px solid #fed7aa !important;
    }
    :host ::ng-deep .tag-sem {
        background-color: #f0fdf4 !important;
        color: #14532d !important;
        border: 1px solid #bbf7d0 !important;
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
export class TableMKT implements OnInit {

    drawerVisible: boolean = false;
    descripcionExpandida: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    mkts: Mkt[] = [];
    clientesLista: clientes[] = [];

    dialogNuevoCliente: boolean = false;
    datosNuevoCliente: clientes = {
        clientName: '',
        email: '',
        phone: '',
        status: 'Activo'
    };

    fechaInicioFilter: Date | null = null;
    fechaEntregaFilter: Date | null = null;

    nuevoMkt: Mkt = {
        name: '',
        area: '',
        clientId: '',
        startDate: '',
        deliveryDate: '',
        mktHours: 0,
        status: '',
        services: '',
        description: ''
    };

    roles = [
        { name: 'MKT', value: 'MKT' }
    ];

    estatusOptions = [
        { name: 'Diamante', value: 'Diamante' },
        { name: 'Oro', value: 'Oro' },
        { name: 'Plata', value: 'Plata' }
    ];

    serviciosOptions = [
        { name: 'Diseño', value: 'Diseño' },
        { name: 'Redes', value: 'Redes' },
        { name: 'LO', value: 'LO' },
        { name: 'SEM', value: 'SEM' }
    ];

    opcionesEstatusClientes = [
        { name: 'Activo', value: 'Activo' },
        { name: 'No Activo', value: 'No Activo' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;
    @ViewChild('newClientForm') newClientForm!: NgForm;

    constructor(
        private mktService: MktService,
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.cargarClientes();
        setTimeout(() => {
            this.recargarTabla();
        });
    }

    cargarClientes() {
        this.clientesService.getClientes().subscribe({
            next: (data) => {
                this.clientesLista = data.map(c => {
                    const rawId = (c as any)._id;
                    return {
                        ...c,
                        _id: (typeof rawId === 'object' && rawId !== null) ? rawId.$oid || rawId.toString() : rawId,
                        fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                    };
                });
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando clientes', err);
            }
        });
    }

    recargarTabla() {
        this.loading = true;
        this.mktService.getMkts().subscribe({
            next: (data) => {
                this.mkts = data.map(mkt => {
                    const clientIdRaw = (mkt as any).clientId || (mkt as any).client;
                    const clientId = (typeof clientIdRaw === 'object' && clientIdRaw !== null) 
                        ? (clientIdRaw as any).$oid || clientIdRaw.toString() 
                        : clientIdRaw;
                    
                    return {
                        ...mkt,
                        clientId: clientId, // Normalizamos a clientId como string
                        startDate: mkt.startDate ? new Date(mkt.startDate) : undefined,
                        deliveryDate: mkt.deliveryDate ? new Date(mkt.deliveryDate) : undefined
                    };
                });
                setTimeout(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err) => {
                console.error('Error cargando MKTs', err);
                this.loading = false;
            }
        });
    }

    crearMkt() {
        this.modoEdicion = false;
        this.descripcionExpandida = false;
        this.nuevoMkt = {
            name: '',
            area: 'MKT',
            clientId: '',
            startDate: '',
            deliveryDate: '',
            mktHours: 0,
            status: '',
            services: '',
            description: ''
        };
        this.drawerVisible = true;
    }

    editarMkt(mkt: Mkt) {
        this.modoEdicion = true;
        this.descripcionExpandida = false;
        const parseDate = (dateVal: any) => {
            if (!dateVal) return undefined;
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? undefined : d;
        };

        this.nuevoMkt = {
            ...mkt,
            startDate: parseDate(mkt.startDate) as any,
            deliveryDate: parseDate(mkt.deliveryDate) as any,
            description: mkt.description || ''
        };
        this.drawerVisible = true;
        this.cdr.detectChanges();
    }

    eliminarMkt(mkt: Mkt) {
        if (!mkt._idmkt) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el registro de ${mkt.name}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.mktService.deleteMkt(mkt._idmkt!).subscribe({
                    next: () => {
                        this.mkts = this.mkts.filter(m => m._idmkt !== mkt._idmkt);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Registro MKT eliminado correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el registro MKT'
                        });
                    }
                });
            }
        });
    }

    getEstatusClass(status: string | undefined): string {
        if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (status.toLowerCase()) {
            case 'diamante':
                return 'tag-diamond';
            case 'oro':
                return 'tag-gold';
            case 'plata':
                return 'tag-silver';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getServicioClass(services: string | undefined): string {
        if (!services) return 'bg-gray-100 text-gray-400 border-gray-200';
        switch (services.toLowerCase()) {
            case 'diseño': return 'tag-diseno';
            case 'redes': return 'tag-redes';
            case 'lo': return 'tag-lo';
            case 'sem': return 'tag-sem';
            default: return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    }

    getAreaClass(area: string | undefined): string {
        return 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]';
    }

    guardarMkt(form: any) {
        if (form.invalid || (this.nuevoMkt.mktHours || 0) <= 0) {
            if ((this.nuevoMkt.mktHours || 0) <= 0) {
                this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes ingresar el número de horas' });
            }
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const mktObj: Mkt = { ...this.nuevoMkt };

        const peticion = (this.modoEdicion && this.nuevoMkt._idmkt)
            ? this.mktService.updateMkt(this.nuevoMkt._idmkt, mktObj)
            : this.mktService.createMkt(mktObj);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.modoEdicion ? 'Registro actualizado correctamente' : 'Registro creado correctamente'
                });
                this.recargarTabla();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error completo recibido:', err);
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

    getClientName(clientId: string | undefined): string {
        if (!clientId) return 'N/A';
        
        // Intentar encontrar por ID primero
        let client = this.clientesLista.find(c => c._id === clientId);
        
        // Si no se encuentra por ID, intentar por nombre (para datos antiguos)
        if (!client) {
            client = this.clientesLista.find(c => c.clientName === clientId || c.fullName === clientId);
        }

        if (client) {
            return client.fullName || ((client.clientName || '') + ' ' + (client.clientLastName || '')).trim() || 'N/A';
        }

        return clientId;
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

    getFilterValue(field: string): any {
        if (!this.dt1 || !this.dt1.filters || !this.dt1.filters[field]) return null;
        const f = this.dt1.filters[field];
        return Array.isArray(f) ? f[0].value : f.value;
    }

    applyFilters(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.fechaInicioFilter, 'startDate', 'dateIs');
            this.dt1.filter(this.fechaEntregaFilter, 'deliveryDate', 'dateIs');
            if (cf) cf.hide();
        }
    }

    clearFilters(cf: any) {
        this.fechaInicioFilter = null;
        this.fechaEntregaFilter = null;
        if (this.dt1) {
            this.dt1.filter(null, 'startDate', 'dateIs');
            this.dt1.filter(null, 'deliveryDate', 'dateIs');
            if (cf) cf.hide();
        }
    }

    abrirDialogCliente() {
        this.datosNuevoCliente = {
            clientName: '',
            email: '',
            phone: '',
            status: 'Activo',
            registrationDate: new Date()
        };
        this.dialogNuevoCliente = true;
    }

    guardarNuevoCliente() {
        if (this.newClientForm?.invalid) {
            Object.values(this.newClientForm.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

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
            next: (clienteCreado) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Cliente creado correctamente'
                });

                this.clientesService.getClientes().subscribe(data => {
                    this.clientesLista = data.map(c => {
                        const rawId = (c as any)._id;
                        return {
                            ...c,
                            _id: (typeof rawId === 'object' && rawId !== null) ? rawId.$oid || rawId.toString() : rawId,
                            fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                        };
                    });
                    
                    // Buscar el cliente recién creado por nombre para obtener su _id
                    const newClient = this.clientesLista.find(c => c.clientName === clienteParaGuardar.clientName);
                    if (newClient) {
                        this.nuevoMkt.clientId = newClient._id!;
                    }
                    this.dialogNuevoCliente = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo crear el cliente'
                });
            }
        });
    }

    soloNumeros(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }
}
