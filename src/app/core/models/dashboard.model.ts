export interface DashboardData {
  totalMedicamentos: number;
  medicamentosStockBajo: number;
  medicamentosProximosAVencer: number;
  totalClientes: number;
  ventasHoy: number;
  totalVentasHoy: number;
  ventasMes: number;
  totalVentasMes: number;
}

export interface MedicamentoResponse {
  id: number;
  nombre: string;
  principioActivo: string;
  presentacion: string;
  concentracion: string;
  precioVenta: number;
  precioCompra: number;
  stock: number;
  stockMinimo: number;
  stockBajo: boolean;
  fechaVencimiento: string;
  requiereReceta: boolean;
  activo: boolean;
  categoriaId: number;
  categoriaNombre: string;
  proveedorId: number;
  proveedorNombre: string;
}
