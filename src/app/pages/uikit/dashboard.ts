import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';

import { ListaProyectosService, Proyecto } from '../service/lista-proyectos.service';
import { ListaHorasService, Hora } from '../service/lista-horas.service';
import { CiCdService, CiCd } from '../service/cicd.service';
import { MktService, Mkt } from '../service/mkt.service';
import { UsuarioService, User } from '../service/usuarios.service';
import { RegistrosFaltantesService, RegistroFaltante } from '../service/registros-faltantes.service';
import { AuthService } from '@/app/core/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TableModule,
        ChartModule,
        SelectButtonModule,
        FormsModule,
        SelectModule,
        TagModule,
        DatePickerModule,
        ConfirmDialogModule,
        ToastModule
    ],
    template: `
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<!-- Loading Overlay -->
<div *ngIf="loadingDashboard" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm animate-fade-in">
    <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 border-4 border-[#1e3a8a]/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-[#1e3a8a] rounded-full animate-spin"></div>
        <div class="absolute inset-4 flex items-center justify-center">
            <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="Logo" class="w-10 h-10 opacity-80 animate-pulse" />
        </div>
    </div>
    <h2 class="text-white text-xl font-bold tracking-widest mb-2">OBTENIENDO DATOS</h2>
    <div class="flex gap-1">
        <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
    </div>
</div>

<div class="flex flex-col gap-4 w-full" [class.opacity-0]="loadingDashboard">
    <!-- TOP CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full relative z-10">
        <!-- Proyectos Activos -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#10b981]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#10b981]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#10b981]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <i class="pi pi-folder-open text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-semibold border border-[#10b981]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctProyectosActivos >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctProyectosActivos > 0 ? '+' + pctProyectosActivos : pctProyectosActivos }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ totalProyectosActivos }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Proyectos Activos</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#10b981]/20 group-hover:bg-[#10b981]/30 transition-colors rounded-sm" style="height: 30%"></div>
                <div class="w-full bg-[#10b981]/20 group-hover:bg-[#10b981]/30 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#10b981]/20 group-hover:bg-[#10b981]/30 transition-colors rounded-sm" style="height: 40%"></div>
                <div class="w-full bg-[#10b981]/40 group-hover:bg-[#10b981]/50 transition-colors rounded-sm" style="height: 70%"></div>
                <div class="w-full bg-[#10b981]/40 group-hover:bg-[#10b981]/50 transition-colors rounded-sm" style="height: 60%"></div>
                <div class="w-full bg-[#10b981]/60 group-hover:bg-[#10b981]/70 transition-colors rounded-sm" style="height: 90%"></div>
                <div class="w-full bg-[#10b981]/60 group-hover:bg-[#10b981]/70 transition-colors rounded-sm" style="height: 80%"></div>
                <div class="w-full bg-[#10b981] rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]" style="height: 100%"></div>
            </div>
        </div>

        <!-- Horas Registradas -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#3b82f6]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#3b82f6]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#3b82f6]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <i class="pi pi-clock text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-semibold border border-[#3b82f6]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctHorasRegistradas >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctHorasRegistradas > 0 ? '+' + pctHorasRegistradas : pctHorasRegistradas }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ totalHorasRegistradas }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Horas Registradas</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#3b82f6]/20 group-hover:bg-[#3b82f6]/30 transition-colors rounded-sm" style="height: 60%"></div>
                <div class="w-full bg-[#3b82f6]/20 group-hover:bg-[#3b82f6]/30 transition-colors rounded-sm" style="height: 40%"></div>
                <div class="w-full bg-[#3b82f6]/20 group-hover:bg-[#3b82f6]/30 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#3b82f6]/40 group-hover:bg-[#3b82f6]/50 transition-colors rounded-sm" style="height: 30%"></div>
                <div class="w-full bg-[#3b82f6]/40 group-hover:bg-[#3b82f6]/50 transition-colors rounded-sm" style="height: 70%"></div>
                <div class="w-full bg-[#3b82f6]/60 group-hover:bg-[#3b82f6]/70 transition-colors rounded-sm" style="height: 85%"></div>
                <div class="w-full bg-[#3b82f6]/60 group-hover:bg-[#3b82f6]/70 transition-colors rounded-sm" style="height: 90%"></div>
                <div class="w-full bg-[#3b82f6] rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.5)]" style="height: 100%"></div>
            </div>
        </div>

         <!-- Proyectos En Riesgo  -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#f59e0b]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#f59e0b]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#f59e0b]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <i class="pi pi-exclamation-triangle text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] font-semibold border border-[#f59e0b]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctProyectosEnRiesgo >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctProyectosEnRiesgo > 0 ? '+' + pctProyectosEnRiesgo : pctProyectosEnRiesgo }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ proyectosEnRiesgo }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Proyectos En Riesgo</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#f59e0b]/20 group-hover:bg-[#f59e0b]/30 transition-colors rounded-sm" style="height: 20%"></div>
                <div class="w-full bg-[#f59e0b]/20 group-hover:bg-[#f59e0b]/30 transition-colors rounded-sm" style="height: 30%"></div>
                <div class="w-full bg-[#f59e0b]/20 group-hover:bg-[#f59e0b]/30 transition-colors rounded-sm" style="height: 25%"></div>
                <div class="w-full bg-[#f59e0b]/40 group-hover:bg-[#f59e0b]/50 transition-colors rounded-sm" style="height: 40%"></div>
                <div class="w-full bg-[#f59e0b]/40 group-hover:bg-[#f59e0b]/50 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#f59e0b]/60 group-hover:bg-[#f59e0b]/70 transition-colors rounded-sm" style="height: 45%"></div>
                <div class="w-full bg-[#f59e0b]/60 group-hover:bg-[#f59e0b]/70 transition-colors rounded-sm" style="height: 70%"></div>
                <div class="w-full bg-[#f59e0b] rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.5)]" style="height: 100%"></div>
            </div>
        </div>

        <!-- Horas Desviadas -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#ef4444]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ef4444]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#ef4444]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <i class="pi pi-exclamation-circle text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] text-[10px] font-semibold border border-[#ef4444]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctHorasDesviadas >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctHorasDesviadas > 0 ? '+' + pctHorasDesviadas : pctHorasDesviadas }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ horasDesviadas }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Horas Desviadas</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#ef4444]/20 group-hover:bg-[#ef4444]/30 transition-colors rounded-sm" style="height: 40%"></div>
                <div class="w-full bg-[#ef4444]/20 group-hover:bg-[#ef4444]/30 transition-colors rounded-sm" style="height: 30%"></div>
                <div class="w-full bg-[#ef4444]/20 group-hover:bg-[#ef4444]/30 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#ef4444]/40 group-hover:bg-[#ef4444]/50 transition-colors rounded-sm" style="height: 60%"></div>
                <div class="w-full bg-[#ef4444]/40 group-hover:bg-[#ef4444]/50 transition-colors rounded-sm" style="height: 45%"></div>
                <div class="w-full bg-[#ef4444]/60 group-hover:bg-[#ef4444]/70 transition-colors rounded-sm" style="height: 70%"></div>
                <div class="w-full bg-[#ef4444]/60 group-hover:bg-[#ef4444]/70 transition-colors rounded-sm" style="height: 85%"></div>
                <div class="w-full bg-[#ef4444] rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]" style="height: 100%"></div>
            </div>
        </div>
        <!-- Horas MKT -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#a855f7]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#a855f7]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#a855f7]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <i class="pi pi-chart-line text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#a855f7]/10 text-[#a855f7] text-[10px] font-semibold border border-[#a855f7]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctHorasMkt >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctHorasMkt > 0 ? '+' + pctHorasMkt : pctHorasMkt }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ totalHorasMkt }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Horas MKT</p>
                <p class="text-[8px] text-white/40 uppercase tracking-widest mt-1 font-medium">MKT ACTIVOS: {{ mktActivosCount }}</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#a855f7]/20 group-hover:bg-[#a855f7]/30 transition-colors rounded-sm" style="height: 20%"></div>
                <div class="w-full bg-[#a855f7]/20 group-hover:bg-[#a855f7]/30 transition-colors rounded-sm" style="height: 25%"></div>
                <div class="w-full bg-[#a855f7]/20 group-hover:bg-[#a855f7]/30 transition-colors rounded-sm" style="height: 40%"></div>
                <div class="w-full bg-[#a855f7]/40 group-hover:bg-[#a855f7]/50 transition-colors rounded-sm" style="height: 45%"></div>
                <div class="w-full bg-[#a855f7]/40 group-hover:bg-[#a855f7]/50 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#a855f7]/60 group-hover:bg-[#a855f7]/70 transition-colors rounded-sm" style="height: 35%"></div>
                <div class="w-full bg-[#a855f7]/60 group-hover:bg-[#a855f7]/70 transition-colors rounded-sm" style="height: 60%"></div>
                <div class="w-full bg-[#a855f7] rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.5)]" style="height: 75%"></div>
            </div>
        </div>

        <!-- Horas CI/CD -->
        <div class="glass-card bg-[var(--p-content-background)] rounded-xl p-5 relative overflow-hidden group hover:border-[#14b8a6]/30">
            <div class="absolute inset-0 bg-gradient-to-br from-[#14b8a6]/10 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 16px 16px;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#14b8a6]/20 rounded-full blur-3xl z-0 transition-all duration-300 group-hover:bg-[#14b8a6]/30 group-hover:scale-110"></div>
            <div class="relative z-10 flex justify-between items-start mb-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    <i class="pi pi-briefcase text-lg"></i>
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-[10px] font-semibold border border-[#14b8a6]/20 shadow-sm whitespace-nowrap">
                    <i class="pi text-[8px]" [ngClass]="pctHorasCicd >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                    {{ pctHorasCicd > 0 ? '+' + pctHorasCicd : pctHorasCicd }}%
                </span>
            </div>
            <div class="relative z-10 flex flex-col mb-1.5">
                <h2 class="text-3xl font-bold text-[var(--p-text-color)] mb-0.5 drop-shadow-sm leading-none">{{ totalHorasCicd }}</h2>
                <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Horas CI/CD</p>
                <p class="text-[8px] text-white/40 uppercase tracking-widest mt-1 font-medium">CI/CD Activos: {{ cicdActivosCount }}</p>
            </div>
            <div class="relative z-10 h-8 flex items-end gap-1 opacity-80 mt-3">
                <div class="w-full bg-[#14b8a6]/20 group-hover:bg-[#14b8a6]/30 transition-colors rounded-sm" style="height: 50%"></div>
                <div class="w-full bg-[#14b8a6]/20 group-hover:bg-[#14b8a6]/30 transition-colors rounded-sm" style="height: 55%"></div>
                <div class="w-full bg-[#14b8a6]/20 group-hover:bg-[#14b8a6]/30 transition-colors rounded-sm" style="height: 60%"></div>
                <div class="w-full bg-[#14b8a6]/40 group-hover:bg-[#14b8a6]/50 transition-colors rounded-sm" style="height: 65%"></div>
                <div class="w-full bg-[#14b8a6]/40 group-hover:bg-[#14b8a6]/50 transition-colors rounded-sm" style="height: 70%"></div>
                <div class="w-full bg-[#14b8a6]/60 group-hover:bg-[#14b8a6]/70 transition-colors rounded-sm" style="height: 75%"></div>
                <div class="w-full bg-[#14b8a6]/60 group-hover:bg-[#14b8a6]/70 transition-colors rounded-sm" style="height: 80%"></div>
                <div class="w-full bg-[#14b8a6] rounded-sm shadow-[0_0_8px_rgba(20,184,166,0.5)]" style="height: 85%"></div>
            </div>
        </div>
    </div>

    <!-- SUBHEADERS / FILTERS -->
    <div class="flex justify-end w-full">
        <div class="flex flex-wrap gap-2">
            <p-selectButton 
                [options]="filterOptions" 
                [(ngModel)]="selectedFilter" 
                (onChange)="onFilterChange()"
                optionLabel="label" 
                optionValue="value"
                [allowEmpty]="false"
                styleClass="custom-pills">
            </p-selectButton>
            <p-datepicker 
                [(ngModel)]="customDateRange" 
                selectionMode="range" 
                [readonlyInput]="true" 
                placeholder="Seleccionar Rango" 
                [showIcon]="true" 
                iconDisplay="input"
                (ngModelChange)="onCustomDateSelect()"
                styleClass="h-10 ml-2 custom-date-picker">
            </p-datepicker>
        </div>
    </div>

    <!-- MAIN GRID (Content Cards) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full w-full">
        <!-- Izquierda: Proyectos Registrados (1 columna, abarca todo el alto) -->
        <div class="col-span-1 bg-[var(--p-content-background)] border border-[var(--p-content-border-color)] rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full">
            <div class="font-semibold text-[var(--p-text-color)] mb-2">Proyectos Con Progreso Registrados</div>
            
            <ng-container *ngIf="proyectosRegistradosData.length > 0; else noProgress">
                <p-table [value]="proyectosRegistradosData" [paginator]="true" [rows]="5" styleClass="p-datatable-sm custom-mini-table" responsiveLayout="scroll">
                    <ng-template #header>
                        <tr>
                            <th class="text-left font-semibold">Nombre</th>
                            <th class="text-center font-semibold">Área</th>
                            <th class="text-right font-semibold">Horas</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-proyecto>
                        <tr>
                            <td class="text-left text-[var(--p-text-color)]">{{ proyecto.name }}</td>
                            <td class="text-center text-[var(--p-text-color)]">{{ proyecto.area }}</td>
                            <td class="text-right text-[var(--p-text-color)]">{{ proyecto.hours }}</td>
                        </tr>
                    </ng-template>
                </p-table>

                <div class="mt-4 flex-grow h-[300px]">
                    <p-chart type="bar" [data]="chartData" [options]="chartOptions" height="100%"></p-chart>
                </div>
            </ng-container>

            <ng-template #noProgress>
                <div class="flex flex-col items-center justify-center flex-grow py-12 text-center">
                    <i class="pi pi-calendar-times text-4xl mb-3 text-[var(--p-text-color)] opacity-20"></i>
                    <p class="text-[var(--p-text-color)] opacity-60 italic text-lg">no hubo progreso registrado</p>
                </div>
            </ng-template>
        </div>

        <!-- Derecha: Cuadrícula 2x2 (abarca 2 columnas en lg) -->
        <div class="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <!-- Proyectos Activos -->
            <div class="bg-[var(--p-content-background)] border border-[var(--p-content-border-color)] rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full min-h-[420px]">
                <div class="font-semibold text-[var(--p-text-color)]">Proyectos Activos</div>
                <div class="flex-1">
                    <p-table [value]="proyectosActivosData" [paginator]="true" [rows]="5" styleClass="p-datatable-sm custom-mini-table" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th class="text-left font-semibold">Nombre</th>
                                <th class="text-center font-semibold">Área</th>
                                <th class="text-right font-semibold">Fecha de Venc.</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-proyecto>
                            <tr>
                                <td class="text-left text-[var(--p-text-color)]">{{ proyecto.projectName }}</td>
                                <td class="text-center text-[var(--p-text-color)]">{{ proyecto.area }}</td>
                                <td class="text-right text-[var(--p-text-color)]">{{ (proyecto.deliveryDate | date: 'dd/MM/yyyy') || 'N/A' }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>

            <!-- Proyectos A Vencer -->
            <div class="bg-[var(--p-content-background)] border border-[var(--p-content-border-color)] rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full min-h-[420px]">
                <div class="font-semibold text-[var(--p-text-color)] mb-2">Proyectos A Vencer</div>
                <div class="space-y-4 flex-1">
                    <!-- Circular Timer Item -->
                    <div *ngFor="let v of proyectosAVencerData | slice:(proyectosAVencerPage * proyectosAVencerRows):((proyectosAVencerPage + 1) * proyectosAVencerRows)" class="flex items-center gap-4 p-3 rounded-2xl border transition-colors" [ngClass]="getTimerBgClass(v.deliveryDate)">
                        <div class="relative size-16 shrink-0">
                            <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                                <circle class="stroke-slate-800 dark:stroke-slate-100/10" cx="18" cy="18" fill="none" r="16" stroke-width="3"></circle>
                                <circle [ngClass]="getTimerStrokeColor(v.deliveryDate)" cx="18" cy="18" fill="none" r="16" stroke-dasharray="100" [attr.stroke-dashoffset]="getStrokeOffset(v)" stroke-linecap="round" stroke-width="3"></circle>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-black" [ngClass]="getTimerTextColor(v.deliveryDate)">{{ getDiasRestantes(v.deliveryDate) }}d</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm truncate text-[var(--p-text-color)]">{{ v.projectName }}</h4>
                            <p class="text-[11px] text-slate-500 uppercase font-bold tracking-wider">{{ getTimerStatus(v.deliveryDate) }}</p>
                        </div>
                    </div>
                    <div *ngIf="proyectosAVencerData.length === 0" class="text-center text-slate-500 text-sm mt-4">No hay proyectos a vencer</div>
                </div>
                <!-- Mini Paginator -->
                <div *ngIf="proyectosAVencerData.length > proyectosAVencerRows" class="flex items-center justify-between mt-auto pt-4 border-t border-[var(--p-content-border-color)]">
                    <span class="text-xs text-slate-500 font-medium">Página {{ proyectosAVencerPage + 1 }} de {{ totalAVencerPages }}</span>
                    <div class="flex gap-1">
                        <button (click)="prevAVencerPage()" [disabled]="proyectosAVencerPage === 0" 
                            class="w-7 h-7 rounded-md border border-[var(--p-content-border-color)] flex items-center justify-center hover:bg-slate-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[var(--p-text-color)]">
                            <i class="pi pi-chevron-left text-xs"></i>
                        </button>
                        <button (click)="nextAVencerPage()" [disabled]="proyectosAVencerPage >= totalAVencerPages - 1" 
                            class="w-7 h-7 rounded-md border border-[var(--p-content-border-color)] flex items-center justify-center hover:bg-slate-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[var(--p-text-color)]">
                            <i class="pi pi-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Registros Faltantes -->
            <div class="bg-[var(--p-content-background)] border border-[var(--p-content-border-color)] rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full min-h-[420px]">
                <div class="font-semibold text-[var(--p-text-color)]">Registros Faltantes</div>
                
                <ng-container *ngIf="registrosFaltantes.length > 0; else noIncidencias">
                    <p-table [value]="registrosFaltantes" [paginator]="true" [rows]="5" styleClass="p-datatable-sm custom-mini-table" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th class="text-left font-semibold">Nombre</th>
                                <th class="text-left font-semibold">Incidencias</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-reg>
                            <tr>
                                <td class="text-left text-[var(--p-text-color)] align-top pt-3">{{ reg.developer }}</td>
                                <td class="text-left py-2">
                                    <div class="flex flex-row flex-wrap gap-2 items-start">
                                        <span *ngFor="let inc of reg.incidencias; let i = index" 
                                              class="inline-flex items-center justify-between px-3 py-1.5 rounded-md bg-[#ffedd5] text-[#c2410c] border border-[#fdba74] shadow-sm text-[0.80rem] font-bold cursor-default whitespace-nowrap">
                                            {{ inc.fechaDisplay }}
                                            <i class="pi pi-times-circle cursor-pointer text-[#fb923c] hover:text-[#9a3412] transition-colors ml-2" 
                                               style="font-size: 0.80rem;" 
                                               (click)="confirmarEliminarIncidencia($event, reg, i)"
                                               title="Eliminar incidencia"></i>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-container>

                <ng-template #noIncidencias>
                    <div class="flex flex-col items-center justify-center flex-grow py-12 text-center">
                        <i class="pi pi-check-circle text-4xl mb-3 text-emerald-500 opacity-20"></i>
                        <p class="text-[var(--p-text-color)] opacity-60 italic text-lg font-medium">No hay incidencias</p>
                    </div>
                </ng-template>
            </div>

            <!-- CI/CD Horas Registradas -->
            <div class="bg-[var(--p-content-background)] border border-[var(--p-content-border-color)] rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full min-h-[420px]">
                <div class="flex justify-between items-center">
                    <div class="font-semibold text-[var(--p-text-color)]">CI/CD Horas Registradas</div>
                    <p-select 
                        [options]="ciCdFilterOptions" 
                        [(ngModel)]="selectedCiCdFilter" 
                        (onChange)="aplicarFiltroCiCd()"
                        optionLabel="label" 
                        optionValue="value" 
                        class="w-40 border-gray-600 custom-mini-dropdown"
                        placeholder="Filtrar">
                    </p-select>
                </div>
                <p-table [value]="cicdHorasDataMostrar" [paginator]="true" [rows]="5" styleClass="p-datatable-sm custom-mini-table" responsiveLayout="scroll">
                    <ng-template #header>
                        <tr>
                            <th class="text-left font-semibold">Proyecto</th>
                            <th class="text-center font-semibold">Horas Reg.</th>
                            <th class="text-center font-semibold">Horas Requeridas</th>
                            <th class="text-right font-semibold">Estatus</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-cicd>
                        <tr>
                            <td class="text-left text-[var(--p-text-color)]">{{ cicd.name }}</td>
                            <td class="text-center text-[var(--p-text-color)]">{{ cicd.horasRegistradas }}</td>
                            <td class="text-center text-[var(--p-text-color)]">{{ cicd.cicdHours }}</td>
                            <td class="text-right text-[var(--p-text-color)]">
                                <p-tag [severity]="cicd.severity" [value]="cicd.status" [rounded]="true" styleClass="text-xs"></p-tag>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    </div>
</div>
    `,
    styles: [`
    :host ::ng-deep .glass-card {
        border: 1px solid var(--p-content-border-color);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    :host ::ng-deep .glass-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }
    :host ::ng-deep .custom-pills .p-button {
        background: transparent;
        border: 1px solid var(--p-content-border-color);
        color: var(--p-text-muted-color);
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        transition: all 0.2s;
    }
    :host ::ng-deep .custom-pills .p-button:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
    :host ::ng-deep .custom-pills .p-button:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; }
    :host ::ng-deep .custom-pills .p-button.p-highlight {
        background: color-mix(in srgb, var(--p-primary-color), transparent 80%);
        color: var(--p-primary-color);
        border-color: var(--p-primary-color);
    }
    :host ::ng-deep .custom-mini-dropdown .p-select {
        border-radius: 20px;
        background: transparent;
    }
    :host ::ng-deep .custom-mini-table .p-datatable-header,
    :host ::ng-deep .custom-mini-table .p-datatable-thead > tr > th,
    :host ::ng-deep .custom-mini-table .p-datatable-tbody > tr > td {
        background: transparent !important;
        border: none !important;
        border-bottom: 1px solid var(--p-content-border-color) !important;
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
    }
    :host ::ng-deep .custom-mini-table .p-datatable-tbody > tr:hover > td {
        background: var(--p-content-hover-background) !important;
    }
    :host ::ng-deep .custom-mini-table .p-paginator {
        background: transparent !important;
        justify-content: flex-end !important;
        border: none !important;
    }
    :host ::ng-deep .custom-date-picker .p-inputtext {
        border-radius: 6px;
        background: transparent;
        border: 1px solid var(--p-content-border-color);
        color: var(--p-text-muted-color);
    }
    :host ::ng-deep .custom-date-picker .p-datepicker-input-icon {
        color: var(--p-text-muted-color);
    }
    `]
    , providers: [ConfirmationService, MessageService]
})
export class Dashboard implements OnInit {
    loadingDashboard = false;


