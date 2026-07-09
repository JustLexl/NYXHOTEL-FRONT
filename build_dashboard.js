/* build_dashboard.js */
const fs = require('fs');

const dashboardCode = fs.readFileSync('src/app/pages/uikit/dashboard.ts', 'utf-8');

// Extract the class part starting from 'export class Dashboard'
const classMatch = dashboardCode.match(/export class Dashboard[\s\S]+/);
if (!classMatch) throw new Error('Could not find Dashboard class');
let classCode = classMatch[0].replace(/export class Dashboard/g, 'export class DashboardPrueba');

// Extract all the imports from the top (everything before @Component)
const importsMatch = dashboardCode.match(/([\s\S]+?)@Component/);
let importsCode = importsMatch ? importsMatch[1] : '';

const template = `
<main class="flex-1 flex flex-col overflow-x-hidden min-h-screen text-slate-100" style="background-color: #120a06; font-family: 'Public Sans', sans-serif;">
<header class="h-20 border-b border-[rgba(255,255,255,0.1)] px-8 flex items-center justify-between bg-[#120a06]/30 backdrop-blur-sm z-10 sticky top-0">
<div class="flex flex-col">
<span class="text-xs text-slate-500 font-medium">Home / Dashboard</span>
<h2 class="text-lg font-semibold">Resumen de Gestión</h2>
</div>
<div class="flex-1 max-w-xl px-12">
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ec5b13] transition-colors">search</span>
<input class="w-full bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent outline-none transition-all placeholder:text-slate-500" placeholder="Buscar proyectos, tareas o miembros..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<div class="flex gap-2">
<button class="w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-slate-400 hover:text-slate-100 transition-colors relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ec5b13] rounded-full ring-2 ring-[#120a06]"></span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-slate-400 hover:text-slate-100 transition-colors">
<span class="material-symbols-outlined">chat_bubble</span>
</button>
</div>
<div class="flex items-center gap-3 pl-6 border-l border-[rgba(255,255,255,0.1)]">
<div class="text-right">
<p class="text-sm font-semibold">Alexander</p>
<p class="text-[10px] text-[#ec5b13] uppercase font-bold tracking-wider">Developer</p>
</div>
<div class="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#ec5b13]/30 flex items-center justify-center overflow-hidden">
<img alt="Avatar user" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKqaDqvWuynAcjRLIQ3nI6YnoU32NuuzSPyKC4ScjPEish5TkXPO8vRrMOEBPCewH1Jb-2aEtvvfOvtVoQtCXHGK_NFZwV1zdvA9Md_PMolhxQop-uP5grD4eVv9sDSq9ja5RGZsnYSjzpcpf_CmFuIAQqMTnZNO53kfD_TLcHHh2aahzVY744A-I84Zwdrkf7MFWc6wq_z7OFbk_Tbgctxw16PAMb5tsxInefjiY_yDijU7V9uaXQQKe8d_9q2rYwb0lhP1IbpfY"/>
</div>
</div>
</div>
</header>
<div class="p-8 space-y-8">
<!-- KPI Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<!-- Card 1 -->
<div class="glass-card mesh-green p-6 rounded-2xl flex flex-col gap-4">
<div class="flex justify-between items-start">
<div class="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
<span class="material-symbols-outlined">rocket_launch</span>
</div>
<span class="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">{{ pctProyectosActivos > 0 ? '+' : '' }}{{ pctProyectosActivos }}% vs mes ant.</span>
</div>
<div>
<p class="text-slate-400 text-sm font-medium">Proyectos Activos</p>
<h3 class="text-3xl font-bold mt-1">{{ totalProyectosActivos }}</h3>
</div>
<div class="h-8 flex items-end">
<div class="w-full flex gap-1 items-end h-4">
<div class="flex-1 bg-emerald-500/30 h-1 rounded-full"></div>
<div class="flex-1 bg-emerald-500/30 h-2 rounded-full"></div>
<div class="flex-1 bg-emerald-500/30 h-3 rounded-full"></div>
<div class="flex-1 bg-emerald-500 h-4 rounded-full"></div>
</div>
</div>
</div>
<!-- Card 2 -->
<div class="glass-card mesh-blue p-6 rounded-2xl flex flex-col gap-4">
<div class="flex justify-between items-start">
<div class="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
<span class="material-symbols-outlined">schedule</span>
</div>
<span class="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">{{ pctHorasRegistradas > 0 ? '+' : '' }}{{ pctHorasRegistradas }}% vs mes ant.</span>
</div>
<div>
<p class="text-slate-400 text-sm font-medium">Horas Registradas</p>
<h3 class="text-3xl font-bold mt-1">{{ totalHorasRegistradas }}</h3>
</div>
<div class="h-8 flex items-end">
<div class="w-full flex gap-1 items-end h-4">
<div class="flex-1 bg-blue-500/30 h-3 rounded-full"></div>
<div class="flex-1 bg-blue-500/30 h-4 rounded-full"></div>
<div class="flex-1 bg-blue-500 h-2 rounded-full"></div>
<div class="flex-1 bg-blue-500/30 h-4 rounded-full"></div>
</div>
</div>
</div>
<!-- Card 3 -->
<div class="glass-card mesh-orange p-6 rounded-2xl flex flex-col gap-4">
<div class="flex justify-between items-start">
<div class="p-3 bg-orange-500/20 text-orange-500 rounded-xl">
<span class="material-symbols-outlined">warning</span>
</div>
<span class="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">{{ pctProyectosEnRiesgo > 0 ? '+' : '' }}{{ pctProyectosEnRiesgo }}% vs mes ant.</span>
</div>
<div>
<p class="text-slate-400 text-sm font-medium">Proyectos en Riesgo</p>
<h3 class="text-3xl font-bold mt-1">{{ proyectosEnRiesgo }}</h3>
</div>
<div class="h-8 flex items-end">
<div class="w-full flex gap-1 items-end h-4">
<div class="flex-1 bg-orange-500 h-4 rounded-full"></div>
<div class="flex-1 bg-orange-500/30 h-2 rounded-full"></div>
<div class="flex-1 bg-orange-500/30 h-3 rounded-full"></div>
<div class="flex-1 bg-orange-500 h-4 rounded-full"></div>
</div>
</div>
</div>
<!-- Card 4 -->
<div class="glass-card mesh-red p-6 rounded-2xl flex flex-col gap-4">
<div class="flex justify-between items-start">
<div class="p-3 bg-red-500/20 text-red-500 rounded-xl">
<span class="material-symbols-outlined">error_outline</span>
</div>
<span class="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">{{ pctHorasDesviadas > 0 ? '+' : '' }}{{ pctHorasDesviadas }}% vs mes ant.</span>
</div>
<div>
<p class="text-slate-400 text-sm font-medium">Horas Desviadas</p>
<h3 class="text-3xl font-bold mt-1">{{ horasDesviadas }}</h3>
</div>
<div class="h-8 flex items-end">
<div class="w-full flex gap-1 items-end h-4">
<div class="flex-1 bg-red-500/30 h-1 rounded-full"></div>
<div class="flex-1 bg-red-500 h-4 rounded-full"></div>
<div class="flex-1 bg-red-500/30 h-2 rounded-full"></div>
<div class="flex-1 bg-red-500/30 h-1 rounded-full"></div>
</div>
</div>
</div>
</div>

<!-- Filters -->
<div class="flex flex-wrap items-center justify-between gap-4">
<div class="flex flex-wrap gap-2">
<button *ngFor="let opt of filterOptions" 
    (click)="selectedFilter = opt.value; onFilterChange()" 
    [ngClass]="{'text-white bg-[#ec5b13] shadow-lg shadow-[#ec5b13]/20': selectedFilter === opt.value, 'hover:bg-[rgba(255,255,255,0.03)] border-transparent hover:border-[rgba(255,255,255,0.1)]': selectedFilter !== opt.value}" 
    class="px-4 py-2 rounded-full text-sm font-medium text-slate-400 border transition-all">
    {{ opt.label }}
</button>
</div>
<p-datePicker
    [(ngModel)]="customDateRange" 
    selectionMode="range" 
    [readonlyInput]="true" 
    (onSelect)="onCustomDateSelect()" 
    placeholder="Seleccionar Rango" 
    [showIcon]="true" 
    class="custom-date-picker">
</p-datePicker>
</div>

<!-- Dashboard Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Left Column (Proyectos Registrados) -->
<div class="lg:col-span-4 space-y-8">
<div class="glass-card rounded-2xl p-6 flex flex-col h-full">
<div class="flex items-center justify-between mb-6">
<h4 class="font-bold">Proyectos Registrados</h4>
<button class="text-slate-500 hover:text-slate-100"><span class="material-symbols-outlined">more_horiz</span></button>
</div>
<div class="overflow-x-auto flex-1">
<table class="w-full text-sm text-left">
<thead class="text-slate-500 border-b border-[rgba(255,255,255,0.1)] uppercase text-[10px] tracking-widest font-bold">
<tr>
<th class="pb-3 px-1">Nombre</th>
<th class="pb-3 px-1 text-center">Área</th>
<th class="pb-3 px-1 text-right">Horas</th>
</tr>
</thead>
<tbody class="divide-y divide-[rgba(255,255,255,0.1)]">
<tr *ngFor="let proy of proyectosRegistradosData | slice:0:3" class="hover:bg-[rgba(255,255,255,0.03)] transition-colors">
<td class="py-4 px-1 font-medium">{{ proy.nombreProyecto }}</td>
<td class="py-4 px-1 text-center">
<span class="bg-[#ec5b13]/10 text-[#ec5b13] px-3 py-1 rounded-full text-[10px] font-bold">Desarrollo</span>
</td>
<td class="py-4 px-1 text-right text-slate-400">{{ proy.horasTotales }}</td>
</tr>
</tbody>
</table>
</div>
<!-- Bar Chart -->
<div class="mt-8 pt-8 border-t border-[rgba(255,255,255,0.1)] h-48">
<p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-full w-full"></p-chart>
</div>
</div>
</div>
<!-- Center Column -->
<div class="lg:col-span-4 space-y-6">
<!-- Proyectos Activos -->
<div class="glass-card rounded-2xl p-6">
<h4 class="font-bold mb-6">Proyectos Activos</h4>
<div class="overflow-x-auto">
<table class="w-full text-sm text-left">
<thead class="text-slate-500 border-b border-[rgba(255,255,255,0.1)] uppercase text-[10px] tracking-widest font-bold">
<tr>
<th class="pb-3">Nombre</th>
<th class="pb-3 text-right">Vencimiento</th>
</tr>
</thead>
<tbody class="divide-y divide-[rgba(255,255,255,0.1)]">
<tr *ngFor="let pa of proyectosActivosData | slice:0:3">
<td class="py-4 font-medium">{{ pa.nombreProyecto }}</td>
<td class="py-4 text-right whitespace-nowrap">{{ pa.fechaEntrega | date:'MMM dd' }}</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Registros Faltantes -->
<div class="glass-card rounded-2xl p-6">
<div class="flex items-center justify-between mb-6">
<h4 class="font-bold">Registros Faltantes</h4>
<span class="material-symbols-outlined text-orange-500">priority_high</span>
</div>
<div class="space-y-4">
<div *ngFor="let missing of registrosFaltantes | slice:0:5" class="flex items-center justify-between group">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold border border-[rgba(255,255,255,0.1)]">
{{ missing.nombre | slice:0:2 | uppercase }}
</div>
<span class="text-sm font-medium group-hover:text-[#ec5b13] transition-colors">{{ missing.nombre }}</span>
</div>
<div class="flex gap-1 overflow-x-auto snap-x snap-mandatory flex-nowrap hide-scrollbars">
    <span *ngFor="let inc of missing.incidencias | slice:0:2" class="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
        {{ inc }}
    </span>
</div>
</div>
</div>
</div>
</div>
<!-- Right Column -->
<div class="lg:col-span-4 space-y-6">
<!-- Proyectos A Vencer -->
<div class="glass-card rounded-2xl p-6">
<h4 class="font-bold mb-6">Proyectos A Vencer</h4>
<div class="overflow-x-auto">
<table class="w-full text-sm text-left">
<thead class="text-slate-500 border-b border-[rgba(255,255,255,0.1)] uppercase text-[10px] tracking-widest font-bold">
<tr>
<th class="pb-3">Nombre</th>
<th class="pb-3 text-right">Vencimiento</th>
</tr>
</thead>
<tbody class="divide-y divide-[rgba(255,255,255,0.1)]">
<tr *ngFor="let v of proyectosAVencerData | slice:0:2">
<td class="py-4 font-medium">{{ v.nombreProyecto }}</td>
<td class="py-4 text-right font-bold" [ngClass]="{'text-red-400': true}">{{ v.fechaEntrega | date:'MMM dd' }}</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- CI/CD Horas Registradas -->
<div class="glass-card rounded-2xl p-6">
<div class="flex items-center justify-between mb-6">
<h4 class="font-bold">CI/CD Horas</h4>
</div>
<div class="overflow-x-auto">
<table class="w-full text-[12px] text-left">
<thead class="text-slate-500 border-b border-[rgba(255,255,255,0.1)] font-bold uppercase tracking-wider">
<tr>
<th class="pb-3 pr-2">Proyecto</th>
<th class="pb-3 px-2 text-center">Horas</th>
<th class="pb-3 px-2 text-right">Estatus</th>
</tr>
</thead>
<tbody class="divide-y divide-[rgba(255,255,255,0.1)]">
<tr *ngFor="let ci of cicdHorasData | slice:0:3">
<td class="py-4 font-semibold">{{ ci.nombre }}</td>
<td class="py-4 text-center">{{ ci.horasCiCd }} / <span class="text-slate-500">{{ ci.horasMes }}</span></td>
<td class="py-4 text-right">
<span class="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-[9px] font-bold inline-block leading-none">Alerta</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</main>
`;

const styles = `
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .mesh-green {
            background-image: radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0, transparent 50%);
        }
        .mesh-blue {
            background-image: radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0, transparent 50%);
        }
        .mesh-orange {
            background-image: radial-gradient(at 0% 0%, rgba(236, 91, 19, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 91, 19, 0.1) 0, transparent 50%);
        }
        .mesh-red {
            background-image: radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.1) 0, transparent 50%);
        }
        .hide-scrollbars::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbars {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        :host ::ng-deep .custom-date-picker .p-inputtext {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            color: #f1f5f9;
            border-radius: 0.75rem;
        }
        :host ::ng-deep p-chart > div {
            min-height: 100%;
        }
`;

const fullComponentCode = `
${importsCode}
@Component({
    selector: 'app-dashboard-prueba',
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
    template: \`
${template}\`,
    styles: [\`
${styles}\`],
    providers: [ConfirmationService, MessageService]
})
${classCode}
`;

fs.writeFileSync('src/app/pages/uikit/dashboardprueba.ts', fullComponentCode);
