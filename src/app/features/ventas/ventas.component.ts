import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaService, VentaResponse, VentaRequest } from '../../core/services/venta.service';
import { MedicamentoService, MedicamentoResponse } from '../../core/services/medicamento.service';
import { ClienteService, ClienteResponse } from '../../core/services/cliente.service';
import { NavIconComponent } from '../../shared/components/nav-icon/nav-icon.component';
import { MedicamentoComboboxComponent } from '../../shared/components/medicamento-combobox/medicamento-combobox.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe, NavIconComponent, MedicamentoComboboxComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  items    = signal<VentaResponse[]>([]);
  filtered = signal<VentaResponse[]>([]);
  medicamentos = signal<MedicamentoResponse[]>([]);
  clientes = signal<ClienteResponse[]>([]);
  loading  = signal(true); saving = signal(false);
  showModal = signal(false); showDetalle = signal(false);
  ventaDetalle = signal<VentaResponse|null>(null);
  error = signal(''); success = signal('');
  searchQ = signal(''); filterEstado = signal('');
  form!: FormGroup;

  constructor(private svc: VentaService, private medSvc: MedicamentoService,
              private cliSvc: ClienteService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clienteId: [null],
      observacion: [''],
      detalles: this.fb.array([])
    });
    this.cargar();
    this.medSvc.listar(0, 100).subscribe(r => this.medicamentos.set(r.contenido.filter(m => m.activo && m.stock > 0)));
    this.cliSvc.listar().subscribe(r => this.clientes.set(r.filter(c => c.activo)));
  }

  get detallesArray(): FormArray { return this.form.get('detalles') as FormArray; }

  cargar(): void {
    this.loading.set(true);
    this.svc.listar().subscribe({
      next: r => { this.items.set(r); this.filter(); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar.'); this.loading.set(false); }
    });
  }

  filter(): void {
    let r = this.items();
    if (this.searchQ()) r = r.filter(v => (v.clienteNombre||'').toLowerCase().includes(this.searchQ().toLowerCase()) || v.id.toString().includes(this.searchQ()));
    if (this.filterEstado()) r = r.filter(v => v.estado === this.filterEstado());
    this.filtered.set(r);
  }

  onSearch(e: Event): void { this.searchQ.set((e.target as HTMLInputElement).value); this.filter(); }
  onFilterEstado(e: Event): void { this.filterEstado.set((e.target as HTMLSelectElement).value); this.filter(); }

  openCreate(): void {
    this.detallesArray.clear();
    this.form.reset();
    this.agregarDetalle();
    this.error.set('');
    this.showModal.set(true);
  }
  closeModal(): void { this.showModal.set(false); }

  agregarDetalle(): void {
    this.detallesArray.push(this.fb.group({
      medicamentoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }));
  }
  quitarDetalle(i: number): void { if (this.detallesArray.length > 1) this.detallesArray.removeAt(i); }

  totalCalculado(): number {
    return this.detallesArray.controls.reduce((sum, ctrl) => {
      const medId = ctrl.value.medicamentoId;
      const med = this.medicamentos().find(m => m.id == medId);
      return sum + (med ? med.precioVenta * (ctrl.value.cantidad || 0) : 0);
    }, 0);
  }

  getMedNombre(id: any): string {
    const m = this.medicamentos().find(x => x.id == id);
    return m ? `${m.nombre} (S/. ${m.precioVenta.toFixed(2)})` : '';
  }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const req: VentaRequest = {
      clienteId: this.form.value.clienteId || undefined,
      observacion: this.form.value.observacion,
      detalles: this.detallesArray.value
    };
    this.svc.registrar(req).subscribe({
      next: () => { this.saving.set(false); this.showModal.set(false); this.success.set('Venta registrada.'); this.cargar(); setTimeout(() => this.success.set(''), 3000); },
      error: (e) => { this.saving.set(false); this.error.set(e?.error?.mensaje || 'Error al registrar.'); }
    });
  }

  verDetalle(v: VentaResponse): void { this.ventaDetalle.set(v); this.showDetalle.set(true); }

  anular(id: number): void {
    if (!confirm('¿Anular esta venta?')) return;
    this.svc.anular(id).subscribe({ next: () => { this.success.set('Venta anulada.'); this.cargar(); setTimeout(() => this.success.set(''), 3000); } });
  }

  ventasHoy(): number { const h = new Date().toDateString(); return this.items().filter(v => new Date(v.fechaVenta).toDateString() === h && v.estado === 'COMPLETADA').length; }
  totalHoy(): number { const h = new Date().toDateString(); return this.items().filter(v => new Date(v.fechaVenta).toDateString() === h && v.estado === 'COMPLETADA').reduce((s,v) => s + v.totalVenta, 0); }
}
