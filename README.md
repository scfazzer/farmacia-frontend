# 🏥 Farmacia SaludPlus — Frontend Angular

Sistema de gestión farmacéutica completo con Angular 17+.

## 🚀 Instalación y Ejecución

```bash
cd farmacia-angular
npm install
ng serve
```

Abrir **http://localhost:4200**

## 🔑 Credenciales de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `password` | ADMIN |
| `empleado1` | `password` | EMPLEADO |

> ⚠️ Las contraseñas BCrypt en el SQL son hash de `"password"`. Ajusta según tu backend.

## 📋 Módulos implementados

| Módulo | Funcionalidades |
|--------|----------------|
| **Login** | Autenticación JWT, validación, mostrar/ocultar contraseña |
| **Dashboard** | KPIs de ventas, alertas de stock bajo y vencimientos |
| **Medicamentos** | CRUD completo, paginación, búsqueda, filtros, barra de stock |
| **Clientes** | CRUD, búsqueda por nombre/DNI/email, toggle activo |
| **Ventas** | Registro con múltiples productos, cálculo automático, detalle, anulación |
| **Categorías** | CRUD con vista de tarjetas |
| **Proveedores** | CRUD en tabla con toggle de estado |
| **Usuarios** | CRUD (solo ADMIN), gestión de contraseñas |

## 🎨 Diseño

- **Estilo**: Moderno minimalista, blanco puro + acento verde
- **Tipografía**: Sora (títulos) + Outfit (cuerpo)
- **Layout**: Navbar horizontal sticky, responsive con menú hamburguesa en móvil
- **Angular 17+**: Standalone components, signals reactivos, control flow (@if, @for)

## 🔧 Backend requerido

Spring Boot en `http://localhost:8080`  
Ver proyecto `farmacia-salud-v2` para el backend.
