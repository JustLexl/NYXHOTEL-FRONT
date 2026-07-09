import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { User, UsuarioService } from '../service/usuarios.service';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase-config';

import { ChangeDetectorRef } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

type UserWithPhone = User & { phone?: number };

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-tableUsuarios',
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
    <div class="font-semibold text-xl mb-2">Usuarios</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full">

    </div>

    <p-table
        #dt1
        [value]="customers1"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '50rem'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['name', 'email', 'jobPosition', 'jobArea', 'role', 'phone']"
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
            placeholder="Buscar Usuario"
            class="w-[150px]" />
    </p-iconfield>

            <p-button
                label="Crear Usuario"
                icon="pi pi-user-plus"
                (click)="crearUsuario()" />
        </div>

    </div>
</ng-template>

        <ng-template #header>
            <tr>
<th class="w-[16%] px-4 py-3 text-left">
    <div class="flex justify-start items-center gap-2">
        <span class="text-left font-semibold">
            Nombre
        </span>

        <p-columnFilter
            type="text"
            field="name"
            display="menu"
            placeholder="Buscar Usuario">
        </p-columnFilter>
    </div>
</th>

<th class="w-[16%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span class="font-semibold ">Posición De Trabajo</span>
        
        <p-columnFilter field="jobPosition" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
        <ng-template #header>
                <div class="px-4 pt-4 pb-0">
                    <span class="font-semibold">Posición</span>
                </div>
            </ng-template>

            <ng-template #filter let-value let-filter="filterCallback">
                <p-select
                    [ngModel]="value"
                    [options]="roles2"
                    placeholder="Selecciona Posición"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    optionValue="value"
                    styleClass="w-full border-slate-200"
                    class="w-full">

                    <ng-template let-option #item>
                        <div class="flex items-start gap-2 w-44 py-1">
                            <span>{{ option.name }}</span>
                        </div>
                    </ng-template>
                </p-select>
            </ng-template>
        </p-columnFilter>
    </div>
</th>
<th class="w-[14%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span class="font-semibold">Area De Trabajo</span>

        <p-columnFilter field="jobArea" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
        <ng-template #header>
                <div class="px-4 pt-4 pb-0">
                    <span class="font-semibold">Area de trabajo</span>
                </div>
            </ng-template>

            <ng-template #filter let-value let-filter="filterCallback">
                <p-select
                    [ngModel]="value"
                    [options]="roles"
                    placeholder="Selecciona Área"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    optionValue="value"
                    styleClass="w-full"
                    class="w-full">

                    <ng-template let-option #item>
                        <div class="flex items-center gap-2 w-44">
                            <span>{{ option.name }}</span>
                        </div>
                    </ng-template>
                </p-select>
            </ng-template>
        </p-columnFilter>
    </div>
</th>
<th class="w-[14%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span class="font-semibold ">Rol</span>
        <p-columnFilter field="role" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
        <ng-template #header>
                <div class="px-4 pt-4 pb-0">
                    <span class="font-semibold">Rol</span>
                </div>
            </ng-template>

            <ng-template #filter let-value let-filter="filterCallback">
                <p-select
                    [ngModel]="value"
                    [options]="roles3"
                    placeholder="Selecciona Rol"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    optionValue="value"
                    class="w-full"
                    styleClass="w-full">
                    <ng-template let-option #item>
                        <div class="flex items-center gap-2 w-44">
                            <span>{{ option.name }}</span>
                        </div>
                    </ng-template>
                </p-select>
            </ng-template>
        </p-columnFilter>
    </div>
</th>

<th class="w-[12%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span>Teléfono</span>

        <p-columnFilter
         type="text" field="phone" display="menu" placeholder="Buscar Teléfono">
        </p-columnFilter>
    </div>
</th>

<th class="w-[18%] px-4 py-3 text-left">
<div class="flex justify-start items-center gap-2 font-semibold">
        <span>Correo</span>
        <p-columnFilter
        type="text" field="email" display="menu" placeholder="Buscar Correo">
        </p-columnFilter>
    </div>
</th>

<th class="w-[10%] px-4 py-3">
    <div class="flex justify-center items-center font-semibold">Acciones</div>
