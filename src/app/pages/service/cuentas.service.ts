import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface Cuenta {
    _id?: string;
    nombre?: string;
    departamento?: string;
    puesto?: string;
    tipoCuenta?: string;
    correo?: string;
    contrasena?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CuentasService {
    private apiUrl = `${API_BASE_URL}/api/cuentas`;

    constructor(private http: HttpClient) { }

    createCuenta(cuenta: Cuenta): Observable<any> {
        return this.http.post(this.apiUrl, cuenta);
    }

    getCuentas(): Observable<Cuenta[]> {
        return this.http.get<Cuenta[]>(this.apiUrl);
    }

    getCuenta(id: string): Observable<Cuenta> {
        return this.http.get<Cuenta>(`${this.apiUrl}/${id}`);
    }

    updateCuenta(id: string, cuenta: Cuenta): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, cuenta);
    }

    deleteCuenta(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
