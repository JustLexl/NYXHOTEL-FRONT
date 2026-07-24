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
import { TextareaModule } from 'primeng/textarea';
import { InventarioItem, InventarioService } from '../service/inventario.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-tableInventarioNyx',
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
        TooltipModule,
        TextareaModule
    ],
    template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="card main-content" [class.drawer-open]="drawerVisible">
        <div class="font-semibold text-xl mb-2">Inventario NYX</div>

        <div class="flex flex-wrap gap-2 mb-4 w-full"></div>

        <p-table
            #dt1
            [value]="inventarioLista"
            dataKey="_id"
            [rows]="10"
            [loading]="loading"
            [rowHover]="true"
            [showGridlines]="false"
            [tableStyle]="{'min-width': '80rem'}"
            styleClass="p-datatable-sm custom-modern-table"
            [paginator]="true"
            [globalFilterFields]="['departamento', 'puesto', 'nombreEquipo', 'equipo', 'marcaModelo', 'numeroSerie', 'memoria', 'versionSO', 'comentarios']"
            responsiveLayout="scroll"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros encontrados">

            <ng-template pTemplate="caption">
                <div class="flex justify-between items-center w-full flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <p-button
                            label="Limpiar"
                            [outlined]="true"
                            icon="pi pi-filter-slash"
                            (click)="clear(dt1, filterGlobal)" />
                        <p-button
                            label="Excel"
                            icon="pi pi-file-excel"
                            severity="success"
                            [outlined]="true"
                            (click)="exportarExcel()"
                            pTooltip="Exportar tabla a Excel"
                            tooltipPosition="bottom" />
                        <p-button
                            label="PDF"
                            icon="pi pi-file-pdf"
                            severity="danger"
                            [outlined]="true"
                            (click)="exportarPDF()"
                            pTooltip="Exportar tabla a PDF"
                            tooltipPosition="bottom" />
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
                                placeholder="Buscar en inventario..."
                                class="w-[200px]" />
                        </p-iconfield>

                        <p-button
                            label="Agregar Equipo"
                            icon="pi pi-plus"
                            (click)="crearItem()" />
                    </div>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th class="w-[10%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2">
                            <span class="text-left font-semibold">Departamento</span>
                            <p-columnFilter
                                type="text"
                                field="departamento"
                                display="menu"
                                placeholder="Buscar departamento">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[10%] px-4 py-3 text-left">
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

                    <th class="w-[10%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Nombre del Equipo</span>
                            <p-columnFilter
                                type="text"
                                field="nombreEquipo"
                                display="menu"
                                placeholder="Buscar nombre equipo">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[8%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Equipo</span>
                            <p-columnFilter
                                type="text"
                                field="equipo"
                                display="menu"
                                placeholder="Buscar equipo">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[12%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Marca y Modelo</span>
                            <p-columnFilter
                                type="text"
                                field="marcaModelo"
                                display="menu"
                                placeholder="Buscar marca/modelo">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[12%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Num. de Serie</span>
                            <p-columnFilter
                                type="text"
                                field="numeroSerie"
                                display="menu"
                                placeholder="Buscar numero de serie">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[8%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Memoria</span>
                            <p-columnFilter
                                type="text"
                                field="memoria"
                                display="menu"
                                placeholder="Buscar memoria">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[12%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Version SO</span>
                            <p-columnFilter
                                type="text"
                                field="versionSO"
                                display="menu"
                                placeholder="Buscar version SO">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[12%] px-4 py-3 text-left">
                        <div class="flex justify-start items-center gap-2 font-semibold">
                            <span>Comentarios</span>
                            <p-columnFilter
                                type="text"
                                field="comentarios"
                                display="menu"
                                placeholder="Buscar comentarios">
                            </p-columnFilter>
                        </div>
                    </th>

                    <th class="w-[140px] px-4 py-3">
                        <div class="flex justify-center items-center font-semibold">Acciones</div>
                    </th>
                </tr>
            </ng-template>

            <ng-template #body let-item>
                <tr>
                    <td class="text-left">{{ item.departamento || 'Sin asignar' }}</td>
                    <td class="text-left">{{ item.puesto || 'Sin asignar' }}</td>
                    <td class="text-left">{{ item.nombreEquipo || '-' }}</td>
                    <td class="text-left">{{ item.equipo || '-' }}</td>
                    <td class="text-left">{{ item.marcaModelo || '-' }}</td>
                    <td class="text-left font-mono text-sm">{{ item.numeroSerie || '-' }}</td>
                    <td class="text-left">{{ item.memoria || '-' }}</td>
                    <td class="text-left">{{ item.versionSO || '-' }}</td>
                    <td class="text-left">
                        <span
                            [pTooltip]="item.comentarios"
                            tooltipPosition="top"
                            class="truncate-cell">
                            {{ item.comentarios || '-' }}
                        </span>
                    </td>
                    <td>
                        <div class="flex gap-2 justify-center">
                            <button
                                type="button"
                                (click)="editarItem(item)"
                                pTooltip="Editar"
                                tooltipPosition="top"
                                class="flex items-center justify-center w-8 h-8 rounded-md border
                                   bg-[#bfdbfe] border-[#60a5fa] text-[#1d4ed8]
                                   hover:brightness-95 cursor-pointer transition-all shadow-sm active:scale-95">
                                <i class="pi pi-pencil"></i>
                            </button>
                            <button
                                type="button"
                                (click)="eliminarItem(item)"
                                pTooltip="Eliminar"
                                tooltipPosition="top"
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
                <tr><td colspan="10">No se encontraron equipos registrados en el inventario.</td></tr>
            </ng-template>

            <ng-template #loadingbody>
                <tr><td colspan="10">Cargando datos. Por favor espere.</td></tr>
            </ng-template>
        </p-table>
    </div>

    <p-drawer
        [(visible)]="drawerVisible"
        position="right"
        [modal]="false"
        styleClass="!w-[420px] !pt-[5.5rem] !px-[1.5rem] !pb-[1.5rem]">

        <ng-template pTemplate="header">
            <h3 class="font-bold text-lg text-[var(--p-text-color)]">
                <i class="pi pi-desktop mr-2 text-primary"></i> {{ modoEdicion ? 'Editar Equipo' : 'Agregar Equipo' }}
            </h3>
        </ng-template>

        <ng-template pTemplate="content">
            <form #inventarioForm="ngForm" novalidate>
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Departamento</label>
                        <input
                            pInputText
                            name="departamento"
                            [(ngModel)]="nuevoItem.departamento"
                            placeholder="Introduce departamento"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Puesto</label>
                        <input
                            pInputText
                            name="puesto"
                            [(ngModel)]="nuevoItem.puesto"
                            placeholder="Introduce puesto"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Nombre del Equipo</label>
                        <input
                            pInputText
                            name="nombreEquipo"
                            [(ngModel)]="nuevoItem.nombreEquipo"
                            placeholder="Introduce nombre del equipo"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Equipo</label>
                        <input
                            pInputText
                            name="equipo"
                            [(ngModel)]="nuevoItem.equipo"
                            placeholder="Ej: Laptop, Desktop, Tablet..."
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Marca y Modelo</label>
                        <input
                            pInputText
                            name="marcaModelo"
                            [(ngModel)]="nuevoItem.marcaModelo"
                            placeholder="Ej: Dell Latitude 5540"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Numero de Serie</label>
                        <input
                            pInputText
                            name="numeroSerie"
                            [(ngModel)]="nuevoItem.numeroSerie"
                            placeholder="Introduce numero de serie"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Memoria</label>
                        <input
                            pInputText
                            name="memoria"
                            [(ngModel)]="nuevoItem.memoria"
                            placeholder="Ej: 16 GB RAM"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Version de Sistema Operativo</label>
                        <input
                            pInputText
                            name="versionSO"
                            [(ngModel)]="nuevoItem.versionSO"
                            placeholder="Ej: Windows 11 Pro 23H2"
                            class="w-full p-2 border rounded"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-2 font-medium text-base">Comentarios</label>
                        <textarea
                            pTextarea
                            name="comentarios"
                            [(ngModel)]="nuevoItem.comentarios"
                            placeholder="Observaciones adicionales..."
                            rows="3"
                            class="w-full p-2 border rounded resize-none">
                        </textarea>
                    </div>

                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <p-button
                        label="Cancelar"
                        severity="secondary"
                        [outlined]="true"
                        (click)="cerrarDrawer(inventarioForm)">
                    </p-button>

                    <p-button
                        label="Guardar"
                        (click)="guardarItem(inventarioForm)">
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
    .main-content.drawer-open { margin-right: 420px; }
    @media (max-width: 768px) {
        .main-content.drawer-open { margin-right: 0; }
    }

    .truncate-cell {
        display: block;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: default;
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
export class TableInventarioNyx implements OnInit {

    drawerVisible: boolean = false;
    modoEdicion: boolean = false;
    loading: boolean = true;
    inventarioLista: InventarioItem[] = [];

    nuevoItem: InventarioItem = {
        departamento: '',
        puesto: '',
        nombreEquipo: '',
        equipo: '',
        marcaModelo: '',
        numeroSerie: '',
        memoria: '',
        versionSO: '',
        comentarios: ''
    };

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private inventarioService: InventarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.cargarInventario();
    }

    cargarInventario() {
        this.loading = true;
        this.inventarioService.getItems().subscribe({
            next: (result) => {
                this.inventarioLista = (result || []).filter((i: any) => !i.isDeleted);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('Error cargando inventario', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    crearItem() {
        this.modoEdicion = false;
        this.nuevoItem = {
            departamento: '',
            puesto: '',
            nombreEquipo: '',
            equipo: '',
            marcaModelo: '',
            numeroSerie: '',
            memoria: '',
            versionSO: '',
            comentarios: ''
        };
        this.drawerVisible = true;
    }

    editarItem(item: InventarioItem) {
        this.modoEdicion = true;
        this.nuevoItem = { ...item };
        this.drawerVisible = true;
    }

    eliminarItem(item: InventarioItem) {
        if (!item._id) return;

        this.confirmationService.confirm({
            message: `Seguro que deseas eliminar el equipo "${item.nombreEquipo || item.marcaModelo || 'este registro'}"?`,
            header: 'Confirmar eliminacion',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.inventarioService.deleteItem(item._id!).subscribe({
                    next: () => {
                        this.inventarioLista = this.inventarioLista.filter(i => i._id !== item._id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Equipo eliminado correctamente'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el equipo'
                        });
                    }
                });
            }
        });
    }

    guardarItem(form: any) {
        const peticion = (this.modoEdicion && this.nuevoItem._id)
            ? this.inventarioService.updateItem(this.nuevoItem._id, this.nuevoItem)
            : this.inventarioService.createItem(this.nuevoItem);

        peticion.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: this.modoEdicion ? 'Equipo actualizado correctamente' : 'Equipo registrado correctamente'
                });
                this.cargarInventario();
                this.drawerVisible = false;
            },
            error: (err: any) => {
                console.error('Error al guardar equipo:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de servidor',
                    detail: err.error?.message || err.message || 'No se pudo completar la operacion'
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

    exportarExcel() {
        const dataToExport = (this.dt1 && this.dt1.filteredValue) ? this.dt1.filteredValue : this.inventarioLista;
        if (!dataToExport || dataToExport.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No hay registros para exportar' });
            return;
        }
        const excelData = dataToExport.map(i => ({
            'Departamento': i.departamento || '',
            'Puesto': i.puesto || '',
            'Nombre del Equipo': i.nombreEquipo || '',
            'Equipo': i.equipo || '',
            'Marca y Modelo': i.marcaModelo || '',
            'Número de Serie': i.numeroSerie || '',
            'Memoria': i.memoria || '',
            'Versión SO': i.versionSO || '',
            'Comentarios': i.comentarios || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario_NYX');
        XLSX.writeFile(workbook, `Inventario_NYX_${new Date().toISOString().slice(0, 10)}.xlsx`);
        this.messageService.add({ severity: 'success', summary: 'Exportado', detail: 'Tabla exportada a Excel correctamente' });
    }

    exportarPDF() {
        const dataToExport = (this.dt1 && this.dt1.filteredValue) ? this.dt1.filteredValue : this.inventarioLista;
        if (!dataToExport || dataToExport.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No hay registros para exportar' });
            return;
        }
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text('Inventario NYX Hotel Cancún', 14, 15);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 14, 22);

        const headers = [['Departamento', 'Puesto', 'Nombre Equipo', 'Equipo', 'Marca/Modelo', 'Num. Serie', 'Memoria', 'Versión SO', 'Comentarios']];
        const rows = dataToExport.map(i => [
            i.departamento || '',
            i.puesto || '',
            i.nombreEquipo || '',
            i.equipo || '',
            i.marcaModelo || '',
            i.numeroSerie || '',
            i.memoria || '',
            i.versionSO || '',
            i.comentarios || ''
        ]);

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 26,
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
            headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: {
                8: { cellWidth: 50 }
            }
        });

        doc.save(`Inventario_NYX_${new Date().toISOString().slice(0, 10)}.pdf`);
        this.messageService.add({ severity: 'success', summary: 'Exportado', detail: 'Tabla exportada a PDF correctamente' });
    }
}
