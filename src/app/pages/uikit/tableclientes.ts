import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select, SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { clientes, ClientesService } from '../service/clientes.service';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-tableClientes',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        Select,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        DrawerModule,
        ConfirmDialogModule,
    ],
    template: `
    <p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Clientes</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="clientesLista"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '50rem'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['clientName', 'email']"
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
            placeholder="Buscar Cliente"
            class="w-[150px]" />
    </p-iconfield>

            <p-button
                label="Crear Cliente"
                icon="pi pi-user-plus"
                (click)="crearCliente()" />
        </div>

    </div>
</ng-template>

        <ng-template #header>
            <tr>
<th class="w-[20%] px-4 py-3 text-left">
    <div class="flex justify-start items-center gap-2">
        <span class="text-left font-semibold">
            Nombre
        </span>

        <p-columnFilter
            type="text"
            field="clientName"
            display="menu"
            placeholder="Buscar Cliente">
        </p-columnFilter>
    </div>
</th>

<th class="w-[25%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span>Correo</span>
        <p-columnFilter
        type="text" field="email" display="menu" placeholder="Buscar Correo">
        </p-columnFilter>
    </div>
</th>

<th class="w-[15%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span>Teléfono</span>

        <p-columnFilter
         type="text" field="phone" display="menu" placeholder="Buscar Teléfono">
        </p-columnFilter>
    </div>
</th>

<th class="w-[17%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span>Fecha Creación</span>

        <p-columnFilter
         type="date" field="registrationDate" display="menu" placeholder="Buscar Fecha">
        </p-columnFilter>
    </div>
</th>

<th class="w-[13%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span class="font-semibold">Estatus</span>

        <p-columnFilter field="isActive" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
        <ng-template #header>
                <div class="px-4 pt-4 pb-0">
                    <span class="font-semibold">Estatus</span>
                </div>
            </ng-template>

            <ng-template #filter let-value let-filter="filterCallback">
                <p-select
                    [ngModel]="value"
                    [options]="opcionesEstatus"
                    placeholder="Selecciona Estatus"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    optionValue="value"
                    appendTo="body"
                    styleClass="w-full"
                    class="w-full">
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

        <ng-template #body let-cliente>
            <tr>
                <td class="text-left">{{ (cliente.clientName || '') + ' ' + (cliente.clientLastName || '') || 'No registrado' }}</td>
                <td class="text-left">{{ cliente.email || 'No registrado' }}</td>
                <td class="text-left">{{ cliente.phone || 'No registrado' }}</td>
                <td class="text-left whitespace-nowrap">{{ (cliente.registrationDate | date:'dd/MM/yyyy') || 'No registrado' }}</td>
                <td class="text-left">
                    <div class="flex justify-start items-center">
                        <span [ngClass]="getEstatusClass(cliente.isActive)"
                              class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                            {{ cliente.isActive ? 'Activo' : 'No Activo' }}
                        </span>
                    </div>
                </td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarCliente(cliente)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border
                               bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8]
                               hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarCliente(cliente)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border
                               bg-[#fecaca] border-[#f87171] text-[#b91c1c]
                               hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95"
                        >
                            <i class="pi pi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="6">No se encontraron clientes.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="6">Cargando datos. Por favor espere.</td></tr>
        </ng-template>

    </p-table> </div>

   <p-drawer
    [(visible)]="drawerVisible"
    position="right"
    [modal]="false"
    styleClass="!w-[400px] !pt-[5.5rem] !px-[1.5rem] !pb-[1.5rem]">

    <ng-template pTemplate="header">
        <h3 class="font-bold text-lg text-[var(--p-text-color)]">
            <i class="pi pi-users mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Cliente' : 'Crear Cliente' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #clienteForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre*</label>
                    <input
                        pInputText
                        name="clientName"
                        required
                        [(ngModel)]="nuevoCliente.clientName"
                        placeholder="Introduce Nombre"
                        #nameModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nameModel.invalid && (nameModel.touched || clienteForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nameModel.invalid && (nameModel.touched || clienteForm.submitted)">
                        Nombre Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Correo</label>
                    <input
                        pInputText
                        name="email"
                        [(ngModel)]="nuevoCliente.email"
                        placeholder="Introduce Correo"
                        #correoModel="ngModel"
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Teléfono</label>
                    <input
                        pInputText
                        name="phone"
                        [(ngModel)]="nuevoCliente.phone"
                        #numeroModel="ngModel"
                        (keypress)="soloNumeros($event)"
                        maxlength="10"
                        placeholder="Número de teléfono"
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Estatus*</label>
                    <p-select
                        [options]="opcionesEstatus"
                        name="isActive"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoCliente.isActive"
                        #isActiveModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Estatus"
                        class="w-full"
                        [styleClass]="(isActiveModel.invalid && (isActiveModel.touched || clienteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="isActiveModel.invalid && (isActiveModel.touched || clienteForm.submitted)">
                        Estatus Obligatorio
                    </small>
                </div>

            </div>

            <div class="flex justify-end gap-3 mt-4">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(clienteForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarCliente(clienteForm)">
                </p-button>
            </div>
        </form>
    </ng-template>
</p-drawer>

`,
    styles: [`
    .p-datatable-frozen-tbody { font-weight: bold; }
    .p-datatable-scrollable .p-frozen-column { font-weight: bold; }
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

:host ::ng-deep .p-dropdown.ng-invalid.ng-dirty {
    border: 1px solid #ef4444 !important;
}
`],
    providers: [ConfirmationService, MessageService]
})
export class TableClientes implements OnInit {

