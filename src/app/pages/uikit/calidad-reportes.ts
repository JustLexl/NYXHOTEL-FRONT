import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalidadReporte, CalidadSeccion, CalidadReportesService } from '../service/calidad-reportes.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-calidad-reportes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="p-6 min-h-screen bg-slate-50">

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                <i class="pi pi-check-square text-teal-600 text-3xl"></i>
                Calidad Reportes
            </h1>
            <p class="text-slate-500 mt-1 text-sm font-medium">
                Inspección de calidad y estándares para Habitaciones y Spa.
            </p>
        </div>
        <button
            (click)="openCreateModal()"
            class="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <i class="pi pi-plus"></i>
            Crear reporte de {{ activeTab === 'habitacion' ? 'Habitación' : 'Spa' }}
        </button>
    </div>

    <!-- Segmented Control Selector -->
    <div class="flex bg-slate-200/80 p-1.5 rounded-2xl w-max gap-1.5 mb-6 border border-slate-300/40">
        <button
            (click)="switchTab('habitacion')"
            [class]="activeTab === 'habitacion' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer">
            <i class="pi pi-home"></i>
            Habitaciones
        </button>
        <button
            (click)="switchTab('spa')"
            [class]="activeTab === 'spa' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer">
            <i class="pi pi-sparkles"></i>
            Spa
        </button>
    </div>

    <!-- Filters Panel -->
    <div class="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-3 flex-wrap items-center justify-between">
            <div class="flex flex-col sm:flex-row gap-3 flex-wrap w-full sm:w-auto">
                <!-- Date Filter -->
                <div class="relative w-full sm:w-auto">
                    <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"></i>
                    <input
                        type="date"
                        [(ngModel)]="filterFecha"
                        (ngModelChange)="applyFilters()"
                        class="w-full sm:w-44 pl-9 pr-3 py-2 border-2 border-teal-300 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-teal-50" />
                </div>
                <!-- Number Search -->
                <div class="relative w-full sm:w-64">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        [(ngModel)]="filterNumero"
                        (ngModelChange)="applyFilters()"
                        placeholder="Buscar por {{ activeTab === 'habitacion' ? 'Habitación' : 'Cabina' }}..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <!-- Inspector Search -->
                <div class="relative w-full sm:w-64">
                    <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        [(ngModel)]="filterInspector"
                        (ngModelChange)="applyFilters()"
                        placeholder="Filtrar por Inspector..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
            </div>
            <button
                type="button"
                (click)="resetFilters()"
                class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center">
                <i class="pi pi-filter-slash"></i>
                Limpiar Filtros
            </button>
        </div>
        <div *ngIf="filteredRecords.length !== totalRecordsCount()" class="mt-2 text-xs text-teal-600 font-semibold">
            Mostrando {{ filteredRecords.length }} de {{ totalRecordsCount() }} reportes registrados
        </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th class="py-4 px-6">Fecha</th>
                        <th *ngIf="activeTab === 'habitacion'" class="py-4 px-6">N° Habitación</th>
                        <th class="py-4 px-6">Puntuación / Calificación</th>
                        <th class="py-4 px-6">Inspector</th>
                        <th class="py-4 px-6 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    <tr *ngFor="let item of filteredRecords" class="hover:bg-slate-50 transition-colors duration-150">
                        <td class="py-4 px-6 font-semibold">{{ item.fecha }}</td>
                        <td *ngIf="activeTab === 'habitacion'" class="py-4 px-6 font-bold text-slate-900">
                            Habitación #{{ item.numero }}
                        </td>
                        <td class="py-4 px-6">
                            <span
                                [class]="getScoreBadgeClass(item.puntuacion)"
                                class="px-2.5 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-max">
                                {{ item.puntuacion }}%
                            </span>
                        </td>
                        <td class="py-4 px-6 font-medium text-slate-600">{{ item.inspector }}</td>
                        <td class="py-4 px-6">
                            <div class="flex items-center justify-center gap-2">
                                <button
                                    (click)="printPdf(item)"
                                    title="Imprimir PDF"
                                    class="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all duration-150 border border-blue-100 cursor-pointer">
                                    <i class="pi pi-print text-xs"></i>
                                </button>
                                <button
                                    (click)="openEditModal(item)"
                                    title="Editar Reporte"
                                    class="bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600 p-2 rounded-lg transition-all duration-150 border border-slate-200 cursor-pointer">
                                    <i class="pi pi-pencil text-xs"></i>
                                </button>
                                <button
                                    (click)="deleteReport(item)"
                                    title="Eliminar Reporte"
                                    class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all duration-150 border border-red-100 cursor-pointer">
                                    <i class="pi pi-trash text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="filteredRecords.length === 0">
                        <td [attr.colspan]="activeTab === 'habitacion' ? 5 : 4" class="py-16 px-6 text-center">
                            <div class="flex flex-col items-center gap-3">
                                <i class="pi pi-folder-open text-5xl text-slate-200"></i>
                                <p class="text-slate-400 font-medium">No se encontraron reportes registrados para esta selección.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- OVERLAY: CREAR/EDITAR REPORTE (PANTALLA COMPLETA SOBREPUESTA) -->
