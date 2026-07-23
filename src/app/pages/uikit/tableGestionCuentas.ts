import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
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
import { TooltipModule } from 'primeng/tooltip';
import { Cuenta, CuentasService } from '../service/cuentas.service';

@Component({
    selector: 'app-tableGestionCuentas',
    standalone: true,
    imports: [
        TableModule,
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
        TooltipModule
    ],
    template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="card main-content" [class.drawer-open]="drawerVisible">
        <div class="font-semibold text-xl mb-2">Gestión de Cuentas</div>

        <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

        <p-table
            #dt1
            [value]="cuentasLista"
            dataKey="_id"
            [rows]="10"
            [loading]="loading"
            [rowHover]="true"
            [showGridlines]="false"
            [tableStyle]="{'min-width': '50rem'}"
            styleClass="p-datatable-sm custom-modern-table"
            [paginator]="true"
            [globalFilterFields]="['nombre', 'departamento', 'puesto', 'tipoCuenta', 'correo', 'contrasena']"
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
                                placeholder="Buscar Cuenta..."
                                class="w-[180px]" />
                        </p-iconfield>

                        <p-button
                            label="Crear Cuenta"
                            icon="pi pi-plus"
                            (click)="crearCuenta()" />
                    </div>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th class="w-[16%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2">
                            <span class="text-left font-semibold">Nombre</span>
                            <p-columnFilter
                                type="text"
                                field="nombre"
                                display="menu"
                                placeholder="Buscar nombre">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[16%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Departamento</span>
                            <p-columnFilter
                                type="text"
                                field="departamento"
                                display="menu"
                                placeholder="Buscar departamento">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[16%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Puesto</span>
                            <p-columnFilter
                                type="text"
                                field="puesto"
                                display="menu"
                                placeholder="Buscar puesto">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[16%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Tipo de Cuenta</span>
                            <p-columnFilter
                                type="text"
                                field="tipoCuenta"
                                display="menu"
                                placeholder="Buscar tipo de cuenta">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[18%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Correo</span>
                            <p-columnFilter
                                type="text"
                                field="correo"
                                display="menu"
                                placeholder="Buscar correo">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[12%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Contraseña</span>
                            <p-columnFilter
                                type="text"
                                field="contrasena"
                                display="menu"
                                placeholder="Buscar contraseña">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[6%] px-4 py-3">
                        <div class="flex justify-center items-center font-semibold">Acciones</div>
                    </th>
                </tr>
            </ng-template>

            <ng-template #body let-cuenta>
                <tr>
                    <td class="text-left">{{ cuenta.nombre || 'Sin nombre' }}</td>
                    <td class="text-left">{{ cuenta.departamento || 'Sin asignar' }}</td>
                    <td class="text-left">{{ cuenta.puesto || 'Sin asignar' }}</td>
                    <td class="text-left">{{ cuenta.tipoCuenta || 'Sin especificar' }}</td>
                    <td class="text-left">{{ cuenta.correo || 'Sin correo' }}</td>
                    <td class="text-left font-mono text-sm">{{ cuenta.contrasena || 'Sin contraseña' }}</td>
                    <td>
                        <div class="flex gap-2 justify-center">
                            <button
                                type="button"
                                (click)="editarCuenta(cuenta)"
                                class="flex items-center justify-center w-8 h-8 rounded-md border
                                   bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8]
                                   hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                                <i class="pi pi-pencil"></i>
                            </button>
                            <button
                                type="button"
                                (click)="eliminarCuenta(cuenta)"
                                class="flex items-center justify-center w-8 h-8 rounded-md border
                                   bg-[#fecaca] border-[#f87171] text-[#b91c1c]
                                   hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                                <i class="pi pi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr><td colspan="7">No se encontraron cuentas registradas.</td></tr>
            </ng-template>

            <ng-template #loadingbody>
                <tr><td colspan="7">Cargando datos. Por favor espere.</td></tr>
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
                <i class="pi pi-key mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Cuenta' : 'Crear Cuenta' }}
            </h3>
        </ng-template>

        <ng-template pTemplate="content">
            <form #cuentaForm="ngForm" novalidate>
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Nombre</label>
                        <input
                            pInputText
                            name="nombre"
                            [(ngModel)]="nuevaCuenta.nombre"
                            placeholder="Introduce nombre"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Departamento</label>
                        <input
                            pInputText
                            name="departamento"
                            [(ngModel)]="nuevaCuenta.departamento"
                            placeholder="Introduce departamento"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Puesto</label>
                        <input
                            pInputText
                            name="puesto"
                            [(ngModel)]="nuevaCuenta.puesto"
                            placeholder="Introduce puesto"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Tipo de Cuenta</label>
                        <input
                            pInputText
                            name="tipoCuenta"
                            [(ngModel)]="nuevaCuenta.tipoCuenta"
                            placeholder="Introduce tipo de cuenta"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Correo</label>
                        <input
                            pInputText
                            type="email"
                            name="correo"
                            [(ngModel)]="nuevaCuenta.correo"
                            placeholder="Introduce correo"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Contraseña</label>
                        <input
                            pInputText
                            type="text"
                            name="contrasena"
                            [(ngModel)]="nuevaCuenta.contrasena"
                            placeholder="Introduce contraseña"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <p-button
                        label="Cancelar"
                        severity="secondary"
                        [outlined]="true"
                        (click)="cerrarDrawer(cuentaForm)">
                    </p-button>

                    <p-button
                        label="Guardar"
                        (click)="guardarCuenta(cuentaForm)">
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
    `],
    providers: [ConfirmationService, MessageService]
})
export class TableGestionCuentas implements OnInit {

    drawerVisible: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    cuentasLista: Cuenta[] = [];

    visiblePasswords: { [id: string]: boolean } = {};

    nuevaCuenta: Cuenta = {
        nombre: '',
        departamento: '',
        puesto: '',
        tipoCuenta: '',
        correo: '',
        contrasena: ''
    };

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private cuentasService: CuentasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.cargarCuentas();
    }

    cargarCuentas() {
        this.loading = true;
        this.cuentasService.getCuentas().subscribe({
            next: (cuentasResult) => {
                this.cuentasLista = (cuentasResult || []).filter((c: any) => !c.isDeleted);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('Error cargando cuentas', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    crearCuenta() {
        this.modoEdicion = false;
        this.nuevaCuenta = {
            nombre: '',
            departamento: '',
            puesto: '',
            tipoCuenta: '',
            correo: '',
            contrasena: ''
        };
        this.drawerVisible = true;
    }

    editarCuenta(cuenta: Cuenta) {
        this.modoEdicion = true;
        this.nuevaCuenta = { ...cuenta };
        this.drawerVisible = true;
    }

    eliminarCuenta(cuenta: Cuenta) {
        if (!cuenta._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar la cuenta de ${cuenta.correo || cuenta.departamento || 'este registro'}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.cuentasService.deleteCuenta(cuenta._id!).subscribe({
                    next: () => {
                        this.cuentasLista = this.cuentasLista.filter(c => c._id !== cuenta._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Cuenta eliminada correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar la cuenta'
                        });
                    }
                });
            }
        });
    }

    guardarCuenta(form: any) {
        const peticion = (this.modoEdicion && this.nuevaCuenta._id)
            ? this.cuentasService.updateCuenta(this.nuevaCuenta._id, this.nuevaCuenta)
            : this.cuentasService.createCuenta(this.nuevaCuenta);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: this.modoEdicion ? 'Cuenta actualizada correctamente' : 'Cuenta creada correctamente'
                });
                this.cargarCuentas();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error al guardar cuenta:', err);
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
        if (form) {
            form.resetForm();
        }
    }

    togglePasswordVisibility(id?: string) {
        if (!id) return;
        this.visiblePasswords[id] = !this.visiblePasswords[id];
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
}
