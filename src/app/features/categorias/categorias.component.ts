import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService, CategoriaResponse } from '../../core/services/categoria.service';
import { NavIconComponent } from '../../shared/components/nav-icon/nav-icon.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavIconComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  items   = signal<CategoriaResponse[]>([]);
  loading = signal(true); saving = signal(false);
  showModal = signal(false); editingId = signal<number|null>(null);
  error = signal(''); success = signal('');
  form!: FormGroup;

  constructor(private svc: CategoriaService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.maxLength(300)]
    });
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.svc.listar().subscribe({ next: r => { this.items.set(r); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  openCreate(): void { this.editingId.set(null); this.form.reset(); this.error.set(''); this.showModal.set(true); }
  openEdit(c: CategoriaResponse): void { this.editingId.set(c.id); this.form.patchValue(c); this.error.set(''); this.showModal.set(true); }
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
  get f() { return this.form.controls; }
}
