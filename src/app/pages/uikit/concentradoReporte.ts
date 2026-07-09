import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

import { ListaReportes, ListaReportesService } from '../service/lista-reportes.service';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-concentrado-reporte',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        ProgressSpinnerModule,
        MessageModule,
        TableModule,
        ChartModule
    ],
    template: `
<div class="flex flex-col gap-6 p-4 md:p-8 min-h-screen">
    
    <div>
        <p-button 
            icon="pi pi-arrow-left" 
            label="Volver a la Lista de Reportes" 
            [outlined]="true" 
            severity="secondary"
            (click)="volver()">
        </p-button>
    </div>

    <div *ngIf="loading" class="flex justify-center items-center p-12">
        <p-progressSpinner ariaLabel="Cargando"></p-progressSpinner>
    </div>

    <div *ngIf="!loading && !reporte" class="flex justify-center p-12">
        <p-message severity="error" text="El reporte solicitado no existe o fue eliminado."></p-message>
    </div>

    <div *ngIf="!loading && reporte" class="flex flex-col gap-6 animate-fade-in">
        
        <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold mb-2">Concentrado: {{ reporte.area | titlecase }}</h1>
                <p class="text-[var(--p-text-muted-color)] max-w-md">
                Datos consolidados de <strong>{{ reporte.area | titlecase }}</strong><span *ngIf="reporte.targetName"> para: <strong>{{ reporte.targetName }}</strong></span>.
                </p>
            </div>
            
            <div class="flex flex-col items-end gap-1 text-sm bg-[var(--p-content-hover-background)] p-3 rounded-lg">
                <div class="flex items-center gap-2 text-[var(--p-text-muted-color)]">
                    <i class="pi pi-calendar"></i> Generado: 
                    <span class="font-medium text-[var(--p-text-color)]">{{ formatFechaCorto(reporte.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-2 text-[var(--p-text-muted-color)]">
                    <i class="pi pi-user"></i> Autor: 
                    <span class="font-medium text-[var(--p-text-color)]">{{ reporte.reportCreator }}</span>
                </div>
                
                <div *ngIf="reporte.reportType !== 'historico' && reporte.startDate && reporte.endDate" class="flex items-center gap-2 text-[var(--p-text-muted-color)] mt-1 pt-1 border-t border-[var(--p-surface-border)]">
                    <i class="pi pi-clock"></i> Periodo: 
                    <span class="font-medium text-[var(--p-text-color)]">{{ formatFechaCorto(reporte.startDate) }} - {{ formatFechaCorto(reporte.endDate) }}</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-[var(--p-text-muted-color)]">Horas Registradas</span>
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <i class="pi pi-clock text-xl"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold">{{ totalHoras | number:'1.0-0' }}<span class="text-lg text-[var(--p-text-muted-color)] font-medium">h</span></div>
                <div class="text-sm text-[var(--p-text-muted-color)]">
                    Total de horas sumadas
                </div>
            </div>

            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-[var(--p-text-muted-color)]">Media de Horas</span>
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <i class="pi pi-chart-line text-xl"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold">{{ totalIngenieros > 0 ? (totalHoras / totalIngenieros | number:'1.0-0') : 0 }}<span class="text-lg text-[var(--p-text-muted-color)] font-medium">h</span></div>
                <div class="text-sm text-[var(--p-text-muted-color)]">Promedio de horas por ingeniero</div>
            </div>

            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-[var(--p-text-muted-color)]">Ingenieros Involucrados</span>
                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <i class="pi pi-users text-xl"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold">{{ totalIngenieros }}</div>
                <div class="text-sm text-[var(--p-text-muted-color)]">Colaboradores registrados</div>
            </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm overflow-hidden auto-cols-auto">
                <h3 class="text-xl font-semibold mb-4 text-[var(--p-text-color)]">
                    Detalle {{ reporte.area.toLowerCase() === 'por ingeniero' ? 'por Ingeniero' : 'de Registros' }}
                </h3>
                <p-table [value]="tablaData" [paginator]="true" [rows]="5" styleClass="p-datatable-sm" responsiveLayout="scroll">
                    <ng-template #header>
                        <tr>
                            <th>{{ reporte.area.toLowerCase() === 'por ingeniero' ? 'Ingeniero' : 'Nombre' }}</th>
                            <th *ngIf="deberiaMostrarArea('desarrollo')" class="text-center">Desarrollo (hrs)</th>
                            <th *ngIf="deberiaMostrarArea('mkt')" class="text-center">MKT (hrs)</th>
                            <th *ngIf="deberiaMostrarArea('ci/cd')" class="text-center">CI/CD (hrs)</th>
                            <th class="text-center">Total</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-item>
                        <tr>
                            <td class="font-medium">{{ item.name }}</td>
                             <td *ngIf="deberiaMostrarArea('desarrollo')" class="text-center">{{ item.developmentHours || 0 }}</td>
                             <td *ngIf="deberiaMostrarArea('mkt')" class="text-center">{{ item.mktHours || 0 }}</td>
                             <td *ngIf="deberiaMostrarArea('ci/cd')" class="text-center">{{ item.cicdHours || 0 }}</td>
                             <td class="text-center font-bold text-[var(--p-primary-color)]">{{ (item.developmentHours || 0) + (item.cicdHours || 0) + (item.mktHours || 0) }}</td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr><td colspan="5" class="text-center p-4">No hay datos disponibles para esta vista.</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm flex flex-col items-center justify-center">
                <h3 class="text-xl font-semibold mb-4 text-[var(--p-text-color)] w-full text-left">Distribución de Horas</h3>
                <div class="w-full flex justify-center">
                    <p-chart type="pie" [data]="chartData" [options]="chartOptions" [style]="{'width': '300px'}"></p-chart>
                </div>
            </div>
            
        </div>

        <div class="grid grid-cols-1 mt-6 animate-fade-in" *ngIf="rawLogsData && rawLogsData.length > 0">
            <div class="bg-[var(--p-content-background)] p-6 rounded-2xl border border-[var(--p-content-border-color)] shadow-sm overflow-hidden">
                <h3 class="text-xl font-semibold mb-4 text-[var(--p-text-color)]">
                    Desglose de Registros de Horas
                </h3>
                <p-table [value]="rawLogsData" [paginator]="true" [rows]="10" styleClass="p-datatable-sm" responsiveLayout="scroll">
                    <ng-template #header>
                        <tr>
                            <th>Fecha</th>
                            <th>Desarrollador</th>
                            <th>Proyecto</th>
                            <th>Área</th>
                            <th *ngIf="reporte.area.toLowerCase() === 'ci/cd' || reporte.area.toLowerCase() === 'todas'">Tipo Tarea</th>
                            <th class="text-center">Horas</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-log>
                        <tr>
                            <td class="whitespace-nowrap">{{ formatFechaCorto(log.date) }}</td>
                            <td class="font-medium truncate max-w-[200px]">{{ log.developer }}</td>
                            <td class="truncate max-w-[200px]">{{ log.projectName }}</td>
                            <td>
                                <span class="px-2.5 py-1 text-xs rounded-lg border font-bold uppercase transition-all duration-300 whitespace-nowrap bg-gray-50 border-gray-200 text-gray-600">
                                    {{ log.area }}
                                </span>
                            </td>
                            <td *ngIf="reporte.area.toLowerCase() === 'ci/cd' || reporte.area.toLowerCase() === 'todas'">
                                <span *ngIf="log.taskType" class="text-xs font-semibold text-gray-500">{{ log.taskType }}</span>
                                <span *ngIf="!log.taskType" class="text-xs italic text-gray-400">-</span>
                            </td>
                            <td class="text-center font-bold text-[var(--p-primary-color)]">{{ log.hoursWorked | number:'1.0-2' }}</td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr><td colspan="5" class="text-center p-4">No hay desglose disponible.</td></tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

    </div>
</div>
    `,
    styles: [`
    .animate-fade-in {
        animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    `]
})
export class ConcentradoReporte implements OnInit {

