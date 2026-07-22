import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoriaResponse { id: number; nombre: string; descripcion: string; }
export interface CategoriaRequest { nombre: string; descripcion: string; }

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = `${environment.apiUrl}/categorias`;
  constructor(private http: HttpClient) {}
  listar(): Observable<CategoriaResponse[]> { return this.http.get<CategoriaResponse[]>(this.url); }
  crear(req: CategoriaRequest): Observable<CategoriaResponse> { return this.http.post<CategoriaResponse>(this.url, req); }
  actualizar(id: number, req: CategoriaRequest): Observable<CategoriaResponse> { return this.http.put<CategoriaResponse>(`${this.url}/${id}`, req); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
