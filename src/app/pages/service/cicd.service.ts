import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CiCd {
    _id?: string;
    name: string;
    area: string;
    client: string;
    clientId?: string;
    startDate?: Date | string;
    deliveryDate?: Date | string;
    cicdHours: number;
    status: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class CiCdService {

    private apiUrl = `${API_BASE_URL}/api/cicd`;
    constructor(private http: HttpClient) { }

    createCiCd(cicd: CiCd): Observable<any> {
        return this.http.post(this.apiUrl, cicd, { responseType: 'text' });
    }
    getCiCds(): Observable<CiCd[]> {
        return this.http.get<CiCd[]>(this.apiUrl);
    }

    getCiCd(id: string): Observable<CiCd> {
        return this.http.get<CiCd>(`${this.apiUrl}/${id}`);
    }
    updateCiCd(id: string, cicd: CiCd): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, cicd, { responseType: 'text' });
    }
    deleteCiCd(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
