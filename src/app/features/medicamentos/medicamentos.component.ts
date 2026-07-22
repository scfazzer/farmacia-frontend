import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicamentoService, MedicamentoResponse, MedicamentoRequest } from '../../core/services/medicamento.service';
import { CategoriaService, CategoriaResponse } from '../../core/services/categoria.service';
import { ProveedorService, ProveedorResponse } from '../../core/services/proveedor.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NavIconComponent } from '../../shared/components/nav-icon/nav-icon.component';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe, NavIconComponent],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {
  items       = signal<MedicamentoResponse[]>([]);
  categorias  = signal<CategoriaResponse[]>([]);
  proveedores = signal<ProveedorResponse[]>([]);
  loading = signal(true); saving = signal(false);
  showModal = signal(false); showConfirm = signal(false);
  editingId = signal<number|null>(null); deletingId = signal<number|null>(null);
  error = signal(''); success = signal('');
  pagina = signal(0); total = signal(0); totalPag = signal(0);
  tamanio = 10; searchTerm = signal('');
  private search$ = new Subject<string>();
  form!: FormGroup;

  constructor(private svc: MedicamentoService, private catSvc: CategoriaService,
              private provSvc: ProveedorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      principioActivo: ['', Validators.required],
      presentacion: [''], concentracion: [''],
      precioVenta: [null, [Validators.required, Validators.min(0.01)]],
      precioCompra: [null, Validators.min(0)],
      stock: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [5, Validators.min(0)],
      fechaVencimiento: [''], requiereReceta: [false],
      categoriaId: [null, Validators.required],
      proveedorId: [null, Validators.required]
    });
    this.cargar();
    this.catSvc.listar().subscribe(c => this.categorias.set(c));
    this.provSvc.listar().subscribe(p => this.proveedores.set(p));
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(q => { this.pagina.set(0); this.cargar(q); });
  }

  cargar(q?: string): void {
    this.loading.set(true);
    const obs = q ? this.svc.buscar(q, this.pagina(), this.tamanio) : this.svc.listar(this.pagina(), this.tamanio);
    obs.subscribe({
      next: r => { this.items.set(r.contenido); this.total.set(r.totalElementos); this.totalPag.set(r.totalPaginas); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar.'); this.loading.set(false); }
    });
  }

  onSearch(e: Event): void { const v = (e.target as HTMLInputElement).value; this.searchTerm.set(v); this.search$.next(v); }
  openCreate(): void { this.editingId.set(null); this.form.reset({ stock: 0, stockMinimo: 5, requiereReceta: false }); this.error.set(''); this.showModal.set(true); }
  openEdit(m: MedicamentoResponse): void { this.editingId.set(m.id); this.form.patchValue({ ...m }); this.error.set(''); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const obs = this.editingId() ? this.svc.actualizar(this.editingId()!, this.form.value) : this.svc.crear(this.form.value);
    obs.subscribe({
      next: () => { this.saving.set(false); this.showModal.set(false); this.success.set('Guardado correctamente.'); this.cargar(this.searchTerm()); setTimeout(() => this.success.set(''), 3000); },
      error: (e) => { this.saving.set(false); this.error.set(e?.error?.mensaje || 'Error al guardar.'); }
    });
  }

  confirmDelete(id: number): void { this.deletingId.set(id); this.showConfirm.set(true); }
  cancelDelete(): void { this.showConfirm.set(false); }
  doDelete(): void {
    this.svc.desactivar(this.deletingId()!).subscribe({
      next: () => { this.showConfirm.set(false); this.success.set('Desactivado.'); this.cargar(this.searchTerm()); setTimeout(() => this.success.set(''), 3000); },
      error: () => this.error.set('No se pudo desactivar.')
    });
  }

  ir(p: number): void { if (p < 0 || p >= this.totalPag()) return; this.pagina.set(p); this.cargar(this.searchTerm()); }
  pages(): number[] { return Array.from({ length: Math.min(this.totalPag(), 7) }, (_, i) => i); }
  stockPct(m: MedicamentoResponse): number { if (!m.stockMinimo) return 100; return Math.min(100, Math.round((m.stock / (m.stockMinimo * 4)) * 100)); }
  stockClass(m: MedicamentoResponse): string { const p = this.stockPct(m); return p <= 25 ? 'danger' : p <= 50 ? 'warn' : 'ok'; }
  diasVencer(f: string): number { return Math.ceil((new Date(f).getTime() - Date.now()) / 86400000); }
  get f() { return this.form.controls; }
}
