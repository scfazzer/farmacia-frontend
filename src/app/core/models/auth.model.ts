export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  username: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'EMPLEADO';
  fechaEmision: string;
  fechaExpiracion: string;
}

export interface CurrentUser {
  username: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'EMPLEADO';
}
