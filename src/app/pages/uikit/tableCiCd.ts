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
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

import { CiCd, CiCdService } from '../service/cicd.service';
import { ClientesService, clientes } from '../service/clientes.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-table-cicd',
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
    <div class="font-semibold text-xl mb-2">Lista de CI/CD</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="cicds"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '60rem', 'table-layout': 'fixed'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['name', 'area', 'client', 'clientId', 'status']"
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
                            placeholder="Buscar CI/CD"
                            class="w-[150px]" />
                    </p-iconfield>

                    <p-button
                        label="Crear CI/CD"
                        icon="pi pi-plus"
                        (click)="crearCiCd()" />
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[16%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Nombre</span>
                        <p-columnFilter type="text" field="name" display="menu" placeholder="Buscar Nombre"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[14%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Área</span>
                        <p-columnFilter type="text" field="area" display="menu" placeholder="Buscar Área"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[15%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Cliente</span>
                        <p-columnFilter type="text" field="client" display="menu" placeholder="Buscar Cliente"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[20%] px-4 py-3 text-left">
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
                <th class="w-[13%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Horas CI/CD</span>
                        <p-columnFilter type="numeric" field="cicdHours" display="menu" placeholder="Buscar Horas"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[12%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Estatus</span>
                        <p-columnFilter field="status" matchMode="equals" display="menu">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select 
                                    [ngModel]="value" 
                                    [options]="estatusOptions" 
                                    (onChange)="filter($event.value)" 
                                    placeholder="Todos" 
                                    [showClear]="true"
                                    appendTo="body"
                                    optionLabel="name"
                                    optionValue="value">
                                </p-select>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[10%] px-4 py-3">
                    <div class="flex justify-center items-center font-semibold">Acciones</div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-cicd>
            <tr>
                <td class="text-left px-4 py-3 font-medium">{{ cicd.name }}</td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getAreaClass(cicd.area)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ cicd.area }}
                    </span>
                </td>
                <td class="text-left px-4 py-3 font-medium">{{ getClientFullName(cicd.clientId || cicd.client) }}</td>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    {{ (cicd.startDate | date: 'dd/MM/yyyy') || 'N/A' }} <span class="text-gray-400 mx-1">al</span> {{ (cicd.deliveryDate | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td class="text-left px-4 py-3 font-medium text-[#10b981]">
                    {{ cicd.cicdHours }} <span class="text-xs text-gray-500 font-normal ml-1">hrs</span>
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getEstatusClass(cicd.status)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ cicd.status }}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarCiCd(cicd)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil text-sm"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarCiCd(cicd)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-trash text-sm"></i>
                        </button>
                    </div>
                </td>
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
            <i class="pi pi-briefcase mr-2 text-primary"></i> {{ modoEdicion ? 'Editar CI/CD' : 'Crear CI/CD' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #cicdForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre*</label>
                    <input
                        pInputText
                        name="name"
                        required
                        [(ngModel)]="nuevoCiCd.name"
                        placeholder="Introduce Nombre"
                        #nombreModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nombreModel.invalid && (nombreModel.touched || cicdForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nombreModel.invalid && (nombreModel.touched || cicdForm.submitted)">
                        Nombre Obligatorio
                    </small>
                </div>

                <!-- Área (Oculto pero se mantiene para el modelo) -->
                <input type="hidden" name="area" [(ngModel)]="nuevoCiCd.area" />

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
                        [options]="clientesLista"
                        name="client"
                        optionLabel="fullName"
                        optionValue="_id"
                        [(ngModel)]="nuevoCiCd.clientId"
                        placeholder="Selecciona Cliente"


                        #clienteModel="ngModel"
                        required
                        appendTo="body"
                        class="w-full"
                        [filter]="true"
                        filterBy="clientName"
                        emptyFilterMessage="No se encontraron clientes"
                        [styleClass]="(clienteModel.invalid && (clienteModel.touched || cicdForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="clienteModel.invalid && (clienteModel.touched || cicdForm.submitted)">
                        Cliente Obligatorio
                    </small>
                </div>

                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Inicio*</label>
                        <p-datepicker 
                            name="startDate"
                            [(ngModel)]="nuevoCiCd.startDate"
                            #startDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (startDateModel.invalid && (startDateModel.touched || cicdForm.submitted))}">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Entrega*</label>
                        <p-datepicker 
                            name="deliveryDate"
                            [(ngModel)]="nuevoCiCd.deliveryDate"
                            #deliveryDateModel="ngModel"
                            required
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (deliveryDateModel.invalid && (deliveryDateModel.touched || cicdForm.submitted))}">
                        </p-datepicker>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Estatus*</label>
                    <p-select
                        [options]="estatusOptions"
                        name="status"
                        [(ngModel)]="nuevoCiCd.status"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Seleccionar Estatus"
                        styleClass="w-full"
                        required
                        appendTo="body"
                        #statusModel="ngModel"
                        [ngClass]="{'ng-invalid ng-dirty': (statusModel.invalid && (statusModel.touched || cicdForm.submitted))}">
                    </p-select>
                    <small class="text-red-500 mt-1" *ngIf="statusModel.invalid && (statusModel.touched || cicdForm.submitted)">
                        Estatus Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Horas CI/CD*</label>
                    <p-inputNumber 
                        name="cicdHours"
                        [(ngModel)]="nuevoCiCd.cicdHours"
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
                            [(ngModel)]="nuevoCiCd.description"
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
                    (click)="cerrarDrawer(cicdForm)">
                </p-button>

                <p-button
                    [label]="modoEdicion ? 'Actualizar' : 'Guardar'"
                    (click)="guardarCiCd(cicdForm)">
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

    :host ::ng-deep .p-dropdown.ng-invalid.ng-dirty,
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
export class TableCiCd implements OnInit {

    drawerVisible: boolean = false;
    descripcionExpandida: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    cicds: CiCd[] = [];
    clientesLista: clientes[] = [];

    fechaInicioFilter: Date | null = null;
    fechaEntregaFilter: Date | null = null;

    nuevoCiCd: CiCd = {
        name: '',
        area: '',
        client: '',
        startDate: '',
        deliveryDate: '',
        cicdHours: 0,
        status: '',
        description: ''
    };

    roles = [
        { name: 'CI/CD', value: 'CI/CD' }
    ];

    estatusOptions = [
        { name: 'Estable', value: 'Estable' },
        { name: 'Urgente', value: 'Urgente' },
        { name: 'Requiere atención', value: 'Requiere atención' },
        { name: 'Inactivo', value: 'Inactivo' },
        { name: 'Cancelado', value: 'Cancelado' }
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
        private cicdService: CiCdService,
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
                this.clientesLista = (data || []).map(c => {
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

    getClientFullName(clientId: string | undefined): string {
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



    recargarTabla() {
        this.loading = true;
        this.cicdService.getCiCds().subscribe({
            next: (data) => {
                this.cicds = data
                    .filter((cicd: any) => !cicd.isDeleted)
                    .map(cicd => {
                        const clientIdRaw = (cicd as any).clientId || (cicd as any).client;
                        const clientId = (typeof clientIdRaw === 'object' && clientIdRaw !== null)
                            ? (clientIdRaw as any).$oid || clientIdRaw.toString()
                            : clientIdRaw;

                        return {
                            ...cicd,
                            clientId: clientId, // Normalizamos
                            startDate: cicd.startDate ? new Date(cicd.startDate) : undefined,
                            deliveryDate: cicd.deliveryDate ? new Date(cicd.deliveryDate) : undefined
                        };
                    });
                setTimeout(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err) => {
                console.error('Error cargando CI/CDs', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    crearCiCd() {
        this.modoEdicion = false;
        this.descripcionExpandida = false;
        this.nuevoCiCd = {
            name: '',
            area: 'CI/CD',
            client: '',
            startDate: '',
            deliveryDate: '',
            cicdHours: 0,
            status: '',
            description: ''
        };
        this.drawerVisible = true;
    }

    editarCiCd(cicd: CiCd) {
        this.modoEdicion = true;
        this.descripcionExpandida = false;
        const parseDate = (dateVal: any) => {
            if (!dateVal) return undefined;
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? undefined : d;
        };

        this.nuevoCiCd = {
            ...cicd,
            startDate: parseDate(cicd.startDate) as any,
            deliveryDate: parseDate(cicd.deliveryDate) as any,
            description: cicd.description || ''
        };
        this.drawerVisible = true;
        this.cdr.detectChanges();
    }

    eliminarCiCd(cicd: CiCd) {
        if (!cicd._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el registro de ${cicd.name}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.cicdService.deleteCiCd(cicd._id!).subscribe({
                    next: () => {
                        this.cicds = this.cicds.filter(c => c._id !== cicd._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Registro CI/CD eliminado correctamente'
                        });
                        this.cdr.detectChanges();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el registro CI/CD'
                        });
                    }
                });
            }
        });
    }

    getEstatusClass(status: string | undefined): string {
        if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (status.toLowerCase()) {
            case 'estable':
                return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
            case 'urgente':
                return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
            case 'requiere atención':
                return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getAreaClass(area: string | undefined): string {
        if (!area) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (area.toLowerCase()) {
            case 'ci/cd':
                return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
            case 'mkt':
                return 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]';
            case 'proyectos':
            case 'desarrollo':
                return 'bg-[#F0F6FD] text-[#4F7091] border-[#B9D1EA]';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    guardarCiCd(form: any) {
        if (form.invalid || (this.nuevoCiCd.cicdHours || 0) <= 0) {
            if ((this.nuevoCiCd.cicdHours || 0) <= 0) {
                this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes ingresar el número de horas' });
            }
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const cicdObj: CiCd = { ...this.nuevoCiCd };

        const id = this.nuevoCiCd._id;
        const peticion = (this.modoEdicion && id)
            ? this.cicdService.updateCiCd(id, cicdObj)
            : this.cicdService.createCiCd(cicdObj);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.modoEdicion ? 'CI/CD actualizado' : 'CI/CD creado'
                });
                this.recargarTabla();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error en CI/CD:', err);
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
                    this.clientesLista = (data || []).map(c => {
                        const rawId = (c as any)._id;
                        return {
                            ...c,
                            _id: (typeof rawId === 'object' && rawId !== null) ? rawId.$oid || rawId.toString() : rawId,
                            fullName: ((c.clientName || '') + ' ' + (c.clientLastName || '')).trim()
                        };
                    });

                    // Intentar asociar el cliente recién creado
                    const nuevoCli = this.clientesLista.find(c =>
                        c.clientName === firstName && c.clientLastName === lastName
                    );
                    if (nuevoCli) {
                        this.nuevoCiCd.clientId = nuevoCli._id;
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
