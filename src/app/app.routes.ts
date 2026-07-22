import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'medicamentos', loadComponent: () => import('./features/medicamentos/medicamentos.component').then(m => m.MedicamentosComponent) },
      { path: 'clientes',     loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'ventas',       loadComponent: () => import('./features/ventas/ventas.component').then(m => m.VentasComponent) },
      { path: 'categorias',   loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent) },
      { path: 'proveedores',  loadComponent: () => import('./features/proveedores/proveedores.component').then(m => m.ProveedoresComponent) },
      { path: 'usuarios',     loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
