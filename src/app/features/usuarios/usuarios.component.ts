import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService, UsuarioResponse } from '../../core/services/usuario.service';
import { NavIconComponent } from '../../shared/components/nav-icon/nav-icon.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavIconComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  items   = signal<UsuarioResponse[]>([]);
  loading = signal(true); saving = signal(false);
  showModal = signal(false); editingId = signal<number|null>(null);
  showPass = signal(false);
  error = signal(''); success = signal('');
  form!: FormGroup;

  constructor(private svc: UsuarioService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      nombreCompleto: ['', Validators.required],
      rol: ['EMPLEADO', Validators.required]
    });
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.svc.listar().subscribe({ next: r => { this.items.set(r); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ rol: 'EMPLEADO' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.error.set(''); this.showModal.set(true);
  }

  openEdit(u: UsuarioResponse): void {
    this.editingId.set(u.id);
    this.form.patchValue(u);
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.setValue('');
    this.form.get('password')?.updateValueAndValidity();
    this.error.set(''); this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const val = {...this.form.value};
    if (!val.password) delete val.password;
    const obs = this.editingId() ? this.svc.actualizar(this.editingId()!, val) : this.svc.crear(val);
    obs.subscribe({
      next: () => { this.saving.set(false); this.showModal.set(false); this.success.set('Guardado.'); this.cargar(); setTimeout(() => this.success.set(''), 3000); },
      error: (e) => { this.saving.set(false); this.error.set(e?.error?.mensaje || 'Error.'); }
    });
  }

  toggleEstado(u: UsuarioResponse): void { this.svc.cambiarEstado(u.id, !u.activo).subscribe(() => this.cargar()); }
  get f() { return this.form.controls; }
}
