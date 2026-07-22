import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService, ClienteResponse, ClienteRequest } from '../../core/services/cliente.service';
import { NavIconComponent } from '../../shared/components/nav-icon/nav-icon.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, NavIconComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  items   = signal<ClienteResponse[]>([]);
  filtered = signal<ClienteResponse[]>([]);
  loading = signal(true); saving = signal(false);
  showModal = signal(false); showConfirm = signal(false);
  editingId = signal<number|null>(null); changingId = signal<number|null>(null);
  error = signal(''); success = signal('');
  searchQ = signal('');
  form!: FormGroup;

  constructor(private svc: ClienteService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: [''], email: ['', Validators.email],
      direccion: [''], fechaNacimiento: ['']
    });
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.svc.listar().subscribe({
      next: r => { this.items.set(r); this.filter(); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar.'); this.loading.set(false); }
    });
  }

  filter(): void {
    const q = this.searchQ().toLowerCase();
    if (!q) { this.filtered.set(this.items()); return; }
    this.filtered.set(this.items().filter(c =>
      c.nombre.toLowerCase().includes(q) || c.dni.includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    ));
  }

  onSearch(e: Event): void { this.searchQ.set((e.target as HTMLInputElement).value); this.filter(); }
  openCreate(): void { this.editingId.set(null); this.form.reset(); this.error.set(''); this.showModal.set(true); }
  openEdit(c: ClienteResponse): void { this.editingId.set(c.id); this.form.patchValue({...c}); this.error.set(''); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const obs = this.editingId() ? this.svc.actualizar(this.editingId()!, this.form.value) : this.svc.crear(this.form.value);
    obs.subscribe({
      next: () => { this.saving.set(false); this.showModal.set(false); this.success.set('Guardado.'); this.cargar(); setTimeout(() => this.success.set(''), 3000); },
      error: (e) => { this.saving.set(false); this.error.set(e?.error?.mensaje || 'Error.'); }
    });
  }

  toggleEstado(c: ClienteResponse): void {
    this.svc.cambiarEstado(c.id, !c.activo).subscribe({ next: () => this.cargar() });
  }
  get f() { return this.form.controls; }
}
