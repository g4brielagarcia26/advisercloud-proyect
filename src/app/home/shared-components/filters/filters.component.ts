import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  buttons = ['Todo', 'Populares', 'Gratis', 'Pago'];
  selectedButton: string = 'Todo'; // Botón seleccionado inicialmente

  selectButton(button: string) {
    this.selectedButton = button;
  }

}