    drawerVisible: boolean = false;
    nuevoCliente: clientes = {
        clientName: '',
        email: '',
        phone: '',
        registrationDate: undefined,
        isActive: true
    };

    cerrarDrawer(form: any) {
        this.drawerVisible = false;
        form.resetForm();
    }

    modoEdicion: boolean = false;
    clientesLista: clientes[] = [];

    opcionesEstatus = [
        { name: 'Activo', value: true },
        { name: 'No Activo', value: false }
    ];

    crearCliente() {
        this.modoEdicion = false;
        this.nuevoCliente = {
            clientName: '',
            email: '',
            phone: '',
            registrationDate: new Date() as any,
            isActive: true
        };
        this.drawerVisible = true;
    }

    editarCliente(cliente: clientes) {
        this.modoEdicion = true;
        let dateStr: any = cliente.registrationDate;
        if (dateStr && typeof dateStr === 'string' && dateStr.includes('T')) {
            dateStr = dateStr.split('T')[0];
        }

        this.nuevoCliente = {
            ...cliente,
            clientName: (cliente.clientName || '') + (cliente.clientLastName ? ' ' + cliente.clientLastName : ''),
            registrationDate: dateStr
        };
        this.drawerVisible = true;
    }

    eliminarCliente(cliente: clientes) {
        if (!cliente._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar a ${cliente.clientName}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.clientesService.deleteCliente(cliente._id!).subscribe({
                    next: () => {
                        this.clientesLista = this.clientesLista.filter(c => c._id !== cliente._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Cliente eliminado correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el cliente'
                        });
                    }
                });
            }
        });
    }

    getEstatusClass(isActive?: boolean): string {
        return isActive 
            ? 'bg-[#edfdf2] text-[#166534] border-[#bbf7d0]'
            : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]';
    }

    guardarCliente(form: any) {
        if (form.invalid) {
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const nameParts = (this.nuevoCliente.clientName || '').trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const clienteBackend: clientes = {
            clientName: firstName,
            clientLastName: lastName,
            email: (this.nuevoCliente.email && this.nuevoCliente.email.trim() !== '') 
                           ? this.nuevoCliente.email 
                           : 'No registrado',
            phone: (this.nuevoCliente.phone && String(this.nuevoCliente.phone).trim() !== '') 
                           ? String(this.nuevoCliente.phone) 
                           : 'No registrado',
            registrationDate: this.nuevoCliente.registrationDate ? new Date(this.nuevoCliente.registrationDate) : new Date(),
            isActive: this.nuevoCliente.isActive
        };

        const peticion = (this.modoEdicion && this.nuevoCliente._id)
            ? this.clientesService.updateCliente(this.nuevoCliente._id, clienteBackend)
            : this.clientesService.createCliente(clienteBackend);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.modoEdicion ? 'Cliente actualizado' : 'Cliente creado'
                });
                this.recargarTabla();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error en Cliente:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de servidor',
                    detail: err.error?.message || err.message || 'No se pudo completar la operación'
                });
            }
        });
    }

    recargarTabla() {
        this.clientesService.getClientes().subscribe(data => {
            this.clientesLista = data.filter((c: any) => !c.isDeleted);
            this.drawerVisible = false;
            this.cdr.detectChanges();
        });
    }

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.loading = true;
        this.clientesService.getClientes().subscribe({
            next: (clientesResult) => {
                setTimeout(() => {
                    this.clientesLista = clientesResult.filter((c: any) => !c.isDeleted);
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err: any) => {
                console.error('Error cargando clientes', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
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
}
