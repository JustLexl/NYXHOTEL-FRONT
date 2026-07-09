import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
    _id?: string;
    projectName?: string;
    area?: string;
    client?: string;
    clientId?: string;
    startDate?: Date | string;
    deliveryDate?: Date | string;
    workStatus?: string;
    generalStatus?: string;
    developerInCharge?: string;
    developers?: any[]; // Array de objetos con _id, name, uid
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class ListaProyectosService {
    private apiUrl = `${API_BASE_URL}/api/listaproyectos`;

    constructor(private http: HttpClient) { }

    getProyectos(): Observable<Proyecto[]> {
        return this.http.get<Proyecto[]>(this.apiUrl);
    }

    createProyecto(proyecto: Proyecto): Observable<any> {
        return this.http.post(this.apiUrl, proyecto, { responseType: 'text' });
    }

    updateProyecto(id: string, proyecto: Proyecto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, proyecto, { responseType: 'text' });
    }

    deleteProyecto(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
