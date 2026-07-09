import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    _id?: string;
    id?: number;
    name?: string;
    jobPosition?: string;
    jobArea?: string;
    role?: string;
    email?: string;
    phone?: number;
    firebaseUid?: string;
}


import { API_BASE_URL } from '@/app/api-config';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${API_BASE_URL}/api/user`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUserByFirebaseUid(uid: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/firebase/${uid}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}