<div *ngIf="showFormModal" class="fixed inset-0 z-[1200] bg-slate-100/95 overflow-y-auto p-4 md:p-8 flex justify-center items-start animate-fadein">
    <div class="w-full max-w-5xl bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden my-4 flex flex-col">
        
        <!-- Header del Reporte (Logo + Datos Básicos) -->
        <div class="p-6 md:p-8 border-b border-slate-200 bg-slate-50 flex flex-col gap-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <img src="/layout/images/NyxHotelLogo-removebg-preview.png" alt="Hotel Logo" class="h-10 object-contain" />
                <div class="text-center sm:text-right">
                    <h2 class="text-xl font-black text-slate-800 tracking-wide uppercase">REPORTE DE CALIDAD</h2>
                    <p class="text-xs font-bold text-teal-600 uppercase tracking-widest">{{ activeTab === 'habitacion' ? 'Habitaciones' : 'Spa' }}</p>
                </div>
            </div>

            <div class="border-t border-slate-200 pt-6">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">DATOS GENERALES DE INSPECCIÓN</h3>
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <!-- Fecha -->
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Fecha</label>
                        <input type="date" [(ngModel)]="formReport.fecha"
                            (ngModelChange)="scheduleSave()"
                            class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-semibold text-slate-700" />
                    </div>
                    <!-- Número (Solo Habitación) -->
                    <div *ngIf="activeTab === 'habitacion'">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                            N° Habitación
                        </label>
                        <input type="text" [(ngModel)]="formReport.numero"
                            placeholder="Ej. 102"
                            (ngModelChange)="scheduleSave()"
                            class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-bold text-slate-800" />
                    </div>
                    <!-- Inspector -->
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Inspector / Agente</label>
                        <input type="text" [(ngModel)]="formReport.inspector"
                            [placeholder]="loggedUserPlaceholder"
                            (ngModelChange)="scheduleSave()"
                            class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-semibold text-slate-700" />
                    </div>
                    <!-- Score Realtime Preview -->
                    <div class="bg-teal-50 border border-teal-200 rounded-xl p-3 flex flex-col justify-center items-center">
                        <span class="text-[9px] font-bold text-teal-600 uppercase tracking-wider">PUNTUACIÓN ACTUAL</span>
                        <span class="text-2xl font-black text-teal-800">{{ getLiveScore() }}%</span>
                        <span class="text-[10px] text-teal-600 font-semibold mt-0.5">
                            ({{ getLiveCounts().bien }}/{{ getLiveCounts().total }} Evaluados)
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cuerpo del Formulario (Secciones de Checklist) -->
        <div class="p-6 md:p-8 space-y-8 bg-white max-h-[60vh] overflow-y-auto">
            <div *ngFor="let sec of formReport.secciones; let si = index" class="border rounded-2xl overflow-hidden shadow-sm" [style.border-color]="getSectionColor(si).border">
                <!-- Título de Sección -->
                <div class="px-5 py-3.5 border-b flex justify-between items-center" [style.background]="getSectionColor(si).bg" [style.border-color]="getSectionColor(si).border">
                    <span class="font-extrabold text-sm tracking-wide uppercase" [style.color]="getSectionColor(si).text">{{ sec.nombre }}</span>
                    <span class="text-xs px-2.5 py-1 rounded-full font-bold" [style.background]="getSectionColor(si).badge" [style.color]="getSectionColor(si).text">
                        Preguntas {{ getSectionAnswered(sec) }}/{{ sec.items.length }}
                    </span>
                </div>

                <!-- Switch terraza/balcón -->
                <div *ngIf="sec.nombre === 'Terraza o balcón'" class="px-5 py-3 border-b border-slate-200 bg-amber-50 flex items-center justify-between">
                    <span class="text-xs font-bold text-amber-800">¿Esta habitación cuenta con terraza/balcón?</span>
                    <button
                        type="button"
                        (click)="sec.activa = !sec.activa; scheduleSave()"
                        [class]="sec.activa ? 'bg-teal-500' : 'bg-slate-300'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none">
                        <span
                            [class]="sec.activa ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200">
                        </span>
                    </button>
                </div>

                <!-- Tabla de ítems (si sección activa o no es terraza) -->
                <div *ngIf="sec.nombre !== 'Terraza o balcón' || sec.activa">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <th class="py-2.5 px-5 w-1/2">Sección</th>
                            <th class="py-2.5 px-5 w-1/4 text-center">Estado</th>
                            <th class="py-2.5 px-5 w-1/4">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                        <tr *ngFor="let item of sec.items" class="hover:bg-slate-50/40 transition-colors duration-100">
                            <td class="py-2 px-5 font-semibold text-slate-800 text-xs">{{ item.nombre }}</td>
                            <td class="py-2 px-5">
                                <div class="flex justify-center gap-1.5">
                                    <!-- SI -->
                                    <button
                                        type="button"
                                        (click)="item.estado = item.estado === 'Bien' ? '' : 'Bien'; scheduleSave()"
                                        [class]="item.estado === 'Bien' ? 'bg-emerald-500 text-white shadow-sm font-extrabold ring-2 ring-emerald-300' : 'bg-slate-100 hover:bg-emerald-50 text-slate-500'"
                                        class="px-3 py-1.5 rounded-lg text-[10px] tracking-wide transition-all duration-150 cursor-pointer">
                                        <i class="pi pi-check text-[9px] mr-1"></i> SI
                                    </button>
                                    <!-- NO -->
                                    <button
                                        type="button"
                                        (click)="item.estado = item.estado === 'Mal' ? '' : 'Mal'; scheduleSave()"
                                        [class]="item.estado === 'Mal' ? 'bg-rose-500 text-white shadow-sm font-extrabold ring-2 ring-rose-300' : 'bg-slate-100 hover:bg-rose-50 text-slate-500'"
                                        class="px-3 py-1.5 rounded-lg text-[10px] tracking-wide transition-all duration-150 cursor-pointer">
                                        <i class="pi pi-times text-[9px] mr-1"></i> NO
                                    </button>
                                    <!-- N/A -->
                                    <button
                                        type="button"
                                        (click)="item.estado = item.estado === 'No aplica' ? '' : 'No aplica'; scheduleSave()"
                                        [class]="item.estado === 'No aplica' ? 'bg-slate-600 text-white shadow-sm font-extrabold ring-2 ring-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'"
                                        class="px-3 py-1.5 rounded-lg text-[10px] tracking-wide transition-all duration-150 cursor-pointer">
                                        N/A
                                    </button>
                                </div>
                            </td>
                            <td class="py-2 px-5">
                                <input type="text" [(ngModel)]="item.observaciones"
                                    placeholder="Observación libre..."
                                    (ngModelChange)="scheduleSave()"
                                    class="w-full border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Zona de imágenes por sección -->
                <div class="px-5 py-4 bg-slate-50/60 border-t border-dashed border-slate-200">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="pi pi-camera text-slate-400"></i>
                            Evidencia fotográfica de la sección
                        </span>
                        <label [for]="'img-upload-' + si" class="cursor-pointer flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150">
                            <i class="pi pi-plus text-[9px]"></i>
                            Adjuntar foto
                        </label>
                        <input
                            [id]="'img-upload-' + si"
                            type="file"
                            accept="image/*"
                            multiple
                            class="hidden"
                            (change)="onImageSelected($event, si)" />
                    </div>

                <!-- Galería de imágenes adjuntas -->
                    <div *ngIf="sec.imagenes && sec.imagenes.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <div *ngFor="let img of sec.imagenes; let ii = index" class="relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div class="w-full h-28 overflow-hidden">
                                <img [src]="img.preview" class="w-full h-full object-cover" />
                            </div>
                            <!-- Selector/Escribir criterio -->
                            <div class="p-2">
                                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Criterio:</label>
                                <input
                                    [(ngModel)]="img.criterio"
                                    [attr.list]="'datalist-criterios-' + si"
                                    placeholder="Escribe o selecciona..."
                                    (ngModelChange)="scheduleSave()"
                                    class="w-full text-[10px] border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-slate-700 font-medium" />
                                <datalist [id]="'datalist-criterios-' + si">
                                    <option *ngFor="let item of sec.items" [value]="item.nombre"></option>
                                </datalist>
                            </div>
                            <!-- Botón eliminar -->
                            <button
                                type="button"
                                (click)="removeImage(si, ii)"
                                class="absolute top-1.5 right-1.5 bg-red-500/90 text-white rounded-full w-5 h-5 text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer shadow">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>
                    </div>
                    <p *ngIf="!sec.imagenes || sec.imagenes.length === 0" class="text-[10px] text-slate-400 italic">Sin fotos adjuntas en esta sección.</p>
                </div>
                </div><!-- /terraza wrapper -->
            </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
            <div class="text-xs text-slate-500 font-medium">
                Estándares de Calidad NYX Cancun
            </div>
            <div class="flex gap-3">
                <button (click)="showFormModal = false"
                    class="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-sm text-slate-600 uppercase transition-all duration-150 cursor-pointer">
                    Cancelar
                </button>
                <button (click)="submitForm()"
                    [disabled]="submitting"
                    class="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm uppercase shadow transition-all duration-150 cursor-pointer flex items-center gap-2">
                    <i class="pi pi-save"></i>
                    {{ isEditing ? 'Guardar Cambios' : 'Guardar Reporte' }}
                </button>
            </div>
        </div>

    </div>