    totalProyectosActivos: number = 0;
    totalHorasRegistradas: number = 0;
    proyectosEnRiesgo: number = 0;
    horasDesviadas: number = 0;
    totalHorasMkt: number = 0;
    totalHorasCicd: number = 0;
    mktActivosCount: number = 0;
    cicdActivosCount: number = 0;

    pctProyectosActivos: number = 0;
    pctHorasRegistradas: number = 0;
    pctProyectosEnRiesgo: number = 0;
    pctHorasDesviadas: number = 0;
    pctHorasMkt: number = 0;
    pctHorasCicd: number = 0;

    filterOptions: any[] = [
        { label: 'Mes pasado', value: 'mes-pasado' },
        { label: 'Este mes', value: 'este-mes' },
        { label: 'Hace tres semanas', value: 'hace-tres-semanas' },
        { label: 'Hace dos semanas', value: 'hace-dos-semanas' },
        { label: 'Semana pasada', value: 'semana-pasada' },
        { label: 'Esta semana', value: 'esta-semana' }
    ];
    selectedFilter: string | null = 'esta-semana';
    customDateRange: Date[] | null = null;

    currentStartDate: Date | null = null;
    currentEndDate: Date | null = null;
    prevStartDate: Date | null = null;
    prevEndDate: Date | null = null;

