import { Component, signal, HostListener, computed } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { NavIconComponent, NavIconName } from "../../shared/components/nav-icon/nav-icon.component";

interface NavItem {
  icon: NavIconName;
  label: string;
  route: string;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const SIDEBAR_STORAGE_KEY = "saludplus.sidebar.collapsed";

function readStoredCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavIconComponent],
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent {
  mobileMenuOpen = signal(false);

  // Colapsado en desktop (icon-rail). Persiste entre sesiones porque es una
  // preferencia de espacio de trabajo, no un estado de navegación transitorio.
  collapsed = signal(readStoredCollapsed());

  /**
   * Navegación agrupada por dominio funcional real, no como lista plana.
   * Un farmacéutico piensa en "lo que vendo/atiendo hoy" (Operación) vs.
   * "lo que mantengo en el tiempo" (Inventario) vs. "quién administra esto"
   * (Administración) — la agrupación sigue ese modelo mental, no el orden
   * de creación de las pantallas.
   */
  readonly navGroups: NavGroup[] = [
    {
      label: "Operación",
      items: [
        { icon: "home", label: "Dashboard", route: "/dashboard" },
        { icon: "cart", label: "Ventas", route: "/ventas" },
        { icon: "users", label: "Clientes", route: "/clientes" },
      ]
    },
    {
      label: "Inventario",
      items: [
        { icon: "pill", label: "Medicamentos", route: "/medicamentos" },
        { icon: "box", label: "Categorías", route: "/categorias" },
        { icon: "truck", label: "Proveedores", route: "/proveedores" },
      ]
    },
    {
      label: "Administración",
      items: [
        { icon: "shield", label: "Usuarios", route: "/usuarios", adminOnly: true },
      ]
    }
  ];

  constructor(readonly auth: AuthService) {}

  visibleGroups = computed(() => {
    const isAdmin = this.auth.isAdmin();
    return this.navGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly || isAdmin)
      }))
      .filter(group => group.items.length > 0);
  });

  // Lista plana usada por el menú móvil (sin agrupación: en pantallas
  // pequeñas priorizamos escaneo rápido sobre taxonomía).
  visibleNavFlat = computed(() => this.visibleGroups().flatMap(g => g.items));

  toggleCollapsed() {
    const next = !this.collapsed();
    this.collapsed.set(next);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    } catch {
      // localStorage no disponible (modo privado, SSR, etc.) — no es crítico.
    }
  }

  @HostListener("document:keydown.escape")
  closeMobile() { this.mobileMenuOpen.set(false); }
}
