import { Component, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { ReporteGuardiaService, ReporteGuardia as ReporteGuardiaModel, ItemReporte, RestauranteReporte } from '../service/reporte-guardia.service';

type Vista = 'inicio' | 'formulario' | 'enviado';

function crearItem(descripcion: string): ItemReporte {
    return { descripcion, bien: null, mal: null, observaciones: '' };
}

function crearRestaurante(nombre: string, items: string[]): RestauranteReporte {
    return {
        nombre,
        items: items.map(crearItem),
        comentarios: '',
        cerrado: false
    };
}

const ITEMS_AREAS_HUESPEDES = [
    'Acceso principal (limpieza, luces, papeleras, jardineras)',
    'Motor Lobby (limpieza, luces, papeleras, jardineras)',
    'Motor Lobby (Botones y seguridad de 07:00 a 23:00)',
    'Recepción',
    'Realizar 2 llamadas a recepción, verificando que se cumpla el estándar de teléfonos',
    'Revisar todos los escritorios del lobby',
    'Computadora para huéspedes',
    'Baños de huéspedes área de lobby (papel, jabón, a/a, limpieza y orden)',
    'Lobby bar (limpio y en orden)',
    'Salas del lobby y mesa de billar',
    'Pasillos de habitaciones libres de ruido',
    'Gimnasio (En buen estado, a/a funcionando, limpio y en orden)',
    'Baños de huéspedes área de alberca (papel, jabón, a/a, limpieza y orden)',
    'Pool bar (limpio y en orden)',
    'Área de toallero alberca',
    'Área de piscina limpia y en orden, libre de restos de comida y/o menaje. Verificar que las papeleras estén en óptimas condiciones',
    'Camastros alineados, en orden, y limpios',
    'Sombrillas en área de piscina limpias y en orden',
    'Iluminación en áreas exteriores (piscinas, pasillos, jardineras, playa)',
    'Área de playa limpia y en orden (sin restos de comida o menaje)',
    'Camas balinesas y palapas limpias y en orden',
    '¿Hay banda tocando en vivo?',
];

const ITEMS_EQUIPOS = [
    'Chillers (Temperatura entre 7°C y 10°C)',
    'Cámaras de refrigeración (Temperatura entre 0°C y 4°C)',
    'Cámaras de congelación (Temperatura entre -18°C y -22°C)',
    'Agua caliente (Temperatura entre 50°C y 60°C)',
    'Osmosis inversa (Verificar nivel de cisterna)',
    'Osmosis inversa (Verificar nivel de cloro entre 0.5 PPM y 1.5 PPM)',
    'Osmosis inversa (Verificar PH de agua entre 7.4 PPM y 7.8 PPM)',
    'Elevadores',
];

const ITEMS_COLABORADORES = [
    'Pasillos: piso, techos, paredes y lockers',
    'Iluminación — lámparas funcionando',
    'Baños y vestidores de colaboradores',
    'Andén recepción de mercancías',
    'Personal: actitud, sonrisa, saludos',
    'Presentación, uniforme completo, gafete',
];

const ITEMS_RESTAURANTE_STD = [
    'Se saluda a los huéspedes y se les da la bienvenida',
    'Las mesas están abiertas en sistema con las comandas correspondientes',
    'El huésped es atendido máximo a los 2 minutos de haber llegado',
    'El mesero se presenta por su nombre con el huésped',
    'Se ofrece alguna bebida o aperitivo antes de los alimentos',
    'Las estaciones de los meseros están limpias y en buenas condiciones',
    'Los menús lucen limpios y en buen estado',
    'Presentación de mesa y sillas',
    'Pisos, techos y paredes en buenas condiciones',
    'Verificar que no haya focos fundidos',
    '¿En cuánto tiempo se sirvió el plato fuerte después de ser ordenado?',
];

const ITEMS_TACOS = [
    ...ITEMS_RESTAURANTE_STD.slice(0, 10),
    '¿En cuánto tiempo se sirvieron los tacos después de ser ordenados?',
];

const ITEMS_BAR = [
    'Se saluda a los huéspedes y se les da la bienvenida',
    'Las mesas de los planes HD y CV están abiertas en sistema con las comandas correspondientes',
    'El huésped es atendido máximo a los 2 minutos de haber llegado',
    'El bartender se presenta por su nombre con el huésped',
    'Se promueve coctelería de especialidad',
    'Los menús lucen limpios y en buen estado',
    'Cristalería limpia y en buen estado',
    'La barra de servicio está limpia y ordenada',
    'Las garnituras e insumos se encuentran frescos y disponibles',
    'Pisos, techos y paredes en buenas condiciones',
    'Volumen de la música adecuado',
    'Verificar que no haya focos fundidos',
    '¿En cuánto tiempo se sirvió la bebida después de ser ordenada?',
];

const ITEMS_COFFEE_CORNER = [
    'Se saluda a los huéspedes y se les da la bienvenida',
    'Los menús lucen limpios y en buen estado',
    'Presentación de los alimentos',
    'Pisos, techos y paredes en buenas condiciones',
    'Verificar que no haya focos fundidos',
    '¿En cuánto tiempo se sirvió el plato fuerte después de ser ordenado?',
];

class DbDraftService {
    private dbName = 'ReporteGuardiaDB';
    private storeName = 'DraftStore';
    private keyName = 'reporte_guardia_draft';

    private openDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            };
            request.onerror = (event: any) => {
                reject(event.target.error);
            };
        });
    }

    async saveDraft(data: any): Promise<void> {
        try {
            const db = await this.openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(data, this.keyName);
                request.onsuccess = () => resolve();
                request.onerror = (event: any) => reject(event.target.error);
            });
        } catch (error) {
            console.error('Error saving draft to IndexedDB:', error);
        }
    }

    async loadDraft(): Promise<any> {
        try {
            const db = await this.openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(this.keyName);
                request.onsuccess = (event: any) => resolve(event.target.result || null);
                request.onerror = (event: any) => reject(event.target.error);
            });
        } catch (error) {
            console.error('Error loading draft from IndexedDB:', error);
            return null;
        }
    }

    async clearDraft(): Promise<void> {
        try {
            const db = await this.openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(this.keyName);
                request.onsuccess = () => resolve();
                request.onerror = (event: any) => reject(event.target.error);
            });
        } catch (error) {
            console.error('Error clearing draft from IndexedDB:', error);
        }
    }
}

