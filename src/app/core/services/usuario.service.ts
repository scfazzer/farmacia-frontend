import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UsuarioResponse { id: number; username: string; nombreCompleto: string; rol: string; activo: boolean; }
export interface UsuarioRequest { username: string; password?: string; nombreCompleto: string; rol: string; }

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;
  constructor(private http: HttpClient) {}
  listar(): Observable<UsuarioResponse[]> { return this.http.get<UsuarioResponse[]>(this.url); }
  crear(req: UsuarioRequest): Observable<UsuarioResponse> { return this.http.post<UsuarioResponse>(this.url, req); }
  actualizar(id: number, req: UsuarioRequest): Observable<UsuarioResponse> { return this.http.put<UsuarioResponse>(`${this.url}/${id}`, req); }
  cambiarEstado(id: number, activo: boolean): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.url}/${id}/estado`, null, { params: { activo } });
  }
}
