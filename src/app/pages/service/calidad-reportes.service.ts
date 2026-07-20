import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface CalidadItem {
    nombre: string;
    estado: 'Bien' | 'Mal' | 'No aplica' | '';
    observaciones: string;
}

export interface CalidadSeccion {
    nombre: string;
    items: CalidadItem[];
    imagenes?: { preview: string; criterio: string }[];
    activa?: boolean; // para secciones opcionales como Terraza/Balcón
}

export interface CalidadReporte {
    id?: string;
    _id?: string;
    fecha: string;
    tipo: 'habitacion' | 'spa';
    numero: string; // Número de habitación / Cabina
    puntuacion: number; // Porcentaje de 'Bien'
    inspector: string;
    secciones: CalidadSeccion[];
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalidadReportesService {
    private apiUrl = `${API_BASE_URL}/api/calidad`;

    private recordsSubject = new BehaviorSubject<CalidadReporte[]>([]);

    constructor(private http: HttpClient) {
        this.loadRecords();
    }

    private loadRecords() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id?.toString() || r.id }));
                this.recordsSubject.next(mapped);
            },
            error: (err) => console.error('Error loading calidad reports', err)
        });
    }

    getRecords(): Observable<CalidadReporte[]> {
        return this.recordsSubject.asObservable();
    }

    refresh(): void {
        this.loadRecords();
    }

    create(record: Omit<CalidadReporte, 'id' | '_id'>): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.apiUrl, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error creating calidad report', err);
                    observer.error(err);
                }
            });
        });
    }

    update(id: string, record: Partial<CalidadReporte>): Observable<any> {
        return new Observable(observer => {
            this.http.put(`${this.apiUrl}/${id}`, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error updating calidad report', err);
                    observer.error(err);
                }
            });
        });
    }

    delete(id: string): Observable<any> {
        return new Observable(observer => {
            this.http.delete(`${this.apiUrl}/${id}`).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error deleting calidad report', err);
                    observer.error(err);
                }
            });
        });
    }
}
