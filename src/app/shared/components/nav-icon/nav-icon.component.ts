import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export type NavIconName = "home" | "pill" | "users" | "cart" | "box" | "truck" | "shield" | "collapse";

/**
 * Icono SVG monocromo para la navegación principal.
 * Reemplaza el uso de emojis para mantener consistencia visual
 * entre plataformas y densidades de pantalla.
 */
@Component({
  selector: "app-nav-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
      @switch (name()) {
        @case ("home") {
          <path d="M10 2.5a1 1 0 01.6.2l7 5.25a1 1 0 01.4.8V16a1.5 1.5 0 01-1.5 1.5h-3.25a.75.75 0 01-.75-.75V13a1.5 1.5 0 00-1.5-1.5h-2a1.5 1.5 0 00-1.5 1.5v3.75a.75.75 0 01-.75.75H3.5A1.5 1.5 0 012 16V8.75a1 1 0 01.4-.8l7-5.25a1 1 0 01.6-.2z"/>
        }
        @case ("pill") {
          <path fill-rule="evenodd" d="M11.47 2.47a4.5 4.5 0 016.364 6.364l-8.5 8.5a4.5 4.5 0 01-6.364-6.364l8.5-8.5zm-4.146 4.647l4-4a3 3 0 014.415 4.062l-.086.09-2 2-4.5-4.5 2-2-3.829 3.348v1zm-1.06 1.06l4.5 4.5-3.44 3.44a3 3 0 01-4.243-4.243l3.182-3.697z" clip-rule="evenodd"/>
        }
        @case ("users") {
          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.078-.226.124-.464.13-.712a7.487 7.487 0 00-1.813-4.87 4.5 4.5 0 015.63 1.774.75.75 0 01-.19.98A6.483 6.483 0 0114.5 16z"/>
        }
        @case ("cart") {
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        }
        @case ("box") {
          <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3H9v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd"/>
        }
        @case ("truck") {
          <path d="M8 4a1 1 0 00-1 1v9a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h1.1a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-3.586a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0015.586 6H14V5a1 1 0 00-1-1H8zM3 6a1 1 0 000 2h3a1 1 0 100-2H3zM2 10a1 1 0 011-1h4a1 1 0 110 2H3a1 1 0 01-1-1zM3 13a1 1 0 100 2h2a1 1 0 100-2H3z"/>
          <circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>
        }
        @case ("shield") {
          <path fill-rule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75zm4.196 5.954a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 9.963a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l3.75-5.25z" clip-rule="evenodd"/>
        }
        @case ("collapse") {
          <path fill-rule="evenodd" d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h1.5a1 1 0 001-1V4a1 1 0 00-1-1H4zm7.03 1.97a.75.75 0 010 1.06L9.06 8H16a.75.75 0 010 1.5H9.06l1.97 1.97a.75.75 0 11-1.06 1.06l-3.25-3.25a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" clip-rule="evenodd"/>
        }
      }
    </svg>
  `
})
export class NavIconComponent {
  name = input.required<NavIconName>();
}
