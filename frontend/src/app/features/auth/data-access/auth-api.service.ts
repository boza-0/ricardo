import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthCredentials, LoginResponse, RegisterResponse } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) { }

  login(credentials: AuthCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: AuthCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, credentials);
  }
}
