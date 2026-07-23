import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface HallazgoItem {
    id?: string;
    no?: number;
    hallazgo: string;
    area: string;
    responsable: string;
    evidencia?: string;
    realizado?: boolean;
    estatus?: 'NO_REALIZADO' | 'EN_PROCESO' | 'REALIZADO';
    planAccion?: string;
}

export type SeccionDistintivoH = 'AYB' | 'COCINA' | 'MANTENIMIENTO' | 'ALMACEN' | 'AMA_DE_LLAVES';

export interface DistintivoHRecord {
    id?: string;
    _id?: string;
    seccion?: SeccionDistintivoH;
    fecha: string;
    mesAuditoria?: string;
    responsableDepto?: string;
    auditor?: string;
    titulo?: string;
    hallazgos: HallazgoItem[];
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DistintivoHService {
    private apiUrl = `${API_BASE_URL}/api/distintivo-h`;

    private recordsSubject = new BehaviorSubject<DistintivoHRecord[]>([]);

    constructor(private http: HttpClient) {
        this.loadRecords();
    }

    private loadRecords() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({
                    ...r,
                    id: r._id?.toString() || r.id,
                    seccion: r.seccion || 'AYB'
                }));
                this.recordsSubject.next(mapped);
            },
            error: (err) => console.error('Error loading Distintivo H records', err)
        });
    }

    getRecords(): Observable<DistintivoHRecord[]> {
        return this.recordsSubject.asObservable();
    }

    refresh(): void {
        this.loadRecords();
    }

    create(record: Omit<DistintivoHRecord, 'id' | '_id'>): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.apiUrl, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error creating Distintivo H record', err);
                    observer.error(err);
                }
            });
        });
    }

    update(id: string, record: Partial<DistintivoHRecord>): Observable<any> {
        return new Observable(observer => {
            this.http.put(`${this.apiUrl}/${id}`, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error updating Distintivo H record', err);
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
                    console.error('Error deleting Distintivo H record', err);
                    observer.error(err);
                }
            });
        });
    }
}
