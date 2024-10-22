import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';

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

  selectButton(button: string) {
    this.selectedButton = button;
    // Emitir el botón seleccionado para que ToolPanel lo reciba.
    this.filterChange.emit(button);
  }

  isFiltersOpen = false;

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
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


