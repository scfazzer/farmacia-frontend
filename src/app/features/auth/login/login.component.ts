import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading  = signal(false);
  error    = signal('');
  showPass = signal(false);

  constructor(
    private fb:      FormBuilder,
    private auth:    AuthService,
    private router:  Router
  ) {
    // Si ya está autenticado, redirigir al dashboard
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set('Usuario o contraseña incorrectos.');
        } else {
          this.error.set('No se pudo conectar con el servidor.');
        }
      }
    });
  }
}