@Component({
    selector: 'app-reporte-guardia',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<!-- ====================== VISTA: INICIO ====================== -->
<div *ngIf="vista === 'inicio'" class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-cover bg-center" style="background-image: url('layout/images/pool-cancun-nyx.jpg');">
    <!-- Capa de difuminado y aclarado sobre la imagen de fondo -->
    <div class="absolute inset-0 bg-white/75 backdrop-blur-[6px]"></div>
    
    <div class="w-full max-w-4xl relative z-10">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-10">
            <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="Hotel NYX Cancún" class="h-32 mb-6 drop-shadow-md" />
            <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight text-center">Reporte de Guardia Ejecutiva</h1>
            <p class="text-slate-600 mt-3 text-center text-base md:text-lg font-medium">Hotel NYX Cancún — Sistema de Gestión Interna</p>
        </div>

        <!-- Card principal blanca ancha -->
        <div class="rounded-3xl border border-slate-200 p-10 shadow-xl bg-white">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <!-- Fecha -->
                <div class="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                    <span class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">Fecha del Turno</span>
                    <div class="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 w-full">
                        <span class="material-symbols-outlined text-teal-500" style="font-size:28px">calendar_today</span>
                        <div class="flex flex-col">
                            <span class="text-xl font-bold text-slate-800">{{ fechaFormateada }}</span>
                            <span class="text-xs text-slate-400">Establecido automáticamente</span>
                        </div>
                    </div>
                </div>

                <!-- Ejecutivo -->
                <div class="flex flex-col justify-center md:pl-4">
                    <span class="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">Ejecutivo de Guardia</span>
                    <div class="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 w-full">
                        <span class="material-symbols-outlined text-teal-500" style="font-size:28px">person</span>
                        <div class="flex flex-col">
                            <span class="text-xl font-bold text-slate-700">{{ nombreEjecutivo || 'Cargando...' }}</span>
                            <span class="text-xs text-slate-400">Perfil autenticado</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botón llenar reporte -->
            <button
                (click)="iniciarReporte()"
                class="w-full py-4 px-6 rounded-2xl font-bold text-lg text-white uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 shadow-md cursor-pointer hover:bg-teal-700 active:scale-[0.99]"
                style="background: linear-gradient(135deg, #0d9488, #0f766e);"
                [class.opacity-60]="!nombreEjecutivo"
                [disabled]="!nombreEjecutivo">
                <span class="material-symbols-outlined" style="font-size:24px">edit_document</span>
                Llenar Reporte de Guardia
            </button>
        </div>
    </div>
</div>

<!-- ====================== VISTA: FORMULARIO ====================== -->
<div *ngIf="vista === 'formulario'" class="min-h-screen pb-16" style="background: #f8fafc;">
    <!-- Header fijo -->
    <div class="sticky top-[-2rem] z-[999] shadow-sm border-b border-slate-200" style="background: #ffffff;">
        <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="layout/images/NyxHotelLogo-removebg-preview.png" alt="NYX" class="h-14" />
                <div>
                    <p class="text-slate-800 font-extrabold text-xl leading-tight">Reporte de Guardia Ejecutiva</p>
                    <p class="text-teal-600 text-sm font-semibold mt-0.5">{{ fechaFormateada }} &mdash; {{ nombreEjecutivo }}</p>
                </div>
            </div>
            <button (click)="vista = 'inicio'" class="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-base font-semibold cursor-pointer">
                <span class="material-symbols-outlined" style="font-size:22px">arrow_back</span>
                Volver
            </button>
        </div>
        <!-- Barra de progreso -->
        <div class="h-1 bg-slate-100">
            <div class="h-1 bg-teal-500 transition-all duration-500" [style.width]="progreso + '%'"></div>
        </div>
    </div>
 
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-4">

        <!-- ===== SECCIÓN I: ÁREAS DE HUÉSPEDES ===== -->
        <div id="sec-ah" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style="scroll-margin-top: 100px;">
            <button type="button" (click)="toggleSeccion('ah')"
                class="w-full px-6 py-4 flex items-center gap-3 cursor-pointer hover:brightness-95 transition-all"
                style="background: linear-gradient(135deg, #0f172a, #1e3a5f);">
                <span class="material-symbols-outlined text-teal-400" style="font-size:22px">hotel</span>
                <h2 class="text-white font-bold text-base flex-1 text-left">Áreas de Huéspedes</h2>
                <span class="text-white/70 text-xs mr-2">{{ contarRespondidos(reporte.areasHuespedes) }}/{{ reporte.areasHuespedes.length }}</span>
                <span class="material-symbols-outlined text-white transition-transform duration-300"
                    [style.transform]="seccionesAbiertas.has('ah') ? 'rotate(180deg)' : 'rotate(0deg)'"
                    style="font-size:20px">expand_more</span>
            </button>
            <div *ngIf="seccionesAbiertas.has('ah')">
                <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique la limpieza, iluminación y estado general en:</p>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                                <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                                <th class="px-3 py-2 font-semibold text-center text-green-600">Bien</th>
                                <th class="px-3 py-2 font-semibold text-center text-red-500">Mal</th>
                                <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let item of reporte.areasHuespedes; let i = index"
                                [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                                class="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                                <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'bien')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.bien ? 'bg-green-500 border-green-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-green-400 hover:text-green-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">check</span>
                                    </button>
                                </td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'mal')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.mal ? 'bg-red-500 border-red-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-red-400 hover:text-red-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">close</span>
                                    </button>
                                </td>
                                <td class="px-4 py-2">
                                    <textarea [(ngModel)]="item.observaciones" [name]="'ah_obs_' + i" (ngModelChange)="guardarProgreso()" rows="1"
                                        class="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white placeholder:text-slate-300 transition-all focus:h-20 resize-none min-h-[38px] align-middle"
                                        placeholder="Observaciones..."></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Comentarios Adicionales</label>
                        <textarea [(ngModel)]="reporte.comentariosAreasHuespedes" name="comentariosAH" (ngModelChange)="guardarProgreso()" rows="3"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white resize-none"
                            placeholder="Comentarios sobre las áreas de huéspedes..."></textarea>
                    </div>
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Adjuntar Evidencia</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Opción 1: Drag & Drop / Galerías -->
                            <div class="flex-1 border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-white relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" (change)="onEvidenciaSelected($event, 'ah')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-slate-400 mb-1" style="font-size:26px">cloud_upload</span>
                                <p class="text-slate-500 text-xs font-semibold">Subir desde galería o archivos</p>
                            </div>
                            <!-- Opción 2: Abrir Cámara Directa -->
                            <div class="flex-1 border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-teal-50/30 relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" capture="environment" (change)="onEvidenciaSelected($event, 'ah')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-teal-600 mb-1" style="font-size:26px">photo_camera</span>
                                <p class="text-teal-700 text-xs font-bold">Tomar Foto (Abrir Cámara)</p>
                            </div>
                        </div>
                        <div *ngIf="(evidenciaPreviews['ah'] || []).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                            <div *ngFor="let p of evidenciaPreviews['ah']; let idx = index" class="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="relative aspect-square w-full bg-slate-200 cursor-pointer" (click)="abrirImagenGrande(p, evidenciaLabels['ah']?.[idx] || '')">
                                    <img [src]="p" class="w-full h-full object-cover" alt="Evidencia" />
                                    <!-- Botón Eliminar visible y separado (esquina superior derecha) -->
                                    <button type="button" 
                                        (click)="$event.stopPropagation(); removeEvidencia('ah', idx)" 
                                        class="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md z-10 transition-colors">
                                        <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                                    </button>
                                </div>
                                <div class="p-2 bg-white border-t border-slate-100">
                                    <textarea [(ngModel)]="evidenciaLabels['ah'][idx]" [name]="'label_ah_' + idx" (ngModelChange)="guardarProgreso()" rows="2"
                                        class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-teal-400 placeholder:text-slate-300 font-medium resize-none block"
                                        placeholder="Añadir etiqueta..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== SECCIÓN II: EQUIPOS ===== -->
        <div id="sec-eq" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style="scroll-margin-top: 100px;">
            <button type="button" (click)="toggleSeccion('eq')"
                class="w-full px-6 py-4 flex items-center gap-3 cursor-pointer hover:brightness-95 transition-all"
                style="background: linear-gradient(135deg, #1e3a5f, #1e40af);">
                <span class="material-symbols-outlined text-blue-300" style="font-size:22px">settings</span>
                <h2 class="text-white font-bold text-base flex-1 text-left"> Equipos</h2>
                <span class="text-white/70 text-xs mr-2">{{ contarRespondidos(reporte.equipos) }}/{{ reporte.equipos.length }}</span>
                <span class="material-symbols-outlined text-white transition-transform duration-300"
                    [style.transform]="seccionesAbiertas.has('eq') ? 'rotate(180deg)' : 'rotate(0deg)'"
                    style="font-size:20px">expand_more</span>
            </button>
            <div *ngIf="seccionesAbiertas.has('eq')">
                <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique que estén dentro de los parámetros aceptables:</p>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                                <th class="text-left px-6 py-2 font-semibold w-3/5">Equipo</th>
                                <th class="px-3 py-2 font-semibold text-center text-green-600">Bien</th>
                                <th class="px-3 py-2 font-semibold text-center text-red-500">Mal</th>
                                <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let item of reporte.equipos; let i = index"
                                [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                                class="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                                <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'bien')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.bien ? 'bg-green-500 border-green-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-green-400 hover:text-green-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">check</span>
                                    </button>
                                </td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'mal')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.mal ? 'bg-red-500 border-red-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-red-400 hover:text-red-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">close</span>
                                    </button>
                                </td>
                                <td class="px-4 py-2">
                                    <textarea [(ngModel)]="item.observaciones" [name]="'eq_obs_' + i" (ngModelChange)="guardarProgreso()" rows="1"
                                        class="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white placeholder:text-slate-300 transition-all focus:h-20 resize-none min-h-[38px] align-middle"
                                        placeholder="Observaciones..."></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Comentarios Adicionales</label>
                        <textarea [(ngModel)]="reporte.comentariosEquipos" name="comentariosEq" (ngModelChange)="guardarProgreso()" rows="3"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white resize-none"
                            placeholder="Comentarios sobre equipos..."></textarea>
                    </div>
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Adjuntar Evidencia</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Opción 1: Drag & Drop / Galerías -->
                            <div class="flex-1 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-white relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" (change)="onEvidenciaSelected($event, 'eq')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-slate-400 mb-1" style="font-size:26px">cloud_upload</span>
                                <p class="text-slate-500 text-xs font-semibold">Subir desde galería o archivos</p>
                            </div>
                            <!-- Opción 2: Abrir Cámara Directa -->
                            <div class="flex-1 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-blue-50/30 relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" capture="environment" (change)="onEvidenciaSelected($event, 'eq')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-blue-600 mb-1" style="font-size:26px">photo_camera</span>
                                <p class="text-blue-700 text-xs font-bold">Tomar Foto (Abrir Cámara)</p>
                            </div>
                        </div>
                        <div *ngIf="(evidenciaPreviews['eq'] || []).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                            <div *ngFor="let p of evidenciaPreviews['eq']; let idx = index" class="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="relative aspect-square w-full bg-slate-200 cursor-pointer" (click)="abrirImagenGrande(p, evidenciaLabels['eq']?.[idx] || '')">
                                    <img [src]="p" class="w-full h-full object-cover" alt="Evidencia" />
                                    <!-- Botón Eliminar visible y separado (esquina superior derecha) -->
                                    <button type="button" 
                                        (click)="$event.stopPropagation(); removeEvidencia('eq', idx)" 
                                        class="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md z-10 transition-colors">
                                        <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                                    </button>
                                </div>
                                <div class="p-2 bg-white border-t border-slate-100">
                                    <textarea [(ngModel)]="evidenciaLabels['eq'][idx]" [name]="'label_eq_' + idx" (ngModelChange)="guardarProgreso()" rows="2"
                                        class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 placeholder:text-slate-300 font-medium resize-none block"
                                        placeholder="Añadir etiqueta..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== SECCIÓN III: ÁREAS COLABORADORES ===== -->
        <div id="sec-col" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style="scroll-margin-top: 100px;">
            <button type="button" (click)="toggleSeccion('col')"
                class="w-full px-6 py-4 flex items-center gap-3 cursor-pointer hover:brightness-95 transition-all"
                style="background: linear-gradient(135deg, #3730a3, #6d28d9);">
                <span class="material-symbols-outlined text-purple-300" style="font-size:22px">badge</span>
                <h2 class="text-white font-bold text-base flex-1 text-left">Áreas de Colaboradores</h2>
                <span class="text-white/70 text-xs mr-2">{{ contarRespondidos(reporte.areasColaboradores) }}/{{ reporte.areasColaboradores.length }}</span>
                <span class="material-symbols-outlined text-white transition-transform duration-300"
                    [style.transform]="seccionesAbiertas.has('col') ? 'rotate(180deg)' : 'rotate(0deg)'"
                    style="font-size:20px">expand_more</span>
            </button>
            <div *ngIf="seccionesAbiertas.has('col')">
                <p class="text-slate-500 text-sm px-6 py-3 bg-slate-50 border-b border-slate-100">Verifique la limpieza, iluminación y estado general en:</p>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                                <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                                <th class="px-3 py-2 font-semibold text-center text-green-600">Bien</th>
                                <th class="px-3 py-2 font-semibold text-center text-red-500">Mal</th>
                                <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let item of reporte.areasColaboradores; let i = index"
                                [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                                class="border-b border-slate-100 hover:bg-purple-50/30 transition-colors">
                                <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'bien')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.bien ? 'bg-green-500 border-green-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-green-400 hover:text-green-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">check</span>
                                    </button>
                                </td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'mal')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.mal ? 'bg-red-500 border-red-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-red-400 hover:text-red-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">close</span>
                                    </button>
                                </td>
                                <td class="px-4 py-2">
                                    <textarea [(ngModel)]="item.observaciones" [name]="'col_obs_' + i" (ngModelChange)="guardarProgreso()" rows="1"
                                        class="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white placeholder:text-slate-300 transition-all focus:h-20 resize-none min-h-[38px] align-middle"
                                        placeholder="Observaciones..."></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Comentarios Adicionales</label>
                        <textarea [(ngModel)]="reporte.comentariosColaboradores" name="comentariosCol" (ngModelChange)="guardarProgreso()" rows="3"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white resize-none"
                            placeholder="Comentarios sobre las áreas de colaboradores..."></textarea>
                    </div>
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Adjuntar Evidencia</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Opción 1: Drag & Drop / Galerías -->
                            <div class="flex-1 border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-white relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" (change)="onEvidenciaSelected($event, 'col')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-slate-400 mb-1" style="font-size:26px">cloud_upload</span>
                                <p class="text-slate-500 text-xs font-semibold">Subir desde galería o archivos</p>
                            </div>
                            <!-- Opción 2: Abrir Cámara Directa -->
                            <div class="flex-1 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-purple-50/30 relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" capture="environment" (change)="onEvidenciaSelected($event, 'col')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-purple-600 mb-1" style="font-size:26px">photo_camera</span>
                                <p class="text-purple-700 text-xs font-bold">Tomar Foto (Abrir Cámara)</p>
                            </div>
                        </div>
                        <div *ngIf="(evidenciaPreviews['col'] || []).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                            <div *ngFor="let p of evidenciaPreviews['col']; let idx = index" class="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="relative aspect-square w-full bg-slate-200 cursor-pointer" (click)="abrirImagenGrande(p, evidenciaLabels['col']?.[idx] || '')">
                                    <img [src]="p" class="w-full h-full object-cover" alt="Evidencia" />
                                    <!-- Botón Eliminar visible y separado (esquina superior derecha) -->
                                    <button type="button" 
                                        (click)="$event.stopPropagation(); removeEvidencia('col', idx)" 
                                        class="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md z-10 transition-colors">
                                        <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                                    </button>
                                </div>
                                <div class="p-2 bg-white border-t border-slate-100">
                                    <textarea [(ngModel)]="evidenciaLabels['col'][idx]" [name]="'label_col_' + idx" (ngModelChange)="guardarProgreso()" rows="2"
                                        class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-purple-400 placeholder:text-slate-300 font-medium resize-none block"
                                        placeholder="Añadir etiqueta..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div *ngFor="let rest of reporte.restaurantes; let ri = index" [id]="'sec-rest_' + ri" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style="scroll-margin-top: 100px;">
            <div class="w-full px-6 py-4 flex flex-wrap items-center gap-3"
                [class.cursor-pointer]="!rest.cerrado"
                (click)="!rest.cerrado && toggleSeccion('rest_' + ri)"
                style="background: linear-gradient(135deg, #7c2d12, #c2410c);">
                <span class="material-symbols-outlined text-orange-300" style="font-size:22px">restaurant</span>
                <h2 class="text-white font-bold text-base flex-1 text-left min-w-[200px]">
                    {{ ri === 0 ? '' : '' }} Centros de Consumo — {{ rest.nombre }}
                    <span *ngIf="rest.cerrado" class="ml-2 px-2 py-0.5 text-xs bg-red-800 text-white rounded font-bold uppercase tracking-wider">Cerrado</span>
                </h2>
                
                <!-- Switch Cerrado -->
                <div class="flex items-center gap-2 bg-black/25 px-3 py-1 rounded-xl mr-2" (click)="$event.stopPropagation()">
                    <span class="text-white/90 text-xs font-bold uppercase tracking-wider">¿Cerrado?</span>
                    <button type="button" 
                        (click)="toggleCerradoRestaurante(rest, 'rest_' + ri)"
                        class="w-12 h-6 rounded-full transition-colors relative cursor-pointer outline-none focus:ring-1 focus:ring-orange-400"
                        [class]="rest.cerrado ? 'bg-red-600' : 'bg-slate-600'">
                        <span class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                            [style.transform]="rest.cerrado ? 'translateX(24px)' : 'translateX(0)'"></span>
                    </button>
                </div>

                <span *ngIf="!rest.cerrado" class="text-white/70 text-xs mr-2">{{ contarRespondidos(rest.items) }}/{{ rest.items.length }}</span>
                
                <button type="button" 
                    *ngIf="!rest.cerrado"
                    (click)="$event.stopPropagation(); toggleSeccion('rest_' + ri)"
                    class="material-symbols-outlined text-white transition-transform duration-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                    [style.transform]="seccionesAbiertas.has('rest_' + ri) ? 'rotate(180deg)' : 'rotate(0deg)'"
                    style="font-size:24px">expand_more</button>
            </div>
            <!-- Mensaje cuando está cerrado -->
            <div *ngIf="rest.cerrado" class="px-6 py-5 flex flex-col gap-4 bg-slate-50 border-t border-slate-200">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-slate-400" style="font-size:24px">do_not_disturb_on</span>
                    <div>
                        <p class="text-slate-600 font-semibold text-sm">Este centro de consumo no opera hoy</p>
                        <p class="text-slate-400 text-xs mt-0.5">Marcado como cerrado — no se requiere evaluación.</p>
                    </div>
                </div>
                <!-- Comentarios del cierre -->
                <div class="w-full">
                    <label class="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-2">Comentarios / Observaciones del Cierre</label>
                    <textarea [(ngModel)]="rest.comentarios" [name]="'comentarios_cerrado_' + ri" (ngModelChange)="guardarProgreso()" rows="2"
                        class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white resize-none"
                        placeholder="Escribe comentarios sobre el cierre..."></textarea>
                </div>
            </div>
            <div *ngIf="!rest.cerrado && seccionesAbiertas.has('rest_' + ri)">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-slate-100 text-slate-600 uppercase text-xs">
                                <th class="text-left px-6 py-2 font-semibold w-3/5">Descripción</th>
                                <th class="px-3 py-2 font-semibold text-center text-green-600">Bien</th>
                                <th class="px-3 py-2 font-semibold text-center text-red-500">Mal</th>
                                <th class="px-4 py-2 font-semibold text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let item of rest.items; let i = index"
                                [class]="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                                class="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                                <td class="px-6 py-3 text-slate-700 font-medium leading-snug">{{ item.descripcion }}</td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'bien')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.bien ? 'bg-green-500 border-green-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-green-400 hover:text-green-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">check</span>
                                    </button>
                                </td>
                                <td class="px-3 py-3 text-center">
                                    <button (click)="toggleBienMal(item, 'mal')"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center mx-auto cursor-pointer"
                                        [class]="item.mal ? 'bg-red-500 border-red-500 text-white shadow-md' : 'border-slate-300 text-slate-300 hover:border-red-400 hover:text-red-400'">
                                        <span class="material-symbols-outlined" style="font-size:16px">close</span>
                                    </button>
                                </td>
                                <td class="px-4 py-2">
                                    <textarea [(ngModel)]="item.observaciones" [name]="'rest_' + ri + '_obs_' + i" (ngModelChange)="guardarProgreso()" rows="1"
                                        class="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white placeholder:text-slate-300 transition-all focus:h-20 resize-none min-h-[38px] align-middle"
                                        placeholder="Observaciones..."></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-4">
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Comentarios Adicionales del Servicio</label>
                        <textarea [(ngModel)]="rest.comentarios" [name]="'rest_com_' + ri" (ngModelChange)="guardarProgreso()" rows="3"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white resize-none"
                            placeholder="Comentarios sobre el servicio del restaurante..."></textarea>
                    </div>
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Adjuntar Evidencia</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Opción 1: Drag & Drop / Galerías -->
                            <div class="flex-1 border-2 border-dashed border-slate-300 hover:border-orange-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-white relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" (change)="onEvidenciaSelected($event, 'rest_' + ri)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-slate-400 mb-1" style="font-size:26px">cloud_upload</span>
                                <p class="text-slate-500 text-xs font-semibold">Subir desde galería o archivos</p>
                            </div>
                            <!-- Opción 2: Abrir Cámara Directa -->
                            <div class="flex-1 border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-orange-50/30 relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" capture="environment" (change)="onEvidenciaSelected($event, 'rest_' + ri)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-orange-600 mb-1" style="font-size:26px">photo_camera</span>
                                <p class="text-orange-700 text-xs font-bold">Tomar Foto (Abrir Cámara)</p>
                            </div>
                        </div>
                        <div *ngIf="(evidenciaPreviews['rest_' + ri] || []).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                            <div *ngFor="let p of evidenciaPreviews['rest_' + ri]; let idx = index" class="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="relative aspect-square w-full bg-slate-200 cursor-pointer" (click)="abrirImagenGrande(p, evidenciaLabels['rest_' + ri]?.[idx] || '')">
                                    <img [src]="p" class="w-full h-full object-cover" alt="Evidencia" />
                                    <!-- Botón Eliminar visible y separado (esquina superior derecha) -->
                                    <button type="button" 
                                        (click)="$event.stopPropagation(); removeEvidencia('rest_' + ri, idx)" 
                                        class="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md z-10 transition-colors">
                                        <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                                    </button>
                                </div>
                                <div class="p-2 bg-white border-t border-slate-100">
                                    <textarea [(ngModel)]="evidenciaLabels['rest_' + ri][idx]" [name]="'label_rest_' + ri + '_' + idx" (ngModelChange)="guardarProgreso()" rows="2"
                                        class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-orange-400 placeholder:text-slate-300 font-medium resize-none block"
                                        placeholder="Añadir etiqueta..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== SECCIÓN VI: INCIDENTES CON HUÉSPEDES ===== -->
        <div id="sec-inc" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style="scroll-margin-top: 100px;">
            <button type="button" (click)="toggleSeccion('inc')"
                class="w-full px-6 py-4 flex items-center gap-3 cursor-pointer hover:brightness-95 transition-all"
                style="background: linear-gradient(135deg, #7f1d1d, #991b1b);">
                <span class="material-symbols-outlined text-red-300" style="font-size:22px">report</span>
                <h2 class="text-white font-bold text-base flex-1 text-left">Incidentes con Huéspedes</h2>
                <span class="material-symbols-outlined text-white transition-transform duration-300"
                    [style.transform]="seccionesAbiertas.has('inc') ? 'rotate(180deg)' : 'rotate(0deg)'"
                    style="font-size:20px">expand_more</span>
            </button>
            <div *ngIf="seccionesAbiertas.has('inc')">
                <div class="px-6 py-6 space-y-4">
                    <div>
                        <label class="text-slate-600 text-sm font-semibold block mb-2">Describa los incidentes presentados durante el turno:</label>
                        <textarea [(ngModel)]="reporte.incidentes" name="incidentes" (ngModelChange)="guardarProgreso()" rows="6"
                            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-white resize-none"
                            placeholder="Describa cualquier incidente con huéspedes, quejas, requerimientos especiales, etc. Si no hubo incidentes escriba 'Sin incidentes'..."></textarea>
                    </div>
                    <div>
                        <label class="text-slate-600 text-xs font-semibold uppercase tracking-wider block mb-2">Adjuntar Evidencia</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Opción 1: Drag & Drop / Galerías -->
                            <div class="flex-1 border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-white relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" (change)="onEvidenciaSelected($event, 'inc')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-slate-400 mb-1" style="font-size:26px">cloud_upload</span>
                                <p class="text-slate-500 text-xs font-semibold">Subir desde galería o archivos</p>
                            </div>
                            <!-- Opción 2: Abrir Cámara Directa -->
                            <div class="flex-1 border-2 border-dashed border-red-300 hover:border-red-500 rounded-xl p-4 transition-colors flex flex-col items-center justify-center cursor-pointer bg-red-50/30 relative min-h-[100px]">
                                <input type="file" multiple accept="image/*" capture="environment" (change)="onEvidenciaSelected($event, 'inc')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                <span class="material-symbols-outlined text-red-600 mb-1" style="font-size:26px">photo_camera</span>
                                <p class="text-red-700 text-xs font-bold">Tomar Foto (Abrir Cámara)</p>
                            </div>
                        </div>
                        <div *ngIf="(evidenciaPreviews['inc'] || []).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                            <div *ngFor="let p of evidenciaPreviews['inc']; let idx = index" class="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="relative aspect-square w-full bg-slate-200 cursor-pointer" (click)="abrirImagenGrande(p, evidenciaLabels['inc']?.[idx] || '')">
                                    <img [src]="p" class="w-full h-full object-cover" alt="Evidencia" />
                                    <!-- Botón Eliminar visible y separado (esquina superior derecha) -->
                                    <button type="button" 
                                        (click)="$event.stopPropagation(); removeEvidencia('inc', idx)" 
                                        class="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-md z-10 transition-colors">
                                        <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                                    </button>
                                </div>
                                <div class="p-2 bg-white border-t border-slate-100">
                                    <textarea [(ngModel)]="evidenciaLabels['inc'][idx]" [name]="'label_inc_' + idx" (ngModelChange)="guardarProgreso()" rows="2"
                                        class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-red-400 placeholder:text-slate-300 font-medium resize-none block"
                                        placeholder="Añadir etiqueta..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== BOTÓN ENVIAR ===== -->
        <div class="flex justify-end gap-4 pt-4">
            <button (click)="vista = 'inicio'"
                class="px-8 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                Cancelar
            </button>
            <button (click)="enviarReporte()"
                [disabled]="enviando"
                class="px-10 py-3 rounded-xl font-bold text-white uppercase tracking-wider shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style="background: linear-gradient(135deg, #0d9488, #0f766e); box-shadow: 0 0 20px rgba(13,148,136,0.3);">
                <span *ngIf="!enviando" class="material-symbols-outlined" style="font-size:20px">send</span>
                <span *ngIf="enviando" class="material-symbols-outlined animate-spin" style="font-size:20px">sync</span>
                {{ enviando ? 'Enviando...' : 'Enviar Reporte' }}
            </button>
        </div>

        <!-- Error -->
        <div *ngIf="errorEnvio" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3 text-red-700">
            <span class="material-symbols-outlined">error</span>
            <span class="text-sm">{{ errorEnvio }}</span>
        </div>
    </div>
</div>


<!-- ====================== VISTA: ENVIADO ====================== -->
<div *ngIf="vista === 'enviado'" class="min-h-screen flex items-center justify-center p-6" style="background: #f8fafc;">
    <div class="text-center max-w-md">
        <div class="w-24 h-24 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center mx-auto mb-8 shadow-md">
            <span class="material-symbols-outlined text-teal-500" style="font-size:48px">check_circle</span>
        </div>
        <h2 class="text-3xl font-bold text-slate-800 mb-3">¡Reporte Enviado!</h2>
        <p class="text-slate-500 mb-2">El reporte de guardia del <span class="text-teal-600 font-semibold">{{ fechaFormateada }}</span></p>
        <p class="text-slate-500 mb-10">ha sido registrado correctamente.</p>
        <button (click)="nuevoReporte()"
            class="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mx-auto shadow-md"
            style="background: linear-gradient(135deg, #0d9488, #0f766e);">
            <span class="material-symbols-outlined" style="font-size:20px">add</span>
            Nuevo Reporte
        </button>
    </div>
</div>

<!-- ====================== MODAL DE PREVISUALIZACIÓN EN GRANDE ====================== -->
<div *ngIf="imagenAmpliada" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" (click)="imagenAmpliada = null">
    <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col items-center animate-scale-in" (click)="$event.stopPropagation()">
        <button class="absolute top-4 right-4 bg-slate-800/80 text-white rounded-full p-2 hover:bg-slate-700 cursor-pointer flex items-center justify-center transition-colors shadow" (click)="imagenAmpliada = null">
            <span class="material-symbols-outlined" style="font-size:22px">close</span>
        </button>
        <img [src]="imagenAmpliada" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-inner" />
        <div *ngIf="etiquetaAmpliada" class="w-full text-center mt-3 py-3 px-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
            <p class="text-slate-700 font-semibold text-base">{{ etiquetaAmpliada }}</p>
        </div>
        <div *ngIf="!etiquetaAmpliada" class="w-full text-center mt-3 py-2 px-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
            <p class="text-slate-400 italic text-sm">Sin etiqueta</p>
        </div>
    </div>
</div>
    `,
    styles: [`
        :host { display: block; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `]
})
export class ReporteGuardia {
    authService = inject(AuthService);
    reporteService = inject(ReporteGuardiaService);
    cdr = inject(ChangeDetectorRef);

    dbDraftService = new DbDraftService();
    private saveTimeout: any = null;

    vista: Vista = 'inicio';
    enviando = false;
    errorEnvio = '';

    fechaHoy = new Date();
    fechaFormateada = this.fechaHoy.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    nombreEjecutivo = '';

    reporte!: ReporteGuardiaModel;

    // Evidencia fotográfica por sección
    evidenciaPreviews: Record<string, string[]> = {};
    evidenciaFiles: Record<string, File[]> = {};
    evidenciaLabels: Record<string, string[]> = {};

    imagenAmpliada: string | null = null;
    etiquetaAmpliada: string = '';

    abrirImagenGrande(url: string, label: string) {
        this.imagenAmpliada = url;
        this.etiquetaAmpliada = label;
        this.cdr.detectChanges();
    }

    // Control de acordeones — empieza todo colapsado
    seccionesAbiertas: Set<string> = new Set();

    guardarProgreso() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            this.guardarProgresoInmediato();
        }, 800);
    }

    async guardarProgresoInmediato() {
        if (!this.reporte) return;
        const draft = {
            reporte: this.reporte,
            evidenciaPreviews: this.evidenciaPreviews,
            evidenciaLabels: this.evidenciaLabels,
            vista: this.vista,
            seccionesAbiertas: Array.from(this.seccionesAbiertas)
        };
        await this.dbDraftService.saveDraft(draft);
    }

    async cargarProgreso() {
        const draft = await this.dbDraftService.loadDraft();
        if (draft && draft.reporte && draft.reporte.nombreEjecutivo === this.nombreEjecutivo) {
            this.reporte = draft.reporte;
            if (this.reporte.restaurantes) {
                this.reporte.restaurantes.forEach(r => {
                    if (r.nombre && r.nombre.includes('Tacos Villanos')) {
                        r.nombre = 'Tacos Villanos — Cena';
                    }
                });
            }
            this.evidenciaPreviews = draft.evidenciaPreviews || {};
            this.evidenciaLabels = draft.evidenciaLabels || {};
            this.vista = draft.vista || 'inicio';
            if (draft.seccionesAbiertas) {
                this.seccionesAbiertas = new Set(draft.seccionesAbiertas);
            }
            // Inicializar evidenciaFiles para cada sección si no existe
            this.evidenciaFiles = {};
            Object.keys(this.evidenciaPreviews).forEach(key => {
                this.evidenciaFiles[key] = [];
            });
            this.cdr.detectChanges();
        }
    }

    get progreso(): number {
        const total =
            this.reporte.areasHuespedes.filter(i => i.bien !== null || i.mal !== null).length +
            this.reporte.equipos.filter(i => i.bien !== null || i.mal !== null).length +
            this.reporte.areasColaboradores.filter(i => i.bien !== null || i.mal !== null).length +
            this.reporte.restaurantes
                .filter(r => !r.cerrado)
                .reduce((a, r) => a + r.items.filter(i => i.bien !== null || i.mal !== null).length, 0);

        const totalPosible =
            this.reporte.areasHuespedes.length +
            this.reporte.equipos.length +
            this.reporte.areasColaboradores.length +
            this.reporte.restaurantes
                .filter(r => !r.cerrado)
                .reduce((a, r) => a + r.items.length, 0);

        return totalPosible > 0 ? Math.round((total / totalPosible) * 100) : 0;
    }

    constructor() {
        // Carga el nombre inicialmente si ya está disponible
        this.actualizarNombre(this.authService.userProfile());

        // Escucha cambios reactivamente usando un effect del signal de perfil
        effect(() => {
            const perfil = this.authService.userProfile();
            this.actualizarNombre(perfil);
            this.cdr.detectChanges();
        });
    }

    private async actualizarNombre(perfil: any) {
        if (perfil) {
            this.nombreEjecutivo = perfil.name || perfil.email?.split('@')[0] || '';
            this.inicializarReporte();
            await this.cargarProgreso();
        }
    }

    inicializarReporte() {
        this.reporte = {
            fecha: this.fechaHoy.toISOString().split('T')[0],
            nombreEjecutivo: this.nombreEjecutivo,
            areasHuespedes: ITEMS_AREAS_HUESPEDES.map(crearItem),
            comentariosAreasHuespedes: '',
            equipos: ITEMS_EQUIPOS.map(crearItem),
            comentariosEquipos: '',
            areasColaboradores: ITEMS_COLABORADORES.map(crearItem),
            comentariosColaboradores: '',
            restaurantes: [
                crearRestaurante('Restaurante Balam', ITEMS_RESTAURANTE_STD),
                crearRestaurante('Coffee Corner by Balam', ITEMS_COFFEE_CORNER),
                crearRestaurante('Restaurante Chianti — Cena', ITEMS_RESTAURANTE_STD),
                crearRestaurante('Restaurante Umami — Cena', ITEMS_RESTAURANTE_STD),
                crearRestaurante('Tacos Villanos — Cena', ITEMS_TACOS),
                crearRestaurante('Restaurante Deck', ITEMS_RESTAURANTE_STD),
                crearRestaurante('Lobby Bar', ITEMS_BAR),
                crearRestaurante('Magic Bar', ITEMS_BAR),
            ],
            incidentes: '',
        };
        this.evidenciaPreviews = {};
        this.evidenciaFiles = {};
        this.evidenciaLabels = {
            'ah': [],
            'eq': [],
            'col': [],
            'inc': []
        };
        this.reporte.restaurantes.forEach((_, ri) => {
            this.evidenciaLabels['rest_' + ri] = [];
        });
    }

    iniciarReporte() {
        this.reporte.nombreEjecutivo = this.nombreEjecutivo;
        this.vista = 'formulario';
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        this.guardarProgresoInmediato();
    }

    toggleBienMal(item: ItemReporte, campo: 'bien' | 'mal') {
        if (campo === 'bien') {
            item.bien = item.bien ? null : true;
            item.mal = null;
        } else {
            item.mal = item.mal ? null : true;
            item.bien = null;
        }
        this.cdr.detectChanges();
        this.guardarProgreso();
    }

    async enviarReporte() {
        // Validación de campos obligatorios
        const noContestadosAH = this.reporte.areasHuespedes.filter(i => i.bien === null && i.mal === null);
        const noContestadosEQ = this.reporte.equipos.filter(i => i.bien === null && i.mal === null);
        const noContestadosCOL = this.reporte.areasColaboradores.filter(i => i.bien === null && i.mal === null);

        let noContestadosRest = 0;
        this.reporte.restaurantes.forEach(r => {
            if (!r.cerrado) {
                noContestadosRest += r.items.filter(i => i.bien === null && i.mal === null).length;
            }
        });

        if (noContestadosAH.length > 0 || noContestadosEQ.length > 0 || noContestadosCOL.length > 0 || noContestadosRest > 0) {
            this.errorEnvio = 'Todos los campos son obligatorios. Por favor, califique todos los elementos (Bien o Mal) antes de enviar.';
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            this.cdr.detectChanges();
            return;
        }

        // ── Validación de tamaño total de evidencias ─────────────────────────────
        // MongoDB tiene un límite estricto de 16 MB por documento.
        // Calculamos el tamaño aproximado de todas las imágenes en base64.
        const LIMITE_BYTES = 8 * 1024 * 1024; // 8 MB margen seguro
        let totalBytes = 0;
        Object.keys(this.evidenciaPreviews).forEach(key => {
            (this.evidenciaPreviews[key] || []).forEach(preview => {
                totalBytes += preview.length * 0.75; // base64 → bytes aproximado
            });
        });

        if (totalBytes > LIMITE_BYTES) {
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
            this.errorEnvio = `Las imágenes adjuntas pesan en total ~${totalMB} MB y superan el límite permitido (8 MB). Por favor elimina algunas fotos antes de enviar.`;
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            this.cdr.detectChanges();
            return;
        }
        // ─────────────────────────────────────────────────────────────────────────

        this.enviando = true;
        this.errorEnvio = '';
        try {
            const evidencias: Record<string, { preview: string; label: string }[]> = {};
            Object.keys(this.evidenciaPreviews).forEach(key => {
                const previews = this.evidenciaPreviews[key] || [];
                const labels = this.evidenciaLabels[key] || [];
                evidencias[key] = previews.map((preview, idx) => ({
                    preview,
                    label: labels[idx] || ''
                }));
            });
            this.reporte.evidencias = evidencias;

            await this.reporteService.crearReporte(this.reporte).toPromise();
            this.vista = 'enviado';
            await this.dbDraftService.clearDraft();
        } catch (err: any) {
            // Extraer el error real para facilitar el diagnóstico
            let mensajeError = 'Error desconocido';
            if (err?.status) {
                mensajeError = `Error ${err.status}`;
            }
            if (err?.error?.message) {
                mensajeError += ': ' + err.error.message;
            } else if (err?.message) {
                mensajeError += ': ' + err.message;
            } else if (typeof err?.error === 'string') {
                mensajeError += ': ' + err.error;
            }
            this.errorEnvio = `No se pudo enviar el reporte. ${mensajeError}`;
            console.error('Error enviando reporte de guardia:', err);
        } finally {
            this.enviando = false;
            this.cdr.detectChanges();
        }
    }


    nuevoReporte() {
        this.inicializarReporte();
        this.dbDraftService.clearDraft();
        this.seccionesAbiertas = new Set();
        this.vista = 'inicio';
    }

    /**
     * Comprime una imagen en un canvas con las dimensiones y calidad dadas.
     * Retorna el resultado en base64 JPEG.
     */
    private comprimirEnCanvas(imgElement: HTMLImageElement, maxWidth: number, quality: number): string {
        const canvas = document.createElement('canvas');
        let width = imgElement.width;
        let height = imgElement.height;

        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(imgElement, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', quality);
    }

    /**
     * Compresión ADAPTATIVA: intenta múltiples combinaciones de resolución y calidad
     * hasta que la imagen quede por debajo de MAX_BYTES_POR_IMAGEN.
     * Garantiza que 30+ fotos de teléfono nunca superen el límite de MongoDB (16 MB).
     */
    async comprimirImagenAdaptiva(file: File): Promise<string> {
        // Presupuesto máximo en caracteres base64 por imagen.
        // 200,000 chars base64 ≈ 150 KB de imagen real.
        // 30 imágenes × 150 KB = 4.5 MB << 16 MB límite MongoDB.
        const MAX_B64_CHARS = 200_000;

        // Escala de compresión de mayor a menor calidad
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
                    // Probar cada nivel hasta que la imagen quepa
                    for (const paso of pasos) {
                        const result = this.comprimirEnCanvas(img, paso.maxWidth, paso.quality);
                        if (result.length <= MAX_B64_CHARS) {
                            console.log(
                                `[Compresión] ${file.name}: ${paso.maxWidth}px q=${paso.quality} → ${(result.length / 1024).toFixed(1)} KB base64`
                            );
                            resolve(result);
                            return;
                        }
                    }
                    // Último recurso: mínima calidad absoluta
                    const fallback = this.comprimirEnCanvas(img, 300, 0.08);
                    console.warn(`[Compresión] ${file.name}: usando calidad mínima → ${(fallback.length / 1024).toFixed(1)} KB base64`);
                    resolve(fallback);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    async onEvidenciaSelected(event: Event, sectionKey: string) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        if (!this.evidenciaPreviews[sectionKey]) this.evidenciaPreviews[sectionKey] = [];
        if (!this.evidenciaFiles[sectionKey]) this.evidenciaFiles[sectionKey] = [];
        if (!this.evidenciaLabels[sectionKey]) this.evidenciaLabels[sectionKey] = [];
        const files = Array.from(input.files);

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            try {
                // Usar compresión adaptativa: garantiza ≤ 150KB por imagen
                const compressedBase64 = await this.comprimirImagenAdaptiva(file);
                this.evidenciaFiles[sectionKey].push(file);
                this.evidenciaLabels[sectionKey].push('');
                this.evidenciaPreviews[sectionKey].push(compressedBase64);
                this.cdr.detectChanges();
                this.guardarProgreso();
            } catch (error) {
                console.error('Error al comprimir la imagen:', error);
            }
        }
        input.value = '';
    }


    removeEvidencia(sectionKey: string, index: number) {
        this.evidenciaPreviews[sectionKey]?.splice(index, 1);
        this.evidenciaFiles[sectionKey]?.splice(index, 1);
        this.evidenciaLabels[sectionKey]?.splice(index, 1);
        this.cdr.detectChanges();
        this.guardarProgreso();
    }

    toggleSeccion(key: string) {
        if (this.seccionesAbiertas.has(key)) {
            this.seccionesAbiertas.delete(key);
        } else {
            this.seccionesAbiertas.clear();
            this.seccionesAbiertas.add(key);
            setTimeout(() => {
                const element = document.getElementById('sec-' + key);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
        this.cdr.detectChanges();
        this.guardarProgreso();
    }

    toggleCerradoRestaurante(rest: RestauranteReporte, key: string) {
        rest.cerrado = !rest.cerrado;
        if (rest.cerrado) {
            // Colapsar la sección si estaba abierta
            this.seccionesAbiertas.delete(key);
            // Resetear las calificaciones de sus items
            rest.items.forEach(item => {
                item.bien = null;
                item.mal = null;
                item.observaciones = '';
            });
            // Limpiar también evidencias
            this.evidenciaPreviews[key] = [];
            this.evidenciaFiles[key] = [];
            this.evidenciaLabels[key] = [];
        }
        this.cdr.detectChanges();
        this.guardarProgreso();
    }

    contarRespondidos(items: ItemReporte[]): number {
        return items.filter(i => i.bien !== null || i.mal !== null).length;
    }
}
