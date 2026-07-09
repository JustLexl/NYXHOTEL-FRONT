import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface ItemReporte {
    descripcion: string;
    bien: boolean | null;
    mal: boolean | null;
    observaciones: string;
}

export interface RestauranteReporte {
    nombre: string;
    items: ItemReporte[];
    comentarios: string;
    cerrado?: boolean;
}

export interface EvidenciaImagen {
    preview: string;
    label: string;
}

export interface ReporteGuardia {
    _id?: string;
    fecha: string;
    nombreEjecutivo: string;
    areasHuespedes: ItemReporte[];
    comentariosAreasHuespedes: string;
    equipos: ItemReporte[];
    comentariosEquipos: string;
    areasColaboradores: ItemReporte[];
    comentariosColaboradores: string;
    restaurantes: RestauranteReporte[];
    incidentes: string;
    firmaEjecutivo?: string;
    creadoEn?: string;
    createdAt?: string;
    evidencias?: Record<string, EvidenciaImagen[]>;
}

@Injectable({ providedIn: 'root' })
export class ReporteGuardiaService {
    private apiUrl = `${API_BASE_URL}/api/reporte-guardia`;

    constructor(private http: HttpClient) {}

    getReportes(): Observable<ReporteGuardia[]> {
        return this.http.get<ReporteGuardia[]>(this.apiUrl);
    }

    getReporte(id: string): Observable<ReporteGuardia> {
        return this.http.get<ReporteGuardia>(`${this.apiUrl}/${id}`);
    }

    crearReporte(reporte: ReporteGuardia): Observable<ReporteGuardia> {
        return this.http.post<ReporteGuardia>(this.apiUrl, reporte);
    }

    actualizarReporte(id: string, reporte: Partial<ReporteGuardia>): Observable<ReporteGuardia> {
        return this.http.put<ReporteGuardia>(`${this.apiUrl}/${id}`, reporte);
    }

    eliminarReporte(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
