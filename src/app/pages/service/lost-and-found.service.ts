import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface LostAndFoundRecord {
    id?: string;
    _id?: string;
    // Parte 1
    nombreEntrega: string;
    departamento: string;
    seEncontroEn: string;
    fechaEncontrado: string;
    horaEncontrado: string;
    descripcionEncontrado: string;
    esDeValor: boolean;
    agenteSeguridad: string;
    nombreRecibe?: string;
    firmaEntrega?: string;

    // Parte 2
    entregado: boolean;
    nombreReclama?: string;
    habitacionReclama?: string;
    fechaReclama?: string;
    horaReclama?: string;
    descripcionReclama?: string;
    firmaReclama?: string;
    fotos?: string[];
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LostAndFoundService {
    private apiUrl = `${API_BASE_URL}/api/lost-and-found`;

    private recordsSubject = new BehaviorSubject<LostAndFoundRecord[]>([]);

    constructor(private http: HttpClient) {
        this.loadRecords();
    }

    private loadRecords() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id?.toString() || r.id }));
                this.recordsSubject.next(mapped);
            },
            error: (err) => console.error('Error loading lost and found records', err)
        });
    }

    getRecords(): Observable<LostAndFoundRecord[]> {
        return this.recordsSubject.asObservable();
    }

    refresh(): void {
        this.loadRecords();
    }

    create(record: Omit<LostAndFoundRecord, 'id' | '_id'>): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.apiUrl, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error creating lost and found record', err);
                    observer.error(err);
                }
            });
        });
    }

    update(id: string, record: Partial<LostAndFoundRecord>): Observable<any> {
        return new Observable(observer => {
            this.http.put(`${this.apiUrl}/${id}`, record).subscribe({
                next: (res) => {
                    this.loadRecords();
                    observer.next(res);
                    observer.complete();
                },
                error: (err) => {
                    console.error('Error updating lost and found record', err);
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
                    console.error('Error deleting lost and found record', err);
                    observer.error(err);
                }
            });
        });
    }
}
