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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

import { ListaHorasService, Hora } from '../service/lista-horas.service';
import { ListaProyectosService, Proyecto } from '../service/lista-proyectos.service';
import { CiCdService } from '../service/cicd.service';
import { MktService } from '../service/mkt.service';
import { UsuarioService, User } from '../service/usuarios.service';
import { AuthService } from '@/app/core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-tableListaHoras',
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
        TooltipModule,
        DatePickerModule,
        InputNumberModule,
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="card main-content" [class.drawer-open]="drawerVisible">
    <div class="font-semibold text-xl mb-2">Lista de Horas</div>

    <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

    <p-table
        #dt1
        [value]="horas"
        dataKey="_id"
        [rows]="10"
        [loading]="loading"
        [rowHover]="true"
        [showGridlines]="false"
        [tableStyle]="{'min-width': '75rem', 'width': '100%', 'table-layout': 'fixed'}"
        styleClass="p-datatable-sm custom-modern-table"
        [paginator]="true"
        [globalFilterFields]="['developer', 'projectName', 'area']"
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
                            placeholder="Buscar"
                            class="w-[150px]" />
                    </p-iconfield>

                    <p-button
                        label="Registrar Horas"
                        icon="pi pi-plus"
                        (click)="crearHora()" />
                </div>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th class="w-[20%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="text-left font-semibold">Desarrollador</span>
                        <p-columnFilter type="text" field="developer" display="menu" placeholder="Buscar Desarrollador"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[25%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Nombre del Proyecto</span>
                        <p-columnFilter type="text" field="projectName" display="menu" placeholder="Buscar Proyecto"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[15%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2">
                        <span class="font-semibold">Área</span>
                        <p-columnFilter type="text" field="area" display="menu" placeholder="Buscar Área"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[17%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>Horas Trabajadas</span>
                        <p-columnFilter type="numeric" field="hoursWorked" display="menu" placeholder="Buscar Horas"></p-columnFilter>
                    </div>
                </th>
                <th class="w-[13%] px-4 py-3 text-left">
                    <div class="flex justify-start items-center gap-2 font-semibold">
                        <span>Date</span>
                        <p-columnFilter 
                            #cf
                            field="date" 
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
                                            [(ngModel)]="fechaFilter" 
                                            placeholder="dd/mm/yy" 
                                            dateFormat="dd/mm/yy"
                                            appendTo="body"
                                            [showIcon]="true"
                                            styleClass="w-full">
                                        </p-datepicker>
                                    </div>
                                    <div class="flex justify-between mt-2 gap-2 border-t pt-3 border-[var(--p-datatable-border-color)]">
                                        <p-button label="Limpiar" [outlined]="true" size="small" (click)="clearDateFilter(cf)"></p-button>
                                        <p-button label="Aplicar" size="small" (click)="applyDateFilter(cf)"></p-button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th class="w-[10%] px-4 py-3">
                    <div class="flex justify-center items-center font-semibold">Acciones</div>
                </th>
            </tr>
        </ng-template>

        <ng-template #body let-hora>
            <tr>
                <td class="text-left px-4 py-3 font-medium">{{ hora.developer }}</td>
                <td class="text-left px-4 py-3 font-medium">
                    {{ getProjectName(hora) }}
                </td>
                <td class="text-left px-4 py-3">
                    <span [ngClass]="getAreaClass(hora.area)"
                          class="inline-flex items-center justify-center px-3.5 py-1 rounded-lg border-2 text-[0.85rem] font-bold tracking-tight shadow-sm transition-all duration-300 whitespace-nowrap">
                        {{ hora.area }}
                    </span>
                </td>
                <td class="text-left px-4 py-3 font-medium text-[#10b981]">
                    {{ getHours(hora.hoursWorked) }}<span class="text-xs text-gray-500 font-normal ml-0.5">h</span> 
                    {{ getMinutes(hora.hoursWorked) }}<span class="text-xs text-gray-500 font-normal ml-0.5">m</span>
                </td>
                <td class="text-left px-4 py-3 font-medium text-sm text-[var(--p-text-color)] whitespace-nowrap">
                    {{ (hora.date | date: 'dd/MM/yyyy') || 'N/A' }}
                </td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button
                            type="button"
                            (click)="editarHora(hora)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-pencil text-sm"></i>
                        </button>
                        <button
                            type="button"
                            (click)="eliminarHora(hora)"
                            class="flex items-center justify-center w-8 h-8 rounded-md border bg-[#fecaca] border-[#f87171] text-[#b91c1c] hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                            <i class="pi pi-trash text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr><td colspan="6" class="text-center p-4">No se encontraron registros de horas.</td></tr>
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
            <i class="pi pi-clock mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Registro de Hora' : 'Registro de Hora' }}
        </h3>
    </ng-template>

    <ng-template pTemplate="content">
        <form #horaForm="ngForm" novalidate>
            <div class="flex flex-col gap-4">

                @if (authService.isDesarrollador()) {
                    <!-- Desarrollador (Oculto pero se mantiene para el modelo) -->
                    <input type="hidden" name="developer" [(ngModel)]="nuevaHora.developer" required #developerModel="ngModel" />
                } @else {
                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Seleccionar Desarrollador*</label>
                        <p-select
                            [options]="usuariosOptions"
                            name="developer"
                            optionLabel="name"
                            optionValue="name"
                            [(ngModel)]="nuevaHora.developer"
                            #developerModel="ngModel"
                            (onChange)="onSelectUsuario($event)"
                            required
                            appendTo="body"
                            placeholder="Selecciona Desarrollador"
                            class="w-full"
                            [filter]="true"
                            filterBy="name"
                            emptyFilterMessage="No se encontraron usuarios"
                            [styleClass]="(developerModel.invalid && (developerModel.touched || horaForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                        ></p-select>

                        <small class="text-red-500 mt-1" *ngIf="developerModel.invalid && (developerModel.touched || horaForm.submitted)">
                            Nombre de Desarrollador Obligatorio
                        </small>
                    </div>
                }

                <!-- Área (Oculto pero se determina por el proyecto) -->
                <input type="hidden" name="area" [(ngModel)]="nuevaHora.area" />

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Nombre del Proyecto*</label>
                    <p-select
                        [options]="filteredProyectosOptions"
                        name="projectId"
                        optionLabel="projectName"
                        dataKey="_id"
                        [(ngModel)]="nuevaHora.projectId"
                        #proyectoModel="ngModel"
                        (onChange)="onSelectProyecto($event)"
                        required
                        appendTo="body"
                        placeholder="Selecciona Proyecto Existente"
                        class="w-full"
                        [filter]="true"
                        filterBy="projectName"
                        filterPlaceholder="Escribe nombre del proyecto"
                        emptyFilterMessage="No se encontraron proyectos"
                        [styleClass]="(proyectoModel.invalid && (proyectoModel.touched || horaForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    >
                        <ng-template #header>
                            <div class="flex items-center gap-2 p-3 bg-[var(--p-select-overlay-background)] border-b border-[var(--p-select-overlay-border-color)] sticky top-0 z-10" (click)="$event.stopPropagation()">
                                <div class="flex flex-wrap gap-1.5">
                                    <button 
                                        *ngFor="let opt of origenFiltroOptions"
                                        type="button"
                                        (click)="$event.stopPropagation(); selectedOrigen = opt; onOrigenChange()"
                                        [class]="selectedOrigen === opt ? 
                                            'flex items-center px-2 py-1 rounded text-[10px] font-bold bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)] shadow-sm cursor-pointer border border-[var(--p-primary-color)]' : 
                                            'flex items-center px-2 py-1 rounded text-[10px] font-bold bg-[var(--p-select-option-background)] text-[var(--p-text-color)] border border-[var(--p-select-overlay-border-color)] hover:bg-[var(--p-select-option-focus-background)] transition-colors cursor-pointer'"
                                    >
                                        {{ opt }}
                                    </button>
                                </div>
                            </div>
                        </ng-template>

                        <ng-template #item let-item>
                            <div class="flex flex-col gap-0.5 py-1">
                                <span class="font-medium text-[var(--p-text-color)]">{{ item.projectName }}</span>
                                <div class="flex items-center leading-none">
                                    <span class="text-[9px] uppercase font-bold tracking-widest opacity-80" 
                                          [ngClass]="{
                                              'text-[#EAB308]': item.origen === 'CI/CD',
                                              'text-[#A855F7]': item.origen === 'MKT',
                                              'text-[#60A5FA]': item.origen === 'Proyectos'
                                          }">
                                        {{ item.origen }}
                                    </span>
                                </div>
                            </div>
                        </ng-template>
                    </p-select>
                    <small class="text-red-500 mt-1" *ngIf="proyectoModel.invalid && (proyectoModel.touched || horaForm.submitted)">
                        Proyecto Obligatorio
                    </small>
                </div>

                <div class="flex flex-col" *ngIf="nuevaHora.area === 'CI/CD'">
                    <label class="mb-2 font-medium text-base">Tipo de Tarea*</label>
                    <p-select
                        [options]="taskTypeOptions"
                        name="taskType"
                        optionLabel="name"
                        optionValue="value"
                        [(ngModel)]="nuevaHora.taskType"
                        #taskTypeModel="ngModel"
                        required
                        appendTo="body"
                        placeholder="Selecciona Tipo"
                        class="w-full"
                        [styleClass]="(taskTypeModel.invalid && (taskTypeModel.touched || horaForm.submitted)) ? 'ng-invalid ng-dirty w-full' : 'w-full'"
                    ></p-select>
                    <small class="text-red-500 mt-1" *ngIf="taskTypeModel.invalid && (taskTypeModel.touched || horaForm.submitted)">
                        Tipo de Tarea Obligatoria
                    </small>
                </div>

                <div class="flex gap-4">
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Horas*</label>
                        <p-inputNumber 
                            name="displayHoras"
                            [(ngModel)]="displayHoras"
                            [min]="0"
                            [max]="24"
                            placeholder="0"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                        ></p-inputNumber>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <label class="mb-2 font-medium text-base">Minutos*</label>
                        <p-inputNumber 
                            name="displayMinutos"
                            [(ngModel)]="displayMinutos"
                            [min]="0"
                            [max]="59"
                            placeholder="0"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                        ></p-inputNumber>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 italic mt-[-10px] px-1">
                    Ejemplo actual: <span class="font-bold text-[var(--p-primary-color)]">
                        {{ getHours(displayHoras + (displayMinutos / 60)) }}<span class="text-gray-400 font-normal">h</span>
                        {{ getMinutes(displayHoras + (displayMinutos / 60)) }}<span class="text-gray-400 font-normal">m</span>
                    </span>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium text-base">Fecha*</label>
                    <p-datepicker 
                        name="date"
                        [(ngModel)]="nuevaHora.date"
                        #dateModel="ngModel"
                        required
                        appendTo="body"
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/yy"
                        styleClass="w-full"
                        [ngClass]="{'ng-invalid ng-dirty': (dateModel.invalid && (dateModel.touched || horaForm.submitted))}">
                    </p-datepicker>
                     <small class="text-red-500 mt-1" *ngIf="dateModel.invalid && (dateModel.touched || horaForm.submitted)">
                        Fecha Requerida
                    </small>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-8">
                <p-button
                    label="Cancelar"
                    severity="secondary"
                    [outlined]="true"
                    (click)="cerrarDrawer(horaForm)">
                </p-button>

                <p-button
                    label="Guardar"
                    (click)="guardarHora(horaForm)">
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
export class TableListaHoras implements OnInit {

    drawerVisible: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    horas: Hora[] = [];
    proyectosOptions: any[] = [];
    usuariosOptions: User[] = [];
    selectedOrigen: string = 'Todos';
    origenFiltroOptions: string[] = ['Todos', 'CI/CD', 'Proyectos', 'MKT'];

    displayHoras: number = 0;
    displayMinutos: number = 0;

    get filteredProyectosOptions() {
        if (!this.selectedOrigen || this.selectedOrigen === 'Todos') {
            return this.proyectosOptions;
        }
        return this.proyectosOptions.filter(p => p.origen === this.selectedOrigen);
    }

    nuevaHora: Hora = {
        developer: '',
        projectName: '',
        area: '',
        hoursWorked: 0,
        date: '',
        taskType: ''
    };

    fechaFilter: Date | null = null;

    roles = [
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Desarrollador', value: 'Desarrollador' }
    ];

    taskTypeOptions = [
        { name: 'Mantenimiento', value: 'Mantenimiento' },
        { name: 'Desarrollo', value: 'Desarrollo' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private listaHorasService: ListaHorasService,
        private listaProyectosService: ListaProyectosService,
        private cicdService: CiCdService,
        private mktService: MktService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        public authService: AuthService
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
            this.cargarProyectos();
            this.cargarUsuarios();
        });
    }

    recargarTabla() {
        this.loading = true;
        this.listaHorasService.getHoras().subscribe({
            next: (data) => {
                const profile = this.authService.userProfile();
                const isDesarrollador = this.authService.isDesarrollador();
                const isAdmin = this.authService.isAdministrador();
                const userName = profile?.name;

                let filteredData = data.filter((h: any) => !h.isDeleted);

                if (isDesarrollador && !isAdmin && userName) {
                    this.horas = filteredData.filter(h => h.developer === userName);
                } else {
                    this.horas = filteredData;
                }

                this.horas = this.horas.map(h => {
                    const projectIdRaw = (h as any).projectId;
                    let projectId = undefined;
                    
                    if (projectIdRaw) {
                        const id = (typeof projectIdRaw._id === 'object' && projectIdRaw._id !== null)
                            ? projectIdRaw._id.$oid || projectIdRaw._id.toString()
                            : projectIdRaw._id;
                        projectId = { _id: id, name: projectIdRaw.name || h.projectName };
                    }

                    return {
                        ...h,
                        projectId: projectId,
                        date: h.date ? new Date(h.date) : undefined
                    };
                });

                setTimeout(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }, 700);
            },
            error: (err) => {
                console.error('Error cargando Lista de Horas', err);
                this.loading = false;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
            }
        });
    }

    cargarProyectos() {
        forkJoin({
            proyectos: this.listaProyectosService.getProyectos(),
            cicds: this.cicdService.getCiCds(),
            mkts: this.mktService.getMkts()
        }).subscribe({
            next: (result) => {
                const profile = this.authService.userProfile();
                const isDesarrollador = this.authService.isDesarrollador();
                const isAdmin = this.authService.isAdministrador();
                const userName = profile?.name;

                let proyectosNormales = (result.proyectos || []).map(p => ({
                    ...p,
                    origen: 'Proyectos'
                }));
                const proyectosCiCd = (result.cicds || []).map((c: any) => ({
                    ...c,
                    projectName: c.name,
                    origen: 'CI/CD'
                }));
                const proyectosMkt = (result.mkts || []).map((m: any) => ({
                    ...m,
                    projectName: m.name,
                    origen: 'MKT'
                }));

                if (isDesarrollador && !isAdmin && userName) {
                    proyectosNormales = proyectosNormales.filter(p => p.developerInCharge === userName);
                }

                this.proyectosOptions = [...proyectosNormales, ...proyectosCiCd, ...proyectosMkt].map(p => ({
                    ...p,
                    _id: (typeof p._id === 'object' && p._id !== null) ? (p._id.$oid || p._id.toString()) : p._id
                }));

                this.proyectosOptions.sort((a, b) =>
                    (a.projectName || '').localeCompare(b.projectName || '')
                );

                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando Proyectos para Selector', err);
            }
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
            error: (err) => {
                console.error('Error cargando Usuarios para Selector', err);
            }
        });
    }

    onOrigenChange() {
        if (this.nuevaHora.projectName) {
            const exists = this.filteredProyectosOptions.some(p => p.projectName === this.nuevaHora.projectName);
            if (!exists) {
                this.nuevaHora.projectName = '';
            }
        }
    }

    onSelectProyecto(event: any) {
        const proyectoSeleccionado = event.value; // Ahora es el objeto completo gracias a dataKey y no usar optionValue
        if (proyectoSeleccionado) {
            // Sincronizar campos antiguos por si acaso
            this.nuevaHora.projectName = proyectoSeleccionado.projectName;
            
            if (proyectoSeleccionado.origen === 'Proyectos') {
                this.nuevaHora.area = 'Desarrollo';
            } else {
                this.nuevaHora.area = proyectoSeleccionado.origen;
            }
            this.cdr.detectChanges();
        }
    }

    getProjectName(hora: Hora): string {
        if (hora.projectId && hora.projectId.name) {
            return hora.projectId.name;
        }
        return hora.projectName || 'Sin Proyecto';
    }

    onSelectUsuario(event: any) {
        const usuarioSeleccionado = this.usuariosOptions.find(u => u.name === event.value);
        if (usuarioSeleccionado) {
            this.cdr.detectChanges();
        }
    }

    getUsuarioArea(usuario: User | null | undefined): string {
        if (!usuario) return '';
        const role = (usuario.role || '').toLowerCase().trim();
        const jobPosition = (usuario.jobPosition || '').toLowerCase().trim();

        if (role === 'desarrollador' || role === 'desarrollo' || jobPosition === 'desarrollador' || jobPosition === 'desarrollo') {
            return 'Desarrollo';
        }
        return usuario.role || usuario.jobPosition || '';
    }


    crearHora() {
        this.modoEdicion = false;
        const profile = this.authService.userProfile();
        const isDesarrollador = this.authService.isDesarrollador();

        this.nuevaHora = {
            developer: isDesarrollador ? (profile?.name || '') : '',
            projectName: '',
            projectId: undefined,
            area: this.getUsuarioArea(profile),
            hoursWorked: 0,
            date: new Date() as any,
            taskType: ''
        };
        this.displayHoras = 0;
        this.displayMinutos = 0;
        this.drawerVisible = true;
    }

    editarHora(hora: Hora) {
        this.modoEdicion = true;
        const parseDate = (dateVal: any) => {
            if (!dateVal) return undefined;
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? undefined : d;
        };

        this.nuevaHora = {
            ...hora,
            date: parseDate(hora.date) as any
        };

        // Si no tiene projectId (dato viejo), intentar buscarlo por nombre para que el selector lo marque
        if (!this.nuevaHora.projectId && this.nuevaHora.projectName) {
            const matchedProj = this.proyectosOptions.find(p => p.projectName === this.nuevaHora.projectName);
            if (matchedProj) {
                this.nuevaHora.projectId = {
                    _id: matchedProj._id,
                    name: matchedProj.projectName
                };
            }
        }

        // Asegurar que el desarrollador coincida (limpiar espacios)
        if (this.nuevaHora.developer) {
            this.nuevaHora.developer = this.nuevaHora.developer.trim();
        }

        this.displayHoras = Math.floor(hora.hoursWorked || 0);
        this.displayMinutos = Math.round(((hora.hoursWorked || 0) % 1) * 60);

        this.drawerVisible = true;
        this.cdr.detectChanges();
    }

    eliminarHora(hora: Hora) {
        if (!hora._id) return;

        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el registro de horas de ${hora.developer} en ${hora.projectName}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.listaHorasService.deleteHora(hora._id!).subscribe({
                    next: () => {
                        this.horas = this.horas.filter(h => h._id !== hora._id);
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

    guardarHora(form: any) {
        this.nuevaHora.hoursWorked = (this.displayHoras || 0) + ((this.displayMinutos || 0) / 60);

        // Preparar el objeto projectId antes de guardar
        if (this.nuevaHora.projectId) {
            const selectedProj = this.proyectosOptions.find(p => p._id === (this.nuevaHora.projectId as any)._id);
            if (selectedProj) {
                this.nuevaHora.projectId = {
                    _id: selectedProj._id,
                    name: selectedProj.projectName || selectedProj.name
                };
                this.nuevaHora.projectName = selectedProj.projectName || selectedProj.name;
            }
        }

        if (form.invalid || (this.nuevaHora.hoursWorked || 0) <= 0) {
            if ((this.nuevaHora.hoursWorked || 0) <= 0) {
                this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes ingresar al menos algunos minutos de trabajo' });
            }
            Object.values(form.controls).forEach((control: any) => control.markAsTouched());
            return;
        }

        const horaObj: Hora = { ...this.nuevaHora };

        const peticion = (this.modoEdicion && this.nuevaHora._id)
            ? this.listaHorasService.updateHora(this.nuevaHora._id, horaObj)
            : this.listaHorasService.createHora(horaObj);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Registro guardado correctamente'
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

    cerrarDrawer(form: any) {
        this.drawerVisible = false;
        form.resetForm();
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

    getHours(decimal: number): number {
        return Math.floor(decimal || 0);
    }

    getMinutes(decimal: number): string {
        const minutes = Math.round(((decimal || 0) % 1) * 60);
        return minutes < 10 ? `0${minutes}` : `${minutes}`;
    }

    getFormattedHours(decimal: number): string {
        return `${this.getHours(decimal)}h ${this.getMinutes(decimal)}m`;
    }


    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    clear(table: Table, inputGlobal: HTMLInputElement) {
        table.clear();
        table.filterGlobal('', 'contains');
        this.fechaFilter = null;
        if (inputGlobal) {
            inputGlobal.value = '';
        }
    }

    getFilterValue(field: string): any {
        if (!this.dt1 || !this.dt1.filters || !this.dt1.filters[field]) return null;
        const f = this.dt1.filters[field];
        return Array.isArray(f) ? f[0].value : f.value;
    }

    applyDateFilter(cf: any) {
        if (this.dt1) {
            this.dt1.filter(this.fechaFilter, 'date', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }

    clearDateFilter(cf: any) {
        this.fechaFilter = null;
        if (this.dt1) {
            this.dt1.filter(null, 'date', 'dateIs');
            this.cdr.markForCheck();
            if (cf) cf.hide();
        }
    }
}