</div>
`,
    styles: [`
        .animate-fadein {
            animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
    `]
})
export class CalidadReportesComponent implements OnInit {
    records: CalidadReporte[] = [];
    filteredRecords: CalidadReporte[] = [];
    activeTab: 'habitacion' | 'spa' = 'habitacion';

    // Filters
    filterFecha = '';
    filterNumero = '';
    filterInspector = '';

    // Modals
    showFormModal = false;
    isEditing = false;
    editingReportId = '';
    submitting = false;

    loggedUserPlaceholder = '';

    formReport = {
        fecha: '',
        numero: '',
        inspector: 'Alejandra Sánchez',
        secciones: [] as CalidadSeccion[]
    };

    constructor(
        private crService: CalidadReportesService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loggedUserPlaceholder = 'Alejandra Sánchez';

        this.crService.getRecords().subscribe({
            next: (data) => {
                this.records = data;
                this.applyFilters();
            }
        });

        // Default date filter = today
        this.filterFecha = new Date().toISOString().split('T')[0];

        // Cargar borrador persistido si existe
        this.loadDraft();
    }

    switchTab(tab: 'habitacion' | 'spa') {
        this.activeTab = tab;
        this.applyFilters();
    }

    totalRecordsCount(): number {
        return this.records.filter(r => r.tipo === this.activeTab).length;
    }

    applyFilters() {
        const num = this.filterNumero.toLowerCase().trim();
        const insp = this.filterInspector.toLowerCase().trim();

        this.filteredRecords = this.records.filter(r => {
            if (r.tipo !== this.activeTab) return false;

            const matchFecha = !this.filterFecha || r.fecha === this.filterFecha;
            const matchNumero = !num || r.numero.toLowerCase().includes(num);
            const matchInspector = !insp || r.inspector.toLowerCase().includes(insp);

            return matchFecha && matchNumero && matchInspector;
        });
        this.cdr.detectChanges();
    }

    resetFilters() {
        this.filterFecha = new Date().toISOString().split('T')[0];
        this.filterNumero = '';
        this.filterInspector = '';
        this.applyFilters();
    }

    getScoreBadgeClass(score: number): string {
        if (score >= 96) return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
        if (score >= 91) return 'bg-amber-100 text-amber-800 border border-amber-300';
        return 'bg-red-100 text-red-800 border border-red-300';
    }

    async printPdf(record: CalidadReporte) {
        const isHabitacion = record.tipo === 'habitacion';
        const subtitleText = isHabitacion ? `Auditoria · Habitación #${record.numero}` : 'Auditoria · Spa';
        const docTitle = isHabitacion ? `Reporte de Calidad — Auditoria #${record.numero}` : 'Reporte de Calidad — Spa';
        const scoreColor = record.puntuacion >= 96 ? '#16a34a' : record.puntuacion >= 91 ? '#d97706' : '#dc2626';

        const estadoHtml = (estado: string) => {
            if (estado === 'Bien') return `<span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">✔ SI</span>`;
            if (estado === 'Mal') return `<span style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">✘ NO</span>`;
            if (estado === 'No aplica') return `<span style="background:#f1f5f9;color:#64748b;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">N/A</span>`;
            return `<span style="color:#94a3b8;font-size:10px;">—</span>`;
        };

        let seccionesHtml = '';
        const palette = [
            '#f0fdf4', '#eff6ff', '#fdf4ff', '#fff7ed', '#f0f9ff',
            '#fdf2f8', '#f7fee7', '#fff1f2', '#f5f3ff', '#ecfdf5', '#fefce8', '#f0fdfa'
        ];
        const borderPalette = [
            '#86efac', '#93c5fd', '#d8b4fe', '#fdba74', '#7dd3fc',
            '#f0abfc', '#a3e635', '#fda4af', '#c4b5fd', '#6ee7b7', '#fde047', '#5eead4'
        ];
        const textPalette = [
            '#15803d', '#1d4ed8', '#7c3aed', '#c2410c', '#0369a1',
            '#a21caf', '#4d7c0f', '#be123c', '#6d28d9', '#065f46', '#854d0e', '#0f766e'
        ];

        record.secciones.forEach((sec, si) => {
            const bg = palette[si % palette.length];
            const border = borderPalette[si % borderPalette.length];
            const color = textPalette[si % textPalette.length];

            const itemsHtml = sec.items.map((item, idx) => `
                <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}">
                    <td style="padding:5px 10px;font-size:10px;color:#334155;border-bottom:1px solid #f1f5f9;width:60%">${item.nombre}</td>
                    <td style="padding:5px 10px;text-align:center;border-bottom:1px solid #f1f5f9;width:15%">${estadoHtml(item.estado)}</td>
                    <td style="padding:5px 10px;font-size:9px;color:#64748b;border-bottom:1px solid #f1f5f9;width:25%">${item.observaciones || ''}</td>
                </tr>`).join('');

            seccionesHtml += `
            <div style="margin-bottom:16px;border:1.5px solid ${border};border-radius:8px;overflow:hidden;page-break-inside:avoid">
                <div style="background:${bg};padding:8px 12px;border-bottom:1px solid ${border};display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:${color}">${sec.nombre}</span>
                    <span style="font-size:9px;font-weight:700;color:${color};background:rgba(0,0,0,.06);padding:2px 8px;border-radius:99px">
                        ${sec.items.filter(i => i.estado !== '').length}/${sec.items.length} respondidas
                    </span>
                </div>
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f8fafc">
                            <th style="padding:5px 10px;font-size:9px;text-align:left;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Criterio</th>
                            <th style="padding:5px 10px;font-size:9px;text-align:center;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Estado</th>
                            <th style="padding:5px 10px;font-size:9px;text-align:left;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
            </div>`;
        });

        // ── Evidencia fotográfica al final ──
        const todasImagenes = record.secciones
            .map((sec, si) => ({ secNombre: sec.nombre, imgs: sec.imagenes || [], si }))
            .filter(s => s.imgs.length > 0);

        let fotoHtml = '';
        if (todasImagenes.length > 0) {
            fotoHtml = `<div style="page-break-before:always">
                <h2 style="font-size:13px;font-weight:800;color:#0f766e;border-bottom:2px solid #ccfbf1;padding-bottom:6px;margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em">
                    📷 Evidencia Fotográfica
                </h2>`;
            todasImagenes.forEach(({ secNombre, imgs, si }) => {
                const bg = palette[si % palette.length];
                const color = textPalette[si % textPalette.length];
                const border = borderPalette[si % borderPalette.length];
                fotoHtml += `
                <div style="margin-bottom:20px;page-break-inside:avoid">
                    <div style="background:${bg};border:1px solid ${border};border-radius:6px;padding:5px 10px;margin-bottom:10px;display:inline-block">
                        <span style="font-size:10px;font-weight:800;color:${color};text-transform:uppercase">${secNombre}</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:10px">`;
                imgs.forEach(img => {
                    fotoHtml += `
                        <div style="border:1.5px solid #e2e8f0;border-radius:8px;overflow:hidden;width:160px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08)">
                            <img src="${img.preview}" style="width:160px;height:120px;object-fit:cover;display:block" />
                            <div style="padding:5px 8px;font-size:9px;color:#475569;font-weight:600;border-top:1px solid #f1f5f9;line-height:1.3">
                                ${img.criterio || '(sin criterio)'}
                            </div>
                        </div>`;
                });
                fotoHtml += `</div></div>`;
            });
            fotoHtml += `</div>`;
        }

        // ── Cargar logo como base64 ──
        let logoBase64 = '';
        try {
            const resp = await fetch('/layout/images/NyxHotelLogo-removebg-preview.png');
            const blob = await resp.blob();
            logoBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch { logoBase64 = ''; }

        const logoHtml = logoBase64
            ? `<img src="${logoBase64}" style="height:52px;object-fit:contain;" alt="NYX Hotel" />`
            : `<span style="font-size:15px;font-weight:900;color:#0f766e;">NYX Hotel Cancún</span>`;

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>${docTitle}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e293b; padding: 24px 28px; font-size: 11px; }
  @media print {
    body { padding: 12px 16px; }
    @page { size: A4; margin: 14mm 12mm; }
  }
</style>
</head>
<body>
  <!-- Encabezado -->
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f766e;padding-bottom:12px;margin-bottom:18px">
    <div style="display:flex;align-items:center;gap:14px">
      ${logoHtml}
      <div>
        <div style="font-size:16px;font-weight:900;color:#0f766e;text-transform:uppercase;letter-spacing:.04em">Reporte de Calidad</div>
        <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:2px">${subtitleText}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:10px;color:#64748b">Fecha: <strong>${record.fecha}</strong></div>
      <div style="font-size:10px;color:#64748b;margin-top:2px">Inspector: <strong>${record.inspector}</strong></div>
      <div style="margin-top:6px;background:${scoreColor};color:#fff;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:900;display:inline-block">
        ${record.puntuacion}%
      </div>
    </div>
  </div>

  <!-- Secciones -->
  ${seccionesHtml}

  <!-- Imágenes al final -->
  ${fotoHtml}

  <div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:8px;text-align:center;font-size:9px;color:#94a3b8">
    Estándares de Calidad · NYX Hotel Cancún · Generado ${new Date().toLocaleString('es-MX')}
  </div>
</body>
</html>`;

        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return;
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 600);
    }

    // ── Form Modal Management ──────────────────────
    openCreateModal() {
        const now = new Date();
        const localDate = now.toISOString().split('T')[0];

        this.isEditing = false;
        this.editingReportId = '';
        const secciones = this.getDefaultSections(this.activeTab);
        // Inicializar imagenes y activa en cada sección
        secciones.forEach(sec => {
            sec.imagenes = [];
            if (sec.nombre === 'Terraza o balcón') sec.activa = true;
        });
        this.formReport = {
            fecha: localDate,
            numero: '',
            inspector: 'Alejandra Sánchez',
            secciones
        };
        this.showFormModal = true;
        this.saveDraft();
    }

    openEditModal(record: CalidadReporte) {
        this.isEditing = true;
        this.editingReportId = record.id || record._id || '';

        // Deep copy of sections to prevent editing original list before saving
        const secciones: CalidadSeccion[] = JSON.parse(JSON.stringify(record.secciones));
        secciones.forEach(sec => {
            if (!sec.imagenes) sec.imagenes = [];
            if (sec.nombre === 'Terraza o balcón' && sec.activa === undefined) sec.activa = true;
        });
        this.formReport = {
            fecha: record.fecha,
            numero: record.numero,
            inspector: record.inspector,
            secciones
        };
        this.showFormModal = true;
        this.saveDraft();
    }

    deleteReport(record: CalidadReporte) {
        const id = record.id || record._id || '';
        if (!id) return;

        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar este reporte de ${this.activeTab === 'habitacion' ? 'Habitación' : 'Spa'} #${record.numero}?`,
            header: 'Eliminar Reporte',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.crService.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'El reporte se eliminó correctamente.'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el reporte.'
                        });
                    }
                });
            }
        });
    }

    // ── Image compression (same technique as reporte-guardia) ────────────
    private comprimirEnCanvas(imgEl: HTMLImageElement, maxWidth: number, quality: number): string {
        const canvas = document.createElement('canvas');
        let w = imgEl.width;
        let h = imgEl.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(imgEl, 0, 0, w, h);
        return canvas.toDataURL('image/jpeg', quality);
    }

    async comprimirImagenAdaptiva(file: File): Promise<string> {
        const MAX_B64 = 200_000;
        const pasos = [
            { maxWidth: 900, quality: 0.75 },
            { maxWidth: 800, quality: 0.60 },
            { maxWidth: 700, quality: 0.50 },
            { maxWidth: 600, quality: 0.40 },
            { maxWidth: 500, quality: 0.30 },
            { maxWidth: 450, quality: 0.22 },
            { maxWidth: 400, quality: 0.15 },
            { maxWidth: 350, quality: 0.10 },
        ];
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = reject;
                img.onload = () => {
                    for (const paso of pasos) {
                        const result = this.comprimirEnCanvas(img, paso.maxWidth, paso.quality);
                        if (result.length <= MAX_B64) { resolve(result); return; }
                    }
                    resolve(this.comprimirEnCanvas(img, 300, 0.08));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    async onImageSelected(event: Event, secIndex: number) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        const sec = this.formReport.secciones[secIndex];
        if (!sec.imagenes) sec.imagenes = [];
        const files = Array.from(input.files);
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            try {
                const preview = await this.comprimirImagenAdaptiva(file);
                // El criterio se toma del último ítem contestado con 'Mal', o se deja vacío en lugar del nombre de archivo
                const lastMal = [...sec.items].reverse().find(i => i.estado === 'Mal');
                const criterio = lastMal ? lastMal.nombre : '';
                sec.imagenes.push({ preview, criterio });
                this.cdr.detectChanges();
            } catch (err) {
                console.error('Error al comprimir imagen:', err);
            }
        }
        input.value = '';
        this.saveDraft();
    }

    removeImage(secIndex: number, imgIndex: number) {
        this.formReport.secciones[secIndex].imagenes?.splice(imgIndex, 1);
        this.cdr.detectChanges();
        this.saveDraft();
    }

    // ── Local Storage Draft Recovery ───────────────
    private _saveTimer: any = null;

    /** Debounce: guarda máximo una vez cada 600 ms sin importar cuántos eventos lleguen */
    scheduleSave() {
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => { this._doSave(); }, 600);
    }

    saveDraft() { this._doSave(); }

    private _doSave() {
        try {
            const draft = {
                activeTab: this.activeTab,
                isEditing: this.isEditing,
                editingReportId: this.editingReportId,
                formReport: this.formReport
            };
            localStorage.setItem('calidad_reporte_draft', JSON.stringify(draft));
        } catch (e) {
            // Silenciar errores de cuota (imágenes muy pesadas)
            console.warn('No se pudo guardar borrador en localStorage', e);
        }
    }

    loadDraft() {
        try {
            const raw = localStorage.getItem('calidad_reporte_draft');
            if (raw) {
                const draft = JSON.parse(raw);
                if (draft && draft.formReport) {
                    this.activeTab = draft.activeTab || 'habitacion';
                    this.isEditing = draft.isEditing || false;
                    this.editingReportId = draft.editingReportId || '';
                    this.formReport = draft.formReport;
                    this.showFormModal = true;
                    this.cdr.detectChanges();
                }
            }
        } catch (e) {
            console.error('Error loading draft', e);
        }
    }

    clearDraft() {
        localStorage.removeItem('calidad_reporte_draft');
    }

    // ── Section color palette ──────────────────────
    private sectionPalette = [
        { bg: '#f0fdf4', border: '#86efac', text: '#15803d', badge: '#dcfce7' }, // green
        { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', badge: '#dbeafe' }, // blue
        { bg: '#fdf4ff', border: '#d8b4fe', text: '#7c3aed', badge: '#f3e8ff' }, // purple
        { bg: '#fff7ed', border: '#fdba74', text: '#c2410c', badge: '#ffedd5' }, // orange
        { bg: '#f0f9ff', border: '#7dd3fc', text: '#0369a1', badge: '#e0f2fe' }, // sky
        { bg: '#fdf2f8', border: '#f0abfc', text: '#a21caf', badge: '#fae8ff' }, // pink
        { bg: '#f7fee7', border: '#a3e635', text: '#4d7c0f', badge: '#ecfccb' }, // lime
        { bg: '#fff1f2', border: '#fda4af', text: '#be123c', badge: '#ffe4e6' }, // rose
        { bg: '#f5f3ff', border: '#c4b5fd', text: '#6d28d9', badge: '#ede9fe' }, // violet
        { bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46', badge: '#d1fae5' }, // emerald
        { bg: '#fefce8', border: '#fde047', text: '#854d0e', badge: '#fef9c3' }, // yellow
        { bg: '#f0fdfa', border: '#5eead4', text: '#0f766e', badge: '#ccfbf1' }  // teal
    ];

    getSectionColor(index: number) {
        return this.sectionPalette[index % this.sectionPalette.length];
    }

    getSectionAnswered(sec: CalidadSeccion): number {
        return sec.items.filter(i => i.estado !== '').length;
    }

    // ── Score calculation on-the-fly ───────────────
    getLiveCounts() {
        let bien = 0;
        let total = 0;
        for (const sec of this.formReport.secciones) {
            // Ignorar sección inactiva (terraza desactivada)
            if (sec.nombre === 'Terraza o balcón' && !sec.activa) continue;
            for (const item of sec.items) {
                if (item.estado === 'Bien') {
                    bien++;
                    total++;
                } else if (item.estado === 'Mal') {
                    total++;
                }
            }
        }
        return { bien, total };
    }

    getLiveScore(): number {
        const { bien, total } = this.getLiveCounts();
        if (total === 0) return 100;
        return Math.round((bien / total) * 100 * 10) / 10;
    }
    submitForm() {
        const { fecha, numero, inspector, secciones } = this.formReport;
        const isNumeroRequired = this.activeTab === 'habitacion';
        const finalNumero = isNumeroRequired ? numero : 'Spa';

        if (!fecha || (isNumeroRequired && !numero) || !inspector || secciones.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Por favor completa todos los campos generales de inspección.'
            });
            return;
        }

        // Excluir secciones inactivas del payload enviado
        const seccionesEnvio = secciones.map(sec => {
            if (sec.nombre === 'Terraza o balcón' && !sec.activa) {
                // Enviar vacía para no inflar el documento pero mantener la referencia
                return { ...sec, items: sec.items.map(i => ({ ...i, estado: 'No aplica' as const })) };
            }
            return sec;
        });

        const data: Omit<CalidadReporte, 'id' | '_id'> = {
            fecha,
            tipo: this.activeTab,
            numero: finalNumero,
            inspector,
            secciones: seccionesEnvio,
            puntuacion: this.getLiveScore()
        };

        this.submitting = true;
        if (this.isEditing) {
            this.crService.update(this.editingReportId, data).subscribe({
                next: () => {
                    this.submitting = false;
                    this.showFormModal = false;
                    this.clearDraft();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Guardado',
                        detail: 'El reporte se actualizó correctamente.'
                    });
                },
                error: () => {
                    this.submitting = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo actualizar el reporte.'
                    });
                }
            });
        } else {
            this.crService.create(data).subscribe({
                next: () => {
                    this.submitting = false;
                    this.showFormModal = false;
                    this.clearDraft();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado',
                        detail: 'El reporte de calidad se registró correctamente.'
                    });
                },
                error: () => {
                    this.submitting = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo guardar el reporte de calidad.'
                    });
                }
            });
        }
    }

    // ── Default sections helper ────────────────────
    getDefaultSections(tipo: 'habitacion' | 'spa'): CalidadSeccion[] {
        if (tipo === 'habitacion') {
            return [
                {
                    nombre: 'Generales',
                    items: [
                        { nombre: 'Exterior de habitación', estado: '', observaciones: '' },
                        { nombre: 'Número de habitación', estado: '', observaciones: '' },
                        { nombre: 'Puerta de acceso, chapa y funcionamiento', estado: '', observaciones: '' },
                        { nombre: 'Brazo o bisagra de cerrado automático', estado: '', observaciones: '' },
                        { nombre: 'de evacuación', estado: '', observaciones: '' },
                        { nombre: 'Letrero de NO fumar en habitación', estado: '', observaciones: '' },
                        { nombre: 'Candado de NO molestar / asear la habitación', estado: '', observaciones: '' },
                        { nombre: 'Menu Room Service', estado: '', observaciones: '' },
                        { nombre: 'Cafetera / con kit de cafe', estado: '', observaciones: '' },
                        { nombre: 'Tazas con blondas', estado: '', observaciones: '' },
                        { nombre: 'Estado del piso', estado: '', observaciones: '' },
                        { nombre: 'Estado del techo', estado: '', observaciones: '' },
                        { nombre: 'Estado de los muros', estado: '', observaciones: '' },
                        { nombre: 'Ventilador', estado: '', observaciones: '' },
                        { nombre: 'Iluminación', estado: '', observaciones: '' },
                        { nombre: 'Apagadores / Contactos', estado: '', observaciones: '' },
                        { nombre: 'Habitación libre de olores', estado: '', observaciones: '' },
                        { nombre: 'Rejillas del aire acondicionado', estado: '', observaciones: '' },
                        { nombre: 'Aire a 22 ºC y en automático o low', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Closet',
                    items: [
                        { nombre: 'Puertas', estado: '', observaciones: '' },
                        { nombre: 'Entrepaños', estado: '', observaciones: '' },
                        { nombre: 'Caja de seguridad', estado: '', observaciones: '' },
                        { nombre: 'Plancha y burro de planchar', estado: '', observaciones: '' },
                        { nombre: 'Bolsa y lista de lavandería', estado: '', observaciones: '' },
                        { nombre: 'Cobertor y almohada en entrepaño superior', estado: '', observaciones: '' },
                        { nombre: '5 ganchos de pinza y 5 ganchos lisos', estado: '', observaciones: '' },
                        { nombre: 'Reglamento del hotel ingles / español', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Escritorio y frigobar',
                    items: [
                        { nombre: 'Frigobar', estado: '', observaciones: '' },
                        { nombre: 'Escritorio o mueble del frigobar', estado: '', observaciones: '' },
                        { nombre: 'Silla del escritorio', estado: '', observaciones: '' },
                        { nombre: 'Producto completo en frigobar', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Habitación',
                    items: [
                        { nombre: 'Cuadros decorativos', estado: '', observaciones: '' },
                        { nombre: 'Espejo', estado: '', observaciones: '' },
                        { nombre: 'Cesto de basura', estado: '', observaciones: '' },
                        { nombre: 'Maceta con palma', estado: '', observaciones: '' },
                        { nombre: 'Sillones / sofa cama', estado: '', observaciones: '' },
                        { nombre: 'Mesa de la sala', estado: '', observaciones: '' },
                        { nombre: 'Mesa de comedor', estado: '', observaciones: '' },
                        { nombre: 'Televisor', estado: '', observaciones: '' },
                        { nombre: 'Control remoto', estado: '', observaciones: '' },
                        { nombre: 'Guia de canales de TV', estado: '', observaciones: '' },
                        { nombre: 'Tarjeta de bienvenida', estado: '', observaciones: '' },
                        { nombre: 'Tarjeta de Cambio Ecológico', estado: '', observaciones: '' },
                        { nombre: 'Ventanas', estado: '', observaciones: '' },
                        { nombre: 'Cortinas (frescura)', estado: '', observaciones: '' },
                        { nombre: 'Cortinas (black out)', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Cama',
                    items: [
                        { nombre: 'Cabecera', estado: '', observaciones: '' },
                        { nombre: 'Buró', estado: '', observaciones: '' },
                        { nombre: 'Teléfono', estado: '', observaciones: '' },
                        { nombre: 'Directorio telefónico', estado: '', observaciones: '' },
                        { nombre: 'Radio despertador', estado: '', observaciones: '' },
                        { nombre: 'Almohadas y cojines', estado: '', observaciones: '' },
                        { nombre: 'Tendido de cama', estado: '', observaciones: '' },
                        { nombre: 'Camino decorativo', estado: '', observaciones: '' },
                        { nombre: 'Faldón o pie de cama', estado: '', observaciones: '' },
                        { nombre: 'Lamparas de lectura', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Terraza o balcón',
                    items: [
                        { nombre: 'Canceleria', estado: '', observaciones: '' },
                        { nombre: 'Cristales', estado: '', observaciones: '' },
                        { nombre: 'Calcomanías en cristales', estado: '', observaciones: '' },
                        { nombre: 'Cortinas (Frescura)', estado: '', observaciones: '' },
                        { nombre: 'Cortinas (Black out)', estado: '', observaciones: '' },
                        { nombre: 'Cortinas (Caidas decorativas)', estado: '', observaciones: '' },
                        { nombre: 'Maceta con palma', estado: '', observaciones: '' },
                        { nombre: 'Techo', estado: '', observaciones: '' },
                        { nombre: 'Piso', estado: '', observaciones: '' },
                        { nombre: 'Drenaje', estado: '', observaciones: '' },
                        { nombre: 'Muros', estado: '', observaciones: '' },
                        { nombre: 'Barandal', estado: '', observaciones: '' },
                        { nombre: 'Iluminación', estado: '', observaciones: '' },
                        { nombre: 'Mesa de terraza', estado: '', observaciones: '' },
                        { nombre: 'Sillas de terraza', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Baño',
                    items: [
                        { nombre: 'Puerta', estado: '', observaciones: '' },
                        { nombre: 'Piso', estado: '', observaciones: '' },
                        { nombre: 'Techo', estado: '', observaciones: '' },
                        { nombre: 'Muros', estado: '', observaciones: '' },
                        { nombre: 'Ventanas', estado: '', observaciones: '' },
                        { nombre: 'Iluminación', estado: '', observaciones: '' },
                        { nombre: 'Apagadores / contactos', estado: '', observaciones: '' },
                        { nombre: 'Lavabo', estado: '', observaciones: '' },
                        { nombre: 'Mezcladora / monomando', estado: '', observaciones: '' },
                        { nombre: 'Temperatura del agua', estado: '', observaciones: '' },
                        { nombre: 'Espejo del lavabo', estado: '', observaciones: '' },
                        { nombre: 'Vasos con blondas', estado: '', observaciones: '' },
                        { nombre: 'Amenidades', estado: '', observaciones: '' },
                        { nombre: 'Toallas', estado: '', observaciones: '' },
                        { nombre: 'Toalleros', estado: '', observaciones: '' },
                        { nombre: 'Cesto de basura', estado: '', observaciones: '' },
                        { nombre: 'Secadora de cabello', estado: '', observaciones: '' },
                        { nombre: 'Espejo de vanidad', estado: '', observaciones: '' },
                        { nombre: 'Taza de baño', estado: '', observaciones: '' },
                        { nombre: 'Porta rollos', estado: '', observaciones: '' },
                        { nombre: 'Rollos de papel higiénico', estado: '', observaciones: '' },
                        { nombre: 'Pañuelos desechables', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'Ducha',
                    items: [
                        { nombre: 'Jabonera', estado: '', observaciones: '' },
                        { nombre: 'Coladera', estado: '', observaciones: '' },
                        { nombre: 'Cebolla', estado: '', observaciones: '' },
                        { nombre: 'Brazo de altura de la cebolla', estado: '', observaciones: '' },
                        { nombre: 'Mezcladora / monomando', estado: '', observaciones: '' },
                        { nombre: 'Tendedero retráctil', estado: '', observaciones: '' },
                        { nombre: 'Puerta o cortina', estado: '', observaciones: '' }
                    ]
                }
            ];
        } else {
            return [
                {
                    nombre: '1. PRESENTACIÓN DEL PERSONAL',
                    items: [
                        { nombre: 'El colaborador porta uniforme completo, limpio y conforme al estándar establecido.', estado: '', observaciones: '' },
                        { nombre: 'El colaborador porta gafete de identificación visible del lado izquierdo.', estado: '', observaciones: '' },
                        { nombre: 'El personal de playa asignado al Spa porta uniforme completo y porta aceitera de servicio.', estado: '', observaciones: '' },
                        { nombre: 'La imagen personal cumple con el estándar (cabello, higiene personal y presentación).', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: '2. ATENCIÓN AL HUÉSPED – General',
                    items: [
                        { nombre: 'La etiqueta telefónica se realiza conforme al estándar institucional. Departamento en el cuál labora (Ejemplo: NYX Spa, Buenos días/tardes/noches (según aplica). Le atiende (Nombre del colaborador) ¿En que le puedo ayudar?', estado: '', observaciones: '' },
                        { nombre: 'Se aplica correctamente la Regla de los 10 y 5 pasos.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: '2. ATENCIÓN AL HUÉSPED – Check-in',
                    items: [
                        { nombre: 'Se sigue el estándar de saludo en la bienvenida al Spa: "Buenos días/tardes/noches, Bienvenidos a NYX Spa!, mi nombre es… (dar su nombre), es un placer tenerlo con nosotros"', estado: '', observaciones: '' },
                        { nombre: 'Se ofrecen las amenidades de bienvenida.', estado: '', observaciones: '' },
                        { nombre: 'Se confirma la reservación verificando tratamiento, horario, duración y tarifa.', estado: '', observaciones: '' },
                        { nombre: 'El formato de consulta y/o consentimiento se encuentra correctamente llenado.', estado: '', observaciones: '' },
                        { nombre: 'El colaborador ofrece asistencia adicional al huésped.', estado: '', observaciones: '' },
                        { nombre: 'El terapeuta asignado se presenta al huésped antes de iniciar el servicio.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: '2. ATENCIÓN AL HUÉSPED – Check-out',
                    items: [
                        { nombre: 'Se realiza el procedimiento de check-out conforme al estándar. 1. Pregunta por el servicio. ¿Qué le parecio el servicio? ¿Cómo se sintió? ¿Le gustaría agendar algún otro tratamiento?', estado: '', observaciones: '' },
                        { nombre: '2. Se invita al huésped a responder la encuesta de satisfacción y/o TripAdvisor. ¿Me permite entregarle una tarjeta de TripdAvisor por si usted desea poner algún comentario? Ademas le comentó que le llegará un correo que contiene nuestra encuesta de calidad, nos daría mucho gusto que nos evaluará.', estado: '', observaciones: '' },
                        { nombre: 'La despedida se realiza de manera cordial y agradeciendo su visita.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'RECEPCIÓN',
                    items: [
                        { nombre: 'El área de recepción se encuentra limpia y ordenada.', estado: '', observaciones: '' },
                        { nombre: 'El mobiliario se encuentra limpio y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'El menú de tratamientos está visible y actualizado.', estado: '', observaciones: '' },
                        { nombre: 'La iluminación y música ambiental son adecuadas.', estado: '', observaciones: '' },
                        { nombre: 'No existen objetos fuera de lugar o materiales innecesarios.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'BAÑOS DE HUÉSPEDES',
                    items: [
                        { nombre: 'El baño se encuentra limpio y libre de malos olores.', estado: '', observaciones: '' },
                        { nombre: 'Cuenta con papel higiénico, jabón y bote de basura.', estado: '', observaciones: '' },
                        { nombre: 'Lavabos, espejos, sanitarios y accesorios están limpios.', estado: '', observaciones: '' },
                        { nombre: 'Pisos y paredes están limpios y sin daños visibles.', estado: '', observaciones: '' },
                        { nombre: 'Los dispensadores funcionan correctamente.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'CABINAS DE MASAJE',
                    items: [
                        { nombre: 'La cabina se encuentra limpia y ordenada.', estado: '', observaciones: '' },
                        { nombre: 'La iluminación es adecuada para el tratamiento.', estado: '', observaciones: '' },
                        { nombre: 'La aromatización es agradable y suficiente.', estado: '', observaciones: '' },
                        { nombre: 'La cama de masaje está correctamente tendida conforme al estándar. Faldon, Sábana de cajón, Toalla de alberca beige. Sábana plana. Cubrecama. Camino.', estado: '', observaciones: '' },
                        { nombre: 'La ropa de cama está limpia, sin manchas ni desgaste.', estado: '', observaciones: '' },
                        { nombre: 'La charola con campanas tibetanas está limpia, completa y correctamente colocada.', estado: '', observaciones: '' },
                        { nombre: 'No existen objetos ajenos al servicio dentro de la cabina.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'SALÓN DE BELLEZA',
                    items: [
                        { nombre: 'El salón se encuentra limpio y ordenado.', estado: '', observaciones: '' },
                        { nombre: 'Herramientas limpias, desinfectadas y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'Productos correctamente almacenados y etiquetados.', estado: '', observaciones: '' },
                        { nombre: 'Las estaciones de trabajo permanecen organizadas.', estado: '', observaciones: '' },
                        { nombre: 'El mobiliario está limpio y sin daños.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'ÁREA DE MEDICINA ESTÉTICA',
                    items: [
                        { nombre: 'El salón se encuentra limpio y ordenado.', estado: '', observaciones: '' },
                        { nombre: 'Herramientas limpias, desinfectadas y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'Productos correctamente almacenados y etiquetados.', estado: '', observaciones: '' },
                        { nombre: 'Las estaciones de trabajo permanecen organizadas.', estado: '', observaciones: '' },
                        { nombre: 'El mobiliario está limpio y sin daños.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'HIDROMASAJE',
                    items: [
                        { nombre: 'El área se encuentra limpia y ordenada.', estado: '', observaciones: '' },
                        { nombre: 'La iluminación funciona correctamente.', estado: '', observaciones: '' },
                        { nombre: 'La aromatización es adecuada.', estado: '', observaciones: '' },
                        { nombre: 'El piso está libre de incrustaciones y residuos.', estado: '', observaciones: '' },
                        { nombre: 'El tubo de hielo está limpio y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'La regadera funciona correctamente y se encuentra limpia.', estado: '', observaciones: '' },
                        { nombre: 'La cortina permanece cerrada cuando no hay servicio.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'PALAPA DEL SPA (PLAYA)',
                    items: [
                        { nombre: 'La estructura de la palapa se encuentra firme y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'No existen telarañas, nidos o acumulación de polvo.', estado: '', observaciones: '' },
                        { nombre: 'El piso de la palapa está limpio y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'El mobiliario está limpio, alineado y sin daños.', estado: '', observaciones: '' },
                        { nombre: 'La iluminación funciona correctamente.', estado: '', observaciones: '' },
                        { nombre: 'La decoración se encuentra limpia y completa.', estado: '', observaciones: '' },
                        { nombre: 'El área transmite una imagen de limpieza, confort y seguridad.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'ESTÁNDAR DURANTE EL SERVICIO',
                    items: [
                        { nombre: 'El terapeuta explica el desarrollo del tratamiento antes de iniciar.', estado: '', observaciones: '' },
                        { nombre: 'Explica el uso de campanas tibetanas, iluminación y música ambiental.', estado: '', observaciones: '' },
                        { nombre: 'Verifica el confort del huésped durante el servicio.', estado: '', observaciones: '' },
                        { nombre: 'Respeta el tiempo estándar del tratamiento contratado. *Manicure básico/Pedicure básico (esmalte regular) - 25 min. *Gelish 60-70 min. *Spa Manicure/Spa Pedicure - 50-60 min. *Depilación: Ceja/Bigote/Barbilla - 25 min; Axila/Brazo/Línea bikini - 30 min; Brazo completo/Media pierna - 45 min; Pierna completa/Espalda/Pecho - 1 hora. *Cortes de cabello 40 min máx. *Retiro de esmalte / 30 min máx.', estado: '', observaciones: '' },
                        { nombre: 'Mantiene una actitud profesional durante todo el servicio.', estado: '', observaciones: '' },
                        { nombre: 'Pregunta sobre lesiones o molestias durante el servicio en cabina.', estado: '', observaciones: '' }
                    ]
                },
                {
                    nombre: 'MANTENIMIENTO E INFRAESTRUCTURA',
                    items: [
                        { nombre: 'Fachada limpia y en buen estado.', estado: '', observaciones: '' },
                        { nombre: 'Pintura sin desprendimientos.', estado: '', observaciones: '' },
                        { nombre: 'Pisos, paredes y techos sin daños visibles.', estado: '', observaciones: '' },
                        { nombre: 'Puertas y cerraduras funcionan correctamente.', estado: '', observaciones: '' },
                        { nombre: 'La iluminación del Spa funciona correctamente.', estado: '', observaciones: '' },
                        { nombre: 'No existen fugas de agua.', estado: '', observaciones: '' },
                        { nombre: 'No existen grietas o humedad visibles.', estado: '', observaciones: '' }
                    ]
                }
            ];
        }
    }
}
