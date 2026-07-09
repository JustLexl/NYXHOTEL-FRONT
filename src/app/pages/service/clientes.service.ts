import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface clientes {
    _id?: string;
    idcliente?: number;
    clientName?: string;
    clientLastName?: string;
    fullName?: string; // Add this line
    phone?: string;
    registrationDate?: Date;
    email?: string;
    status?: string;
    isActive?: boolean;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private apiUrl = `${API_BASE_URL}/api/clientes`;
    constructor(private http: HttpClient) { }

    getClientes(): Observable<clientes[]> {
        return this.http.get<clientes[]>(this.apiUrl);
    }

    createCliente(cliente: clientes): Observable<any> {
        return this.http.post(this.apiUrl, cliente, { responseType: 'text' });
    }

    updateCliente(id: string, cliente: clientes): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, cliente, { responseType: 'text' });
    }

    deleteCliente(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
