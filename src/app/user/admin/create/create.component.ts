import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToolService } from '../../../home/tools/tool-service/tool-service';
import { ToolModel } from '../../../home/tools/tool-model/tool.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export default class CreateComponent {

  @Output() closeModal = new EventEmitter<void>();

  // Inicializar el FormGroup con todos los controles
  createToolForm = new FormGroup({
    name: new FormControl('', Validators.required),
    detail: new FormControl(''),
    description: new FormControl(''),
    properties: new FormArray([]), // FormArray para propiedades
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    subcategory: new FormControl('', Validators.required),
    video: new FormControl('', Validators.pattern('https?://.*')),
    images: new FormControl<string | null>(null), // Control para almacenar las imágenes
    logo: new FormControl(null) // Control para almacenar el logo
  });

  propertyInput = new FormControl('');

  constructor(private toolService: ToolService) { }

  // Getter para acceder al FormArray `properties`
  get properties() {
    return this.createToolForm.get('properties') as FormArray;
  }

  // Agregar una característica al presionar Enter
  addProperty(event: Event): void {
    event.preventDefault();
    const value = this.propertyInput.value?.trim() || '';
    if (value && this.properties.length < 6) {
      this.properties.push(new FormControl(value));
      this.propertyInput.reset();
    }
  }

  // Eliminar una característica por índice
  removeProperty(index: number): void {
    this.properties.removeAt(index);
  }

  close() {
    this.closeModal.emit();
  }

  // Función para validar los archivos que se subirán.
  onFileSelected(event: any, field: string) {

    const fileSelected: FileList = event.target.files;

    // Verificar si se seleccionaron archivos
    if (fileSelected.length === 0) return;

    // Validación de cantidad de archivos
    if (field === 'logos' && fileSelected.length !== 1) {
      toast.error('Solo se puede subir un archivo para el logo.');
      event.target.value = ''; // Limpia el campo de archivo
      return;
    } else if (field === 'images' && fileSelected.length > 3) {
      toast.error('Solo se pueden subir un máximo de tres imágenes.');
      event.target.value = ''; // Limpia el campo de archivo
      return;
    }

    // Validación de tipo de archivo
    for (let i = 0; i < fileSelected.length; i++) {
      const file = fileSelected[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (
        (field === 'logos' && fileExtension !== 'svg' && fileExtension !== 'png') ||
        (field === 'images' && fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png')
      ) {
        toast.error(field === 'logos'
          ? 'El logo debe ser un archivo con extensión SVG o PNG'
          : 'Las imágenes deben ser archivos JPG, JPEG o PNG'
        );
        event.target.value = ''; // Limpia el campo de archivo
        return;
      }
    }

    // Si pasa todas las validaciones, llama a `uploadFile` para cada archivo
    for (let i = 0; i < fileSelected.length; i++) {
      const file = fileSelected[i];
      const filePath = field === 'logos' ? `logos/${file.name}` : `images/tools/${file.name}`;
      this.uploadFile(file, filePath, field);
    }
  }

  // Función para subir archivos
  uploadFile(file: File, filePath: string, field: string) {
    this.toolService.uploadFile(file, filePath).subscribe(
      (url: string) => {
        console.log(`${field} subido con éxito. URL: `, url);

        // Asignamos la URL al formulario segun el campo corresponeiente.
        this.createToolForm.patchValue({
          [field]: url
        });
      },
      (error) => {
        console.error(`Error al subir el ${field}:`, error);
      }
    );
  }

}