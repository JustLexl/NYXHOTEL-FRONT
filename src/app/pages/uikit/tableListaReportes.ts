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
import { DatePickerModule } from 'primeng/datepicker';

import { ListaReportes, ListaReportesService } from '../service/lista-reportes.service';
import { AuthService } from '../../core/services/auth.service';
import { ClientesService, clientes } from '../service/clientes.service';
import { UsuarioService, User } from '../service/usuarios.service';

@Component({
    selector: 'app-tableListaReportes',
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
        DatePickerModule,
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Lista de Reportes</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="reportes"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '75rem', 'width': '100%', 'table-layout': 'fixed'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['area', 'reportType', 'reportCreator']"
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
                            placeholder="Buscar Reportes"
                            class="w-[150px]" />
                    </p-iconfield>

                    <p-button
                        label="Crear Reporte"
                        icon="pi pi-plus"
                        (click)="crearReporte()" />
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Fecha de Creación</span>
                        <p-columnFilter 
                            #cf
                            field="createdAt" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Seleccionar Fecha</span>
                                        <p-datepicker 
                                            [(ngModel)]="fechaCreacionFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearFechaFilter(cf)"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyFechaFilter(cf)"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Área</span>
                        <p-columnFilter type="text" field="area" display="menu" placeholder="Buscar Área"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Tipo de Reporte</span>
                        <p-columnFilter type="text" field="reportType" display="menu" placeholder="Buscar Tipo"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>Intervalo de Tiempo</span>
                        <p-columnFilter 
                            #cfRange
                            field="filtroRango" 
                            display="menu"
                            [showMatchModes]="false" 
                            [showOperator]="false" 
                            [showAddButton]="false"
                            [showClearButton]="false"
                            [showApplyButton]="false">
                            <ng-template #filter>
                                <div class="flex flex-col gap-4 p-2 min-w-[220px]" (click)="$event.stopPropagation()">
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Desde</span>
                                        <p-datepicker 
                                            [(ngModel)]="rangeInicioFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <span class="text-xs font-bold uppercase text-muted-color">Hasta</span>
                                        <p-datepicker 
                                            [(ngModel)]="rangeFinFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearRangeFilter(cfRange)"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyRangeFilter(cfRange)"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[18%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Creador</span>
                        <p-columnFilter type="text" field="reportCreator" display="menu" placeholder="Buscar Creador"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[10%] px-4 py-3">
                    <div class="flex justify-center items-center font-semibold">Acciones</div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-reporte>
            <tr>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    {{ formatFechaCreacion(reporte.createdAt) }}
                </td>
                <td class="text-left px-4 py-3">{{ reporte.area }} <span *ngIf="reporte.targetName" class="text-gray-500 font-semibold text-xs ml-1">({{ reporte.targetName }}{{ reporte.targetStatus ? ' - ' + reporte.targetStatus : '' }})</span></td>
                <td class="text-left px-4 py-3">{{ reporte.reportType }}</td>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    <span *ngIf="(reporte.reportType !== 'historico') && reporte.startDate && reporte.endDate">
                        {{ (reporte.startDate | date: 'dd/MM/yyyy') }} <span class="text-gray-400 mx-1">al</span> {{ (reporte.endDate | date: 'dd/MM/yyyy') }}
                    </span>
                    <span *ngIf="reporte.reportType === 'historico' || !reporte.startDate || !reporte.endDate">
                        N/A
                    </span>
                </td>
                <td class="text-left px-4 py-3">{{ reporte.reportCreator }}</td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="verConcentrado(reporte)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#dcfce7] border-[#86efac] text-[#166534] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-external-link text-sm"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarReporte(reporte)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-trash text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="6" class="text-center p-4">No se encontraron registros.</td></tr>
        </ng-template>

        <ng-template #loadingbody>
            <tr><td colspan="6" class="text-center p-4">Cargando datos. Por favor espere.</td></tr>
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
            <i class="pi pi-file-export mr-2 text-primary"></i> Nuevo Reporte
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #reporteForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Área del reporte*</label>
                    <p-select
                        [options]="areasOptions"
                        name="area"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoReporte.area"
                        #areaModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Área"
                        class="w-full"
                        [styleClass]="(areaModel.invalid && (areaModel.touched || reporteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="areaModel.invalid && (areaModel.touched || reporteForm.submitted)">
                        Área Obligatoria
                    </small>
                </div>

                <div class="flex gap-4" *ngIf="nuevoReporte.area === 'por cliente'">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Cliente*</label>
                        <p-select
                            [options]="clientesList"
                            name="targetName"
                            optionLabel="clientName"
                            optionValue="clientName"
                            [(ngModel)]="nuevoReporte.targetName"
                            (onChange)="onClienteSelect($event.value)"
                            #clienteModel="ngModel"
                            required
                            appendTo="body"
                            placeholder="Selecciona Cliente"
                            class="w-full"
                            [styleClass]="(clienteModel.invalid && (clienteModel.touched || reporteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                        ></p-select>
                        <small class="text-red-500 mt-1" *ngIf="clienteModel.invalid && (clienteModel.touched || reporteForm.submitted)">
                            Cliente Obligatorio
                        </small>
                    </div>
                    <div class="flex flex-col w-1/2" *ngIf="nuevoReporte.targetName">
                        <label class="mb-2 font-medium text-base">Estado*</label>
                        <p-select
                            [options]="estatusClienteOptions"
                            name="targetStatus"
                            optionLabel="name"
                            optionValue="value"
                            [(ngModel)]="nuevoReporte.targetStatus"
                            #estatusModel="ngModel"
                            required
                            appendTo="body"
                            placeholder="Selecciona Estado"
                            class="w-full"
                            [styleClass]="(estatusModel.invalid && (estatusModel.touched || reporteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                        ></p-select>
                        <small class="text-red-500 mt-1" *ngIf="estatusModel.invalid && (estatusModel.touched || reporteForm.submitted)">
                            Estado Obligatorio
                        </small>
                    </div>
                </div>

                <div class="flex flex-col" *ngIf="nuevoReporte.area === 'por ingeniero'">
                    <label class="mb-2 font-medium text-base">Ingeniero*</label>
                    <p-select
                        [options]="usuariosList"
                        name="targetName"
                        optionLabel="name"
                        optionValue="name"
                        [(ngModel)]="nuevoReporte.targetName"
                        #ingenieroModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Ingeniero"
                        class="w-full"
                        [styleClass]="(ingenieroModel.invalid && (ingenieroModel.touched || reporteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="ingenieroModel.invalid && (ingenieroModel.touched || reporteForm.submitted)">
                        Ingeniero Obligatorio
                    </small>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Tipo de reporte*</label>
                    <p-select
                        [options]="tiposReporteOptions"
                        name="reportType"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevoReporte.reportType"
                        #tipoReporteModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Tipo"
                        class="w-full"
                        [styleClass]="(tipoReporteModel.invalid && (tipoReporteModel.touched || reporteForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="tipoReporteModel.invalid && (tipoReporteModel.touched || reporteForm.submitted)">
                        Tipo de reporte Obligatorio
                    </small>
                </div>

                <div class="flex gap-4" *ngIf="nuevoReporte.reportType === 'periodo'">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Inicio*</label>
                        <p-datepicker 
                            name="startDate"
                            [(ngModel)]="nuevoReporte.startDate"
                            #fechaInicioModel="ngModel"
                            [required]="nuevoReporte.reportType === 'periodo'"
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (fechaInicioModel.invalid && (fechaInicioModel.touched || reporteForm.submitted))}">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Fecha Fin*</label>
                        <p-datepicker 
                            name="endDate"
                            [(ngModel)]="nuevoReporte.endDate"
                            #fechaFinModel="ngModel"
                            [required]="nuevoReporte.reportType === 'periodo'"
                            appendTo="body"
                            [showIcon]="true"
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yy"
                            styleClass="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': (fechaFinModel.invalid && (fechaFinModel.touched || reporteForm.submitted))}">
                        </p-datepicker>
                    </div>
                </div>

            </div>

            <div class="flex justify-end gap-3 mt-6">

                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(reporteForm)">
                </p-button>

                <p-button
                    label="Generar Reporte"
                    (click)="guardarReporte(reporteForm)">
                </p-button>
            </div>
        </form>
    </ng-template>
</p-drawer>
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
    `],
    providers: [ConfirmationService, MessageService]
})
export class TableListaReportes implements OnInit {

    drawerVisible: boolean = false;
    loading: boolean = true;
    reportes: ListaReportes[] = [];
    clientesList: clientes[] = [];
    usuariosList: User[] = [];

    nuevoReporte: ListaReportes = {
        reportType: '',
        area: '',
        startDate: '',
        endDate: '',
        reportCreator: '',
        targetName: '',
        targetStatus: ''
    };

    fechaCreacionFilter: Date | null = null;
    rangeInicioFilter: Date | null = null;
    rangeFinFilter: Date | null = null;
    meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    tiposReporteOptions = [
        { name: 'Histórico', value: 'historico' },
        { name: 'Periodo', value: 'periodo' },
        { name: 'Semanal', value: 'semanal' },
        { name: 'Mensual', value: 'mensual' },
        { name: 'Mensual por semana', value: 'mensual por semana' }
    ];

    areasOptions = [
        { name: 'Todas', value: 'todas' },
        { name: 'CI/CD', value: 'ci/cd' },
        { name: 'Desarrollo', value: 'desarrollo' },
        { name: 'MKT', value: 'mkt' },
        { name: 'Hosting', value: 'hosting' },
        { name: 'Por ingeniero', value: 'por ingeniero' },
        { name: 'Por cliente', value: 'por cliente' }
    ];

    estatusClienteOptions = [
        { name: 'Activo', value: 'Activo' },
        { name: 'Inactivo', value: 'Inactivo' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private reportesService: ListaReportesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        public authService: AuthService,
        private clientesService: ClientesService,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.recargarTabla();
        });
        this.clientesService.getClientes().subscribe(data => {
            this.clientesList = data;
            this.cdr.markForCheck();
        });
        this.usuarioService.getUsers().subscribe(data => {
            this.usuariosList = data;
            this.cdr.markForCheck();
        });
    }

    recargarTabla() {
        this.loading = true;
        this.reportesService.getReportes().subscribe({
            next: (data) => {
                this.reportes = data.map(r => {
                    const dateObj = r.createdAt ? new Date(r.createdAt) : null;
                    return {
                        ...r,
                        createdAt: dateObj || undefined,
                        startDate: r.startDate ? new Date(r.startDate) : undefined,
                        endDate: r.endDate ? new Date(r.endDate) : undefined
                    };
                });
                setTimeout(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err) => {
                console.error('Error cargando Reportes', err);
                this.loading = false;
            }
        });
    }

    crearReporte() {
        this.nuevoReporte = {
            reportType: '',
            area: '',
            startDate: undefined as any,
            endDate: undefined as any,
            reportCreator: this.authService.userProfile()?.name || 'Usuario',
            targetName: '',
            targetStatus: ''
        };
        this.drawerVisible = true;
    }

    onClienteSelect(value: string) {
        const clienteSeleccionado = this.clientesList.find(c => c.clientName === value);
        if (clienteSeleccionado && clienteSeleccionado.status) {
            this.nuevoReporte.targetStatus = clienteSeleccionado.status;
        } else {
            this.nuevoReporte.targetStatus = 'Activo';
        }
    }

    formatFechaCreacion(dateVal?: any): string {
        if (!dateVal) return 'N/A';
        const date = new Date(dateVal);

        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = dias[date.getDay()];
        const diaNumero = date.getDate();
        const mesNombre = this.meses[date.getMonth()];
        const anio = date.getFullYear();
        const horas = date.getHours().toString().padStart(2, '0');
        const mins = date.getMinutes().toString().padStart(2, '0');

        return `${diaSemana} ${diaNumero} de ${mesNombre}, ${anio} ${horas}:${mins}`;
    }

    verConcentrado(reporte: ListaReportes) {
        if (!reporte._id) return;

        window.open('/Inicio/ConcentradoReporte/' + reporte._id, '_blank');
    }

    eliminarReporte(reporte: ListaReportes) {
        if (!reporte._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar este reporte de ${reporte.area}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.reportesService.deleteReporte(reporte._id!).subscribe({
                    next: () => {
                        this.reportes = this.reportes.filter(r => r._id !== reporte._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Reporte eliminado correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el reporte'
                        });
                    }
                });
            }
        });
    }

    guardarReporte(form: any) {
        if (form.invalid) {
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const reporteObj: ListaReportes = { ...this.nuevoReporte };

        if (reporteObj.reportType !== 'periodo') {
            delete reporteObj.startDate;
            delete reporteObj.endDate;
        }

        this.reportesService.createReporte(reporteObj).subscribe({
            next: (savedReporte) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Reporte generado correctamente'
                });
                this.recargarTabla();
                this.drawerVisible = false;

                setTimeout(() => {
                    this.verConcentrado(savedReporte);
                }, 500);
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de servidor',
                    detail: err.error?.message || 'No se pudo generar el reporte'
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
        this.fechaCreacionFilter = null;
        if (inputGlobal) {
            inputGlobal.value = '';
        }
    }

    applyFechaFilter(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.fechaCreacionFilter, 'createdAt', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    clearFechaFilter(cf: any) {
        this.fechaCreacionFilter = null;
        if (this.dt1) {
            this.dt1.filter(null, 'createdAt', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    applyRangeFilter(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.rangeInicioFilter, 'startDate', 'dateIs');
            this.dt1.filter(this.rangeFinFilter, 'endDate', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    clearRangeFilter(cf: any) {
        this.rangeInicioFilter = null;
        this.rangeFinFilter = null;
        if (this.dt1) {
            this.dt1.filter(null, 'startDate', 'dateIs');
            this.dt1.filter(null, 'endDate', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }
}
