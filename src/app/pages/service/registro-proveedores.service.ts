import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface RegistroProveedorRecord {
    id?: string;
    _id?: string;
    // Entrada
    fechaEntrada: string;
    horaEntrada: string;
    nombreProveedor: string;
    compania: string;
    numeroGafete: string;
    agenteSeguridad: string;
    destino: string;
    // Salida (automática)
    horaSalida?: string;
    fechaSalida?: string;
    // Meta
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RegistroProveedoresService {
    private apiUrl = `${API_BASE_URL}/api/registro-proveedores`;

    private recordsSubject = new BehaviorSubject<RegistroProveedorRecord[]>([]);

    constructor(private http: HttpClient) {
        this.loadRecords();
    }

    private loadRecords() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id?.toString() || r.id }));
                this.recordsSubject.next(mapped);
            },
            error: (err) => console.error('Error loading registro proveedores', err)
        });
    }

    getRecords(): Observable<RegistroProveedorRecord[]> {
        return this.recordsSubject.asObservable();
    }

    refresh(): void {
        this.loadRecords();
    }

    create(record: Omit<RegistroProveedorRecord, 'id' | '_id'>): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.apiUrl, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error creating registro proveedor', err);
                    observer.error(err);
                }
            });
        });
    }

    update(id: string, record: Partial<RegistroProveedorRecord>): Observable<any> {
        return new Observable(observer => {
            this.http.put(`${this.apiUrl}/${id}`, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error updating registro proveedor', err);
                    observer.error(err);
                }
            });
        });
    }

    registrarSalida(id: string): Observable<any> {
        return new Observable(observer => {
            this.http.put(`${this.apiUrl}/${id}/salida`, {}).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error registrando salida', err);
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
                    console.error('Error deleting registro proveedor', err);
                    observer.error(err);
                }
            });
        });
    }
}
