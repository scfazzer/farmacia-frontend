import { Component, OnInit, signal } from "@angular/core";
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { DashboardService } from "../../core/services/dashboard.service";
import { AuthService } from "../../core/services/auth.service";
import { DashboardData, MedicamentoResponse } from "../../core/models/dashboard.model";
import { NavIconComponent } from "../../shared/components/nav-icon/nav-icon.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, DecimalPipe, NavIconComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  data      = signal<DashboardData | null>(null);
  stockBajo = signal<MedicamentoResponse[]>([]);
  porVencer = signal<MedicamentoResponse[]>([]);
  loading   = signal(true);
  error     = signal("");
  today     = new Date();

  constructor(private dashSvc: DashboardService, readonly auth: AuthService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading.set(true);
    this.dashSvc.getResumen().subscribe({
      next: r => { this.data.set(r); this.loading.set(false); },
      error: () => { this.error.set("No se pudo cargar el dashboard."); this.loading.set(false); }
    });
    this.dashSvc.getStockBajo().subscribe({ next: l => this.stockBajo.set(l.slice(0, 6)) });
    this.dashSvc.getPorVencer(60).subscribe({ next: l => this.porVencer.set(l.slice(0, 6)) });
  }

  diasParaVencer(fecha: string): number {
    return Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
  }
  urgenciaBadge(dias: number): string {
    if (dias <= 7) return "badge-danger"; if (dias <= 30) return "badge-warning"; return "badge-info";
  }
  stockPct(med: MedicamentoResponse): number {
    if (!med.stockMinimo) return 100;
    return Math.min(100, Math.round((med.stock / (med.stockMinimo * 4)) * 100));
  }
  stockClass(med: MedicamentoResponse): string {
    const p = this.stockPct(med); return p <= 25 ? 'danger' : p <= 50 ? 'warn' : 'ok';
  }
}
