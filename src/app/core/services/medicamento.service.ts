import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MedicamentoResponse {
  id: number; nombre: string; principioActivo: string;
  presentacion: string; concentracion: string;
  precioVenta: number; precioCompra: number;
  stock: number; stockMinimo: number; stockBajo: boolean;
  fechaVencimiento: string; requiereReceta: boolean; activo: boolean;
  categoriaId: number; categoriaNombre: string;
  proveedorId: number; proveedorNombre: string;
}

export interface PageResponse<T> {
  contenido: T[]; paginaActual: number; totalPaginas: number;
  totalElementos: number; tamanioPagina: number; esUltimaPagina: boolean;
}

export interface MedicamentoRequest {
  nombre: string; principioActivo: string; presentacion: string;
  concentracion: string; precioVenta: number; precioCompra: number;
  stock: number; stockMinimo: number; fechaVencimiento: string;
  requiereReceta: boolean; categoriaId: number; proveedorId: number;
}

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private url = `${environment.apiUrl}/medicamentos`;
  constructor(private http: HttpClient) {}

  listar(pagina = 0, tamanio = 10): Observable<PageResponse<MedicamentoResponse>> {
    const p = new HttpParams().set('pagina', pagina).set('tamanio', tamanio);
    return this.http.get<PageResponse<MedicamentoResponse>>(this.url, { params: p });
  }
  buscar(q: string, pagina = 0, tamanio = 10): Observable<PageResponse<MedicamentoResponse>> {
    const p = new HttpParams().set('q', q).set('pagina', pagina).set('tamanio', tamanio);
    return this.http.get<PageResponse<MedicamentoResponse>>(`${this.url}/buscar`, { params: p });
  }
  stockBajo(): Observable<MedicamentoResponse[]> { return this.http.get<MedicamentoResponse[]>(`${this.url}/stock-bajo`); }
  porVencer(dias = 30): Observable<MedicamentoResponse[]> {
    return this.http.get<MedicamentoResponse[]>(`${this.url}/por-vencer`, { params: { dias } });
  }
  crear(req: MedicamentoRequest): Observable<MedicamentoResponse> { return this.http.post<MedicamentoResponse>(this.url, req); }
  actualizar(id: number, req: MedicamentoRequest): Observable<MedicamentoResponse> { return this.http.put<MedicamentoResponse>(`${this.url}/${id}`, req); }
  desactivar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
