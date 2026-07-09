import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroFaltante {
    _id?: string;
    developer: string;
    date: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class RegistrosFaltantesService {
    private apiUrl = `${API_BASE_URL}/api/registros-faltantes`;

    constructor(private http: HttpClient) { }

    getRegistros(): Observable<RegistroFaltante[]> {
        return this.http.get<RegistroFaltante[]>(this.apiUrl);
    }

    createRegistro(registro: RegistroFaltante): Observable<any> {
        return this.http.post<any>(this.apiUrl, registro);
    }

    deleteRegistro(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
