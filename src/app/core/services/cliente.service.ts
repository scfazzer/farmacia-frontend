import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClienteResponse {
  id: number; nombre: string; dni: string; telefono: string;
  email: string; direccion: string; fechaNacimiento: string; activo: boolean;
}
export interface ClienteRequest {
  nombre: string; dni: string; telefono: string;
  email: string; direccion: string; fechaNacimiento: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private url = `${environment.apiUrl}/clientes`;
  constructor(private http: HttpClient) {}
  listar(): Observable<ClienteResponse[]> { return this.http.get<ClienteResponse[]>(this.url); }
  buscar(nombre: string): Observable<ClienteResponse[]> { return this.http.get<ClienteResponse[]>(`${this.url}/buscar`, { params: { nombre } }); }
  buscarPorDni(dni: string): Observable<ClienteResponse> { return this.http.get<ClienteResponse>(`${this.url}/dni/${dni}`); }
  crear(req: ClienteRequest): Observable<ClienteResponse> { return this.http.post<ClienteResponse>(this.url, req); }
  actualizar(id: number, req: ClienteRequest): Observable<ClienteResponse> { return this.http.put<ClienteResponse>(`${this.url}/${id}`, req); }
  cambiarEstado(id: number, activo: boolean): Observable<ClienteResponse> {
    return this.http.patch<ClienteResponse>(`${this.url}/${id}/estado`, null, { params: { activo } });
  }
}