    reporteId: string | null = null;
    reporte: ListaReportes | null = null;
    loading: boolean = true;

    tablaData: any[] = [];
    rawLogsData: any[] = [];
    chartData: any;
    chartOptions: any;

    totalHoras: number = 0;
    totalIngenieros: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private reportesService: ListaReportesService,
        private cdr: ChangeDetectorRef,
        private layoutService: LayoutService
    ) { 
        effect(() => {
            this.layoutService.layoutConfig();
            if (this.tablaData && this.tablaData.length > 0) {
                setTimeout(() => {
                    this.prepararGrafica();
                    this.cdr.detectChanges();
                }, 0);
            }
        });
    }

    ngOnInit() {
        this.reporteId = this.route.snapshot.paramMap.get('id');

        if (this.reporteId) {
            this.cargarReporte(this.reporteId);
        } else {
            this.loading = false;
        }
    }

    cargarReporte(id: string) {
        this.loading = true;

        this.reportesService.getReportes().subscribe({
            next: (reportes) => {
                this.reporte = reportes.find(r => r._id === id) || null;

                if (this.reporte) {
                    this.reporte.startDate = this.reporte.startDate ? new Date(this.reporte.startDate) : undefined;
                    this.reporte.endDate = this.reporte.endDate ? new Date(this.reporte.endDate) : undefined;
                    
                    this.cargarEstadisticas(id);
                } else {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            },
            error: (err) => {
                console.error('Error cargando el reporte:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    cargarEstadisticas(id: string) {
        this.reportesService.getReporteStats(id).subscribe({
            next: (data: any) => {
                if (data && data.aggregates) {
                    this.tablaData = data.aggregates;
                    this.rawLogsData = data.rawLogs || [];
                } else {
                    this.tablaData = data;
                    this.rawLogsData = [];
                }
                this.prepararGrafica();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando las estadísticas:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deberiaMostrarArea(areaToCheck: string): boolean {
        if (!this.reporte || !this.reporte.area) return true;
        const areaReporte = this.reporte.area.toLowerCase();

        if (areaReporte === 'todas' || areaReporte === 'por ingeniero' || areaReporte === 'hosting' || areaReporte === 'por cliente') {
            return true;
        }

        return areaReporte === areaToCheck ||
            (areaReporte === 'cicd' && areaToCheck === 'ci/cd') ||
            (areaReporte === 'marketing' && areaToCheck === 'mkt');
    }

    prepararGrafica() {
        let totalDesarrollo = 0;
        let totalCicd = 0;
        let totalMkt = 0;

        this.tablaData.forEach(item => {
            totalDesarrollo += item.developmentHours || 0;
            totalCicd += item.cicdHours || 0;
            totalMkt += item.mktHours || 0;
        });

        this.totalHoras = totalDesarrollo + totalCicd + totalMkt;
        this.totalIngenieros = this.tablaData.length;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color') || (this.layoutService.isDarkTheme() ? '#ffffff' : '#333333');

        this.chartData = {
            labels: ['Desarrollo', 'CI/CD', 'MKT'],
            datasets: [
                {
                    data: [totalDesarrollo, totalCicd, totalMkt],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-blue-500') || '#3b82f6',
                        documentStyle.getPropertyValue('--p-orange-500') || '#f97316',
                        documentStyle.getPropertyValue('--p-green-500') || '#22c55e'
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--p-blue-400') || '#60a5fa',
                        documentStyle.getPropertyValue('--p-orange-400') || '#fb923c',
                        documentStyle.getPropertyValue('--p-green-400') || '#4ade80'
                    ]
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    volver() {
        this.router.navigate(['/Inicio/ListaReportes']);
    }

    formatFechaCorto(date?: string | Date | null): string {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }
}
