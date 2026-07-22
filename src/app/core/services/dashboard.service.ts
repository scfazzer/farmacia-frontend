import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardData, MedicamentoResponse } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getResumen(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  getStockBajo(): Observable<MedicamentoResponse[]> {
    return this.http.get<MedicamentoResponse[]>(`${this.apiUrl}/medicamentos/stock-bajo`);
  }

  getPorVencer(dias: number = 30): Observable<MedicamentoResponse[]> {
    return this.http.get<MedicamentoResponse[]>(
      `${this.apiUrl}/medicamentos/por-vencer?dias=${dias}`
    );
  }
}
