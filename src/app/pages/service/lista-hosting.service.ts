import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ListaHosting {
    _id?: string;
    name: string;
    clientId: string;
    domain: string;

    provider: string;
    account: string;
    startDate: Date | string | null;
    expiryDate?: Date | string | null;
    status: string;
    providerContacted?: boolean;
    renewalConfirmed?: boolean;
    renewalHistory?: any[];
    createdAt?: string;
    updatedAt?: string;
}

import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class ListaHostingService {
    private apiUrl = `${API_BASE_URL}/api/listahostings`;
    constructor(private http: HttpClient) { }

    getHostings(): Observable<ListaHosting[]> {
        return this.http.get<ListaHosting[]>(this.apiUrl);
    }

    createHosting(hosting: ListaHosting): Observable<any> {
        return this.http.post(this.apiUrl, hosting, { responseType: 'text' });
    }

    updateHosting(id: string, hosting: ListaHosting): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, hosting, { responseType: 'text' });
    }

    deleteHosting(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
