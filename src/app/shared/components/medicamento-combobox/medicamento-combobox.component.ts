import {
  Component, ChangeDetectionStrategy, input, signal, computed,
  ElementRef, HostListener, forwardRef, viewChild
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MedicamentoResponse } from "../../../core/services/medicamento.service";

/**
 * Combobox de búsqueda para seleccionar un medicamento dentro del detalle
 * de una venta.
 *
 * Por qué existe: un <select> nativo con cientos de opciones concatenadas
 * en texto plano ("Paracetamol · S/. 5.00 (stock: 40)") es la peor
 * herramienta posible para la acción que un farmacéutico repite más veces
 * al día. Este componente resuelve exactamente ese punto de fricción:
 * escribir para filtrar, navegar con teclado, ver stock/precio/receta de
 * un vistazo antes de confirmar.
 *
 * Implementa ControlValueAccessor para integrarse de forma nativa con el
 * FormArray reactivo ya existente en VentasComponent — no cambia la forma
 * de los datos que el formulario produce (sigue siendo un `medicamentoId`
 * numérico), solo cambia cómo se elige.
 */
@Component({
  selector: "app-medicamento-combobox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MedicamentoComboboxComponent),
      multi: true
    }
  ],
  templateUrl: "./medicamento-combobox.component.html",
  styleUrls: ["./medicamento-combobox.component.css"]
})
export class MedicamentoComboboxComponent implements ControlValueAccessor {
  medicamentos = input.required<MedicamentoResponse[]>();
  placeholder = input("Buscar medicamento...");

  private inputRef = viewChild<ElementRef<HTMLInputElement>>("inputEl");
  private hostRef = viewChild<ElementRef<HTMLElement>>("host");

  query = signal("");
  open = signal(false);
  activeIndex = signal(0);
  selectedId = signal<number | null>(null);

  disabled = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.medicamentos();
    if (!q) return list.slice(0, 30);
    return list
      .filter(m =>
        m.nombre.toLowerCase().includes(q) ||
        m.principioActivo?.toLowerCase().includes(q)
      )
      .slice(0, 30);
  });

  selectedMed = computed(() =>
    this.medicamentos().find(m => m.id === this.selectedId()) ?? null
  );

  writeValue(value: number | null): void {
    this.selectedId.set(value);
    const med = this.medicamentos().find(m => m.id === value);
    this.query.set(med ? med.nombre : "");
  }
  registerOnChange(fn: (value: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  onFocus(): void {
    if (this.disabled()) return;
    this.open.set(true);
    this.activeIndex.set(0);
    // Al enfocar, limpiamos el texto para que la búsqueda parta en blanco
    // en vez de obligar al usuario a borrar el nombre ya elegido.
    this.query.set("");
  }

  onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    this.activeIndex.set(0);
    if (value === "") {
      this.selectedId.set(null);
      this.onChange(null);
    }
  }

  select(med: MedicamentoResponse): void {
    this.selectedId.set(med.id);
    this.query.set(med.nombre);
    this.onChange(med.id);
    this.open.set(false);
    this.onTouched();
    // Devolvemos el foco al input tras confirmar: en flujo de teclado puro
    // (buscar → flechas → Enter) el usuario espera poder seguir navegando
    // con Tab hacia el campo de Cantidad sin que el foco se haya perdido.
    this.inputRef()?.nativeElement.focus();
  }

  onKeydown(e: KeyboardEvent): void {
    const results = this.results();
    if (!this.open()) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        this.open.set(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.activeIndex.set(Math.min(this.activeIndex() + 1, results.length - 1));
        this.scrollActiveIntoView();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
        this.scrollActiveIntoView();
        break;
      case "Enter":
        e.preventDefault();
        if (results[this.activeIndex()]) this.select(results[this.activeIndex()]);
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Tab":
        this.close();
        break;
    }
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() => {
      const host = this.hostRef()?.nativeElement;
      const el = host?.querySelector(`[data-idx="${this.activeIndex()}"]`) as HTMLElement | null;
      el?.scrollIntoView({ block: "nearest" });
    });
  }

  close(): void {
    this.open.set(false);
    this.onTouched();
    // Si el usuario cerró sin confirmar una selección válida, restauramos
    // el texto del medicamento seleccionado (o lo dejamos vacío).
    const med = this.selectedMed();
    this.query.set(med ? med.nombre : "");
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(e: MouseEvent): void {
    const host = this.hostRef()?.nativeElement;
    if (host && !host.contains(e.target as Node)) {
      this.close();
    }
  }

  stockClass(m: MedicamentoResponse): string {
    if (!m.stockMinimo) return "ok";
    const pct = (m.stock / (m.stockMinimo * 4)) * 100;
    return pct <= 25 ? "danger" : pct <= 50 ? "warn" : "ok";
  }
}
