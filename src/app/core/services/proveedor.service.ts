import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProveedorResponse {
  id: number; nombre: string; ruc: string; direccion: string;
  telefono: string; email: string; activo: boolean;
}
export interface ProveedorRequest { nombre: string; ruc: string; direccion: string; telefono: string; email: string; }

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private url = `${environment.apiUrl}/proveedores`;
  constructor(private http: HttpClient) {}
  listar(): Observable<ProveedorResponse[]> { return this.http.get<ProveedorResponse[]>(this.url); }
  crear(req: ProveedorRequest): Observable<ProveedorResponse> { return this.http.post<ProveedorResponse>(this.url, req); }
  actualizar(id: number, req: ProveedorRequest): Observable<ProveedorResponse> { return this.http.put<ProveedorResponse>(`${this.url}/${id}`, req); }
  cambiarEstado(id: number, activo: boolean): Observable<ProveedorResponse> {
    return this.http.patch<ProveedorResponse>(`${this.url}/${id}/estado`, null, { params: { activo } });
  }
}