    horasTemp: Hora[] = [];
    proyectosTemp: Proyecto[] = [];
    cicdTemp: CiCd[] = [];
    mktTemp: Mkt[] = [];
    usuariosTemp: User[] = [];
    registrosDbTemp: RegistroFaltante[] = [];

    proyectosRegistradosData: any[] = [];
    proyectosActivosData: Proyecto[] = [];
    proyectosAVencerData: Proyecto[] = [];
    proyectosAVencerPage: number = 0;
    proyectosAVencerRows: number = 3;
    registrosFaltantes: any[] = [];
    cicdHorasData: any[] = [];
    cicdHorasDataMostrar: any[] = [];
    selectedCiCdFilter: string = 'all';
    ciCdFilterOptions: any[] = [
        { label: 'Todos', value: 'all' },
        { label: 'Horas excedidas', value: 'excedidas' },
        { label: 'En riesgo', value: 'riesgo' },
        { label: 'Al corriente', value: 'orden' }
    ];

    chartData: any;
    chartOptions: any;

    constructor(
        private listaProyectosService: ListaProyectosService,
        private listaHorasService: ListaHorasService,
        private cicdService: CiCdService,
        private mktService: MktService,
        private usuarioService: UsuarioService,
        private registrosFaltantesService: RegistrosFaltantesService,
        private cdr: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {
        effect(() => {
            if (this.authService.userProfile()) {
                this.applyFilters();
            }
        });
    }

    ngOnInit() {
        if (this.authService.needsHeavyLoader()) {
            this.loadingDashboard = true;
        }

        
        this.initChartOptions();
        this.loadRawData();
    }

    onFilterChange() {
        this.customDateRange = null;
        this.calculateDateRange();
        this.applyFilters();
    }

    onCustomDateSelect() {
        if (this.customDateRange && this.customDateRange[0] && this.customDateRange[1]) {
            this.selectedFilter = null;
            this.currentStartDate = this.customDateRange[0];
            this.currentEndDate = this.customDateRange[1];
            this.currentStartDate.setHours(0, 0, 0, 0);
            this.currentEndDate.setHours(23, 59, 59, 999);

            const diffTime = Math.abs(this.currentEndDate.getTime() - this.currentStartDate.getTime());
            this.prevEndDate = new Date(this.currentStartDate.getTime() - 1);
            this.prevStartDate = new Date(this.prevEndDate.getTime() - diffTime);

            this.applyFilters();
        } else if (!this.customDateRange || this.customDateRange.length === 0 || (!this.customDateRange[0] && !this.customDateRange[1])) {
            this.selectedFilter = 'esta-semana';
            this.onFilterChange();
        }
    }

    calculateDateRange() {
        if (!this.selectedFilter) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay() || 7;

        switch (this.selectedFilter) {
            case 'esta-semana':
                this.currentStartDate = new Date(today);
                this.currentStartDate.setDate(today.getDate() - dayOfWeek + 1);
                this.currentEndDate = new Date(this.currentStartDate);
                this.currentEndDate.setDate(this.currentStartDate.getDate() + 6);
                this.prevStartDate = new Date(this.currentStartDate);
                this.prevStartDate.setDate(this.currentStartDate.getDate() - 7);
                this.prevEndDate = new Date(this.currentEndDate);
                this.prevEndDate.setDate(this.currentEndDate.getDate() - 7);
                break;
            case 'semana-pasada':
                this.currentEndDate = new Date(today);
                this.currentEndDate.setDate(today.getDate() - dayOfWeek);
                this.currentStartDate = new Date(this.currentEndDate);
                this.currentStartDate.setDate(this.currentEndDate.getDate() - 6);
                this.prevStartDate = new Date(this.currentStartDate);
                this.prevStartDate.setDate(this.currentStartDate.getDate() - 7);
                this.prevEndDate = new Date(this.currentEndDate);
                this.prevEndDate.setDate(this.currentEndDate.getDate() - 7);
                break;
            case 'hace-dos-semanas':
                this.currentEndDate = new Date(today);
                this.currentEndDate.setDate(today.getDate() - dayOfWeek - 7);
                this.currentStartDate = new Date(this.currentEndDate);
                this.currentStartDate.setDate(this.currentEndDate.getDate() - 6);
                this.prevStartDate = new Date(this.currentStartDate);
                this.prevStartDate.setDate(this.currentStartDate.getDate() - 7);
                this.prevEndDate = new Date(this.currentEndDate);
                this.prevEndDate.setDate(this.currentEndDate.getDate() - 7);
                break;
            case 'hace-tres-semanas':
                this.currentEndDate = new Date(today);
                this.currentEndDate.setDate(today.getDate() - dayOfWeek - 14);
                this.currentStartDate = new Date(this.currentEndDate);
                this.currentStartDate.setDate(this.currentEndDate.getDate() - 6);
                this.prevStartDate = new Date(this.currentStartDate);
                this.prevStartDate.setDate(this.currentStartDate.getDate() - 7);
                this.prevEndDate = new Date(this.currentEndDate);
                this.prevEndDate.setDate(this.currentEndDate.getDate() - 7);
                break;
            case 'este-mes':
                this.currentStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                this.currentEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                this.prevStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                this.prevEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'mes-pasado':
                this.currentStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                this.currentEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
                this.prevStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                this.prevEndDate = new Date(today.getFullYear(), today.getMonth() - 1, 0);
                break;
        }

        if (this.currentEndDate) this.currentEndDate.setHours(23, 59, 59, 999);
        if (this.prevEndDate) this.prevEndDate.setHours(23, 59, 59, 999);
    }

    initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary, font: { weight: 500 } },
                    grid: { display: false, drawBorder: false }
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, drawBorder: false, borderDash: [5, 5] }
                }
            }
        };
    }

    loadRawData() {
        let loaded = 0;
        const checkDone = () => {
            loaded++;
            if (loaded === 6) {
                this.onFilterChange();
                
                if (this.loadingDashboard) {
                    setTimeout(() => {
                        this.loadingDashboard = false;
                        this.authService.needsHeavyLoader.set(false);
                        this.cdr.detectChanges();
                    }, 1500);

                } else {
                    this.loadingDashboard = false;
                    this.cdr.detectChanges();
                }
            }
        };

        this.listaHorasService.getHoras().subscribe(horas => {
            this.horasTemp = horas;
            checkDone();
        });

        this.listaProyectosService.getProyectos().subscribe(proyectos => {
            this.proyectosTemp = proyectos;
            checkDone();
        });

        this.cicdService.getCiCds().subscribe(cicds => {
            this.cicdTemp = cicds;
            checkDone();
        });

        this.mktService.getMkts().subscribe(mkts => {
            this.mktTemp = mkts;
            checkDone();
        });

        this.usuarioService.getUsers().subscribe((usuarios: User[]) => {
            this.usuariosTemp = usuarios;
            checkDone();
        });

        this.registrosFaltantesService.getRegistros().subscribe((registros: RegistroFaltante[]) => {
            this.registrosDbTemp = registros;
            checkDone();
        });
    }


    isDateInPrevRange(dateValue: any): boolean {
        if (!dateValue || !this.prevStartDate || !this.prevEndDate) return true;
        const d = new Date(dateValue);
        return d >= this.prevStartDate && d <= this.prevEndDate;
    }

    isActiveInRange(startDateVal: any, endDateVal: any, rangeStart: Date | null, rangeEnd: Date | null): boolean {
        if (!rangeStart || !rangeEnd) return true;

        let itemStart = startDateVal ? new Date(startDateVal) : new Date(0);

        let itemEnd = endDateVal ? new Date(endDateVal) : new Date(86400000000000);

        return itemStart <= rangeEnd && itemEnd >= rangeStart;
    }

    getDiasRestantes(fecha: any): number {
        if (!fecha) return 0;
        const diffTime = new Date(fecha).getTime() - new Date().getTime();
        const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 0;
    }

    getTimerTextColor(fecha: any): string {
        const now = new Date().getTime();
        const entrege = new Date(fecha).getTime();
        if (entrege < now) return 'text-slate-400';

        const dias = this.getDiasRestantes(fecha);
        if (dias <= 3) return 'text-red-500';
        if (dias <= 7) return 'text-orange-500';
        return 'text-emerald-500';
    }

    getTimerStrokeColor(fecha: any): string {
        const now = new Date().getTime();
        const entrege = new Date(fecha).getTime();
        if (entrege < now) return 'stroke-slate-400';

        const dias = this.getDiasRestantes(fecha);
        if (dias <= 3) return 'stroke-red-500';
        if (dias <= 7) return 'stroke-orange-500';
        return 'stroke-emerald-500';
    }

    getTimerBgClass(fecha: any): string {
        const now = new Date().getTime();
        const entrege = new Date(fecha).getTime();
        if (entrege < now) return 'bg-slate-500/10 border-slate-500/10 opacity-70';

        const dias = this.getDiasRestantes(fecha);
        if (dias <= 3) return 'bg-red-500/10 border-red-500/20';
        if (dias <= 7) return 'bg-orange-500/10 border-orange-500/20';
        return 'bg-emerald-500/10 border-emerald-500/20';
    }

    getTimerStatus(fecha: any): string {
        const now = new Date().getTime();
        const entrege = new Date(fecha).getTime();
        if (entrege < now) return 'VENCIDO';

        const dias = this.getDiasRestantes(fecha);
        if (dias <= 3) return 'Alta Prioridad';
        if (dias <= 7) return 'Ultimos Dias';
        return 'Regular';
    }

    getStrokeOffset(proyecto: any): number {
        if (!proyecto || !proyecto.startDate || !proyecto.deliveryDate) return 100;

        const start = new Date(proyecto.startDate).getTime();
        const end = new Date(proyecto.deliveryDate).getTime();
        const now = new Date().getTime();

        if (now <= start) return 100;
        if (now >= end) return 0;

        const total = end - start;
        const progress = end - now;
        return (progress / total) * 100;
    }

    getPercentageChange(current: number, prev: number): number {
        if (prev === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - prev) / prev) * 100);
    }

    applyFilters() {
        const profile = this.authService.userProfile();
        const isDesarrollador = this.authService.isDesarrollador();
        const isAdmin = this.authService.isAdministrador();
        const userName = profile?.name;

        let filteredHoras = this.horasTemp;
        let filteredProyectos = this.proyectosTemp;

        if (isDesarrollador && !isAdmin && userName) {
            filteredHoras = this.horasTemp.filter(h => h.developer === userName);
            filteredProyectos = this.proyectosTemp.filter(p => p.developerInCharge === userName);
        }

        const horasFiltradas = filteredHoras.filter(h => this.isDateInRange(h.date));
        const horasPrevias = filteredHoras.filter(h => this.isDateInPrevRange(h.date));

        const proyectosFiltrados = filteredProyectos.filter(p => this.isActiveInRange(p.startDate, p.deliveryDate, this.currentStartDate, this.currentEndDate));
        const proyectosPrevios = filteredProyectos.filter(p => this.isActiveInRange(p.startDate, p.deliveryDate, this.prevStartDate, this.prevEndDate));

        const nombresProyectosAsignados = new Set(filteredProyectos.map(p => p.projectName));

        const cicdFiltrados = this.cicdTemp.filter(c => {
            const inRange = this.isActiveInRange(c.startDate, c.deliveryDate, this.currentStartDate, this.currentEndDate);
            if (isDesarrollador && !isAdmin && userName) {
                return inRange && nombresProyectosAsignados.has(c.name);
            }
            return inRange;
        });
        this.cicdActivosCount = cicdFiltrados.filter(c => ['Estable', 'Importante'].includes(c.status!)).length;

        const cicdPrevios = this.cicdTemp.filter(c => {
            const inRange = this.isActiveInRange(c.startDate, c.deliveryDate, this.prevStartDate, this.prevEndDate);
            if (isDesarrollador && !isAdmin && userName) {
                return inRange && nombresProyectosAsignados.has(c.name);
            }
            return inRange;
        });

        const nombresMkt = new Set(this.mktTemp.map(m => m.name));
        const nombresCicdFull = new Set(this.cicdTemp.map(c => c.name));

        const horasMktActuales = horasFiltradas.filter(h => h.projectName && nombresMkt.has(h.projectName));
        this.totalHorasMkt = horasMktActuales.reduce((acc, h) => acc + (h.hoursWorked || 0), 0);
        const horasMktPasadas = horasPrevias.filter(h => h.projectName && nombresMkt.has(h.projectName));
        this.pctHorasMkt = this.getPercentageChange(this.totalHorasMkt, horasMktPasadas.reduce((acc, h) => acc + (h.hoursWorked || 0), 0));

        const horasCicdActuales = horasFiltradas.filter(h => h.projectName && nombresCicdFull.has(h.projectName));
        this.totalHorasCicd = horasCicdActuales.reduce((acc, h) => acc + (h.hoursWorked || 0), 0);
        const horasCicdPasadas = horasPrevias.filter(h => h.projectName && nombresCicdFull.has(h.projectName));
        this.pctHorasCicd = this.getPercentageChange(this.totalHorasCicd, horasCicdPasadas.reduce((acc, h) => acc + (h.hoursWorked || 0), 0));

        const mktFiltrados = this.mktTemp.filter(m => {
            const inRange = this.isActiveInRange(m.startDate, m.deliveryDate, this.currentStartDate, this.currentEndDate);
            if (isDesarrollador && !isAdmin && userName) {
                return inRange && nombresProyectosAsignados.has(m.name);
            }
            return inRange;
        });
        this.mktActivosCount = mktFiltrados.length;

        const nombresProyectosNormales = new Set(this.proyectosTemp.map(p => p.projectName));
        const horasNormalesActuales = horasFiltradas.filter(h => h.projectName && nombresProyectosNormales.has(h.projectName));
        this.totalHorasRegistradas = horasNormalesActuales.reduce((acc, current) => acc + (current.hoursWorked || 0), 0);

        const horasNormalesPrevias = horasPrevias.filter(h => h.projectName && nombresProyectosNormales.has(h.projectName));
        const prevHorasRegistradas = horasNormalesPrevias.reduce((acc, current) => acc + (current.hoursWorked || 0), 0);

        this.pctHorasRegistradas = this.getPercentageChange(this.totalHorasRegistradas, prevHorasRegistradas);
        const activosNormales = proyectosFiltrados.filter(p => !['Entregado', 'Cancelado'].includes(p.workStatus!));
        const activosCicd = cicdFiltrados.filter(c => c.status !== 'Cancelado');
        this.totalProyectosActivos = activosNormales.length + activosCicd.length;
        this.proyectosActivosData = activosNormales;

        const prevActivosNormales = proyectosPrevios.filter(p => !['Entregado', 'Cancelado'].includes(p.workStatus!));
        const prevActivosCicd = cicdPrevios.filter(c => c.status !== 'Cancelado');
        this.pctProyectosActivos = this.getPercentageChange(this.totalProyectosActivos, prevActivosNormales.length + prevActivosCicd.length);

        const riesgoNormales = proyectosFiltrados.filter(p => ['Urgente', 'Importante'].includes(p.generalStatus!));
        this.proyectosEnRiesgo = riesgoNormales.length;

        const prevRiesgoNormales = proyectosPrevios.filter(p => ['Urgente', 'Importante'].includes(p.generalStatus!));
        this.pctProyectosEnRiesgo = this.getPercentageChange(this.proyectosEnRiesgo, prevRiesgoNormales.length);

        this.proyectosAVencerData = proyectosFiltrados
            .filter(p => p.deliveryDate && !['Entregado', 'Cancelado'].includes(p.workStatus!))
            .sort((a, b) => {
                const now = new Date().getTime();
                const vA = new Date(a.deliveryDate!).getTime();
                const vB = new Date(b.deliveryDate!).getTime();

                const expA = vA < now;
                const expB = vB < now;

                if (expA && !expB) return 1;
                if (!expA && expB) return -1;

                return vA - vB;
            });
        this.proyectosAVencerPage = 0;

        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const horasMesActual = this.horasTemp.filter(h => {
            if (!h.date) return false;
            const d = new Date(h.date);
            return d >= currentMonthStart && d <= currentMonthEnd;
        });

        this.cicdHorasData = cicdFiltrados.map(cicd => {
            const horasRegistradas = horasMesActual
                .filter(h => h.projectName === cicd.name)
                .reduce((acc, curr) => acc + (curr.hoursWorked || 0), 0);

            const target = cicd.cicdHours || 0;
            const expectedProgress = (target / daysInMonth) * currentDay;

            let status = 'Al corriente';
            let severity: 'success' | 'warn' | 'danger' = 'success';

            if (horasRegistradas >= target) {
                status = 'Excedido';
                severity = 'warn';
            } else if (horasRegistradas < expectedProgress * 0.85) {
                status = 'En riesgo';
                severity = 'danger';
            }

            return {
                ...cicd,
                horasRegistradas,
                status,
                severity
            };
        });

        const cicdRiesgoCount = this.cicdHorasData.filter(c => c.status === 'En riesgo').length;
        this.proyectosEnRiesgo += cicdRiesgoCount;

        this.aplicarFiltroCiCd();

        this.horasDesviadas = this.cicdHorasData.reduce((acc, current) => {
            const diff = current.horasRegistradas - (current.cicdHours || 0);
            return diff > 0 ? acc + diff : acc;
        }, 0);

        const prevCicdHoras = cicdPrevios.map(cicd => {
            return { ...cicd, horasRegistradas: 0 };
        });

        this.pctHorasDesviadas = 0;

        this.procesarProyectosRegistrados(proyectosFiltrados, horasFiltradas);

        this.calculateMissingRecords();
        this.cdr.detectChanges();
    }

    calculateMissingRecords() {
        if (!this.currentStartDate || !this.currentEndDate || !this.usuariosTemp.length) {
            this.registrosFaltantes = [];
            return;
        }

        const desarrolladores = this.usuariosTemp.filter(u => {
            const role = (u.role || '').toLowerCase().trim();
            const jobPosition = (u.jobPosition || '').toLowerCase().trim();
            return role.includes('desarrollo') || role.includes('desarrollador') ||
                jobPosition.includes('desarrollo') || jobPosition.includes('desarrollador');
        });

        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const systemStartDate = new Date(2026, 2, 31);
        systemStartDate.setHours(0, 0, 0, 0);

        let iterDate = new Date(this.currentStartDate);
        iterDate.setHours(0, 0, 0, 0);
        if (iterDate < systemStartDate) iterDate = new Date(systemStartDate);

        const limitDate = new Date(this.currentEndDate);

        let thresholdDate = new Date(today);
        if (now.getHours() < 19) {
            thresholdDate.setDate(today.getDate() - 1);
        }

        if (limitDate > thresholdDate) {
            limitDate.setTime(thresholdDate.getTime());
        }
        limitDate.setHours(23, 59, 59, 999);

        const registrosPorDev = new Map<string, Set<string>>();
        this.horasTemp.forEach(h => {
            if (h.developer && h.date && (h.hoursWorked || 0) > 0) {
                const normalizedDev = h.developer.toLowerCase().trim();
                if (!registrosPorDev.has(normalizedDev)) {
                    registrosPorDev.set(normalizedDev, new Set<string>());
                }
                const dStr = this.toLocalDateString(h.date);
                registrosPorDev.get(normalizedDev)?.add(dStr);
            }
        });

        const gapsEncontrados: { developer: string, date: string }[] = [];
        while (iterDate <= limitDate) {
            const dayOfWeek = iterDate.getDay();

            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const dateKey = this.toLocalDateString(iterDate);

                desarrolladores.forEach(dev => {
                    const devName = dev.name;
                    if (!devName) return;

                    const normalizedDevName = devName.toLowerCase().trim();
                    const hasHours = registrosPorDev.get(normalizedDevName)?.has(dateKey);

                    if (!hasHours) {
                        gapsEncontrados.push({ developer: devName, date: dateKey });
                    } else {
                        const incidenciaErronea = this.registrosDbTemp.find(r =>
                            r.developer.toLowerCase().trim() === normalizedDevName &&
                            this.toLocalDateString(r.date) === dateKey
                        );

                        if (incidenciaErronea && incidenciaErronea._id) {
                            this.registrosFaltantesService.deleteRegistro(incidenciaErronea._id).subscribe(() => {
                                this.registrosDbTemp = this.registrosDbTemp.filter(r => r._id !== incidenciaErronea._id);
                                this.mapearRegistrosParaDisplay();
                            });
                        }
                    }
                });
            }
            iterDate.setDate(iterDate.getDate() + 1);
        }

        gapsEncontrados.forEach(gap => {
            const normalizedNombreGap = gap.developer.toLowerCase().trim();
            const existeEnDb = this.registrosDbTemp.find(r =>
                r.developer.toLowerCase().trim() === normalizedNombreGap &&
                this.toLocalDateString(r.date) === gap.date
            );

            if (!existeEnDb) {
                this.registrosFaltantesService.createRegistro({
                    developer: gap.developer,
                    date: gap.date
                }).subscribe(nuevo => {
                    if (nuevo && (nuevo._id || nuevo.insertedId)) {
                        const idTemp = nuevo._id || nuevo.insertedId;
                        this.registrosDbTemp.push({ ...gap, _id: idTemp });
                        this.mapearRegistrosParaDisplay();
                    }
                });
            }
        });

        this.mapearRegistrosParaDisplay();
    }

    mapearRegistrosParaDisplay() {
        const agrupados: any[] = [];

        const incidenciasEnRango = this.registrosDbTemp.filter(r => this.isDateInRange(r.date));

        incidenciasEnRango.forEach(inc => {
            const normalizedIncNombre = (inc.developer || '').toLowerCase().trim();
            let grupo = agrupados.find(g => (g.developer || '').toLowerCase().trim() === normalizedIncNombre);

            const dateObj = new Date(this.toLocalDateString(inc.date) + 'T00:00:00');
            const display = this.formatIncidenciaDate(dateObj);

            if (grupo) {
                if (!grupo.incidencias.some((i: any) => i.fechaDisplay === display)) {
                    grupo.incidencias.push({ fechaDisplay: display, id: inc._id, rawFecha: inc.date });
                }
            } else {
                agrupados.push({
                    developer: inc.developer,
                    incidencias: [{ fechaDisplay: display, id: inc._id, rawFecha: inc.date }]
                });
            }
        });

        this.registrosFaltantes = agrupados.sort((a, b) => a.developer.localeCompare(b.developer));
        this.cdr.detectChanges();
    }

    formatIncidenciaDate(date: Date): string {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }

    procesarProyectosRegistrados(proyArray: Proyecto[], horasArray: Hora[]) {
        if (!proyArray.length || !horasArray.length) {
            this.proyectosRegistradosData = [];
            this.chartData = { labels: [], datasets: [] };
            return;
        }

        const horasPorProyecto: { [key: string]: number } = {};
        horasArray.forEach(h => {
            if (h.projectName) {
                horasPorProyecto[h.projectName] = (horasPorProyecto[h.projectName] || 0) + (h.hoursWorked || 0);
            }
        });

        this.proyectosRegistradosData = proyArray.map(p => ({
            name: p.projectName,
            area: p.area,
            hours: horasPorProyecto[p.projectName!] || 0
        })).filter(p => p.hours > 0)
            .sort((a, b) => b.hours - a.hours);

        const labels = this.proyectosRegistradosData.slice(0, 5).map(p => p.name);
        const data = this.proyectosRegistradosData.slice(0, 5).map(p => p.hours);

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Horas Registradas',
                    backgroundColor: '#4ade80',
                    hoverBackgroundColor: '#22c55e',
                    data: data,
                    barPercentage: 0.3,
                    borderRadius: 4
                }
            ]
        };
    }



    aplicarFiltroCiCd() {
        if (!this.selectedCiCdFilter || this.selectedCiCdFilter === 'all') {
            this.cicdHorasDataMostrar = [...this.cicdHorasData];
            return;
        }

        this.cicdHorasDataMostrar = this.cicdHorasData.filter(cicd => {
            if (this.selectedCiCdFilter === 'excedidas' && cicd.status === 'Excedido') return true;
            if (this.selectedCiCdFilter === 'riesgo' && cicd.status === 'En riesgo') return true;
            if (this.selectedCiCdFilter === 'orden' && cicd.status === 'Al corriente') return true;
            return false;
        });
    }

    confirmarEliminarIncidencia(event: Event, registro: any, index: number) {
        const incidencia = registro.incidencias[index];
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Deseas eliminar la incidencia del día ${incidencia.fechaDisplay}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.eliminarIncidencia(registro, index);
            }
        });
    }

    eliminarIncidencia(registro: any, index: number) {
        const incidencia = registro.incidencias[index];

        if (incidencia.id) {
            this.registrosFaltantesService.deleteRegistro(incidencia.id).subscribe({
                next: () => {
                    this.registrosDbTemp = this.registrosDbTemp.filter(r => r._id !== incidencia.id);
                    registro.incidencias.splice(index, 1);
                    if (registro.incidencias.length === 0) {
                        this.registrosFaltantes = this.registrosFaltantes.filter(reg => reg.developer !== registro.developer);
                    }
                    this.cdr.detectChanges();
                }
            });
        }
    }

    private toLocalDateString(date: any): string {
        if (!date) return '';

        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
            return date.substring(0, 10);
        }

        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    isDateInRange(dateValue: any): boolean {
        if (!dateValue || !this.currentStartDate || !this.currentEndDate) return true;

        const d = new Date(this.toLocalDateString(dateValue) + 'T00:00:00');

        const start = new Date(this.currentStartDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(this.currentEndDate);
        end.setHours(23, 59, 59, 999);

        return d >= start && d <= end;
    }

    get totalAVencerPages(): number {
        return Math.ceil(this.proyectosAVencerData.length / this.proyectosAVencerRows);
    }

    nextAVencerPage() {
        if (this.proyectosAVencerPage < this.totalAVencerPages - 1) {
            this.proyectosAVencerPage++;
        }
    }

    prevAVencerPage() {
        if (this.proyectosAVencerPage > 0) {
            this.proyectosAVencerPage--;
        }
    }
}
