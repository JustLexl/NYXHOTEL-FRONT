import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface InventarioItem {
    _id?: string;
    departamento?: string;
    puesto?: string;
    nombreEquipo?: string;
    equipo?: string;
    marcaModelo?: string;
    numeroSerie?: string;
    memoria?: string;
    versionSO?: string;
    comentarios?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class InventarioService {
    private apiUrl = `${API_BASE_URL}/api/inventario`;

    constructor(private http: HttpClient) { }

    createItem(item: InventarioItem): Observable<any> {
        return this.http.post(this.apiUrl, item);
    }

    getItems(): Observable<InventarioItem[]> {
        return this.http.get<InventarioItem[]>(this.apiUrl);
    }

    getItem(id: string): Observable<InventarioItem> {
        return this.http.get<InventarioItem>(`${this.apiUrl}/${id}`);
    }

    updateItem(id: string, item: InventarioItem): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, item);
    }

    deleteItem(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
