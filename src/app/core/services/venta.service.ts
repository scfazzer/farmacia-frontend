import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DetalleVentaResponse {
  id: number; medicamentoId: number; medicamentoNombre: string;
  medicamentoPresentacion: string; cantidad: number;
  precioUnitario: number; subtotal: number;
}
export interface VentaResponse {
  id: number; clienteId: number; clienteNombre: string; clienteDni: string;
  totalVenta: number; estado: string; observacion: string;
  usuarioId: number; usuarioNombre: string; fechaVenta: string;
  detalles: DetalleVentaResponse[];
}
export interface VentaRequest {
  clienteId?: number; observacion?: string;
  detalles: { medicamentoId: number; cantidad: number; }[];
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  private url = `${environment.apiUrl}/ventas`;
  constructor(private http: HttpClient) {}
  listar(): Observable<VentaResponse[]> { return this.http.get<VentaResponse[]>(this.url); }
  obtener(id: number): Observable<VentaResponse> { return this.http.get<VentaResponse>(`${this.url}/${id}`); }
  registrar(req: VentaRequest): Observable<VentaResponse> { return this.http.post<VentaResponse>(this.url, req); }
  anular(id: number): Observable<VentaResponse> { return this.http.patch<VentaResponse>(`${this.url}/${id}/anular`, {}); }
}
