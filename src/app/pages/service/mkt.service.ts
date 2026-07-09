import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mkt {
    _idmkt?: string;
    name?: string;
    area?: string;
    clientId?: string;
    startDate?: Date | string | null;
    deliveryDate?: Date | string | null;
    mktHours?: number;
    status?: string;
    services?: string;
    description?: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class MktService {
    private apiUrl = `${API_BASE_URL}/api/mkt`;

    constructor(private http: HttpClient) { }

    getMkts(): Observable<Mkt[]> {
        return this.http.get<Mkt[]>(this.apiUrl);
    }

    createMkt(mkt: Mkt): Observable<Mkt> {
        return this.http.post<Mkt>(this.apiUrl, mkt);
    }

    updateMkt(id: string, mkt: Mkt): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, mkt, { responseType: 'text' });
    }

    deleteMkt(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
