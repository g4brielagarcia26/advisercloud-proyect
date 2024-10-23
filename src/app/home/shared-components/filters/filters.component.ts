import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  router = inject(Router)

  buttons = ['Todo', 'Populares', 'Gratis', 'Pago'];
  selectedButton: string = 'Todo'; // Botón seleccionado inicialmente

  // Evento de salida para comunicar el filtro seleccionado
  @Output() filterChange = new EventEmitter<string>();

  // Evento de salida para comunicar las subcategorías seleccionadas
  @Output() subcategoryFilterChange = new EventEmitter<string[]>();

  // Almacenar las subcategorías seleccionadas
  private selectedSubcategories = new BehaviorSubject<string[]>([]);

  isFiltersOpen = false;

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  selectButton(button: string) {
    this.selectedButton = button;
    // Emitir el botón seleccionado para que ToolPanel lo reciba.
    this.filterChange.emit(button);
  }

  // Método actualizado en el componente
onSubcategoryChange(subcategory: string, event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const isChecked = inputElement?.checked;

  if (isChecked !== undefined) {
    let currentSelections = this.selectedSubcategories.value;

    if (isChecked) {
      currentSelections.push(subcategory);
    } else {
      currentSelections = currentSelections.filter(item => item !== subcategory);
    }

    // Emitir los cambios de las subcategorías seleccionadas
    this.selectedSubcategories.next(currentSelections);
    this.subcategoryFilterChange.emit(currentSelections);
  }
}
  
  /**
 * Verifica si la ruta actual incluye la subruta especificada.
 * @param route - La subruta a verificar en la URL actual.
 * @returns Verdadero si la URL actual incluye la subruta especificada, falso en caso contrario.
 */
  isRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}