import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export default class CreateComponent {
  
  // Inicializar el FormGroup con todos los controles
  createToolForm = new FormGroup({
    name: new FormControl('', Validators.required),
    detail: new FormControl(''),
    description: new FormControl(''),
    properties: new FormArray([]), // FormArray para propiedades
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    subcategory: new FormControl('', Validators.required),
    video: new FormControl('', Validators.pattern('https?://.*')),
    images: new FormControl(null), // Control para almacenar las imágenes
    logo: new FormControl(null) // Control para almacenar el logo
  });

  propertyInput = new FormControl('');

  // Getter para acceder al FormArray `properties`
  get properties() {
    return this.createToolForm.get('properties') as FormArray;
  }

  // Agregar una característica al presionar Enter
  addProperty(event: Event): void {
    event.preventDefault(); // Evita el comportamiento por defecto de Enter en un formulario
  
    const value = this.propertyInput.value?.trim() || ''; // Usa '' si es null o undefined
  
    if (value && this.properties.length < 6) {
      this.properties.push(new FormControl(value));
      this.propertyInput.reset(); // Limpia el campo de entrada
    }
  }

  // Eliminar una característica por índice
  removeProperty(index: number): void {
    this.properties.removeAt(index);
  }
}