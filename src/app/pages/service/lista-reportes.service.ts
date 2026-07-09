import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ListaReportes {
    _id?: string;
    area: string;
    reportType: string;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    reportCreator: string;
    targetName?: string;
    targetStatus?: string;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class ListaReportesService {
    private apiUrl = `${API_BASE_URL}/api/listareportes`;

    constructor(private http: HttpClient) { }

    getReportes(): Observable<ListaReportes[]> {
        return this.http.get<ListaReportes[]>(this.apiUrl);
    }

    getReporteStats(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stats/${id}`);
    }

    createReporte(reporte: ListaReportes): Observable<ListaReportes> {
        return this.http.post<ListaReportes>(this.apiUrl, reporte);
    }

    updateReporte(id: string, reporte: ListaReportes): Observable<ListaReportes> {
        return this.http.put<ListaReportes>(`${this.apiUrl}/${id}`, reporte);
    }

    deleteReporte(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
