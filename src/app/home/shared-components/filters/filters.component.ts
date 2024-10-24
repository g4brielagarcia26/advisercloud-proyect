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

  // Estado para almacenar los filtros seleccionados
  selectedFilters: { [key: string]: boolean } = {
    design: false,
    frameworks: false,
    tools: false,
    ide: false,
    browser: false,
  };

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  selectButton(button: string) {
    this.selectedButton = button;
    // Emitir el botón seleccionado para que ToolPanel lo reciba.
    this.filterChange.emit(button);
  }

  // Método actualizado en el componente
  onSubcategoryChange(subcategory: string, filter: string, event: any) {
    // Obtener el elemento de entrada del evento y verificar si está marcado
    const inputElement = event.target as HTMLInputElement;
    // Verifica si el checkbox está marcado
    const isChecked = inputElement?.checked;
     // Actualizar el estado del filtro seleccionado en base a si el checkbox está marcado o no
    this.selectedFilters[filter] = event.target.checked;

    // Si el valor de isChecked no es undefined (el checkbox es válido)
    if (isChecked !== undefined) {
      // Obtener las subcategorías actualmente seleccionadas
      let currentSelections = this.selectedSubcategories.value;

      // Si el checkbox está marcado, agregar la subcategoría a las seleccionadas
      if (isChecked) {
        currentSelections.push(subcategory);
      } else {
        // Si no está marcado, eliminar la subcategoría de las seleccionadas
        currentSelections = currentSelections.filter(item => item !== subcategory);
      }

      // Emitir los cambios de las subcategorías seleccionadas 
      // Actualiza el observable con la nueva lista
      this.selectedSubcategories.next(currentSelections);  
      // Emitir un evento con la lista actualizada de subcategorías seleccionadas
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