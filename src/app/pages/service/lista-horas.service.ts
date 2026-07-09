import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hora {
    _id?: string;
    developer?: string;
    projectName?: string;
    projectId?: { _id: string, name: string };
    area?: string;
    hoursWorked?: number;
    date?: Date | string;
    taskType?: string;
    createdAt?: string;
    updatedAt?: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class ListaHorasService {
    private apiUrl = `${API_BASE_URL}/api/listahoras`;

    constructor(private http: HttpClient) { }

    getHoras(): Observable<Hora[]> {
        return this.http.get<Hora[]>(this.apiUrl);
    }

    createHora(hora: Hora): Observable<Hora> {
        return this.http.post<Hora>(this.apiUrl, hora);
    }

    updateHora(id: string, hora: Hora): Observable<Hora> {
        return this.http.put<Hora>(`${this.apiUrl}/${id}`, hora);
    }

    deleteHora(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
