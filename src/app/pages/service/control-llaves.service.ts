import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface ControlLlavesRecord {
    id: string;
    tipo: 'ENTREGADA' | 'DEVUELTA';
    tipoLlave: 'MAGNETICA' | 'METALICA';
    entregadaId?: string;
    fecha: string;
    hora: string;
    colaborador: string;
    departamento: string;
    puesto: string;
    numeroLlave: string;
    numeroPiezas: number;
}

@Injectable({
    providedIn: 'root'
})
export class ControlLlavesService {
    private apiUrl = `${API_BASE_URL}/api/control-llaves`;

    private recordsSubject = new BehaviorSubject<ControlLlavesRecord[]>([]);

    constructor(private http: HttpClient) {
        this.loadRecords();
    }

    private loadRecords() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id?.toString() || r.id }));
                this.recordsSubject.next(mapped);
            },
            error: (err) => console.error('Error loading control llaves records', err)
        });
    }

    getRecords(): Observable<ControlLlavesRecord[]> {
        return this.recordsSubject.asObservable();
    }

    refresh(): void {
        this.loadRecords();
    }

    create(record: Omit<ControlLlavesRecord, 'id'>): void {
        this.http.post(this.apiUrl, record).subscribe({
            next: () => this.loadRecords(),
            error: (err) => console.error('Error creating control llaves record', err)
        });
    }

    update(id: string, record: Partial<ControlLlavesRecord>): void {
        this.http.put(`${this.apiUrl}/${id}`, record).subscribe({
            next: () => this.loadRecords(),
            error: (err) => console.error('Error updating control llaves record', err)
        });
    }

    delete(id: string): void {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
            next: () => this.loadRecords(),
            error: (err) => console.error('Error deleting control llaves record', err)
        });
    }
}