</th>
            </tr>
        </ng-template>

        <ng-template #body let-customer>
            <tr>
                <td class="text-left">{{ customer.name }}</td>
                <td class="text-left">
                    <span class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm whitespace-nowrap
                                bg-[#FBF3F4] text-[#913E4A] border-[#D9A8AF]">
                        {{ customer.jobPosition }}
                    </span>
                </td>
                <td class="text-left">
                    <span [ngClass]="getRolClass(customer.jobArea)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ customer.jobArea }}
                    </span>
                </td>
                <td class="text-left">
                    <span class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm
                                bg-[#FFF0F3] text-[#6A5B8E] border-[#CBBEE5] whitespace-nowrap">
                        {{ customer.role }}
                    </span>
                </td>
                <td class="text-left">
                    {{ customer.phone }}</td>
                <td class="text-left whitespace-nowrap">{{ customer.email }}</td>

                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarUsuario(customer)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border
                               bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8]
                               hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarUsuario(customer)"
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
            <tr><td colspan="7">No se encontraron usuarios.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="7">Cargando datos. Por favor espere.</td></tr>
        </ng-template>

    </p-table> </div>

   <p-drawer
    [(visible)]="drawerVisible"
    position="right"
    [modal]="false"
    styleClass="!w-[400px] !pt-[5.5rem] !px-[1.5rem] !pb-[1.5rem]">

    <ng-template pTemplate="header">
        <h3 class="font-bold text-lg text-[var(--p-text-color)]">
            <i class="pi pi-user mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #usuarioForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre*</label>
                    <input
                        pInputText
                        name="name"
                        required
                        [(ngModel)]="nuevoUsuario.name"
                        #nameModel="ngModel"                        
                        placeholder="Introduce Nombre"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (nameModel.invalid && (nameModel.touched || usuarioForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="nameModel.invalid && (nameModel.touched || usuarioForm.submitted)">
                        Nombre Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Correo*</label>
                    <input
                        pInputText
                        name="email"
                        required
                        email
                        [(ngModel)]="nuevoUsuario.email"
                        placeholder="Introduce Correo"
                        #emailModel="ngModel"
                        class="w-full p-2 border rounded"
                        [ngClass]="{'ng-invalid ng-dirty': (emailModel.invalid && (emailModel.touched || usuarioForm.submitted))}"
                    />
                    <small class="text-red-500 mt-1" *ngIf="emailModel.invalid && (emailModel.touched || usuarioForm.submitted)">
                        Correo Obligatorio (nyxhotelcancun)
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Posición de trabajo*</label>
                    <p-select
                        [options]="roles2"
                        name="jobPosition"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoUsuario.jobPosition"
                        placeholder="Selecciona Posición"
                        #jobPositionModel="ngModel"
                        required
                        appendTo="body"
                        class="w-full"
                        [styleClass]="(jobPositionModel.invalid && (jobPositionModel.touched || usuarioForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="jobPositionModel.invalid && (jobPositionModel.touched || usuarioForm.submitted)">
                        Posición Obligatoria
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Área de trabajo*</label>
                    <p-select
                        [options]="roles"
                        name="jobArea"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoUsuario.jobArea"
                        #jobAreaModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona área"
                        class="w-full"
                        [styleClass]="(jobAreaModel.invalid && (jobAreaModel.touched || usuarioForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="jobAreaModel.invalid && (jobAreaModel.touched || usuarioForm.submitted)">
                        Área Obligatoria
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Rol*</label>
                    <p-select
                        [options]="roles3"
                        name="role"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoUsuario.role"
                        #roleModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona rol"
                        class="w-full"
                        [styleClass]="(roleModel.invalid && (roleModel.touched || usuarioForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="roleModel.invalid && (roleModel.touched || usuarioForm.submitted)">
                        Rol Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Teléfono*</label>
                    <input
                        pInputText
                        name="phone"
                        required
                        [(ngModel)]="nuevoUsuario.phone"
                        #phoneModel="ngModel"
                        (keypress)="soloNumeros($event)"
                        maxlength="10"
                        placeholder="Número"
                        [ngClass]="{'ng-invalid ng-dirty': (phoneModel.invalid && (phoneModel.touched || usuarioForm.submitted))}"
                        class="w-full p-2 border rounded"
                    />
                    <small class="text-red-500 mt-1" *ngIf="phoneModel.invalid && (phoneModel.touched || usuarioForm.submitted)">
                        Teléfono obligatorio
                    </small>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-4">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(usuarioForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarUsuario(usuarioForm)">
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
export class TableUsuarios implements OnInit {

    drawerVisible: boolean = false;
    nuevoUsuario: any = {
        name: '',
        email: '',
        jobArea: '',
        jobPosition: '',
        role: '',
        phone: null,
    };

    cerrarDrawer(form: any) {
        this.drawerVisible = false;
        form.resetForm();
    }

    modoEdicion: boolean = false;
    customers1: UserWithPhone[] = [];
    customers2: UserWithPhone[] = [];
    customers3: UserWithPhone[] = [];
    roles = [
        { name: 'Desarrollo', value: 'Desarrollo' },
        { name: 'Marketing', value: 'Marketing' },
        { name: 'CI/CD', value: 'CI/CD' },
    ];

    roles2 = [
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Desarrollador', value: 'Desarrollador' },
        { name: 'Practicante', value: 'Practicante' },
        { name: 'Dev', value: 'Dev' }
    ];

    roles3 = [
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Desarrollador', value: 'Desarrollador' },
        { name: 'Marketing', value: 'Marketing' },
        { name: 'CI/CD', value: 'CI/CD' }
    ];

    crearUsuario() {

        this.modoEdicion = false;
        this.nuevoUsuario = {
            name: '',
            email: '',
            jobArea: '',
            role: '',
            phone: '',
            jobPosition: ''
        };
        this.drawerVisible = true;
    }

    editarUsuario(customer: User) {
        this.modoEdicion = true;
        this.nuevoUsuario = {
            ...customer
        };
        this.drawerVisible = true;
    }

    eliminarUsuario(customer: User) {
        if (!customer._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar a ${customer.name}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {

                this.UsuarioService.deleteUser(customer._id!).subscribe({
                    next: () => {

                        this.customers1 = this.customers1.filter(c => c._id !== customer._id);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Usuario eliminado correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar'
                        });
                    }
                });

            }
        });
    }
    getRolClass(jobArea: string): string {
        const clases: { [key: string]: string } = {
            'Administrador': 'bg-[#FFF6ED] text-[#9E6B55] border-[#FAD7B5]',
            'Desarrollador': 'bg-[#F0F6FD] text-[#4F7091] border-[#B9D1EA]',
            'Desarrollo': 'bg-[#F0F6FD] text-[#4F7091] border-[#B9D1EA]',
            'Marketing': 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
            'CI/CD': 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]'
        };

        return clases[jobArea] || 'bg-gray-50 text-gray-600 border-gray-200';
    }
    guardarUsuario(form: any) {
        if (form.invalid) {
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const emailToSave = this.nuevoUsuario.email?.toLowerCase() || '';
        const esDominioValido = emailToSave.endsWith('@monstruocanela.com') || emailToSave.endsWith('@dappertechnologies.com') || emailToSave.endsWith('@outlook.com') || emailToSave.endsWith('@nyxhotelcancun.com');

        if (!esDominioValido) {
            this.messageService.add({
                severity: 'error',
                summary: 'Correo no autorizado',
                detail: 'Solo se permiten correos de @nyxhotelcancun.com'
            });
            return;
        }

        const phoneConcatenado = this.nuevoUsuario.phone;

        const usuarioBackend: User = {
            name: this.nuevoUsuario.name,
            email: emailToSave,
            jobArea: this.nuevoUsuario.jobArea,
            role: this.nuevoUsuario.role,
            phone: Number(phoneConcatenado),
            jobPosition: this.nuevoUsuario.jobPosition
        };

        const peticion = (this.modoEdicion && this.nuevoUsuario._id)
            ? this.UsuarioService.updateUser(this.nuevoUsuario._id, usuarioBackend)
            : this.UsuarioService.createUser(usuarioBackend);

        peticion.subscribe({
            next: () => {
                if (!this.modoEdicion) {
                    sendPasswordResetEmail(auth, emailToSave).then(() => {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Invitación enviada',
                            detail: `Se ha enviado un correo a ${emailToSave} para configurar su contraseña.`
                        });
                    }).catch((error) => {
                        console.error('Error sending reset email:', error);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Error en envío',
                            detail: 'Usuario creado, pero no se pudo enviar el correo de invitación.'
                        });
                    });
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario guardado correctamente'
                });
                this.recargarTabla();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de servidor',
                    detail: err.error?.message || 'No se pudo completar la operación'
                });
            }
        });
    }
    recargarTabla() {
        this.UsuarioService.getUsers().subscribe(data => {
            this.customers1 = data;
            this.drawerVisible = false;
            this.cdr.detectChanges();

        });
    }

    selectedCustomers1: User[] = [];

    selectedCustomer: User = {};

    statuses: any[] = [];


    rowGroupMetadata: any = {};

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    NumeroFrozen: boolean = false;

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private UsuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
    ) { }


    ngOnInit() {
        this.rowGroupMetadata = {};
        this.loading = true;

        this.UsuarioService.getUsers().subscribe({
            next: (customers) => {

                for (let i = 0; i < customers.length; i++) {
                    const rowData = customers[i];
                    const jobAreaName = rowData?.jobArea ?? '';

                    if (i === 0) {
                        this.rowGroupMetadata[jobAreaName] = {
                            index: 0,
                            size: 1
                        };
                    } else {
                        const previousRowData = customers[i - 1];
                        const previousRowGroup = previousRowData?.jobArea;

                        if (jobAreaName === previousRowGroup) {
                            this.rowGroupMetadata[jobAreaName].size++;
                        } else {
                            this.rowGroupMetadata[jobAreaName] = {
                                index: i,
                                size: 1
                            };
                        }
                    }
                }

                setTimeout(() => {
                    this.customers1 = customers;
                    this.customers2 = customers;
                    this.customers3 = customers;
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

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers2) {
            for (let customer of this.customers2) {
                if (customer?.jobPosition === name) {
                    total++;
                }
            }
        }

        return total;
    }

    collapseAll() {
        this.expandedRows = {};
    }
}
