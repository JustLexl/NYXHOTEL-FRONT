import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@/app/api-config';

export interface AlcoholimetroRecord {
    id: string;
    fecha: string;
    nombre: string;
    observaciones: string;
    departamento: string;
    destacado?: boolean;
}

export interface AccidenteRecord {
    id: string;
    fecha: string;
    nombreHuesped: string;
    habitacion: string;
    lugar: string;
    descripcion: string;
    acciones: string;
    reportadoPor: string;
    tipoAtencion: string;
}

export interface AccidenteColaboradorRecord {
    id: string;
    fecha: string;
    nombreColaborador: string;
    areaColaborador: string;
    observaciones: string;
}

export type ExtraviosCategoria = 'HABITACIONES' | 'AREAS_COMUNES';
export type ExtraviosEstado = 'ENCONTRADO' | 'NO_ENCONTRADO' | 'PENDIENTE';

export interface ExtravioRecord {
    id: string;
    fecha: string;
    habitacion: string;
    nombreHuesped: string;
    observaciones: string;
    categoria: ExtraviosCategoria;
    estado: ExtraviosEstado;
}

@Injectable({
    providedIn: 'root'
})
export class SeguridadService {
    private apiUrl = `${API_BASE_URL}/api/seguridad`;

    private alcoholimetroSubject = new BehaviorSubject<AlcoholimetroRecord[]>([]);
    private accidenteSubject = new BehaviorSubject<AccidenteRecord[]>([]);
    private accidenteColaboradorSubject = new BehaviorSubject<AccidenteColaboradorRecord[]>([]);
    private extravioSubject = new BehaviorSubject<ExtravioRecord[]>([]);

    constructor(private http: HttpClient) {
        this.loadInitialData();
    }

    private loadInitialData() {
        this.loadAlcoholimetroRecords();
        this.loadAccidenteRecords();
        this.loadAccidenteColaboradorRecords();
        this.loadExtravioRecords();
    }

    private loadAlcoholimetroRecords() {
        this.http.get<any[]>(`${this.apiUrl}/alcoholimetro`).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id }));
                this.alcoholimetroSubject.next(mapped);
            },
            error: (err) => console.error('Error loading alcoholimetro records', err)
        });
    }

    private loadAccidenteRecords() {
        this.http.get<any[]>(`${this.apiUrl}/accidente`).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id }));
                this.accidenteSubject.next(mapped);
            },
            error: (err) => console.error('Error loading accidente records', err)
        });
    }

    private loadAccidenteColaboradorRecords() {
        this.http.get<any[]>(`${this.apiUrl}/accidente-colaborador`).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id }));
                this.accidenteColaboradorSubject.next(mapped);
            },
            error: (err) => console.error('Error loading accidente colaborador records', err)
        });
    }

    private loadExtravioRecords() {
        this.http.get<any[]>(`${this.apiUrl}/extravio`).subscribe({
            next: (records) => {
                const mapped = records.map(r => ({ ...r, id: r._id }));
                this.extravioSubject.next(mapped);
            },
            error: (err) => console.error('Error loading extravio records', err)
        });
    }

    // Alcoholimetro
    getAlcoholimetroRecords(): Observable<AlcoholimetroRecord[]> {
        return this.alcoholimetroSubject.asObservable();
    }

    addAlcoholimetroRecord(record: Omit<AlcoholimetroRecord, 'id'>): void {
        this.http.post(`${this.apiUrl}/alcoholimetro`, record).subscribe({
            next: () => this.loadAlcoholimetroRecords(),
            error: (err) => console.error('Error adding alcoholimetro record', err)
        });
    }

    updateAlcoholimetroRecord(id: string, record: Partial<AlcoholimetroRecord>): void {
        this.http.put(`${this.apiUrl}/alcoholimetro/${id}`, record).subscribe({
            next: () => this.loadAlcoholimetroRecords(),
            error: (err) => console.error('Error updating alcoholimetro record', err)
        });
    }

    deleteAlcoholimetroRecord(id: string): void {
        this.http.delete(`${this.apiUrl}/alcoholimetro/${id}`).subscribe({
            next: () => this.loadAlcoholimetroRecords(),
            error: (err) => console.error('Error deleting alcoholimetro record', err)
        });
    }

    // Accidentes
    getAccidenteRecords(): Observable<AccidenteRecord[]> {
        return this.accidenteSubject.asObservable();
    }

    addAccidenteRecord(record: Omit<AccidenteRecord, 'id'>): void {
        this.http.post(`${this.apiUrl}/accidente`, record).subscribe({
            next: () => this.loadAccidenteRecords(),
            error: (err) => console.error('Error adding accidente record', err)
        });
    }

    updateAccidenteRecord(id: string, record: Partial<AccidenteRecord>): void {
        this.http.put(`${this.apiUrl}/accidente/${id}`, record).subscribe({
            next: () => this.loadAccidenteRecords(),
            error: (err) => console.error('Error updating accidente record', err)
        });
    }

    deleteAccidenteRecord(id: string): void {
        this.http.delete(`${this.apiUrl}/accidente/${id}`).subscribe({
            next: () => this.loadAccidenteRecords(),
            error: (err) => console.error('Error deleting accidente record', err)
        });
    }

    // Accidentes de colaboradores
    getAccidenteColaboradorRecords(): Observable<AccidenteColaboradorRecord[]> {
        return this.accidenteColaboradorSubject.asObservable();
    }

    addAccidenteColaboradorRecord(record: Omit<AccidenteColaboradorRecord, 'id'>): void {
        this.http.post(`${this.apiUrl}/accidente-colaborador`, record).subscribe({
            next: () => this.loadAccidenteColaboradorRecords(),
            error: (err) => console.error('Error adding accidente colaborador record', err)
        });
    }

    updateAccidenteColaboradorRecord(id: string, record: Partial<AccidenteColaboradorRecord>): void {
        this.http.put(`${this.apiUrl}/accidente-colaborador/${id}`, record).subscribe({
            next: () => this.loadAccidenteColaboradorRecords(),
            error: (err) => console.error('Error updating accidente colaborador record', err)
        });
    }

    deleteAccidenteColaboradorRecord(id: string): void {
        this.http.delete(`${this.apiUrl}/accidente-colaborador/${id}`).subscribe({
            next: () => this.loadAccidenteColaboradorRecords(),
            error: (err) => console.error('Error deleting accidente colaborador record', err)
        });
    }

    // Extravios
    getExtravioRecords(): Observable<ExtravioRecord[]> {
        return this.extravioSubject.asObservable();
    }

    addExtravioRecord(record: Omit<ExtravioRecord, 'id'>): void {
        this.http.post(`${this.apiUrl}/extravio`, record).subscribe({
            next: () => this.loadExtravioRecords(),
            error: (err) => console.error('Error adding extravio record', err)
        });
    }

    updateExtravioRecord(id: string, record: Partial<ExtravioRecord>): void {
        this.http.put(`${this.apiUrl}/extravio/${id}`, record).subscribe({
            next: () => this.loadExtravioRecords(),
            error: (err) => console.error('Error updating extravio record', err)
        });
    }

    deleteExtravioRecord(id: string): void {
        this.http.delete(`${this.apiUrl}/extravio/${id}`).subscribe({
            next: () => this.loadExtravioRecords(),
            error: (err) => console.error('Error deleting extravio record', err)
        });
    }
}
